import { computed, createApp, warn } from "vue";

//導入 flatpickr 日曆選擇器
import flatpick from "flatpickr";
import "flatpickr/dist/flatpickr.css";
// 如果要繁體中文
import { MandarinTraditional } from "flatpickr/dist/l10n/zh-tw.js";

import axios, {isCancel, AxiosError} from 'axios';

// const apiA1 = 'https://script.google.com/macros/s/AKfycbyN7wBHtdB19DPAPbiKpEe-MB8IKe5-CoZqcuXT4HJqPnhXvEwm7RcK8uEJO98FFlGZ/exec';
// const partII = 'AKfycbz_bpIfyQQk939_ceHoqJV07H2x_tuZfopWceE1uXRDFJjpLo7iJlyv8c4D2fMHPjte';


const contactUs = document.querySelector('#contactUs');
console.log(contactUs);

if(contactUs){

const contactUsApp = {
  data(){
    return{
      defaultGuest:{
        //訪客資料
        name:'',
        email:'',
        tel:'',
        employmentStatus:'目前職業/工作身分',
        employmentStatusOption:["在職中（全職）", "在職中（兼職）", "待業中", "應屆畢業生", "在學中", "其他"],
        //諮詢主題
        consultationTopic:[],
        consultationTopicOption:['職涯探索與方向', '接案與技能變現', '品牌與內容經營', '遠端工作與數位游牧', '收入與時間管理', '其他（請填寫下題)'],
        expectExpert:'期望諮詢的專家',
        expectExpertOption:[
                              '職涯規劃顧問','人資／招募專家','產業資深從業者','專業技能導師',
                              '轉職顧問','學涯／升學顧問','創業／接案顧問','職涯諮商心理師'
                            ],
        mainChallenges:'',
        desiredGoal:'',
        //聯絡偏好
        preferredContactMethod:'信箱',
        preferredContactMethodOption:['信箱', '電話', 'LINE', 'Discord'],
        preferredContactTime:[],
        preferredContactTimeOption:[
                                     '平日上午(9:00-12:00)', '平日下午(13:00-17:00)', '平日晚上(18:00-21:00)',
                                     '週末上午(9:00-12:00)', '週末下午(13:00-17:00)', '週末晚上(18:00-21:00)'
                                    ],
        makeAnAppointment:'',                              
        findOutThroughAChannel:[],
        findOutThroughAChannelOption:[
                                      'Google 搜尋', 'Instagram', 'Facebook', 'Threads', 'YouTube',
                                      'Podcast / 節目推薦', '朋友或同事推薦', '曾參加職旅活動 / 工作坊', '職涯顧問介紹',
                                      '其他（請填寫下題）'
                                    ],
        tellUsOther:'',

      },
      employmentStatusBtn: false,
      expectExpertStatusBtn: false,
      //預約諮詢時間
      bookingTime:null, // flatpickr instance
      //checkSwitch
      acceptNewDataCheckedText: '',
      acceptNewDataChecked: false,
      acceptNewDataShowSwitch: false,
      agreeTermsCheckedText:'',
      agreeTermsChecked:false,
      agreeTermsShowSwitch:false,

      originalGuest: {}, // 先存一份初始資料

      // 連接到 google 後端資料庫 api
      apiA1: 'https://script.google.com/macros/s/AKfycbyN7wBHtdB19DPAPbiKpEe-MB8IKe5-CoZqcuXT4HJqPnhXvEwm7RcK8uEJO98FFlGZ/exec',
      
    }
  },
  created(){ //資料已經準備好，但畫面還沒生成，不能操作 DOM
    //優化後: Vue 實例初始化時，把 defaultGuest 拷貝一份作為原始資料
    this.originalGuest = JSON.parse(JSON.stringify(this.defaultGuest));

    // const originalGuest = JSON.parse(JSON.stringify(this.defaultGuest));
    // console.log(originalGuest);
  },
  mounted(){ //mounted() 是跳頁時會自動進行「初始化階段讀取一次」; 畫面已經實際渲染在真實頁面上，可以操作 DOM

    // flatpickr 參數設定條件
    this.bookingTime = flatpickr(this.$refs.datepicker,{
      wrap: true,                // 使用包裹 div + 自定義 span
      disableMobile: true,       // 不生成 mobile input
      enableTime: true,          // 開啟時間選擇器
      time_24hr: true,           // 24 小時制
      dateFormat: "Y-m-d H:i",  // 日期 + 時間
      // noCalendar: true,          // 隱藏日曆
      minDate: "today",          // 最小日期今天
      maxDate: new Date().fp_incr(365), // 一年內
      locale: MandarinTraditional, // 繁體中文
      defaultDate: this.defaultGuest.makeAnAppointment,
      clickOpens: true,         // 禁止點 input 自動打開
      altInput: false,        // 不生成替代 input
      // altFormat: "Y-m-d H:i",
      // allowInput: true,   // 允許手動輸入
      appendTo: document.body,
      // 動態設定寬度: 透過 RWD狀態多寬, 日曆選擇器跟著 input 多寬
      onOpen: (selectedDates, dateStr, instance) => {
      const inputWidth = this.$refs.datepicker.querySelector('[data-input]').offsetWidth;
      instance.calendarContainer.style.width = inputWidth + 'px';
      },

      // 選擇日期後更新 v-model
      onChange: (_, dateStr) => {
        this.defaultGuest.makeAnAppointment = dateStr;
      },

    });
  },
  beforeUnmount() {
    // 清理 flatpickr
    if (this.bookingTime) {
      this.bookingTime.destroy();
    }
  },
  watch:{
    // employmentStatus 是包在 defaultGuest 裡的屬性
    // 所以 watch 不能直接寫 employmentStatus，必須「指定路徑」。
    // 使用 [ 字串路徑 ] 可以解決此方式
   'defaultGuest.employmentStatus'(data){
    console.log(data);
   },
   'defaultGuest.consultationTopic'(val){
    console.log(val);
    
   },
   'defaultGuest.expectExpert'(val){
    console.log(val);
   },
   'defaultGuest.mainChallenges'(val){
    console.log(val);
   },
   'defaultGuest.desiredGoal'(val){
    console.log(val);
   },
   'defaultGuest.preferredContactMethod'(val){
    console.log(val);
   },
   'defaultGuest.preferredContactTime'(val){
    console.log(val);
   },
   'defaultGuest.makeAnAppointment'(val){
    console.log(val);
   },
   'defaultGuest.findOutThroughAChannel'(val){
    console.log(val);
   },

   //watch-remaid-check (V-model 也需要此值, 才可以讀取到)
   acceptNewDataChecked(newValue){ 
    if(newValue === true){
      this.acceptNewDataShowSwitch = !this.acceptNewDataShowSwitch;
      this.acceptNewDataCheckedText = '';
    }
   },
   agreeTermsChecked(newValue){
    if(newValue === true){
      this.agreeTermsShowSwitch = !this.agreeTermsShowSwitch;
      this.agreeTermsCheckedText = '';
    }
   },


  },
  computed:{ 
  // 利用 computed 功能, 只要this.defaultGuest.consultationTopicOption 有新增選項就自動計算並取出單數的索引值
  // 並將 consultationTopicKey() 函式直接放到 template 用 ; 也就是 template 用頂層 computed，不要再去 data 裡的空陣列
    consultationTopicKey(){
      return this.defaultGuest.consultationTopicOption.map((item,key)=>key).filter((key)=> key % 2 === 1);
    },
  //修改前
  // consultationTopicKey() {
      //   //更原始
      //   // const mapKey = this.defaultGuest.consultationTopicOption.map(function(v,i){
      //   //   return i;
      //   // }); 
      //   // const filterKey = mapKey.filter(function(index){
      //   //   return index % 2 === 1;
      //   // });

      //   // return filterKey;

      //   //優化後
      //   //  return this.defaultGuest.consultationTopicOption
      //   //  .map(function(value, key) {
      //   //    return key;
      //   //  })
      //   //  .filter(function(key) {
      //   //    return key % 2 === 1 ;
      //   //  })
      //  }  
  
  },
  methods:{
    //目前身分
    employmentStatus(e){
      this.employmentStatusBtn = !this.employmentStatusBtn;
    },
    guestStatusValue(data){
      this.defaultGuest.employmentStatus = data;
      this.employmentStatus();
    },
    //期許專家
    expectExpertStatus(e){
      this.expectExpertStatusBtn = !this.expectExpertStatusBtn;
    },
    expectExpertValue(data){
      this.defaultGuest.expectExpert = data;
      this.expectExpertStatus();
    },
    //聯絡時段
    //最符合 Vue 的「關注點分離」
    contactTimeClass(key){
      return {
        'mb-xl-0': ![0, 1, 2].includes(key),
        'mb-2': key !== 5
      }
    },
    //預約諮詢時間
    openCalendar(e){

      // if(this.bookingTime){
      //   this.bookingTime.open(); // 點 span 時打開日曆
      // }
      if(this.fpInstance){
        this.fpInstance.open(); // 點 span 時打開日曆
      }

      // 使用 nextTick 確保 DOM 已更新
      // this.$nextTick(() => {
      //   if (this.fpInstance) {
      //     this.fpInstance.open();
      //   }
      // });

    },
    //得知我們
    ThroughAChannelClass(key){
      return {
        'me-lg-5': ![4,8,9].includes(key),
        'me-lg-0': [8].includes(key),
        'me-md-4': [1,5,6,7].includes(key),
        'me-sm-4': [1,5,6,7].includes(key),
        'me-4': ![1,4,6,7,9].includes(key),
        'mb-lg-2':[8].includes(key),
        'mb-2':![8,9].includes(key),
        'mb-0':[8,9].includes(key)
      }
    },

    //btn
    sentContactBtn(){

     const sentContactErrorValue = [
      {
        test:()=>{
          return !this.acceptNewDataChecked // true
        },
        acceptNewDataCheckedErrorMessage:'請先勾選接收職旅最新資訊和專業內容'
      },
      {
        test: function(){
          return !this.agreeTermsChecked
        }.bind(this),
        agreeTermsCheckedErrorMessage:'請先勾選同意條款'
      }
     ];

     // Array.prototype.find() 的行為是： 「幫我找第一個 test() 回傳 true 的規則」
     const findTestError = sentContactErrorValue.find((item)=>item.test());
     // 有找到符合條件->那個物件
     // 沒找到->undefined

    //  console.log(findTestError);
     
     if(findTestError){ // 如果有篩出 error
      if(findTestError.acceptNewDataCheckedErrorMessage){
        this.acceptNewDataShowSwitch = true;
        this.acceptNewDataCheckedText = findTestError.acceptNewDataCheckedErrorMessage;
        }else if(findTestError.agreeTermsCheckedErrorMessage){
          this.agreeTermsShowSwitch = true;
          this.agreeTermsCheckedText = findTestError.agreeTermsCheckedErrorMessage;
        }
      }else if(!findTestError){
        (async()=>{
          try{

            const params = new URLSearchParams({
              name: this.defaultGuest.name,
              email: this.defaultGuest.email,
              tel: this.defaultGuest.tel,
              employmentStatus: this.defaultGuest.employmentStatus,
              consultationTopic: this.defaultGuest.consultationTopic,
              expectExpert: this.defaultGuest.expectExpert,
              mainChallenges: this.defaultGuest.mainChallenges,
              desiredGoal: this.defaultGuest.desiredGoal,
              preferredContactMethod: this.defaultGuest.preferredContactMethod,
              preferredContactTime: this.defaultGuest.preferredContactTime,
              makeAnAppointment: this.defaultGuest.makeAnAppointment,                              
              findOutThroughAChannel: this.defaultGuest.findOutThroughAChannel,
              tellUsOther: this.defaultGuest.tellUsOther
            });
            
            const res = await axios({
              method:'POST',
              url:`${this.apiA1}`,
              data:params
            });

            console.log(res);
            this.reFillBtn();
            
          }catch(err){
            console.warn(err);
          }
        })();
      }
     

      // axios({
      //   method:'POST',
      //   url: this.apiA1,
      //   data:{
      //     name: this.defaultGuest.name,
      //   }
      // })
      // .then(res=>{
      //   console.log(res);
      // })
      // .catch(err=>{
      //   console.log(err);
      // })

    },
    //guestFactory 是工廠函式的「規格書」:適合表單 reset
    // guestFactory() {
    //   return {
    //   //訪客資料
    //     name:'',
    //     email:'',
    //     tel:'',
    //     employmentStatus:'目前職業/工作身分',
    //     employmentStatusOption:["在職中（全職）", "在職中（兼職）", "待業中", "應屆畢業生", "在學中", "其他"],
    //     //諮詢主題
    //     consultationTopic:[],
    //     consultationTopicOption:['職涯探索與方向', '接案與技能變現', '品牌與內容經營', '遠端工作與數位游牧', '收入與時間管理', '其他（請填寫下題)'],
    //     expectExpert:'期望諮詢的專家',
    //     expectExpertOption:[
    //                           '職涯規劃顧問','人資／招募專家','產業資深從業者','專業技能導師',
    //                           '轉職顧問','學涯／升學顧問','創業／接案顧問','職涯諮商心理師'
    //                         ],
    //     mainChallenges:'',
    //     desiredGoal:'',
    //     //聯絡偏好
    //     preferredContactMethod:'信箱',
    //     preferredContactMethodOption:['信箱', '電話', 'LINE', 'Discord'],
    //     preferredContactTime:[],
    //     preferredContactTimeOption:[
    //                                  '平日上午(9:00-12:00)', '平日下午(13:00-17:00)', '平日晚上(18:00-21:00)',
    //                                  '週末上午(9:00-12:00)', '週末下午(13:00-17:00)', '週末晚上(18:00-21:00)'
    //                                 ],
    //     findOutThroughAChannel:[],
    //     findOutThroughAChannelOption:[
    //                                   'Google 搜尋', 'Instagram', 'Facebook', 'Threads', 'YouTube',
    //                                   'Podcast / 節目推薦', '朋友或同事推薦', '曾參加職旅活動 / 工作坊', '職涯顧問介紹',
    //                                   '其他（請填寫下題）'
    //                                 ],
    //     makeAnAppointment:'',
    //     tellUsOther:'',
    //   }
    // },
    reFillBtn(){
      //優化前: 使用工廠函式製作兩份同樣物件
      // this.defaultGuest = this.guestFactory();

      //優化後:
      this.defaultGuest = JSON.parse(JSON.stringify(this.originalGuest));
      this.bookingTime.clear();
      this.acceptNewDataChecked = false;
      this.agreeTermsChecked = false;
    }

  }
}
createApp(contactUsApp).mount(contactUs);













}