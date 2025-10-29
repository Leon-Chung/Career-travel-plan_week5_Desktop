import { createApp } from 'vue';

const mountPoint = document.querySelector('#personalData'); // mountPoint => personalData ID 的節點

if (mountPoint) { // 如果這個節點存在, 執行
  const personalData = {
  data(){
    return {
      name: 'leon',
      url:'https://todoo.5xcamp.us/api-docs/index.html',
    }
  },
  methods:{

  }
}
  createApp(personalData).mount(mountPoint);
}




