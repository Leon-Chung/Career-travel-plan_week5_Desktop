import { computed, createApp } from "vue";

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
        // 
      },
      employmentStatusBtn: false,
      expectExpertStatusBtn: false
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
  },
  computed:{ 
  // 利用 computed 功能, 只要this.defaultGuest.consultationTopicOption 有新增選項就自動計算並取出單數的索引值
  // 並將 consultationTopicKey() 函式直接放到 template 用 ; 也就是 template 用頂層 computed，不要再去 data 裡的空陣列
    consultationTopicKey(){
      return this.defaultGuest.consultationTopicOption.map((item,key)=>key).filter((key)=> key % 2 === 1);
    }
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
    }
    
  }
}
createApp(contactUsApp).mount(contactUs);













}