import { createApp } from 'vue';

const mountPoint = document.querySelector('#otherData'); // mountPoint => otherData ID 的節點

if (mountPoint) { // 如果這個節點存在, 執行
  const personalData = {
  data(){
    return {
      name: 'leon123154',
      // userData: { userInfo: null, isLogin: false },
      url:'https://todoo.5xcamp.us/api-docs/index.html',
    }
  },
  methods:{

  }
}
  createApp(personalData).mount(mountPoint);
}




