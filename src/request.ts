import axios, { AxiosResponse } from 'axios';
// import { useAuthStore } from '@/store/useAuthStore';

const myAxios = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  withCredentials: true
});

// Add a request interceptor
// 请求拦截器：添加 Token 到请求头
myAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // 从 localStorage 取 Token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 携带 Token
  }
  return config;
});
// myAxios.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );
// 响应拦截器
// myAxios.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const authStore = useAuthStore();
    
//     // 401错误且未重试
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       if (await authStore.refreshAuthToken()) { // 调用重命名后的方法
//         // 刷新成功后重试原请求
//         return myAxios(originalRequest);
//       }
      
//       // 刷新失败，跳转到登录页
//       authStore.logout();
//       return Promise.reject(error);
//     }
    
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor
myAxios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(response);

    const { data } = response;
    console.log(data);
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息接口，或者不是登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/current') &&
        !window.location.pathname.includes('/user/login')
      ) {
        window.location.href = `/user/login?redirect=${window.location.href}`;
      }
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default myAxios;
// import axios, { AxiosResponse } from 'axios';
// import { useLoginUserStore } from '@/store/useLoginUserStore'; // 导入你的登录状态存储

// const myAxios = axios.create({
//   baseURL: 'http://localhost:8080',
//   timeout: 10000,
//   withCredentials: true
// });

// // 请求拦截器：添加 Token（从 store 或 localStorage 取，优先用 store）
// myAxios.interceptors.request.use(config => {
//   const loginStore = useLoginUserStore(); // 实例化 store
//   // 优先从 store 取 Token（store 已从 localStorage 恢复），避免直接读 localStorage 导致不一致
//   const token = loginStore.loginUser?.token || localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 响应拦截器：处理 401 未登录、错误提示等
// myAxios.interceptors.response.use(
//   (response: AxiosResponse) => {
//     // 后端自定义错误码处理（假设 40100 代表未登录）
//     const { data } = response;
//     if (data.code === 40100) {
//       const loginStore = useLoginUserStore();
//       // 未登录且当前不在登录页，则跳转登录页（带重定向参数）
//       if (!window.location.pathname.includes('/user/login')) {
//         // 保存当前页面地址，登录后可跳转回来
//         const redirectUrl = window.location.href;
//         window.location.href = `/user/login?redirect=${encodeURIComponent(redirectUrl)}`;
//         // 清除 store 中的登录状态（调用 store 现有 logout 方法，不修改 store）
//         loginStore.logout();
//       }
//     }
//     return response;
//   },
//   (error) => {
//     // 处理 HTTP 401 状态码（后端直接返回 401 而非自定义 code）
//     if (error.response?.status === 401) {
//       const loginStore = useLoginUserStore();
//       if (!window.location.pathname.includes('/user/login')) {
//         const redirectUrl = window.location.href;
//         window.location.href = `/user/login?redirect=${encodeURIComponent(redirectUrl)}`;
//         loginStore.logout(); // 调用现有 logout 方法
//       }
//     }
//     // 其他错误提示
//     console.error('请求错误：', error.message);
//     return Promise.reject(error);
//   }
// );

// export default myAxios;


// src/request.ts
// import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'; // 关键：导入 InternalAxiosRequestConfig
// import { useLoginUserStore } from '@/store/useLoginUserStore';

// const myAxios = axios.create({
//   baseURL: 'http://localhost:8080',
//   timeout: 10000,
//   withCredentials: true
// });

// // 请求拦截器：使用 InternalAxiosRequestConfig 类型
// myAxios.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => { // 关键：参数类型改为 InternalAxiosRequestConfig
//     const loginStore = useLoginUserStore();
//     const token = loginStore.loginUser?.token || localStorage.getItem('token');
    
//     if (token) {
//       // 兼容 headers 类型（Axios 1.x 后 headers 为 AxiosHeaders 类型）
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error('请求配置错误：', error);
//     return Promise.reject(error);
//   }
// );

// // 响应拦截器
// myAxios.interceptors.response.use(
//   (response: AxiosResponse) => {
//     const { data } = response;
//     if (data && data.code === 40100) {
//       const loginStore = useLoginUserStore();
//       if (!window.location.pathname.includes('/user/login')) {
//         const redirectUrl = encodeURIComponent(window.location.href);
//         window.location.href = `/user/login?redirect=${redirectUrl}`;
//         loginStore.logout();
//       }
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       const loginStore = useLoginUserStore();
//       if (!window.location.pathname.includes('/user/login')) {
//         const redirectUrl = encodeURIComponent(window.location.href);
//         window.location.href = `/user/login?redirect=${redirectUrl}`;
//         loginStore.logout();
//       }
//     }
//     console.error('请求错误：', error.message);
//     return Promise.reject(error);
//   }
// );

// export default myAxios;