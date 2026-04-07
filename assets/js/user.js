import { Modal } from 'bootstrap';
import { computed, createApp, warn, watch } from 'vue';

import axios, {isCancel, AxiosError} from 'axios';


const $ = (selector)=>document.querySelector(selector);

const userApp = {
  data(){
    return {
      //localStorage紀錄目前登入的會員資料（暱稱、頭像等等)
      userData: { 
        isLogin: false, 
        userInfo: null,
        email: null,
        photo: ' ',// https://github.com/hexschool/2022-web-layout-training/blob/main/2025-week5/avatar.png?raw=true 
        gender: 'female',
        birthday:'',
        tel: '',
        address: ''
      },

      //渲染預約課程畫面
      //plan => 永遠是用來顯示到畫面用的
        plan:[],
      //planBackup => 永遠保存真正的原始資料
        planBackup:[],
      //btn-Status-Save
        btnStatus:'全部',

      //職旅計畫
        //職業
        workStatus:'fulltime',
        //工作產業
        defaultIndustry: '工作產業',
        industries: ['科技','媒體','教育','金融','醫療健康','零售製造','服務業','藝術創意','非營利組織'],
        //工作年資
        defaultExperience:'工作年資',
        yearsOfExperience:['1年以下','1-3年','3-5年','5-10年','10年以上'],
        //工作產業開關
        workField: false,
        //工作年資開關
        workSeniority :false,
        //月收入
        defaultIncome:'income-3',
        incomeRange:[
          {salary:'3 萬以下',value:"income-3"},
          {salary:'3-5 萬',value:"income-3-5"},
          {salary:'5-8 萬',value:"income-5-8"},
          {salary:'8-12 萬',value:"income-8-12"},
          {salary:'12-20 萬',value:"income-12-20"},
          {salary:'20 萬以上',value:"income-20"},
        ],
        //職業摘要
        defaultProfessionalSummary:'',
        //作品案例展示
        defaultWorkCases: '',
      //職涯規劃
        //短期職涯目標
        defaultShortTermGoals:'',
        //中長期職涯目標
        defaultLongTermGoals:'',  
        //理想工作模式
        idealWorkStatus:'Fixed-office',
        //目標薪資
        defaultExpectedSalary:'',
        //職涯挑戰
        defaultCareerChallenges:[],
        //期望資源
        defaultExpectedResources:[],
        //服務方案
        defaultServiceOptions:[],
      //專業技能區塊
        //核心專業領域
        defaultCoreCompetency:[],
        //專業背景
        defaultProfessionalBackground:'',
        //專業技能
        defaultProfessionalSkills:'',
        //語文能力
        defaultLanguageProficiency:'',
        //資格證照
        defaultCertification:'',
      //教育背景
        //學歷背景
        defaultEducation:'',
        //專業培訓
        defaultProfessionaltraining:'',
    }
  },
  created(){ //資料已經準備好，但畫面還沒生成，不能操作 DOM
    //初始原始資料
       const BookingData =[
        {
          courseMerchandise: '職涯定位-職涯探索包 | 6/6堂',
          bookClassDate :'2025/11/11',
          consultationTime : '60分鐘',
          consultationMethod : '視訊',
          classStatus : '等待上課'
        },
        {
          courseMerchandise: '職涯定位-職涯探索包 | 5/6堂',
          bookClassDate :'2025/10/10',
          consultationTime : '60分鐘',
          consultationMethod : '視訊',
          classStatus : '等待上課'
        },
        {
          courseMerchandise: '職涯定位-職涯探索包 | 4/6堂',
          bookClassDate :'2025/09/09',
          consultationTime : '60分鐘',
          consultationMethod : '視訊',
          classStatus : '已完成'
        },
        {
          courseMerchandise: '職涯定位-職涯探索包 | 3/6堂',
          bookClassDate :'2025/08/08',
          consultationTime : '60分鐘',
          consultationMethod : '面對面',
          classStatus : '已完成'
        },
        {
          courseMerchandise: '職涯定位-職涯探索包 | 2/6堂',
          bookClassDate :'2025/07/07',
          consultationTime : '60分鐘',
          consultationMethod : '面對面',
          classStatus : '已完成'
        },
        {
          courseMerchandise: '職涯定位-職涯探索包 | 1/6堂',
          bookClassDate :'2025/06/06',
          consultationTime : '90分鐘',
          consultationMethod : '面對面',
          classStatus : '已完成'
        },
      ];

      this.plan = BookingData; //先渲染畫面
      this.planBackup = JSON.parse(JSON.stringify(BookingData)); // 🔥 深拷貝(永久備份)
    
  },
  mounted() {//mounted() 是跳頁時會自動進行「初始化階段讀取一次」; 畫面已經實際渲染在真實頁面上，可以操作 DOM
    // 讀取 localStorage 的使用者暱稱（登入時並紀錄 API 回傳的使用者資料)
    const user = localStorage.getItem('userInfo');
    const userEmail = localStorage.getItem('userEmail');
    // console.log('user:', user);
    // console.log('email:', userEmail);
    // 讀取 localStorage 的頭貼（可能是預設，也可能是使用者之前上傳的）
    const savedPhoto = localStorage.getItem('userPhoto');
    // console.log(savedPhoto);
    // 讀取 localStorage 個人資訊的資料
    const userGender = localStorage.getItem('userGender');
    const userBirthday = localStorage.getItem('userBirthday');
    const userTel = localStorage.getItem('userTel');
    const userAddress = localStorage.getItem('userAddress');
    // console.log('gender:', userGender);
    // console.log('birthday:', userBirthday);
    // console.log('tel:', userTel);
    // console.log('address:', userAddress);
    
    if(user && userEmail && savedPhoto){
      this.userData.userInfo = JSON.parse(user);
      this.userData.email = JSON.parse(userEmail);
      this.userData.photo = savedPhoto || 'https://github.com/hexschool/2022-web-layout-training/blob/main/2025-week5/avatar_default.png?raw=true';
    }else{
      this.userData.userInfo = null; // 還原初始會員資料到畫面
      this.userData.email = null; // 還原初始會員資料到畫面
      this.userData.photo = ''; // 還原初始會員資料到畫面
    }

    if( userGender && userBirthday && userTel && userAddress ){
      this.userData.gender = userGender;
      this.userData.birthday = userBirthday;
      this.userData.tel = userTel;
      this.userData.address = userAddress;
    }else{
      this.userData.gender = 'female';
      this.userData.birthday = '';
      this.userData.tel = '';
      this.userData.address = '';
    }

    // 職旅計畫
     //概況
    // const finishedWorkStatus = localStorage.getItem('userWorkStatus');
    // const finishedIndustry = localStorage.getItem('userDefaultIndustry');
    // const finishedExperience = localStorage.getItem('userDefaultExperience');
    // const finishedIncome = localStorage.getItem('userDefaultIncome');
    // const finishedProfessionalSummary = localStorage.getItem('userDefaultProfessionalSummary');
    // const finishedWorkCases = localStorage.getItem('userDefaultWorkCases');
    // if(finishedWorkStatus && finishedIndustry && finishedExperience && finishedIncome && finishedProfessionalSummary && finishedWorkCases){
    //   this.workStatus = finishedWorkStatus;
    //   this.defaultIndustry = finishedIndustry;
    //   this.defaultExperience = finishedExperience;
    //   this.defaultIncome = finishedIncome;
    //   this.defaultProfessionalSummary = finishedProfessionalSummary;
    //   this.defaultWorkCases = finishedWorkCases;
    // }
    //規劃
    // const finishedShortTermGoals = localStorage.getItem('userDefaultShortTermGoals');
    // const finishedLongTermGoals = localStorage.getItem('userDefaultLongTermGoals');
    // const finishedIdealWorkStatus = localStorage.getItem('userDefaultIdealWorkStatus');
    // const finishedExpectedSalary = localStorage.getItem('userDefaultExpectedSalary');
    // const finishedCareerChallenges = localStorage.getItem('userDefaultCareerChallenges');
    // const finishedExpectedResources = localStorage.getItem('userDefaultExpectedResources');
    // const finishedServiceOptions = localStorage.getItem('userDefaultServiceOptions');
    // if(finishedShortTermGoals && finishedLongTermGoals && finishedIdealWorkStatus && finishedExpectedSalary){
    //   this.defaultShortTermGoals = finishedShortTermGoals;
    //   this.defaultLongTermGoals = finishedLongTermGoals;
    //   this.idealWorkStatus = finishedIdealWorkStatus;
    //   this.defaultExpectedSalary = finishedExpectedSalary;
    // }
    // if(finishedCareerChallenges && finishedExpectedResources && finishedServiceOptions) {
    //   this.defaultCareerChallenges = JSON.parse(finishedCareerChallenges);
    //   this.defaultExpectedResources = JSON.parse(finishedExpectedResources);
    //   this.defaultServiceOptions = JSON.parse(finishedServiceOptions);
    // }
    //專業技能區塊
    // const finishedCoreCompetency = localStorage.getItem('userDefaultCoreCompetency');
    // const finishedProfessionalBackground = localStorage.getItem('userDefaultProfessionalBackground');
    // const finishedProfessionalSkills = localStorage.getItem('userDefaultProfessionalSkills');
    // const finishedLanguageProficiency = localStorage.getItem('userDefaultLanguageProficiency');
    // const finishedCertification = localStorage.getItem('userDefaultCertification');

    // if(finishedCoreCompetency && finishedProfessionalBackground && finishedProfessionalSkills && finishedLanguageProficiency && finishedCertification){
    //   this.defaultCoreCompetency = JSON.parse(finishedCoreCompetency);
    //   this.defaultProfessionalBackground = finishedProfessionalBackground;
    //   this.defaultProfessionalSkills = finishedProfessionalSkills;
    //   this.defaultLanguageProficiency = finishedLanguageProficiency;
    //   this.defaultCertification = finishedCertification;
    // }
    console.log('localStorage.getItem, 優化後');
    //優化後
    const finishedUserWorkStatus = JSON.parse(localStorage.getItem('userWorkStatus'));
    // console.log(finishedUserWorkStatus);
    
  //使用 Object.assign 一次更新（推薦）
  if(finishedUserWorkStatus){
    Object.assign(this, finishedUserWorkStatus );
  }
  //這會把 userDefaults 裡的所有 key/value 一次灌進 this
  //只要 key 名稱跟 this.data 中的對應名稱相同即可）。

  // ✔ 優點:
  // 1. 一行解決
  // 2. 不會破壞 reactivity（對 Vue 來說也安全，只要 key 事先在 data 裡定義）


  },
  watch:{ //watch 是在監聽 data 中的變數，但它的值來自 v-model 綁定的 html 標籤
  
  },
  computed:{
    
  },
  methods:{ // 這裡只能放函式
    //updateAvatar
    updateAvatar(e){
      const fillAvatar = e.target.files[0];
      console.log(fillAvatar);

      if (!fillAvatar) return;

      const reader = new FileReader();
      reader.onload = () => {
          const base64 = reader.result;

          // 前端畫面立即更新目前頁面的 Vue data (大頭貼照片)
          this.userData.photo = base64;

        };
      reader.readAsDataURL(fillAvatar);
    },

    //save-Update-btn
    saveUpdate(e){
      console.log(e);
      // 將 updateAvatar() 函式拋出的新的 Vue data (大頭貼照片) 更新至 localStorage 
      localStorage.setItem('userPhoto', this.userData.photo);
      localStorage.setItem('userGender', this.userData.gender);
      localStorage.setItem('userBirthday', this.userData.birthday);
      localStorage.setItem('userTel', this.userData.tel);
      localStorage.setItem('userAddress', this.userData.address);

       // 🔔 廣播一個自訂事件
      window.dispatchEvent(new CustomEvent('userPhotoUpdated', {
        detail: this.userData.photo
      }));
    },

    //refill-form
    resetForm(e){
      this.userData.gender = 'female';
      this.userData.birthday = '';
      this.userData.tel = '';
      this.userData.address = '';
    },

    //updataPwd
    closeUpdataPwdBtn(){
      document.activeElement.blur();
    },
    updatePwd(e){
      // 先讓焦點移到文件主體，避免焦點留在 modal 裡
      document.activeElement.blur();
    },

    //Appointment record(預約紀錄)
    //bookingBtn-filter
    bookingFilterByStatus(status){

      //還原全部
      this.plan = JSON.parse(JSON.stringify(this.planBackup));

      if(status === '全部') return;
      
      this.plan = this.plan.filter( i => {
          return i.classStatus === status;
        });
      
    },
    //all-btn
    allBookingBtn(e){
      this.btnStatus = '全部';
      //還原全部
      // this.plan = JSON.parse(JSON.stringify(this.planBackup));
      this.bookingFilterByStatus('全部');
    },
    //finsish-btn
    finishedBtn(e){
      this.btnStatus = '已完成';
    //   //篩選先渲染畫面的 plan 裡面的 已完成
    //   this.plan = JSON.parse(JSON.stringify(this.planBackup));
    //   this.plan = this.plan.filter( i => {
    //     return i.classStatus === '已完成';
    //   });
      this.bookingFilterByStatus('已完成');
    },
    //cancelBtn
    cancelBtn(e){
      this.btnStatus = '已取消';
      this.bookingFilterByStatus('已取消');
    },

    //dropdown
    toggleDropdown(e){
    
    // 從你點擊的元素開始往上找，找到最近的 .dropdown-btn 元素
    // 如果你點到 button 內的 span 或 icon，也能抓到對應的 button
    // btn 會是 DOM 元素，如果沒找到 .dropdown-btn → btn = null
      const btn = e.target.closest('.dropdown-btn');

    // 找到頁面上 所有的 dropdown menu（可能有多個下拉選單）
    // 以 NodeList 形式存放在 allMenus 變數裡  
      const allMenus = document.querySelectorAll('.dropdown-menu');

    // 如果點擊 不是 dropdown button（例如點到頁面其他地方）
    // 把所有 dropdown menu 的 .show class 移除 → 也就是關閉所有下拉選單
    // return → 停止執行後面程式，因為沒必要再切換當前 dropdown
      if (!btn) {
      // 點擊 dropdown 外的地方 → 關閉所有 dropdown
        allMenus.forEach(menu => menu.classList.remove('show'));
        return;
      }

    // 取得 大螢幕 跟 小螢幕 的按鈕標籤裡面的 "自定義資料屬性 (data-target="#dropdown1")"
      const targetSelector = btn.dataset.target;
      // console.log(targetSelector); // #dropdown1
    // 透過選取出的 #dropdown1 值，來抓取 ul 標籤內的 id="dropdown1" 元素位置
      const menu = document.querySelector(targetSelector);
      // console.log(menu);
      
    // 檢查這個 menu 是否已經有 .show class 參數 ; 有為 true , 無為 false
    // 將結果存進 isOpen，用來決定後續要加還是移除 .show
      const isOpen = menu.classList.contains('show');

    // 第一次點擊 dropdown 按鈕時, 你的 HTML 還沒有 .show   
      // console.log(isOpen); //-->回傳 false

    // 先把 所有 dropdown 都關掉（移除 .show）=> 保證同一時間只有一個 dropdown 打開
    // 關閉所有 dropdown
      allMenus.forEach(menu => menu.classList.remove('show'));

    // 如果點擊的 dropdown 時, 原本就是關閉的 (isOpen = false) → 就加上 .show → 打開它
    // 如果原本已經開了 → 不加 → 也就是維持關閉
      if (!isOpen) {
        menu.classList.add('show');
      }
    },
   

    //sort
    //「日期由大到小」（最新 → 最舊）
    newToOld(e){
      this.plan.sort(( a, b )=>{
        return new Date(b.bookClassDate) - new Date(a.bookClassDate);
      })
      const allMenus = document.querySelectorAll('.dropdown-menu');
      allMenus.forEach(menu => menu.classList.remove('show'));
    },

    //「日期由小到大」（最舊 → 最新）  
    oldToNew(e){
      this.plan.sort(( a, b )=>{
        return new Date(a.bookClassDate) - new Date(b.bookClassDate);
      })
      const allMenus = document.querySelectorAll('.dropdown-menu');
      allMenus.forEach(menu => menu.classList.remove('show'));
    },
    
    // Career planning(職旅計畫)
    //workIndustry-dropdownBtn-change
    workIndustry(e){
      const allMenus = document.querySelectorAll('.dropdown-menu');
      allMenus.forEach(menu => menu.classList.remove('is-open'));

      this.workField = !this.workField;
    },

    //workIndustry-change
    defaultIndustryBtn(workItem){
      this.defaultIndustry = workItem;
      this.workIndustry();
    },

    //workingExperience-dropdownBtn-change
    workingExperience(e){
      const allMenus = document.querySelectorAll('.dropdown-menu');
      allMenus.forEach(menu => menu.classList.remove('is-open'));

      this.workSeniority = !this.workSeniority;
    },

    // workingExperience-change
    defaultExperienceBtn(experienceItem){
      // console.log(experienceItem);
      this.defaultExperience = experienceItem;
      this.workingExperience();
    },
  
  // 職旅計畫
    // work-cases
    openIfLinkWorkCases(e) {
      // console.log('success');
      // if (!this.defaultWorkCases) return;
      // if(this.defaultWorkCases){
      //   window.location.href = this.defaultWorkCases;
      // }

      //優化後
      //沒內容就不開
       if (!this.defaultWorkCases) return;

       let url = this.defaultWorkCases.trim();
  
       if (!url.startsWith('http://') && !url.startsWith('https://')) {
         url = 'https://' + url;
       }

      //  window.open(url, '_blank');
    },
    //儲存更新
    saveUpdateBtn(e){
      console.log('success');
      // localStorage.clear();
    // 職旅計畫
      //概況
      // localStorage.setItem('userWorkStatus', this.workStatus);
      // localStorage.setItem('userDefaultIndustry', this.defaultIndustry);
      // localStorage.setItem('userDefaultExperience',this.defaultExperience);
      // localStorage.setItem('userDefaultIncome',this.defaultIncome);
      // localStorage.setItem('userDefaultProfessionalSummary',this.defaultProfessionalSummary);
      // localStorage.setItem('userDefaultWorkCases',this.defaultWorkCases);
      //規劃 
      // localStorage.setItem('userDefaultShortTermGoals',this.defaultShortTermGoals);
      // localStorage.setItem('userDefaultLongTermGoals',this.defaultLongTermGoals);
      // localStorage.setItem('userDefaultIdealWorkStatus',this.idealWorkStatus);
      // localStorage.setItem('userDefaultExpectedSalary',this.defaultExpectedSalary);
      // localStorage.setItem('userDefaultCareerChallenges',JSON.stringify(this.defaultCareerChallenges));
      // localStorage.setItem('userDefaultExpectedResources',JSON.stringify(this.defaultExpectedResources));
      // localStorage.setItem('userDefaultServiceOptions',JSON.stringify(this.defaultServiceOptions));
      // localStorage.removeItem('userDefaultServiceOptions'); //delete only localStorage key
      //專業技能區塊
      // localStorage.setItem('userDefaultCoreCompetency', JSON.stringify(this.defaultCoreCompetency));
      // localStorage.setItem('userDefaultProfessionalBackground',this.defaultProfessionalBackground);
      // localStorage.setItem('userDefaultProfessionalSkills',this.defaultProfessionalSkills);
      // localStorage.setItem('userDefaultLanguageProficiency',this.defaultLanguageProficiency);
      // localStorage.setItem('userDefaultCertification',this.defaultCertification);
      console.log('localStorage.setItem-優化後');
      //優化後
      const userWorkStatus = {
        //概況
        workStatus: this.workStatus,
        defaultIndustry: this.defaultIndustry,
        defaultExperience: this.defaultExperience,
        defaultIncome: this.defaultIncome,
        defaultProfessionalSummary: this.defaultProfessionalSummary,
        defaultWorkCases: this.defaultWorkCases,
        //規劃
        defaultShortTermGoals: this.defaultShortTermGoals,
        defaultLongTermGoals: this.defaultLongTermGoals,
        idealWorkStatus: this.idealWorkStatus,
        defaultExpectedSalary: this.defaultExpectedSalary,
        defaultCareerChallenges: this.defaultCareerChallenges,
        defaultExpectedResources: this.defaultExpectedResources,
        defaultServiceOptions: this.defaultServiceOptions,
        //專業技能區塊
        defaultCoreCompetency: this.defaultCoreCompetency,
        defaultProfessionalBackground: this.defaultProfessionalBackground,
        defaultProfessionalSkills: this.defaultProfessionalSkills,
        defaultLanguageProficiency: this.defaultLanguageProficiency,
        defaultCertification: this.defaultCertification,
        //教育
        defaultEducation: this.defaultEducation,
        defaultProfessionaltraining: this.defaultProfessionaltraining
      };
      // console.log(userWorkStatus);
      localStorage.setItem('userWorkStatus',JSON.stringify(userWorkStatus));
    },
    printPdf(e){
      window.print();
      
    }    
  }
}

// createApp(userApp).mount('#userApp'); --->跳頁回 index 才會觸發以下這個問題 
//user.js:88 [Vue warn]: Failed to mount app: mount target selector "#userApp" returned null.

// 這代表：
// user.js 是放在**所有頁面（包含 index.html）**都會載入的 JS。
// 但只有 user.html 頁面有 <main id="userApp">。
// 當你回到 index.html 時，該元素不存在 →Vue 嘗試掛載 → 找不到 DOM → 報錯。



const el = document.querySelector('#userApp');
if (el) {
  createApp(userApp).mount(el);
}



