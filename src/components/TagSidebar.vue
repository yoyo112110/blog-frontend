<template>
  <div id="TagSidebar">
    <div class="title">标签</div>
    <div class="tag-cloud">
      <span 
        v-for="tag in tags" 
        :key="tag.articleTagId"
        @click="handleClick"
        :style="{ 
          fontSize: `${12 + Math.random() * 6}px`,
          color: `hsl(${Math.random() * 60}, 70%, 60%)`
        }"
      >
        {{ tag.articleTagName }}
      </span>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="!loading && tags.length === 0" class="empty">暂无标签</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllTags } from '@/api/tag'; // 获取所有标签接口
import { ArticleTag } from '@/api/tag';
import { useRouter } from 'vue-router';

const tags = ref<ArticleTag[]>([]);
const loading = ref(true);
const router = useRouter();

// 获取所有标签
const fetchTags = async () => {
  try {
    loading.value = true;
    const { data } = await getAllTags();
    // 过滤掉分类（只保留标签，假设分类ID长度为1）
    tags.value = data.filter(tag => tag.articleTagId.length > 1);
  } catch (err) {
    console.error('获取标签失败:', err);
  } finally {
    loading.value = false;
  }
};

// 点击标签跳转
const handleClick = () => {
  router.push({ path: '/tag' }); // 跳转到标签页面
};

onMounted(() => {
  fetchTags();
});
</script>

<style scoped>
#TagSidebar {  
    height: auto;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #ddd;
}

#TagSidebar:hover {
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
.tag-cloud {
  padding: 15px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-cloud span {
  cursor: pointer;
  transition: transform 0.2s;
  padding: 2px 8px;
}

.tag-cloud span:hover {
  transform: scale(1.1);
}

.loading, .empty {
  padding: 15px 20px;
  color: #999;
  font-size: 14px;
}
</style>