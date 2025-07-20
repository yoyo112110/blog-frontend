<template>
  <div id="globalHeader">
    <a-row wrap="false">
      <a-col flex="50px">
        <div class="title-bar" >
          <img class="logo" src="../assets/logo.png" alt="logo" @click="goAbout"/>
        </div>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
        <!-- 搜索框 -->
        <!-- <div class="search-box">       ddfg    </div> -->
      </a-col>
      <!-- 用户信息test -->
      <!-- {{ JSON.stringify(loginUserStore.loginUser.userName) }} -->
      <a-col flex="80px">
        <div class="user-login-status">
          <!-- <div>如果成功登录 显示用户头像</div> -->
          <!-- 已登录 -->
          <div v-if="loginUserStore.loginUser" class="user-avatar-container">
            <img :src="loginUserStore.loginUser.avatar || 'https://picsum.photos/1200/300'" alt="用户头像" 
            class="user-avatar" 
            @click="goToPersonalSpace"
            @mouseenter="showOptions = true"
            @mouseleave="showOptions = false"
            >
            <!-- 头像下拉菜单（点击头像显示） -->
            <div v-if="showOptions" class="user-options" @mouseenter="showOptions = true"
                @mouseleave="showOptions = false" >
              <!-- 个人空间选项 -->
              <a-button
                type="text"
                @click="goToPersonalSpace"
                style="justify-content: flex-start;"
              >
                个人空间
              </a-button>
              <!-- 退出登录选项 -->
              <a-button
                type="text"
                @click="handleLogout"
                style="justify-content: flex-start;"
              >
                退出登录
              </a-button>
            </div>
          </div>
          <!-- 未登录 -->
          <div v-else>
            <a-button
              type="primary"
              @click="goToLogin"
              shape="circle"
              style="background: #77d8d8"
            >
              登录
            </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="ad"><RollingAd /></div>
  </div>
</template>
<script lang="ts" setup>
import { h, ref, onMounted } from 'vue';
import {
  HomeOutlined,
  TagsOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  EditOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { userLogout } from '@/api/user'; // 导入 userLogout 函数
import { message } from 'ant-design-vue';
import { useLoginUserStore } from '@/store/useLoginUserStore';
import { computed } from 'vue';
import RollingAd from '@/components/AdPart.vue';
const value = ref('');

// const loginUserStore = useLoginUserStore();
const router = useRouter();

// 可选：控制是否显示用户名
const showName = ref(true);

// 跳转到登录页（替换 href 为路由跳转）
const goToLogin = () => {
  router.push('/user/login');
};

const goAbout = () => {
  router.push('/about');
};

// 点击菜单后的路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({ path: key });
};
// const current = ref<string[]>(['mail']);
const current = ref<string[]>(['/']);

router.afterEach((to, from, failure) => {
  current.value = [to.path];
});

// 处理搜索逻辑
const onSearch = (searchValue: string) => {
  if (!searchValue.trim()) {
    // 如果输入为空，提示用户
    console.warn('请输入搜索内容');
    return;
  }

  // 跳转到搜索结果页面，并将搜索关键词作为查询参数传递
  router.push({
    path: '/search',
    query: { keyword: searchValue }
  });
};

const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '首页',
    title: '首页'
  },
  {
    key: '/tag',
    icon: () => h(TagsOutlined),
    label: '标签',
    title: '标签'
  },
  {
    key: '/archivers',
    icon: () => h(ClockCircleOutlined),
    label: '归档',
    title: '归档'
  },
  {
    key: '/link',
    icon: () => h(LinkOutlined),
    label: '友情链接',
    title: '友情链接'
  },
  {
    key: '/editor',
    icon: () => h(EditOutlined),
    label: '编辑',
    title: '编辑'
  },
  {
    key: '/admin',
    icon: () => h(UserOutlined),
    label: '管理',
    title: '管理'
  }
]);

// 控制头像下拉菜单显示/隐藏
const showOptions = ref(false);

// 切换下拉菜单状态
const toggleOptions = () => {
  showOptions.value = !showOptions.value;
};

// 退出登录逻辑
// const handleLogout = async () => {
//   try {
//     await userLogout({}); // 调用后端注销接口
//     loginUserStore.logout(); // 重置 Store 状态
//     localStorage.removeItem('token'); // 清除 Token
//     localStorage.removeItem('userName'); // 清除存储的用户名
//     showOptions.value = false; // 关闭下拉菜单
//     router.push('/user/login'); // 跳转到登录页
//     message.success('退出成功');
//   } catch (error) {
//     message.error('退出失败，请稍后重试');
//   }
// };

// 退出登录逻辑优化
const handleLogout = async () => {
  try {
    await userLogout({}); // 调用后端注销接口
    loginUserStore.logout(); // 清空 store 状态
    showOptions.value = false;
    router.push('/user/login');
    message.success('退出成功');
  } catch (error) {
    message.error('退出失败，请稍后重试');
  }
};

// 跳转到用户空间页面
// const goToUserSpace = () => {
//   const uid = loginUserStore.loginUser.uid; // 从登录状态中获取用户 UID
//   if (uid) {
//     router.push(`/space/${uid}`); // 动态构造用户空间 URL
//   } else {
//     console.error('用户 UID 不存在');
//   }
// };
// const goToPersonalSpace = () => {
//   showOptions.value = false; // 关闭下拉栏
//   router.push('/me'); // 跳转个人空间路由
// };
// 跳转到个人空间
const goToPersonalSpace = () => {
  showOptions.value = false;
  // 携带用户名参数（如果需要）
  router.push(`/me?userName=${loginUserStore.loginUser?.userName}`);
};


// 初始化登录状态 store
const loginUserStore = useLoginUserStore();

// 定义登录状态变量（响应式）
const isLoggedIn = computed(() => !!loginUserStore.loginUser?.token); // 基于 token 存在性判断
const loginUser = computed(() => loginUserStore.loginUser); // 用户信息

// ... 其他已有逻辑（goToLogin、doMenuClick 等）...

// 页面加载时验证状态
onMounted(() => {
  console.log('GlobalHeader 加载时的登录状态：', {
    isLoggedIn: isLoggedIn.value,
    loginUser: loginUser.value,
    localStorageData: localStorage.getItem('loginUser')
  });

  // 极端情况：强制恢复状态
  if (!isLoggedIn.value && localStorage.getItem('loginUser')) {
    loginUserStore.$reset();
  }
});
</script>

<style scoped>
#globalHeader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  /* background-color: transparent; */
  background-color: white;
  box-shadow: none;
}

.title-bar {
  align-items: center;
  margin-left: 12px;
}

.logo {
  height: 30px;
  cursor: pointer;
}

.logo:hover {
  opacity: 0.8;
  border: #ddd 1px solid;
}

.user-avatar {
  width: 32px; /* 统一尺寸 */
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  /* 清除默认边距，避免影响布局 */
  margin: 0;
  padding: 0;
}

.user-avatar:hover {
  cursor: pointer;
  /* 放大 */
  transform: scale(1.5);
  transition: transform 0.3s ease;
  border: 2px solid #fff;
  /* 防止放大后超出父容器高度 */
  transform-origin: center;
}

.user-avatar-container {
  position: relative; /* 设置相对定位 */
  display: inline-block;
  /* 与登录按钮高度一致，避免布局跳动 */
  height: 32px;
  vertical-align: middle;
  line-height: 32px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.user-options {
  position: absolute;
  top: 32px; /* 距离头像下方 */
  right: 0; /* 靠右显示 */
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1001;
  width: 120px; /* 设置矩形宽度 */
  /* 避免菜单本身高度影响父容器 */
  margin: 0;
}

.user-options a-button {
  width: 100%;
}

/* 用户状态容器（固定高度，防止被内容撑开） */
.user-login-status {
  height: 60px; /* 根据菜单栏整体高度调整 */
  display: flex;
  align-items: center; /* 垂直居中，避免高度波动 */
  justify-content: center;
}
</style>

<style>
/* 鼠标悬浮时下划线颜色 */
/* 选中（点击后）下划线统一颜色 */
#globalHeader .ant-menu-horizontal > .ant-menu-item:hover::after,
#globalHeader .ant-menu-horizontal > .ant-menu-item-selected::after {
  border-bottom-color: #77d8d8;
}
/* 当前激活（选中）的菜单项 */
#globalHeader .ant-menu-item-selected {
  color: #77d8d8;
  font-weight: 600;
}
</style>