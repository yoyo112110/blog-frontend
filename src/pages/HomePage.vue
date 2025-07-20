<template>
  <div id="homePage">
    <HomeLayout>
      <!-- 主体文章列表区域 -->
      <template #blog-list>
        <div class="main-content">
          <ArticleCard
            v-for="article in articleList"
            :key="article.id"
            :article="article"
          />
        </div>
      </template>

      <!-- 侧边栏组件（使用拆分后的组件） -->
      <template #sidebar>
        <CategorySidebar />
        <TagSidebar />
        <RecommendSidebar />
      </template>
    </HomeLayout>
  </div>
</template>

<script setup lang="ts">
import HomeLayout from "@/layouts/HomeLayout.vue";
import ArticleCard from "@/components/ArticleCard.vue";
// 导入拆分后的侧边栏组件
import CategorySidebar from "@/components/CategorySidebar.vue";
import TagSidebar from "@/components/TagSidebar.vue";
import RecommendSidebar from "@/components/RecommendSidebar.vue";

import { ref, onMounted } from "vue";
import { getAllArticles } from "@/api/article";

const articleList = ref([]);

const fetchArticles = async () => {
  try {
    const response = await getAllArticles();
    articleList.value = response.data;
  } catch (err) { 
    console.error("文章列表加载失败:", err);
  }
};

onMounted(async () => {
  await fetchArticles();
});
</script>

<style scoped>
/* 主体布局宽度保持不变 */
#homePage {
  max-width: 1400px;
  margin: 0 auto;
  /* padding: 20px; */
}

.main-content {
  width: 100%;
  margin: 0 auto;
}

.main-content > .article-card {
  margin-bottom: 24px;
}

/* 侧边栏宽度固定 */
:deep(.sidebar-container) {
  width: 300px;
  flex-shrink: 0;
}

/* 所有卡片的基础样式（统一在这里定义，组件继承） */
.card {
  width: 100%;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
  color: black;
  text-align: left;
  padding-left: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.content {
  padding: 15px 20px;
}

.content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.content ul li {
  padding: 8px 0;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  display: flex;
  justify-content: space-between;
}

.content ul li:hover {
  color: #77d8d8;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-cloud span {
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  color: #333;
}

.tag-cloud span:hover {
  background-color: #e9f7f7;
  color: #77d8d8;
}

.tag-cloud sub {
  color: #999;
  margin-left: 4px;
  font-size: 11px;
}

.count {
  color: #999;
  font-size: 12px;
}

.empty, .loading {
  color: #999;
  font-size: 14px;
  padding: 8px 0;
  text-align: center;
}

.card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}
</style>