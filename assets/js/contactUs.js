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
        //聯絡偏好
        preferredContactMethod:'信箱',
        preferredContactMethodOption:['信箱', '電話', 'LINE', 'Discord'],
        preferredContactTime:[],
        preferredContactTimeOption:[
                                     '平日上午(9:00-12:00)', '平日下午(13:00-17:00)', '平日晚上(18:00-21:00)',
                                     '週末上午(9:00-12:00)', '週末下午(13:00-17:00)', '週末晚上(18:00-21:00)'
                                    ],
        findOutThroughAChannel:[],
        findOutThroughAChannelOption:[
                                      'Google 搜尋', 'Instagram', 'Facebook', 'Threads', 'YouTube',
                                      'Podcast / 節目推薦', '朋友或同事推薦', '曾參加職旅活動 / 工作坊', '職涯顧問介紹',
                                      '其他（請填寫下題）'
                                    ],

      },
      employmentStatusBtn: false,
      expectExpertStatusBtn: false,

      //checkSwitch
      acceptNewDataCheckedText: '',
      acceptNewDataChecked: false,
      acceptNewDataShowSwitch: false
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
     ];

     // Array.prototype.find() 的行為是： 「幫我找第一個 test() 回傳 true 的規則」
     const findTestError = sentContactErrorValue.find((item)=>item.test());
     // 有找到符合條件->那個物件
     // 沒找到->undefined

     console.log(findTestError);
     
     if(findTestError){ // 如果有篩出 error
      if(findTestError.acceptNewDataCheckedErrorMessage){
        this.acceptNewDataShowSwitch = true;
        this.acceptNewDataCheckedText = findTestError.acceptNewDataCheckedErrorMessage;
        }
      }
     

    }
  }
}
createApp(contactUsApp).mount(contactUs);













}