<template>
  <div id="SpaceLayout">
    <!-- 顶部封面区域 -->
    <header class="banner">
      <!-- 封面图（支持默认图） -->
      <img 
        v-if="safeUser.cover" 
        :src="safeUser.cover" 
        alt="用户封面" 
        class="banner-img" 
      />
      <div class="banner-mask"></div> <!-- 封面遮罩层 -->
      
      <!-- 用户基本信息 -->
      <div class="user-info">
        <img :src="safeUser.avatar" alt="用户头像" class="avatar" />
        <div class="user-info-text">
          <h2>{{ safeUser.name }}</h2>
          <p>{{ safeUser.desc }}</p>
        </div>
      </div>
    </header>

    <!-- 横向导航菜单 -->
    <nav class="menu-bar">
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'profile' }"
        @click="handleTabClick('profile')"
      >
        个人主页
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'articles' }"
        @click="handleTabClick('articles')"
      >
        我的文章
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'comments' }"
        @click="handleTabClick('comments')"
      >
        我的评论
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'replies' }"
        @click="handleTabClick('replies')"
      >
        我的回复
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'likes' }"
        @click="handleTabClick('likes')"
      >
        我的点赞
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'password' }"
        @click="handleTabClick('password')"
      >
        修改密码
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'feedback' }"
        @click="handleTabClick('feedback')"
      >
        反馈
      </div>
    </nav>

    <!-- 主内容区（左侧内容 + 右侧边栏） -->
    <main class="content-container">
      <!-- 左侧主内容插槽（由业务页面填充） -->
      <section class="main-content">
        <slot name="mainContent"></slot>
      </section>

      <!-- 右侧边栏 -->
      <aside class="sidebar">
        <!-- 用户卡片 -->
        <div class="user-card">
          <img :src="safeUser.avatar" alt="用户头像" class="sidebar-avatar" />
          <h3 class="sidebar-name">{{ safeUser.name }}</h3>
          <p class="sidebar-desc">{{ safeUser.desc }}</p>
          
          <!-- 数据统计 -->
          <div class="sidebar-stats">
            <div class="sidebar-stat">
              <div class="stat-num">{{ safeUser.articleCount }}</div>
              <div class="stat-text">文章</div>
            </div>
            <div class="sidebar-stat">
              <div class="stat-num">{{ safeUser.commentCount }}</div>
              <div class="stat-text">评论</div>
            </div>
            <div class="sidebar-stat">
              <div class="stat-num">{{ safeUser.likeCount }}</div>
              <div class="stat-text">获赞</div>
            </div>
          </div>

          <!-- 编辑资料按钮 -->
          <button class="edit-btn" @click="$emit('editProfile')">编辑资料</button>
        </div>

        <!-- 标签列表 -->
        <div class="sidebar-section">
          <h4 class="sidebar-title">我的标签</h4>
          <div class="tag-list">
            <span 
              v-for="(tag, index) in safeUser.tags" 
              :key="index" 
              class="sidebar-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

// 定义用户信息类型（布局组件所需的最小数据集）
interface User {
  id: string;
  name: string;         // 用户名
  avatar: string;       // 头像URL
  cover?: string;       // 封面URL（可选）
  desc: string;         // 个人简介
  articleCount: number; // 文章数
  commentCount: number; // 评论数
  likeCount: number;    // 获赞数
  tags: string[];       // 标签列表
}

// 组件接收的属性
const props = defineProps<{
  // 用户信息（可选，提供默认值避免报错）
  user?: Partial<User>;
  // 当前激活的标签页（必传）
  activeTab: string;
}>();

// 组件触发的事件
const emit = defineEmits<{
  // 标签页切换事件
  (e: 'tabChange', tab: string): void;
  // 编辑资料事件
  (e: 'editProfile'): void;
}>();

// 安全处理用户信息（确保所有字段有默认值，避免undefined报错）
const safeUser = computed<User>(() => ({
  id: props.user?.id || '',
  name: props.user?.name || '未知用户',
  avatar: props.user?.avatar || '/assets/default-avatar.png', // 默认头像
  cover: props.user?.cover,
  desc: props.user?.desc || '暂无简介',
  articleCount: props.user?.articleCount || 0,
  commentCount: props.user?.commentCount || 0,
  likeCount: props.user?.likeCount || 0,
  tags: props.user?.tags || [],
}));

// 处理标签页点击
const handleTabClick = (tab: string) => {
  emit('tabChange', tab); // 向父组件传递选中的标签
};
</script>

<style scoped>
#SpaceLayout {
  width: 100%;
  min-height: 100vh;
  background: #f7f9fc;
  color: #333;
  box-sizing: border-box;
  background: linear-gradient(to right, #ece8f4, #dff5ff); 
}

/* 顶部封面样式 */
.banner {
  position: relative;
  height: 260px;
  overflow: hidden;
  background-color: #eee; /* 无封面时的默认背景 */
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.banner:hover .banner-img {
  transform: scale(1.02); /* 悬停放大效果 */
}

.banner-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.5));
}

.user-info {
  position: absolute;
  bottom: 24px;
  left: 50px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
  z-index: 10;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #fff;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.user-info-text h2 {
  margin: 0;
  font-size: 22px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.user-info-text p {
  margin: 5px 0 0;
  font-size: 14px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 横向导航菜单 */
.menu-bar {
  display: flex;
  /* margin: 0; 清除默认 margin */
  background: #fff;
  border-bottom: 1px solid #eee;
  overflow-x: auto; /* 支持横向滚动 */
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin: 0;
  padding: 0 20px 0 35px;
}

.menu-item {
  padding: 15px 20px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.menu-item:hover {
  color: #77d8d8;
  background: rgba(119, 216, 216, 0.05);
}

.menu-item.active {
  color: #77d8d8;
  border-bottom-color: #77d8d8;
  font-weight: 500;
}

/* 内容容器 */
.content-container {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  gap: 20px;
  padding: 0 15px;
}

/* 左侧主内容区（由业务页面填充） */
.main-content {
  flex: 3;
  min-width: 0; /* 避免内容溢出 */
}

/* 右侧边栏 */
.sidebar {
  flex: 1;
  min-width: 250px;
}

/* 用户卡片 */
.user-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.sidebar-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f7f9fc;
  margin: 0 auto 15px;
}

.sidebar-name {
  font-size: 18px;
  margin: 0 0 5px;
}

.sidebar-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 20px;
  line-height: 1.5;
}

/* 边栏数据统计 */
.sidebar-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.sidebar-stat .stat-num {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.sidebar-stat .stat-text {
  font-size: 12px;
  color: #666;
}

/* 编辑资料按钮 */
.edit-btn {
  width: 100%;
  padding: 8px 0;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.edit-btn:hover {
  background: #e9f5ff;
  color: #77d8d8;
}

/* 标签区域 */
.sidebar-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  font-size: 16px;
  margin: 0 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sidebar-tag {
  background: #f5f5f5;
  color: #666;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 12px;
  transition: all 0.2s;
}

.sidebar-tag:hover {
  background: #e9f5ff;
  color: #77d8d8;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .content-container {
    flex-direction: column; /* 移动端垂直布局 */
  }
  
  .user-info {
    left: 20px;
  }

  .menu-item {
    padding: 12px 15px;
    font-size: 14px;
  }
}
</style>