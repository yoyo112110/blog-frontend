import { defineStore } from 'pinia';
import { ref, computed } from 'vue'; // 导入 computed
import router from '@/router';
import myAxios from '@/request';
import { message } from 'ant-design-vue';

// 调整类型：确保与后端接口匹配
interface LoginUser {
  id: number | string; // 兼容 number 或 string 类型的 userId
  userName: string;
  avatar?: string; // 可选：头像
  token : string; // 可选：Token
  // 其他可能的字段：如 introduction、role 等
}

export const useLoginUserStore = defineStore('loginUser', () => {
  // 存储已登录用户信息（初始为 null）
  const loginUser = ref<LoginUser | null>(null);

  // 响应式判断是否登录（随 loginUser 变化自动更新）
  const isLoggedIn = computed(() => !!loginUser.value);

  // 登录方法
  const login = async (userName: string, userPassword: string) => {
    try {
      const { data } = await myAxios.post('/api/user/login', { userName, userPassword });
      
      if (data.code === 0) {
        // 合并后端返回的所有用户信息
        loginUser.value = {
          ...data.data, // 包含 userId、avatar 等后端返回字段
          userName: userName // 确保 userName 为登录输入
        };
        message.success('登录成功');
        router.push('/');
        return true;
      } else {
        message.error(data.message || '登录失败');
        return false;
      }
    } catch (error: any) {
      // 更详细的错误提示
      message.error(`登录失败：${error.message || '网络异常'}`);
      return false;
    }
  };

  // 在 useLoginUserStore 中添加注册方法
const register = async (userName: string, password: string) => {
  try {
    const { data } = await myAxios.post('/api/user/register', {
      userName,
      password
      // 可根据后端要求添加其他字段，如 email、nickname 等
    });
    
    if (data.code === 0) {
      message.success('注册成功，请登录');
      router.push('/login'); // 注册成功后跳转到登录页
      return true;
    } else {
      message.error(data.message || '注册失败');
      return false;
    }
  } catch (error: any) {
    message.error(`注册失败：${error.message || '网络异常'}`);
    return false;
  }
};
  // 登出方法
  const logout = () => {
    loginUser.value = null;
    // 若有 Token 存储，需同步清除
    // localStorage.removeItem('token');
    router.push('/login');
    message.success('已退出登录');
  };

  return {
    loginUser,
    isLoggedIn, // 改为 computed
    login,
    register,
    logout
  };
});

// @/store/useLoginUserStore.ts
// import { defineStore } from 'pinia';
// import { ref, onMounted } from 'vue';
// import { login as apiLogin, logout as apiLogout } from '@/api/user';
// import { computed } from 'vue';

// export const useLoginUserStore = defineStore('loginUser', () => {
//   // 存储登录用户信息（初始值从 localStorage 读取）
//   const loginUser = ref<any>(null);

//   // 初始化：刷新页面时从 localStorage 恢复登录状态
//   onMounted(() => {
//     const savedUser = localStorage.getItem('loginUser');
//     if (savedUser) {
//       loginUser.value = JSON.parse(savedUser); // 反序列化
//     }
//   });

//   // 登录：成功后保存到 localStorage
//   const login = async (username: string, password: string) => {
//     const user = await apiLogin(username, password); // 调用登录接口
//     loginUser.value = user;
//     localStorage.setItem('loginUser', JSON.stringify(user)); // 序列化存储
//     return user;
//   };

//   // 登出：清除 localStorage
//   const logout = async () => {
//     await apiLogout(); // 调用登出接口（可选）
//     loginUser.value = null;
//     localStorage.removeItem('loginUser'); // 清除存储
//   };

//   // 是否登录
//   const isLoggedIn = computed(() => !!loginUser.value);

//   return { loginUser, login, logout, isLoggedIn };
// });