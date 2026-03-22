import { createApp } from "vue";

const indexPoint = document.querySelector('#indexApp');
// console.log(indexPoint);

if(indexPoint){
  const indexApp = {
    data(){
      return{
        qaActiveItem: null,
        faqList:[
          {
            id:'item1',
            q:'Q.',
            question:'一對一諮詢是怎麼進行的？需要準備什麼嗎？',
            a:'A.',
            and:`諮詢通常採 Google Meet 或 Zoom，時長約 30 分鐘。
                 我們建議你在預約前先簡單整理目前的狀態、遇到的困難、或想達成的目標。
                 如果你不確定，顧問也會從對話中引導你探索，無需擔心準備不夠。
                 `,
          },
          {
            id:'item2',
            q:'Q.',
            question:'自由職涯真的可以養活自己嗎？你們怎麼協助？',
            a:'A.',
            and:`自由職涯可以養活自己，但需要有策略與持續調整。WorkWay 顧問會根據你的專業、興趣、可投入時間，
                 設計客製化的變現路徑，例如自由接案、產品化服務、遠端職位申請等，
                 同時協助你管理初期財務風險，避免因壓力過大中途放棄。
                 `,
          },
          {
            id:'item3',
            q:'Q.',
            question:'職旅 WorkWay 的收費方式是怎麼計算的？',
            a:'A.',
            and:`我們提供單次諮詢、短期方案（例如 3 次輔導包）、或專案長期陪跑計畫。
                 每種方案都標示清楚金額與包含內容，無強制綁約或推銷額外商品。選擇前，
                 我們也會依照你的需求與預算一起討論最適合的安排。
                 `,
          },
          {
            id:'item4',
            q:'Q.',
            question:'如果諮詢後發現不適合，會有退款保障嗎？',
            a:'A.',
            and:`WorkWay 對每一位學員負責。如果你在第一次完整諮詢結束後，覺得方向不符合期待，
                 可在 3 日內申請退款。我們也提供一次更換顧問的機會，確保你找到最適合自己的陪伴者。
                 `,
          },
          {
            id:'item5',
            q:'Q.',
            question:'我現在還不確定自己要什麼，也可以預約諮詢嗎？',
            a:'A.',
            and:`很多人來找 WorkWay 時，其實也處於迷惘期。我們的一對一諮詢設計，就是從理解你的人生目標、
                 價值觀與現實條件開始，逐步協助你釐清想要的生活方式與可能路徑。你不需要有答案，只需要願意開始對話。
                 `,
          },
        ]
      }
    },
    mounted(){
    
    },
    methods:{
      qaItem(qaItemValue){
        // console.log(e.target.nextElementSibling.outerText);
        // if(e.target.nextElementSibling.outerText === 'chevron_left'){
        //   this.qaItemArrowDirection = 'keyboard_arrow_down';
        // }else if(e.target.nextElementSibling.outerText === 'keyboard_arrow_down'){
        //    this.qaItemArrowDirection = 'chevron_left';
        // }

        //優化後
        // this.qaItemArrowDirection = this.qaItemArrowDirection === 'chevron_left'? 'keyboard_arrow_down':'chevron_left';
        
        //二次優化
        console.log(qaItemValue);
        this.qaActiveItem = this.qaActiveItem === qaItemValue? null : qaItemValue;
      }
    }
  }

  createApp(indexApp).mount(indexPoint);
}

window.addEventListener('DOMContentLoaded', () => {
  const swiperHero = new Swiper('.swiper-Hero', {
        // Optional parameters
        // direction: 'vertical',
        loop: true,
        spaceBetween: 16, //控制 slide 間距。
        loopAdditionalSlides: 0,
        slidesPerView: 'auto',
        autoHeight: false,
        breakpoints: {
          1024: {
            spaceBetween: 24,
          }
        }
        
      });
      const swiperServiceProcess = new Swiper('.swiper-Service-process', {
        // Optional parameters
        // direction: 'vertical',
        loop: true,
        spaceBetween: 16, //控制 slide 間距。
        loopAdditionalSlides: 0,
        slidesPerView: 'auto',
        autoHeight: false,
        
        breakpoints: {
          1024: {
            spaceBetween: 24,
            allowTouchMove: false
          }
        }
      });
});