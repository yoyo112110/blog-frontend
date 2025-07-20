<template>
  <BasicLayout />
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue';
import  { useLoginUserStore }  from '@/store/useLoginUserStore';
import { onMounted } from 'vue';

// const loginUserStore = useLoginUserStore();
// loginUserStore.fetchLoginUser();

// const loginUserStore = useLoginUserStore();
// // 页面挂载后再次触发初始化（确保路由和组件准备就绪）
// onMounted(async () => {
//   await loginUserStore.initLoginStatus();
// });

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
