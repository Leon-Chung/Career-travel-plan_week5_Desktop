import { createApp } from "vue";

const indexPoint = document.querySelector('#indexApp');
// console.log(indexPoint);

if(indexPoint){
  const indexApp = {
    data(){
      return{
        qaActiveItem: null,
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
        this.qaItemArrowDirection = this.qaItemArrowDirection === 'chevron_left'? 'keyboard_arrow_down':'chevron_left';

        console.log(qaItemValue);
        this.qaActiveItem = this.qaActiveItem === qaItemValue? null : qaItemValue;
      }
    }
  }

  createApp(indexApp).mount(indexPoint);
}