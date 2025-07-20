<template>
  <div id="BasicLayout">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">ksdblog &copy; 2025</a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup>
import { getCurrentUser } from '@/api/user';
import GlobalHeader from '@/components/GlobalHeader.vue';

//test
// getCurrentUser().then(res => {
//   console.log(res);
// })
// 示例数据加载
// getCurrentUser().then((res) => {
//   console.log(res);
// }); //直接移除 getCurrentUser 的调用。
</script>

<style scoped>
#BasicLayout {
  min-height: 100vh;
  /*background: linear-gradient(to right, #ece8f4, #dff5ff); /* 浅紫和浅蓝的渐变 */
  /*background-size: cover; /* 使背景渐变覆盖整个区域 */
  /*background-attachment: fixed; /* 使背景渐变固定，不随滚动条滚动 */
}

#BasicLayout .header {
  background-color: rgba(0, 0, 0, 0.1);
}

#BasicLayout .footer {
  background-color: #efefef;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
}

#BasicLayout .content {
  /* width: 1551.77px; */
  width: 100%;
  margin: 0 auto;
  /* padding: 20px; */
  /* 要和底部栏保持一定的外边距，否则内容会被遮住 */
  margin-bottom: 20px;
  /* background-image: url('../assets/logo.png'); */
  background: linear-gradient(to right, #ece8f4, #dff5ff); 
  background-size: cover; 
  background-attachment: fixed; 
}

#basicLayout .header {
  background-color: #fff;
  /* */
  /* margin-bottom: 16px; */
  color: unset;
  padding-inline: 20px;
}
</style>
