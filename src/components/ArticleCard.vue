<template>
  <div v-if="!article && loading" class="loading">Loading...</div>
  <div v-else-if="!article && error" class="error">Error loading article</div>
  <div v-else id="ArticleCard">
    <!-- 文章标题 -->
    <h2 class="article-title" @click="handleClick">
      {{ (displayArticle && (displayArticle.articleTitle || displayArticle.title)) || '未知标题' }}
    </h2>

    <!-- 摘要与封面 -->
    <div class="summary-line">
      <p class="article-summary">
        {{ (displayArticle && (displayArticle.articleContent || displayArticle.summary)) || '未知摘要' }}
      </p>
      <div v-if="coverUrl" class="cover-wrap">
        <img :src="coverUrl" alt="文章封面" />
      </div>
    </div>

    <!-- 文章信息（作者、时间、阅读量、标签） -->
    <div class="article-info">
      <span class="article-author">
        <UserOutlined /> {{ (displayArticle && (displayArticle.user?.userName || displayArticle.author)) || '未知作者' }}
      </span>
      <span class="article-date">
        <FieldTimeOutlined />{{ (displayArticle && displayArticle.articleAddTime) ? formatDate(displayArticle.articleAddTime) : '未知时间' }}
      </span>
      <span class="article-views">
        <EyeOutlined /> {{ (displayArticle && displayArticle.articleViewCount) ? formatNumber(displayArticle.articleViewCount) : 0 }}
      </span>
      <span class="article-tag">
        <TagOutlined />{{ firstTagName || '无' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { getAllArticles, getArticleTagIds } from '@/api/article'; // 获取文章、文章标签ID
import { getTagNames } from '@/api/tag'; // 批量获取标签名称（关键接口）
import { defineProps } from 'vue';
import { UserOutlined, FieldTimeOutlined, EyeOutlined, TagOutlined } from '@ant-design/icons-vue';
import { formatDate, formatNumber } from '@/utils/dataUtils';
import { Article } from '@/api/article'; // 文章接口类型
const article = ref<Article | null>(null); // 文章数据
// 接收父组件传入的文章数据
const props = defineProps({
  article: {
    type: Object,
    required: false,
  },
});

// 状态管理
const apiArticle = ref(null); // API获取的文章数据
const loading = ref(false); // 加载状态
const error = ref(false); // 错误状态
const firstTagName = ref(''); // 第一个标签名称

// 计算属性：当前显示的文章（优先用props传入的，否则用API获取的）
const displayArticle = computed(() => {
  return props.article || apiArticle.value;
});

// 计算属性：封面图URL
const coverUrl = computed(() => {
  return displayArticle.value?.coverImg || displayArticle.value?.imgUrl || '';
});

// 加载文章的第一个标签
// const loadFirstTag = async (articleId: string) => {
//   try {
//     // 1. 获取文章关联的标签ID列表（如 ["11","12","17"]）
//     const { data: tagIds } = await getArticleTagIds(articleId);
//     console.log('文章关联的标签ID:', tagIds);

//     // 2. 若有标签ID，批量查询标签名称（调用你提供的接口）
//     if (tagIds && tagIds.length > 0) {
//       const { data: tagNames } = await getTagNames([tagIds[0]]); // 只取第一个标签
//       console.log('第一个标签名称:', tagNames[0]);
//       firstTagName.value = tagNames[0] || '未知标签';
//     } else {
//       firstTagName.value = '无';
//     }
//   } catch (err) {
//     console.error('加载标签失败:', err);
//     firstTagName.value = '无';
//   }
// };
// 加载文章的第一个有效标签（过滤一位数标签ID）
const loadFirstTag = async (articleId: string) => {
  try {
    // 1. 获取文章关联的所有标签ID列表
    const { data: tagIds } = await getArticleTagIds(articleId);
    console.log('文章关联的所有标签ID:', tagIds);

    // 2. 过滤掉一位数的标签ID（长度为1的ID）
    const validTagIds = tagIds.filter(id => id.length >= 2); // 只保留长度≥2的标签ID
    console.log('过滤后有效的标签ID:', validTagIds);

    // 3. 从有效标签ID中取第一个，查询标签名称
    if (validTagIds.length > 0) {
      const { data: tagNames } = await getTagNames([validTagIds[0]]); // 只查第一个有效标签
      firstTagName.value = tagNames[0] || '无';
    } else {
      // 没有有效标签时显示默认文本
      firstTagName.value = '无';
    }
  } catch (err) {
    console.error('加载标签失败:', err);
    firstTagName.value = '无';
  }
};

// 监听文章ID变化，自动加载标签
watch(
  () => displayArticle.value?.articleId, // 监听文章ID
  async (articleId) => {
    if (articleId) {
      await loadFirstTag(articleId); // 文章ID存在时加载标签
    } else {
      firstTagName.value = '无';
    }
  },
  { immediate: true } // 组件初始化时立即执行
);

// 组件挂载时加载文章（若未通过props传入）
onMounted(async () => {
  if (!props.article) {
    loading.value = true;
    try {
      const response = await getAllArticles();
      apiArticle.value = response.data[0]; // 获取第一篇文章
      console.log('加载的文章数据:', apiArticle.value);
    } catch (err) {
      console.error('获取文章失败:', err);
      error.value = true;
    } finally {
      loading.value = false;
    }
  }
});

// 导入 useRouter
import { useRouter } from 'vue-router';

// 在组件中获取 router 实例
const router = useRouter();

// 点击文章标题跳转详情页（修改后）
const handleClick = () => {
  const id = displayArticle.value?.articleId || displayArticle.value?.id;
  if (id) {
    // 使用 Vue Router 跳转，不刷新页面
    router.push(`/articles/${id}`); 
  }
};
</script>

<style scoped>
#ArticleCard {
  /* background-color: #fff; */
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  /* border: 1px solid #ddd; */
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 16px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-bottom: 20px;
  min-height: 250px;
  max-height: 250px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#ArticleCard:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.6);
}
.article-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  transition: color 0.3s;
}

.article-title:hover {
  color: #77d8d8;
}

.article-summary {
  flex: 1;
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 最多显示3行 */
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-line {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.cover-wrap {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5; /* 占位背景 */
}

.cover-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持比例裁剪 */
}

.article-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #ddd;
  padding-top: 12px;
  flex-wrap: wrap; /* 支持换行 */
  gap: 8px;
}

.article-author, .article-date, .article-views, .article-tag {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;
}

.loading, .error {
  padding: 20px;
  text-align: center;
  color: #666;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .summary-line {
    flex-direction: column;
  }
  .cover-wrap {
    width: 100%;
    height: auto;
  }
}
</style>