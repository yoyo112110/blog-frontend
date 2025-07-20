import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(pinia).use(Antd).use(router).mount('#app');

// main.ts / index.js
// window.addEventListener('error', (e) => {
//   if (e.message.includes('ResizeObserver')) e.stopImmediatePropagation();
// });
// src/main.ts 最前面
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes?.('ResizeObserver loop')
  )
    return;
  originalError(...args);
};