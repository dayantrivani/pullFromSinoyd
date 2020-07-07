<template>
  <div class="jscode">
    <header>点击右上角按钮，然后在弹出的菜单中，点击在浏览器中打开，即可安装</header>
    <section class="container">
      <div class="title">
        <h2>道农移动监管平台App</h2>
        <p>互联网时代运维专家</p>
      </div>
      <div class="content">
        <section class="download">
          <img src="@/assets/img/dlcode.jpg" alt />
          <a @click="downloadApk">
            <svg
              t="1592968323376"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="13837"
              width="16"
              height="16"
            >
              <path
                d="M768 768q0-14.857143-10.857143-25.714286t-25.714286-10.857143-25.714285 10.857143-10.857143 25.714286 10.857143 25.714286 25.714285 10.857143 25.714286-10.857143 10.857143-25.714286z m146.285714 0q0-14.857143-10.857143-25.714286t-25.714285-10.857143-25.714286 10.857143-10.857143 25.714286 10.857143 25.714286 25.714286 10.857143 25.714285-10.857143 10.857143-25.714286z m73.142857-128v182.857143q0 22.857143-16 38.857143t-38.857142 16H91.428571q-22.857143 0-38.857142-16t-16-38.857143v-182.857143q0-22.857143 16-38.857143t38.857142-16h265.714286l77.142857 77.714286q33.142857 32 77.714286 32t77.714286-32l77.714285-77.714286h265.142858q22.857143 0 38.857142 16t16 38.857143z m-185.714285-325.142857q9.714286 23.428571-8 40l-256 256q-10.285714 10.857143-25.714286 10.857143t-25.714286-10.857143L230.285714 354.857143q-17.714286-16.571429-8-40 9.714286-22.285714 33.714286-22.285714h146.285714V36.571429q0-14.857143 10.857143-25.714286t25.714286-10.857143h146.285714q14.857143 0 25.714286 10.857143t10.857143 25.714286v256h146.285714q24 0 33.714286 22.285714z"
                p-id="13838"
                fill="#ffffff"
              />
            </svg>点击下载
          </a>
          <p>适用于Android设备</p>
        </section>
        <section class="describtion">
          <div>
            <h2>应用介绍</h2>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
// import { analyzeResp } from '@/libs/util';

export default {
  name: '',
  mixins: [],
  components: {},
  data() {
    return {};
  },
  created() { },
  watch: {},
  methods: {
    downloadApk() {
      const src = 'https://monitor.envchina.com/api/monitor/static/files/202006/160606341_32.apk';
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `javascript: '<script>location.href="${src}"<\/script>'`;
      document.getElementsByTagName('body')[0].appendChild(iframe);
    },
  },
};
</script>
