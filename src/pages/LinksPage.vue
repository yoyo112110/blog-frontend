<template>
  <div id="LinksPage">
    <div class="page-header">
      <!-- <h1>关于本站</h1> -->
    </div>

    <div class="content-container">
      <!-- 站点介绍 -->
      <!-- <div class="site-intro">
        <p>本站是一个基于 Vue3 和 Spring Boot 开发的博客平台，专注于分享技术文章和个人心得。</p>
        <p>感谢您的访问与支持，如有合作或交流意愿，欢迎通过下方友情链接联系我们。</p>
      </div> -->

      <!-- 友情链接区域 -->
      <div class="friend-links">
        <h2>友链列表</h2>
        <div class="links-grid">
          <!-- 循环渲染友情链接 -->
          <LinkCard 
            v-for="link in links" 
            :key="link.linkId" 
            :link="link" 
          />

          <!-- 空状态提示 -->
          <div class="empty-state" v-if="links.length === 0 && !isLoading">
            <p>暂无友情链接</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LinkCard from '@/components/LinkCard.vue';
import { Link, getLinkList } from '@/api/link';

// 状态管理
const links = ref<Link[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// 加载友情链接数据
const loadLinks = async () => {
  try {
    isLoading.value = true;
    const data = await getLinkList();
    links.value = data || [];
  } catch (err: any) {
    error.value = err.message || '加载友情链接失败';
    console.error('加载失败:', err);
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时初始化数据
onMounted(loadLinks);
</script>

<style scoped>
#LinksPage{
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 88vh;
  height: auto;
  /* background-color: #f9f9f9; */
}

.page-header {
  text-align: center;
  margin: 30px 0 50px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.site-intro {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  line-height: 1.8;
  color: #666;
}

.friend-links h2 {
  font-size: 20px;
  color: #333;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  /* text-align: left; */
  border-bottom: #ddd solid 1px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #999;
  background: #fafafa;
  border-radius: 8px;
}

/* 加载状态 */
.loading {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}

@media (max-width: 768px) {
  .links-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>