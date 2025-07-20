<template>
  <div id="UserRegisterPage">
    <a-card title="用户注册" style="width: 300px; margin: 0 auto;">
      <a-form
        :model="registerForm"
        :rules="registerRules"
        @finish="handleRegister"
        ref="registerFormRef"
      >
        <a-form-item label="用户名" name="userName">
          <a-input v-model:value="registerForm.userName" />
        </a-form-item>
        <a-form-item label="邮箱" name="userEmail">
          <a-input v-model:value="registerForm.userEmail" />
        </a-form-item>
        <a-form-item label="密码" name="userPassword">
          <a-input-password v-model:value="registerForm.userPassword" />
        </a-form-item>
        <a-form-item label="验证码" name="captcha">
  <a-space>
    <a-input v-model:value="registerForm.captcha" />
    <a-button
      size="small"
      :disabled="countDown > 0"
      :loading="sending"
      @click="sendCode"
      class="sendcode-btn">
      {{ countDown > 0 ? `${countDown}s` : '发送验证码' }}
    </a-button>
  </a-space>
</a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block class="register-btn">注册</a-button>
        </a-form-item>
      </a-form>
      <p>
        已经有账号？
        <router-link to="/user/login" class="login-link">登录</router-link>
      </p>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { userRegister } from '@/api/user';
import { sendEmailCaptcha } from '@/api/user'; 

const router = useRouter();
const registerFormRef = ref();
const sending = ref(false);      // 发送中
const countDown = ref(0);        // 倒计时秒数

// 注册表单
const registerForm = ref({
  userEmail: '',
  userName: '',
  userPassword: '',
  captcha: '',
});

const registerRules = {
userEmail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  captcha: [               
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ],
};

const sendCode = async () => {
  if (!registerForm.value.userEmail) {
    message.warning('请先输入邮箱');
    return;
  }
  sending.value = true;
  try {
    const { data } = await sendEmailCaptcha({ email: registerForm.value.userEmail });
    if (data.code === 0) {
      message.success('验证码已发送，5分钟内有效');
      countDown.value = 60;
      const timer = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) clearInterval(timer);
      }, 1000);
    } else {
      message.error(data.message || '发送失败');
    }
  } finally {
    sending.value = false;
  }
};

const handleRegister = async () => {
  try {
    const { data } = await userRegister(registerForm.value);
    if (data.code === 0) {
      message.success('注册成功，请登录');
      router.push('/user/login');
    } else {
      message.error(data.message || '注册失败');
    }
  } catch (err: any) {
    message.error(err.response?.data?.message || '网络异常，请稍后重试');
  }
};
</script>

<style scoped>
#UserRegisterPage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 88vh;
}
.register-btn {
  background-color: #77d8d8;
}
.register-btn:hover {
  background-color: #5fb9b9; /* 鼠标悬停时的背景颜色 */
  border-color: #5fb9b9; /* 鼠标悬停时的边框颜色 */
}

.register-btn:focus {
  border-color: #77d8d8; /* 获取焦点时的边框颜色 */
}

.login-link {
  color: #77d8d8;
}

.register-link:hover {
  color: #5fb9b9;
}
</style>

<style>
/* ============================================ */
  .sendcode-btn:hover {
    border: #77d8d8 1px solid;
  }
</style>