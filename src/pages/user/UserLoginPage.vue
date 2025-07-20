<template>
  <div id="UserLoginPage">
    <a-card title="用户登录" style="width: 300px; margin: 0 auto; ">
      <a-form
        :model="loginForm"
        :rules="loginRules"
        @finish="handleLogin"
        ref="loginFormRef"
      >
        <a-form-item label="用户名" name="userName">
          <!-- <a-input v-model:value="loginForm.userName" /> -->
           <a-input v-model:value="loginForm.userName" />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="loginForm.userPassword" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block class="login-btn">登录</a-button>
        </a-form-item>
      </a-form>
      <p>
        还没有账号？
        <router-link to="/user/register" class="register-link">注册</router-link>
      </p>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { loginByUserName } from '@/api/user';
import { useLoginUserStore } from '@/store/useLoginUserStore'; // 导入 store

const router = useRouter();
const loginFormRef = ref();
const userStore = useLoginUserStore();
const loginForm = ref({
  userName: '',
  userPassword: '',
});

const loginRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
};

// const handleLogin = async () => {
//   try {
//     const { data } = await loginByUserName({
//       userName: loginForm.value.userName,
//       userPassword: loginForm.value.userPassword
//     });

//     if (data.code === 0) {
//       // 登录成功后，调用 Store 方法更新状态
//       // 注意：确保接口返回的数据包含 userId、userName 等字段（符合 UserInfo 接口）
//       userStore.setLoginUser(
//         data.data, // 后端返回的用户信息（如 { userId: '1', userName: 'test' }）
//         data.data.token // 后端返回的 Token
//       );

//       message.success('登录成功');
//       // 存储用户名用于页面刷新后恢复状态
//       localStorage.setItem('userName', data.data.userName);
//       router.push('/');
//     } else {
//       message.error(data.message || '用户名或密码错误');
//     }
//   } catch (err: any) {
//     message.error(err.response?.data?.message || '网络异常，请稍后重试');
//   }
// };
// const handleLogin = async () => {
//   try {
//     const { data } = await loginByUserName({
//       userName: loginForm.value.userName,
//       userPassword: loginForm.value.userPassword
//     });

//     if (data.code === 0) {
//       // 关键：登录成功后调用 setLoginUser
//       userStore.setLoginUser(data.data, data.data.token);
//       message.success('登录成功');
//       router.push('/'); // 跳转首页
//     } else {
//       message.error(data.message || '登录失败');
//     }
//   } catch (err: any) {
//     message.error('网络异常，请稍后重试');
//   }
// };

// const authStore = useAuthStore();
// const email = ref('');
// const password = ref('');

// const handleLogin = async () => {
//   try {
//     await authStore.login({ email: email.value, password: password.value });
//   } catch (error) {
//     console.error('登录失败', error);
//     // 显示错误提示
//   }
// };
const loginUserStore = useLoginUserStore();
const userName = ref('');
const password = ref('');

// ============================强制
// const handleLogin = async () => {
//   if (!userName.value || !password.value) {
//     message.warning('请完善登录信息');
//     return;
//   }
//   // 调用登录方法
//   await loginUserStore.login(userName.value, password.value);
// };
// const handleLogin = async () => {
//   // 去除首尾空格
//   const trimmedUserName = userName.value.trim();
//   const trimmedPassword = password.value.trim();

//   // 验证处理后的输入
//   if (!trimmedUserName || !trimmedPassword) {
//     message.warning('请完善登录信息');
//     return;
//   }

//   // 传递处理后的值
//   await loginUserStore.login(trimmedUserName, trimmedPassword);
// };
// const handleLogin = async () => {
//   // 关键：打印输入值，按F12在控制台查看
//   console.log('用户名实际值:', userName.value, '类型:', typeof userName.value);
//   console.log('密码实际值:', password.value, '类型:', typeof password.value);

//   if (!userName.value || !password.value) {
//     message.warning('请完善登录信息');
//     return;
//   }
//   await loginUserStore.login(userName.value, password.value);
// };
// 登录处理函数（使用 loginForm 中的值）
const handleLogin = async () => {
  // 1. 获取输入框的值（来自 loginForm）
  const userName = loginForm.value.userName.trim();
  const userPassword = loginForm.value.userPassword.trim();

  // 2. 验证非空
  if (!userName || !userPassword) {
    message.warning('请完善登录信息');
    return;
  }

  // 3. 调用登录方法（传递处理后的值）
  const loginSuccess = await loginUserStore.login(userName, userPassword);
  
  // 4. 登录成功后的处理（可选）
  if (loginSuccess) {
    // 可添加额外逻辑，如关闭表单、重置输入等
    loginFormRef.value?.resetFields();
  }
};
</script>

<style scoped>
#UserLoginPage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 88vh;
  /* margin-top: 50px; */
}

.login-btn {
  background-color: #77d8d8;
}

.login-btn:hover {
  background-color: #5fb9b9; /* 鼠标悬停时的背景颜色 */
  border-color: #5fb9b9; /* 鼠标悬停时的边框颜色 */
}

.login-btn:focus {
  border-color: #77d8d8; /* 获取焦点时的边框颜色 */
}

.register-link {
  color: #77d8d8;
}

.register-link:hover {
  color: #5fb9b9;
}
</style>
