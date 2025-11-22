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
    console.log('user:', user);
    console.log('email:', userEmail);
    // 讀取 localStorage 的頭貼（可能是預設，也可能是使用者之前上傳的）
    const savedPhoto = localStorage.getItem('userPhoto');
    console.log(savedPhoto);
    // 讀取 localStorage 個人資訊的資料
    const userGender = localStorage.getItem('userGender');
    const userBirthday = localStorage.getItem('userBirthday');
    const userTel = localStorage.getItem('userTel');
    const userAddress = localStorage.getItem('userAddress');
    console.log('gender:', userGender);
    console.log('birthday:', userBirthday);
    console.log('tel:', userTel);
    console.log('address:', userAddress);
    
    if(user && userEmail && savedPhoto){
      this.userData.userInfo = JSON.parse(user);
      this.userData.email = JSON.parse(userEmail);
      this.userData.photo = savedPhoto;
    }

    if( userGender && userBirthday && userTel && userAddress ){
      this.userData.gender = userGender;
      this.userData.birthday = userBirthday;
      this.userData.tel = userTel;
      this.userData.address = userAddress;
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

    //dropdown
    toggleDropdown(e){
      console.log(e);
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

    // 取得 button 後面的下一個兄弟元素
      const menu = btn.nextElementSibling;

    // 檢查這個 menu 是否已經有 .show class 參數 ; 有為 true , 無為 false
    // 將結果存進 isOpen，用來決定後續要加還是移除 .show
      const isOpen = menu.classList.contains('show');

    // 第一次點擊 dropdown 按鈕時, 你的 HTML 還沒有 .show   
      console.log(isOpen); //-->回傳 false

    // 先把 所有 dropdown 都關掉（移除 .show）=> 保證同一時間只有一個 dropdown 打開
    // 關閉所有 dropdown
      allMenus.forEach(menu => menu.classList.remove('show'));

    // 如果點擊的 dropdown 時, 原本就是關閉的 (isOpen = false) → 就加上 .show → 打開它
    // 如果原本已經開了 → 不加 → 也就是維持關閉
      if (!isOpen) {
        menu.classList.add('show');
      }
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



