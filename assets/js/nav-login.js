import { Modal } from 'bootstrap';
import { createApp, warn, watch } from 'vue';

import axios, {isCancel, AxiosError} from 'axios';


const $ = (selector)=>document.querySelector(selector);
let apiUrl = 'https://cloud.weyutech.com/DEMO_H5Api/api/GetGrid';
let header = {
  'TokenKey':'WEYU54226552',
  'SID':'373286034083697'
}
axios(apiUrl,{
  method:'POST',
  headers: header,
}).then(res=>console.log(res));


const navLogin = {
  data(){
    return {
      //切換會員暱稱、頭像按鈕
      memberPhotoChange:{
        LoginAndRegisterPhoto: true,
        memberPhoto:false,
      },
      //紀錄目前登入的會員資料（暱稱、頭像等等)
      userData:{
        isLogin:false,
        userInfo: null, // 一開始沒有登入，所以是 null
        email: null,
        photo: ''
      },
      //追蹤 login 送出後狀態來抑止-->模擬點擊一次，讓 Bootstrap 關掉 modal 
      isClosingModal: false, // 新增一個 flag
      //readLoginValue(優化成「物件分組」的形式)
      loginValue:{
        email: '',
        password: '',
      },
      //loginReminder
      loginReminder:{
        email: false,
        password: false,
      },
      //loginErrorMessage
      loginErrorMessage:{
        email: '',
        password: '',
      },
      //readRegisterValue
      registerAccountValue: '',
      registerEmailValue: '',
      registerPasswordValue: '',
      registerCheckPasswordValue: '',
      //registerReminder
      accountReminder: false,
      emailReminder: false,
      pwdReminder: false,
      checkPwdReminder: false,
      agreeTermsReminder: false,
      //registerErrorMessage
      accountErrorMessage:'',
      emailErrorMessage:'',
      pwdErrorMessage: '',
      checkPwdErrorMessage: '',
      agreeTermsErrorMessage: '',
      
      //registerReadCheck
      checked: false,

      //toggleEye
      eyeIcon:'visibility_off', //代表目前是「隱藏狀態」
      eyeRegisterIcon:'visibility_off', //代表目前是「隱藏狀態」
      eyeCheckIcon:'visibility_off', //代表目前是「隱藏狀態」
      //login/register page data
      modalLogin: true,
      modalRegister: false,
      //配合 switchRegisterOrLogin() 函式, 紀錄目前停留在 login or register page
      currentMode: 'login',

      //api
      // apiUrl:'https://cloud.weyutech.com/DEMO_H5Api/api/GetGrid',
      // indexUrl:'https://todoo.5xcamp.us/api-docs/index.html',
      url:'https://todoo.5xcamp.us',
    }
  },
  mounted() { //mounted() 是跳頁時會自動進行「初始化階段讀取一次」

      // localStorage.clear();
      // 進入頁面時，從 localStorage 同步登入狀態
      const isLogin = localStorage.getItem('isLogin');
      console.warn(isLogin);
      const user = localStorage.getItem('userInfo');
      console.log(typeof user);
      const userEmail = localStorage.getItem('userEmail');
      console.log(typeof userEmail);
      const savedPhoto = localStorage.getItem('userPhoto');

    if(isLogin  === 'true' && user && userEmail  && savedPhoto){
      console.log('success');
      this.userData.isLogin = true; // 告訴 Vue：已登入
      this.userData.userInfo = JSON.parse(user); // 還原會員資料到畫面
      this.userData.email = JSON.parse(userEmail); // 還原會員資料到畫面
      this.userData.photo = savedPhoto;
      
      this.memberPhotoChange.LoginAndRegisterPhoto = false;
      this.memberPhotoChange.memberPhoto = true;
    }
 
    // 監聽自訂事件（同分頁）的用途 => 單分頁應用
      window.addEventListener('userPhotoUpdated', (e) => {
      console.log('同分頁頭貼更新', e.detail);
      this.userData.photo = e.detail;
    });

    // 若是跨分頁（不同 tab）的用途 =>  同帳號開多個分頁（例如同時開 user.html + index.html）
      window.addEventListener('storage', (event) => {
      if (event.key === 'userPhoto') {
        console.log('跨分頁頭貼更新', event.newValue);
        this.userData.photo = event.newValue;
      }
    });
 
},
  watch:{ //watch 是在監聽 data 中的變數，但它的值來自 v-model 綁定的 html 標籤

    // 監聽 registerCheckbox變化的值的流程
    // 1. 使用者點擊 checkbox
    // 2. v-model 將 checkbox 狀態 (true/false) 自動同步到 data 資料庫的 checked
    // 3. checked 值改變 → 自動觸發 watch.checked(newValue) ; 你就能根據 newValue 寫判斷邏輯
    checked(newValue){ 
      if(newValue === true){
        this.agreeTermsReminder = false;
        this.agreeTermsErrorMessage = '';
      }      
    },
    
  },
  methods:{ // 這裡只能放函式

    //userPage
    userPage(e){
      const isLogin = localStorage.getItem('isLogin');
      if (isLogin === 'true') {
      window.location.href = '../pages/user.html';
      }
    },

    // read login and register value
    loginSent(e){

      // console.log(this.loginValue.email);
      const loginErrorMessageValueData = [
        {
          test:()=>{
            return this.loginValue.email === '' || !this.loginValue.email;
          },
          emailMessage: 'Email欄位不能為空白'
        },
        {
          test:()=>{
            return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginValue.email);
          },
          emailMessage: '請輸入有效的 Email 格式'
        },
        {
          test:()=>{
            return /\s/.test(this.loginValue.password);
          },
          pwdMessage: '密碼不能包含空白字元'
        },
        {
          test:()=>{
            return /[^a-zA-Z0-9_]/.test(this.loginValue.password) ;
          },
          pwdMessage: '密碼僅可包含英文與數字'
        },
        {
          test:()=>{
            return !this.loginValue.password || this.loginValue.password === '' ;
          },
          pwdMessage: '密碼欄位不能為空白'
        },
        {
          test:()=>{
            return this.loginValue.password.length < 8 ;
          },
          pwdMessage: '密碼長度至少需為 8 個字元'
        }
      ];

      const loginFailed = loginErrorMessageValueData.find((v)=>{
        return v.test();
      });
      console.log(loginFailed);
      if(loginFailed){
        if(loginFailed.emailMessage){
            this.loginValue.email = '';
            this.loginErrorMessage.email = loginFailed.emailMessage;
            this.loginReminder.email = true;
          setTimeout(() => {
            this.loginReminder.email = false;
            this.loginErrorMessage.email = '';
          }, 1000);
        } else if(loginFailed.pwdMessage){
            this.loginValue.password = '';
            this.loginErrorMessage.password = loginFailed.pwdMessage;
            this.loginReminder.password = true;
          setTimeout(() => {
            this.loginReminder.password = false;
            this.loginErrorMessage.password = '';
          }, 1000);
        }
      }else if(!loginFailed){//如果沒有篩出 error
        (async ()=>{
          if(this.isClosingModal) return;
          try{
            const loginRes = await axios({
                                          method:'POST',
                                          url:`${this.url}/users/sign_in`,
                                          data:{
                                            user: {
                                                      "email": this.loginValue.email,
                                                      "password": this.loginValue.password,
                                                    }
                                          },
                                      });
            console.log(loginRes);
            if(loginRes?.['status'] === 200){
              console.log('e',e);
              //關閉 modal 前鎖定 flag
              this.isClosingModal = true;
              //先移除按鈕焦點，避免 aria-hidden 衝突
              e.target.blur();
              //登入成功後才給按鈕加上 data-bs-dismiss
              e.target.setAttribute('data-bs-dismiss', 'modal');
              //模擬點擊一次，讓 Bootstrap 關掉 modal
              e.target.click();

              setTimeout(() => {
                this.loginValue.email = '';
                this.loginValue.password = '';
                //移除屬性，避免之後誤觸
                e.target.removeAttribute('data-bs-dismiss');
                //過一段時間再解除鎖
                this.isClosingModal = false;
              }, 1000);
              
              // 清掉舊的登入資訊（比較安全）
              localStorage.removeItem('isLogin');
              localStorage.removeItem('userInfo');

              // localStorage.setItem(); 只是存資料，不會自動改變畫面
              //紀錄登入狀態
              localStorage.setItem('isLogin', 'true');
              
              // 用 JSON.stringify() 是因為 localStorage 只能存字串，不能直接存物件。
              localStorage.setItem('userInfo', JSON.stringify(loginRes.data.nickname)); // 紀錄 API 回傳使用者資料(loginRes.data.nickname)
              localStorage.setItem('userEmail', JSON.stringify(loginRes.data.email)); // 紀錄 API 回傳使用者資料(loginRes.data.nickname)

              // 若 localStorage 還沒有存照片，設置預設頭貼
              if(!localStorage.getItem('userPhoto')){
                // 登入時預設頭貼
                const defaultPhoto = 'https://github.com/hexschool/2022-web-layout-training/blob/main/2025-week5/avatar_default.png?raw=true';
                localStorage.setItem('userPhoto', defaultPhoto );
              }
              //為了讓「前端畫面立即更新」而存在的
              this.userData.isLogin = true;
              this.userData.userInfo = loginRes.data.nickname;
              this.userData.email = loginRes.data.email;

              // 為了讓「前端畫面立即更新」而讀取 localStorage 的頭貼（可能是預設，也可能是使用者之前上傳的）
              this.userData.photo = localStorage.getItem('userPhoto');
              
              this.memberPhotoChange.LoginAndRegisterPhoto = false;
              this.memberPhotoChange.memberPhoto = true;
              
            }
          }catch(loginErr){
            console.log(loginErr);
            
            // console.log(loginErr['status']);
            if(loginErr['status'] === 401){
              alert('電子信箱或密碼錯誤');
              this.loginValue.email = '';
              this.loginValue.password = '';
            }
          }
        })();
      }
    },

    registerSent(e){
      // const registerAccount = this.$refs.registerAccount;
      // console.log('account', registerAccount.value);
      // console.log('1',this.registerAccountValue);
      
      // * if 判斷法太攏長
      // if(this.registerAccountValue.length < 8 || /\s/.test(this.registerAccountValue) || /[^a-zA-Z0-9_]/.test(this.registerAccountValue)){
  
      //   // 判斷是什麼錯誤
      // if (/\s/.test(this.registerAccountValue)) {
      //   this.accountErrorMessage = '帳號不能包含空白字元';
      // }else if(/[^a-zA-Z0-9_]/.test(this.registerAccountValue)){
      //   this.accountErrorMessage = '帳號僅可包含英文與數字';
      // }else if(this.registerAccountValue.length < 8) {
      //   this.accountErrorMessage = '帳號長度至少需為 8 個字元';
      // }
      // // 清空欄位
      //   this.registerAccountValue = '';

      //   // 顯示錯誤訊息
      //   this.accountReminder = true;
      //   setTimeout(()=>{
      //     this.accountReminder = false;
      //     this.accountErrorMessage ='';
      //   },3000);
      // }
      // this.registerAccountValue.length < 8? this.registerAccountValue = '✘ 帳號長度至少需為 8 個字元': null;
      
      // * 使用物件與錯誤訊息對應（最進階，支援多訊息）
      //先建立一個「規則清單 validations」
      const registerErrorMessageValueData = [
        //account
        {
          test:()=>{
            return /\s/.test(this.registerAccountValue);
          },
          accountMessage: '帳號不能包含空白字元'
        },
        {
          // 普通函式的 this 不指向 Vue 實例
          // 1.用箭頭函式或改為傳參數方式
          // 2.使用 .bind(this)來指向
          test: function(){
            return /[^a-zA-Z0-9_]/.test(this.registerAccountValue);
          }.bind(this),
          accountMessage: '帳號僅可包含英文與數字'
        },
        {
          test:()=>{
            return !this.registerAccountValue || this.registerAccountValue === '';
          },
          accountMessage: '帳號欄位不能為空白'
        },
        {
          test:()=>{
            return this.registerAccountValue.length < 8;
          },
          accountMessage: '帳號長度至少需為 8 個字元'
        },
        //email
        {
          test:()=>{
            return !this.registerEmailValue || this.registerEmailValue === '';
          },
          emailMessage: 'Email欄位不能為空白'
        },
        {
          test:()=>{
            return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerEmailValue);
          },
          emailMessage: '請輸入有效的 Email 格式'
        },
        //pwd
        {
          test:()=>{
            return /\s/.test(this.registerPasswordValue);
          },
          pwdMessage: '密碼不能包含空白字元'
        },
        {
          test:()=>{
            return /[^a-zA-Z0-9_]/.test(this.registerPasswordValue);
          },
          pwdMessage: '密碼僅可包含英文與數字'
        },
        {
          test:()=>{
            return !this.registerPasswordValue || this.registerPasswordValue === '';
          },
          pwdMessage: '密碼欄位不能為空白'
        },
        {
          test:()=>{
            return this.registerPasswordValue.length < 8;
          },
          pwdMessage: '密碼長度至少需為 8 個字元'
        },
        //checkPwd
        {
          test:()=>{
            return !this.registerCheckPasswordValue || this.registerCheckPasswordValue === '';
          },
          checkPwdMessage: '確認密碼欄位不能為空白'
        },
        {
          test:()=>{
            return this.registerPasswordValue !== this.registerCheckPasswordValue;
          },
          checkPwdMessage: '兩次輸入的密碼不一致'
        },
        {
          test:()=>{
            return !this.checked;
          },
          agreeMessage: '請先勾選同意條款'
        }
      ];

      //呼叫陣列物件函式register
      // allRegisterAccountValue[0].test();

      //find() 會從 index 0 開始一個一個執行一個一個去執行 v.test() 並回傳規則清單內的那一項物件的條件一樣
      const failed = registerErrorMessageValueData.find(function(v){
        console.log(v);
        return v.test(); // 呼叫陣列物件函式的方式
      }) 
      console.log(failed);
      if(failed){ // 如果有篩出 error
        if(failed.accountMessage){
          console.log('success');
          // 清空欄位
          this.registerAccountValue = '';
          //輸入錯誤訊息
          this.accountErrorMessage = failed.accountMessage;
          // 顯示錯誤訊息
          this.accountReminder = true;
        setTimeout(()=>{
          this.accountReminder = false;
          this.accountErrorMessage ='';
        },1000);
        }else if(failed.emailMessage){
          // 清空欄位
          this.registerEmailValue = '';
          //輸入錯誤訊息
          this.emailErrorMessage = failed.emailMessage;
          // 顯示錯誤訊息
          this.emailReminder = true;
        setTimeout(()=>{
          this.emailReminder = false;
          this.emailErrorMessage ='';
        },1000);
        }else if(failed.pwdMessage){
          // 清空欄位
          this.registerPasswordValue = '';
          this.registerCheckPasswordValue = '';
          //輸入錯誤訊息
          this.pwdErrorMessage = failed.pwdMessage;
          // 顯示錯誤訊息
          this.pwdReminder = true;
        setTimeout(()=>{
          this.pwdReminder = false;
          this.pwdErrorMessage ='';
        },1000);
        }else if(failed.checkPwdMessage){
          // 清空欄位
          this.registerCheckPasswordValue = '';
          //輸入錯誤訊息
          this.checkPwdErrorMessage = failed.checkPwdMessage;
          // 顯示錯誤訊息
          this.checkPwdReminder = true;
        setTimeout(()=>{
          this.checkPwdReminder = false;
          this.checkPwdErrorMessage ='';
        },1000);
        }else if(failed.agreeMessage){
          //輸入錯誤訊息
          this.agreeTermsErrorMessage = failed.agreeMessage;
          // 顯示錯誤訊息
          this.agreeTermsReminder = true;
        }
      };

    
    if(!failed){ //如果沒有篩出 error
    // axios的方法1
    //  axios({
    //   method:'POST',
    //   url:`${this.url}/users`,
    //   data:{
    //     user:{
    //       "email": this.registerEmailValue,
    //       "nickname": this.registerAccountValue,
    //       "password": this.registerPasswordValue,
    //     }
    //   }
    //  })
    //  .then(res=>console.log(res))
    //  .catch(err=>console.log(err))

        (async ()=>{
      try{
        const res = await axios({
                      method:'POST',
                      url:`${this.url}/users`,
                      data:{
                        user:{
                          "email": this.registerEmailValue,
                          "nickname": this.registerAccountValue,
                          "password": this.registerPasswordValue,
                        }
                      }
                    });
       console.log(res);
       if(res?.status === 201){
        alert('註冊成功');
        setTimeout(()=>{
          (()=>{
            this.modalLogin = !this.modalLogin;
            this.modalRegister = !this.modalRegister;
            this.currentMode = 'login';
          })();
            this.registerAccountValue = '';
            this.registerEmailValue = '';
            this.registerPasswordValue = '';
            this.registerCheckPasswordValue = '';
            this.checked = !this.checked;
        },1000)
       }
      } catch(err){
        console.log(err);
        // console.log(err.response);
        // console.log(err.response.status);
        // console.log(err.response['status']);
        // console.log(typeof err.response['status']);

        //方法1
        // const status = err.response['status'];
        // status === 422? statusError(this):null; //  statusError() 函式代入 this 
        // //在 Vue 的 methods 裡定義一個普通函式（非箭頭函式）時，
        // // 它內部的 this 不會自動指向 Vue 實例。
        // function statusError(vm){ 
        //   // 1. 用 vm 當參數把 Vue 的 this 明確傳進去
        //   //2. 再用 vm.xxx 的方式去存取資料或改變狀態
        //   vm.registerEmailValue = '';
        //   vm.emailErrorMessage = err.response.data['error'][0].replace(/\s+/g, '');
        //   vm.emailReminder = true;
        //   setTimeout(()=>{
        //     vm.emailReminder = false;
        //     vm.emailErrorMessage = '';
        //   },1500);
        // }
        
        if(err.response?.['status'] === 422){
          this.registerEmailValue = '';
          // replace(/\s+/g, '') => 去掉中間空白字元
          this.emailErrorMessage = err.response.data['error'][0].replace(/\s+/g, '');
          this.emailReminder = true;
          setTimeout(()=>{
            this.emailReminder = false;
            this.emailErrorMessage = '';
            },1500);
          }
        }
      })();
    }
  


    },
   
    //eye icon change
    //三個函式相同, 集中管理
    toggle(refsName, iconKey, e){
      // 1. this.$refs 是一個物件（Object)
      // 2. refsName = "loginPasswordInput or registerPasswordInput or checkPasswordInput" 這個物件中的一個屬性 key
      // 3. this.$refs[refsName]（中括號語法）
      const eyeInputType = this.$refs[refsName];
      const eyeIcon = e.target.innerHTML.trim();
      //讀取 data 裡面的參數變數值
      this[iconKey] = eyeIcon === 'visibility_off'? 'visibility':'visibility_off'; 
      eyeInputType.type =  eyeIcon === 'visibility_off'? 'text':'password';
    },
    eyeLoginChange(e){
      // 使用 vue 做法來取 input type 屬性值
        // const eyeLoginInput = this.$refs.loginPasswordInput;
        // console.log(eyeLoginInput.type);

      //使用 js 做法來取 input type 屬性值
        // const eyeInput = $('#floatingPassword');
        // console.log(eyeInput.type);
        
      // const eyeIcon = e.target.innerHTML.trim();
      // console.log(eyeIcon);
      // if(eyeIcon === 'visibility_off'){
      //  this.eyeIcon = 'visibility';
      //  eyeInput.type = 'text';
      // }else if(eyeIcon === 'visibility'){
      //   this.eyeIcon = 'visibility_off';
      //   eyeInput.type = 'password';
      // }
      
      //三元運算子版本（簡化後）; 點擊 icon 時, icon 以及 密碼欄 會同時立刻切換, 沒有閃爍，也不會互相干擾
      // this.eyeIcon = eyeIcon === 'visibility_off'? 'visibility':'visibility_off'; 
      // this.eyeIcon = 目前是不是「隱藏狀態」? =? true -> 回傳 visibility ; this.eyeIcon = visibility 
      // eyeLoginInput.type = eyeIcon === 'visibility_off'? 'text':'password';
      // eyeInput.type = 目前是不是「隱藏狀態」? true -> 回傳 text ; eyeInput.type = text
      this.toggle('loginPasswordInput', 'eyeIcon', e);
    },
    eyeRegisterChange(e){
      // const eyeRegisterInput = $('#floatingRegisterPassword');
      // const eyeIcon = e.target.innerHTML.trim();
      // this.eyeRegisterIcon = eyeIcon === 'visibility_off'? 'visibility':'visibility_off';
      // eyeRegisterInput.type = eyeIcon === 'visibility_off'? 'text':'password';
      this.toggle('registerPasswordInput', 'eyeRegisterIcon', e);
    },
    eyeCheckChange(e){
      // const eyeCheckInput = $('#floatingCheckPassword');
      // const eyeIcon = e.target.innerHTML.trim();
      // this.eyeCheckIcon = eyeIcon === 'visibility_off'? 'visibility':'visibility_off';
      // eyeCheckInput.type = eyeIcon === 'visibility_off'? 'text':'password';
      this.toggle('checkPasswordInput', 'eyeCheckIcon', e);
    },
    //Login and register page change 
    closeModal(){
      document.activeElement?.blur(); //先移除 btn focus
     
      // btn 關閉後, 回到預設頁面
     if(this.currentMode === 'login'){
      this.modalLogin = true;
      this.modalRegister = false;
     }else if(this.currentMode === 'register'){
       this.modalRegister = false;
       setTimeout(()=>{
         this.modalLogin = true;
         this.currentMode = 'login';
         //若有 key in 資料, 但未續完成就按壓 close btn 後, 清空資料 
         this.registerAccountValue = '';
         this.registerEmailValue = '';
         this.registerPasswordValue = '';
         this.registerCheckPasswordValue = '';
         this.checked = false;
       },300)
     }
    },

    switchRegisterOrLogin(e){
      // console.log(e.target.innerText);
      let txt = e.target.innerText.trim();
      if(txt === '快速註冊'){
        this.modalLogin = !this.modalLogin;
        this.modalRegister = !this.modalRegister;
        this.currentMode = 'register';
      }else if(txt === '直接登入'){
        this.modalLogin = !this.modalLogin;
        this.modalRegister = !this.modalRegister;
        this.currentMode = 'login';
      }
    }
    
  }
}

createApp(navLogin).mount('#navLogin');


// 註冊表單驗證（使用 if / else if）

// validateForm() {
//   if (this.username.length < 4) {
//     this.error = '✘ 帳號長度至少需為 4 個字元';
//   } else if (this.password.length < 8) {
//     this.error = '✘ 密碼長度至少為 8 個字元，且需包含英文與數字';
//   } else if (!/[a-zA-Z]/.test(this.password) || !/\d/.test(this.password)) {
//     this.error = '✘ 密碼需包含英文與數字';
//   } else if (/\s/.test(this.password)) {
//     this.error = '✘ 密碼不能包含空白字元';
//   } else if (this.password !== this.confirmPassword) {
//     this.error = '✘ 兩次輸入的密碼不一致';
//   } else if (this.usernameExists(this.username)) {
//     this.error = '✘ 此帳號已被使用，請嘗試其他名稱';
//   } else {
//     this.error = ''; // 沒錯誤
//     return true;
//   }
//   return false;
// }

// 前端如何呼叫這個 API？
// Vue / JS 範例
// async checkEmailDuplicate() {
//   const res = await fetch(`/check-email?email=${encodeURIComponent(this.email)}`);
//   const data = await res.json();

//   if (data.exists) {
//     this.emailError = '✘ 此 Email 已被註冊';
//   } else {
//     this.emailError = '';
//   }
// }


// 可以在「輸入完成後的 blur 事件」呼叫檢查

// 或按下「註冊」按鈕時做一次整體表單驗證

// 改寫成「帳號重複檢查」範例
// async checkAccountDuplicate() {
//   const res = await fetch(`/check-account?account=${encodeURIComponent(this.registerAccountValue)}`);
//   const data = await res.json();

//   if (data.exists) {
//     this.accountError = '✘ 此帳號已被使用，請嘗試其他名稱';
//   } else {
//     this.accountError = '';
//   }
// }




