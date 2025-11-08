import { Modal } from 'bootstrap';
import { createApp, warn, watch } from 'vue';

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
    
    }
  },
  mounted() {//mounted() 是跳頁時會自動進行「初始化階段讀取一次」
    // 讀取 localStorage 的使用者暱稱（登入時並紀錄 API 回傳的使用者資料)
    const user = localStorage.getItem('userInfo');
    const userEmail = localStorage.getItem('userEmail');
    // 讀取 localStorage 的頭貼（可能是預設，也可能是使用者之前上傳的）
    const savedPhoto = localStorage.getItem('userPhoto');
    console.log('user:', user);
    console.log('email:', userEmail);
    console.log(savedPhoto);
    
    if(user && userEmail && savedPhoto){
      this.userData.userInfo = JSON.parse(user);
      this.userData.email = JSON.parse(userEmail);
      this.userData.photo = savedPhoto;
    }
  },
  watch:{ //watch 是在監聽 data 中的變數，但它的值來自 v-model 綁定的 html 標籤
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



