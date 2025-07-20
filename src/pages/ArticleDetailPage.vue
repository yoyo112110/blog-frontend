<template>
  <div id="ArticleDetailPage">
    <!-- 加载 / 404 -->
    <div v-if="loading">加载中...</div>
    <div v-else-if="!article">文章不存在</div>

    <!-- 正文 + 目录区域框架 -->
    <div v-else class="layout">
      <!-- 左侧正文区域 -->
      <main class="main">
        <h1>{{ article.articleTitle }}</h1>

        <p class="meta">
          作者：{{ article.user?.userName|| '未知作者' }} |
          <ClockCircleOutlined /> {{ formatDate(article.articleAddTime) }} |
          <EyeOutlined /> {{ formatNumber(article.articleViewCount) }}
        </p>

        <!-- 封面图 -->
        <img
          v-if="article.coverImg"
          :src="article.coverImg"
          alt="封面"
          class="cover"
        />

        <!-- <div class="content" v-html="formatContent(article.articleContent)"></div> -->
        <div class="content" v-html="renderedContent"></div>
        <!-- ==================== -->
        <div class="appraise-section">


          
          <!-- <AppraiseSection :article-id="article.articleId" :user-id="currentUserId"/> -->



          <AppraiseSection :articleId="article.articleId" />
        </div>
        <!-- ======================== 评论部分 ========================-->
        <div class="comment-section">
          <CommentSection :articleId="articleId"/>
        </div>
      </main>

      <!-- 右侧目录占位区域 -->
      <aside class="toc-placeholder">
        <div class="placeholder-content">
          <h4>目录</h4>
          <p>（暂未实现）</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleById, Article } from '@/api/article'
import { formatDate, formatNumber, formatContent } from '@/utils/dataUtils'
import CommentSection from '@/components/CommentSection.vue'
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import AppraiseSection from '@/components/AppraiseSection.vue'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { marked } from 'marked'
import { enhanceMarkdown } from '@/utils/markdownEnhance';

const renderedContent = ref('')

const userStore = useUserStore()
const { id: currentUserId } = storeToRefs(userStore)

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(true)

const fetchArticle = async () => {
  try {
    const { data } = await getArticleById(route.params.id as string)
    article.value = data
  } catch (error) {
    console.error('获取文章失败', error)
  } finally {
    loading.value = false
  }
}

// onMounted(() => {
//   fetchArticle()
// })
onMounted(async () => {
  await fetchArticle()                 // 1. 先取文章
  if (article.value) {
    renderedContent.value = await enhanceMarkdown(article.value.articleContent)
  }
})
</script>

<style scoped>
#ArticleDetailPage {
  max-width: 1600px;
  margin: 32px auto;
  padding: 0 24px;
}

.layout {
  display: flex;
  gap: 32px;
}

.main {
  flex: 4;
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: left; /* 确保整个正文区域左对齐 */
}

h1 {
  font-size: 30px;
  margin-bottom: 16px;
  color: #222;
  text-align: left; /* 标题左对齐 */
  line-height: 1.3; /* 优化标题行高 */
}

.meta {
  font-size: 15px;
  color: #666;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  text-align: left; /* 元信息左对齐 */
}

/* 封面图样式 */
.cover {
  width: 100%;
  max-height: 300px;
  height: auto;
  object-fit: contain;
  margin: 16px 0 20px;
  border-radius: 4px;
  box-shadow: none;
}

/* 正文内容样式 - 重点优化 */
.content {
  line-height: 1.85;
  font-size: 17px;
  color: #333;
  text-align: left; /* 强制左对齐 */
  /* max-width: 70%; */
}

/* 段落样式优化 */
.content p {
  margin-bottom: 20px;
  text-indent: 0; /* 移除可能的首行缩进 */
  margin-top: 0; /* 统一段落上边距 */
}

/* 标题样式优化 */
.content h2, .content h3, .content h4 {
  text-align: left; /* 子标题左对齐 */
  margin: 30px 0 15px; /* 优化标题间距 */
  color: #222;
  font-weight: 600;
}

.content h2 {
  font-size: 24px;
}

.content h3 {
  font-size: 20px;
}

/* 列表样式优化 */
.content ul, .content ol {
  margin: 0 0 20px 24px; /* 列表左缩进 */
  padding: 0;
}

.content li {
  margin-bottom: 8px;
  text-align: left;
}

/* 链接样式 */
.content a {
  color: #1890ff;
  text-decoration: none;
}

.content a:hover {
  text-decoration: underline;
}

.comment-section{
  margin-top: 32px;
}
/* 右侧目录占位区域 */
.toc-placeholder {
  flex: 1;
  position: sticky;
  top: 32px;
  align-self: flex-start;
  padding: 24px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 200px;
}

.placeholder-content h4 {
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 17px;
  color: #555;
}

.placeholder-content p {
  color: #aaa;
  margin: 0;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .main {
    flex: 3;
  }
  .cover {
    max-height: 260px;
  }
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
  .toc-placeholder {
    position: static;
    margin-top: 20px;
    padding: 16px;
  }
  .main {
    padding: 24px 16px;
  }
  .content {
    font-size: 16px;
  }
  .cover {
    max-height: 220px;
    margin: 12px 0 16px;
  }
  h1 {
    font-size: 26px;
  }
  
  /* 移动端标题调整 */
  .content h2 {
    font-size: 22px;
  }
  
  .content h3 {
    font-size: 19px;
  }
}
</style>