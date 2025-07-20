<template>
  <SpaceLayout 
    :user="user" 
    :activeTab="activeTab"
    @tabChange="handleTabChange"
    @editProfile="handleEditProfile"
  >
    <!-- 主内容区域（通过插槽传入 SpaceLayout） -->
    <template #mainContent>
      <!-- 个人主页 -->
      <div v-if="activeTab === 'profile'">
        <h3 class="content-title">个人资料</h3>
        <div class="profile-card">
          <div class="profile-item">
            <span class="label">用户ID：</span>
            <span class="value">{{ user.id }}</span>
          </div>
          <div class="profile-item">
            <span class="label">注册时间：</span>
            <span class="value">{{ formatDate('2024-01-15T00:00:00') }}</span>
          </div>
          <div class="profile-item">
            <span class="label">个人简介：</span>
            <span class="value">{{ user.desc }}</span>
          </div>
          <div class="profile-item">
            <span class="label">擅长领域：</span>
            <span class="value">{{ user.tags.join('、') }}</span>
          </div>
        </div>

        <h3 class="content-title" style="margin-top: 30px;">数据统计</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ user.articleCount }}</div>
            <div class="stat-label">发布文章</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ user.commentCount }}</div>
            <div class="stat-label">发表评论</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ user.likeCount }}</div>
            <div class="stat-label">获得点赞</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ user.viewCount }}</div>
            <div class="stat-label">累计阅读</div>
          </div>
        </div>
      </div>

      <!-- 我的文章 -->
      <div v-if="activeTab === 'articles'">
        <h3 class="content-title">我的文章</h3>
        <div class="articles-list">
          <div class="article-item" v-for="(article, index) in userArticles" :key="index">
            <div class="article-title">{{ article.title }}</div>
            <div class="article-meta">
              <span>{{ article.date }}</span>
              <span>阅读 {{ article.views }}</span>
              <span>点赞 {{ article.likes }}</span>
            </div>
          </div>
          <div class="empty-state" v-if="userArticles.length === 0">
            暂无发布的文章，点击<a href="/write" class="link">发布第一篇文章</a>
          </div>
        </div>
      </div>

      <!-- 我的评论 -->
      <div v-if="activeTab === 'comments'">
        <h3 class="content-title">我的评论</h3>
        <div class="comments-list">
          <div class="comment-item" v-for="(comment, index) in userComments" :key="index">
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-meta">
              <span>评论于 {{ comment.target }}</span>
              <span>{{ comment.time }}</span>
            </div>
          </div>
          <div class="empty-state" v-if="userComments.length === 0">
            暂无评论记录
          </div>
        </div>
      </div>

      <!-- 我的回复 -->
      <div v-if="activeTab === 'replies'">
        <h3 class="content-title">我的回复</h3>
        <div class="empty-state">暂无回复记录</div>
      </div>

      <!-- 我的点赞 -->
      <div v-if="activeTab === 'likes'">
        <h3 class="content-title">我的点赞</h3>
        <div class="empty-state">暂无点赞记录</div>
      </div>

      <!-- 修改密码 -->
      <div v-if="activeTab === 'password'">
        <h3 class="content-title">修改密码</h3>
        <div class="form-container">
          <div class="form-item">
            <label>原密码</label>
            <input type="password" placeholder="请输入原密码">
          </div>
          <div class="form-item">
            <label>新密码</label>
            <input type="password" placeholder="请输入新密码">
          </div>
          <div class="form-item">
            <label>确认密码</label>
            <input type="password" placeholder="请再次输入新密码">
          </div>
          <button class="submit-btn">保存修改</button>
        </div>
      </div>

      <!-- 意见反馈 -->
      <div v-if="activeTab === 'feedback'">
        <h3 class="content-title">意见反馈</h3>
        <div class="feedback-form">
          <textarea placeholder="请输入您的建议或问题..." rows="6"></textarea>
          <button class="submit-btn">提交反馈</button>
        </div>
      </div>
    </template>
  </SpaceLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import SpaceLayout from '@/layouts/SpaceLayout.vue'; // 导入布局组件

// 定义数据类型
interface User {
  id: string;
  name: string;
  avatar: string;
  cover?: string;
  desc: string;
  articleCount: number;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  tags: string[];
}

interface Article {
  title: string;
  date: string;
  views: number;
  likes: number;
}

interface Comment {
  content: string;
  target: string;
  time: string;
}

// 模拟用户数据
const user = reactive<User>({
  id: 'user123456',
  name: 'Steam 玩家',
  avatar: '/cover/cover1.jpg',
  cover: 'https://picsum.photos/1200/300',
  desc: '专注分享技术与游戏心得，偶尔记录生活点滴',
  articleCount: 24,
  commentCount: 156,
  likeCount: 1258,
  viewCount: 128000,
  tags: ['Java', 'Vue', 'Steam', 'Linux', '前端开发']
});

// 模拟文章数据
const userArticles = reactive<Article[]>([
  { title: 'Vue3 组件化开发实战指南', date: '2025-06-10', views: 3240, likes: 89 },
  { title: 'Spring Boot 后端接口设计最佳实践', date: '2025-05-28', views: 2156, likes: 67 },
  { title: '2025年必玩的10款Steam游戏推荐', date: '2025-04-15', views: 5689, likes: 210 }
]);

// 模拟评论数据
const userComments = reactive<Comment[]>([
  { content: '这篇文章写得很详细，对我帮助很大！', target: '《Vue3 组件化开发实战指南》', time: '2025-06-12 14:30' },
  { content: '请问作者，这个问题有更好的解决方案吗？', target: '《Spring Boot 后端接口设计》', time: '2025-05-30 09:15' }
]);

// 状态管理
const activeTab = ref('profile'); // 默认显示个人主页

// 日期格式化
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 事件处理
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

const handleEditProfile = () => {
  // 编辑资料逻辑（如跳转编辑页面）
  console.log('进入编辑资料页面');
};
</script>

<style scoped>
/* 仅保留主内容区域样式（布局样式已在 SpaceLayout 中定义） */
.content-title {
  font-size: 18px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  margin: 0 0 20px;
}

/* 个人资料样式 */
.profile-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.profile-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.profile-item:last-child {
  border-bottom: none;
}

.label {
  width: 100px;
  color: #666;
  flex-shrink: 0;
}

.value {
  flex: 1;
  word-break: break-word;
}

/* 数据统计样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* 文章列表样式 */
.articles-list, .comments-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.article-item {
  padding: 15px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.article-item:last-child {
  border-bottom: none;
}

.article-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.article-title:hover {
  color: #1890ff;
}

.article-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
}

/* 评论列表样式 */
.comment-item {
  padding: 15px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  color: #333;
  margin-bottom: 8px;
  line-height: 1.5;
}

.comment-meta {
  font-size: 12px;
  color: #999;
  display: flex;
  justify-content: space-between;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  background: #fafafa;
  border-radius: 6px;
}

.link {
  color: #1890ff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* 表单样式 */
.form-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.form-item input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-item input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.feedback-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  margin-bottom: 15px;
}

.feedback-form textarea:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.submit-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #096dd9;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>