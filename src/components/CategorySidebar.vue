<template>
  <div id="CategorySidebar">
    <div class="title">分类</div>
    <ul class="category-list">
      <li v-for="category in categories" :key="category.articleTagId" @click="handleClick()">
        <span class="category-name">{{ category.articleTagName }}</span>
        <span class="article-count">({{ category.articleCount }})</span>
      </li>
      <li v-if="loading" class="loading">加载中...</li>
      <li v-if="!loading && categories.length === 0" class="empty">暂无分类</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTypes } from '@/api/tag'; // 获取分类接口
import {getArticlesCountByTagId } from '@/api/article'; // 获取分类下文章数量
import { ArticleTag } from '@/api/tag';
import { useRouter } from 'vue-router';

const categories = ref<Array<ArticleTag & { articleCount: number }>>([]);
const loading = ref(true);
const router = useRouter();

// 获取分类列表及文章数量
const fetchCategories = async () => {
  try {
    loading.value = true;
    const { data } = await getTypes(); // 获取所有分类
    
    // 为每个分类添加文章数量
    for (const category of data) {
      const countRes = await getArticlesCountByTagId(category.articleTagId);
      categories.value.push({
        ...category,
        articleCount: countRes.data || 0
      });
    }
  } catch (err) {
    console.error('获取分类失败:', err);
  } finally {
    loading.value = false;
  }
};

// 点击分类跳转
const handleClick = () => {
  router.push({ path: '/tag'});
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
#CategorySidebar {  
    height: auto;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #ddd;
}

#CategorySidebar:hover {
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

.category-list {
  list-style: none;
  padding: 0 20px;
  margin: 0;
}

.category-list li {
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: color 0.2s;
}

.category-list li:hover .category-name {
  color: #77d8d8;
}

.category-name {
  font-size: 14px;
  color: #333;
}

.article-count {
  font-size: 12px;
  color: #999;
}

.loading, .empty {
  padding: 8px 0;
  font-size: 14px;
  color: #999;
  text-align: center;
}
</style>