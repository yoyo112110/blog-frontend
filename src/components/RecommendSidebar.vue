<template>
  <div id="RecommendSidebar">
    <div class="title">最新推荐</div>
    <ul class="recommend-list">
      <li v-for="article in recommendArticles" :key="article.articleId" @click="handleClick(article.articleId)">
        <div class="article-title">{{ article.articleTitle }}</div>
        <div class="article-date">{{ formatDate(article.articleAddTime) }}</div>
      </li>
      <li v-if="loading" class="loading">加载中...</li>
      <li v-if="!loading && recommendArticles.length === 0" class="empty">暂无推荐</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getLatestArticles } from '@/api/article'; // 获取最新文章接口
import { Article } from '@/api/article';
import { formatDate } from '@/utils/dataUtils'; // 日期格式化工具
import { useRouter } from 'vue-router';

const recommendArticles = ref<Article[]>([]);
const loading = ref(true);
const router = useRouter();

// 获取最新推荐文章
const fetchRecommendArticles = async () => {
  try {
    loading.value = true;
    const { data } = await getLatestArticles(5); // 获取最新5篇文章
    recommendArticles.value = data;
  } catch (err) {
    console.error('获取最新文章失败:', err);
  } finally {
    loading.value = false;
  }
};

// 点击文章跳转详情
const handleClick = (articleId: string) => {
  router.push(`/articles/${articleId}`);
};

onMounted(() => {
  fetchRecommendArticles();
});
</script>

<style scoped>
#RecommendSidebar {  
    height: auto;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #ddd;
}
#RecommendSidebar:hover {
    /* 分别表示水平偏移、垂直偏移、模糊半径、颜色 */
    box-shadow: 0 0 15px #ddd;
    cursor: pointer;
    /* 平滑过渡 */
    transition: box-shadow 0.2s;
}
.title {
    font-size: 18px;
    padding: 10px 20px;/* 内边距 */
    text-align: left;
    border-bottom: #ddd 1px solid;
}
.recommend-list {
  list-style: none;
  padding: 0 ;
  margin: 0;
}

.recommend-list li {
  padding: 12px 20px; /* 用padding控制内部间距，替代ul的默认内边距 */
  border-bottom: 1px dashed #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.recommend-list li:last-child {
  border-bottom: none;
}

.recommend-list li:hover {
  background-color: #f9f9f9;
}

.article-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-date {
  font-size: 12px;
  color: #999;
}

.loading, .empty {
  padding: 15px 20px;
  color: #999;
  font-size: 14px;
}
</style>