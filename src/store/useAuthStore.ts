// import { defineStore } from 'pinia';
// import myAxios from '@/request';
// import router from '@/router';
// import { ref, computed } from 'vue';

// // 定义接口类型
// interface User {
//   id: number;
//   name: string;
//   email: string;
//   // 其他用户字段
// }

// interface AuthResponse {
//   user: User;
//   token: string;
//   refreshToken: string;
// }

// export const useAuthStore = defineStore('auth', () => {
//   // 状态
//   const user = ref<User | null>(null);
//   const token = ref<string | null>(null);
//   const refreshToken = ref<string | null>(null);
//   const loading = ref(false);

//   // 获取器
//   const isAuthenticated = computed(() => !!token.value);

//   // 登录方法
//   const login = async (credentials: { email: string; password: string }) => {
//     loading.value = true;
//     try {
//       const { data } = await myAxios.post<AuthResponse>('/api/login', credentials);
//       user.value = data.user;
//       token.value = data.token;
//       refreshToken.value = data.refreshToken;
      
//       // 设置axios默认请求头
//       myAxios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      
//       // 登录成功后跳转到首页
//       router.push('/');
//       return true;
//     } catch (error) {
//       logout();
//       throw error;
//     } finally {
//       loading.value = false;
//     }
//   };

//   // 刷新Token
//   const refreshTokenFn = async () => {
//     if (!refreshToken.value) return false;
    
//     try {
//       const { data } = await myAxios.post<{ token: string }>('/api/refresh-token', {
//         refreshToken: refreshToken.value
//       });
      
//       token.value = data.token;
//       myAxios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
//       return true;
//     } catch (error) {
//       logout();
//       return false;
//     }
//   };

//   // 登出
//   const logout = () => {
//     user.value = null;
//     token.value = null;
//     refreshToken.value = null;
    
//     // 清除axios请求头
//     delete myAxios.defaults.headers.common['Authorization'];
    
//     // 跳转到登录页
//     router.push('/login');
//   };

//   // 初始化认证状态
//   const initAuth = async () => {
//     if (token.value) {
//       myAxios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
//       try {
//         // 验证Token有效性
//         const { data } = await myAxios.get<User>('/api/me');
//         user.value = data;
//         return true;
//       } catch (error) {
//         // Token无效，尝试刷新
//         return await refreshTokenFn();
//       }
//     }
//     return false;
//   };

//   return {
//     user,
//     token,
//     originalRefreshToken: refreshToken, // 将第一个属性重命名为一个不同的名称
//     loading,
//     isAuthenticated,
//     login,
//     refreshToken: refreshTokenFn, // 重命名避免与状态名冲突
//     logout,
//     initAuth
//   };
// }, {
//   persist: {
//     key: 'my-app-auth',
//     storage: localStorage,
//     paths: ['user', 'token', 'originalRefreshToken','refreshToken']
//   }
// });