<template>
  <div id="TagsPage">
    <!-- 页面头部 -->
    <div class="page-header">
      <!-- <h1>文章标签</h1> -->
      <!-- <p>点击标签查看相关文章</p> -->
    </div>

    <!-- 加载状态 -->
    <div class="loading" v-if="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div class="error-state" v-if="errorMsg">
      <i class="error-icon"></i>
      <p>{{ errorMsg }}</p>
      <button class="retry-btn" @click="fetchData">重试</button>
    </div>

    <!-- 内容区域（加载成功后显示） -->
    <div v-else>
      <!-- 分类筛选器 -->
      <div class="filter-container">
        <div class="filter-tags">
          <span 
            class="filter-tag" 
            :class="{ active: activeTypeId === 'all' }"
            @click="handleTagClick('all')"
          >
            全部标签
          </span>
          <span 
            class="filter-tag" 
            :class="{ active: activeTypeId === type.articleTagId }"
            @click="handleTagClick(type.articleTagId)"
            v-for="type in types" 
            :key="type.articleTagId"
          >
            {{ type.articleTagName }}
          </span>
        </div>
      </div>

      <!-- 标签列表 -->
      <div class="tags-grid" v-if="filteredTags.length > 0">
        <div 
          class="tag-card" 
          v-for="tag in filteredTags" 
          :key="tag.articleTagId"
          @click="handleTagClick(tag.articleTagId)"
        >
          <h3 class="tag-name">{{ tag.articleTagName }}</h3>
          <p class="tag-count">
            <span v-if="tagCountMap[tag.articleTagId] !== undefined">
              {{ tagCountMap[tag.articleTagId] }} 篇文章
            </span>
            <span v-else>0</span>
          </p>
        </div>
      </div>

      <!-- 标签空状态 -->
      <div class="empty" v-if="filteredTags.length === 0 && !articlesLoading">
        <p>暂无标签数据</p>
      </div>

      <!-- 文章列表 -->
      <div class="articles-section">
        <h2 class="articles-title">
          {{ activeTypeId === 'all' ? '全部文章' : currentTagName }}
        </h2>

        <!-- 文章加载中 -->
        <div class="loading small" v-if="articlesLoading">
          <div class="spinner"></div>
        </div>

        <!-- 文章列表 -->
        <div class="articles-grid" v-if="!articlesLoading && filteredArticles.length > 0">
          <ArticleCard 
            v-for="article in filteredArticles" 
            :key="article.articleId" 
            :article="article" 
          />
        </div>

        <!-- 文章空状态 -->
        <div class="empty" v-if="!articlesLoading && filteredArticles.length === 0">
          <p>暂无相关文章</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getTypes, getTagsByTypeId, ArticleTag } from '@/api/tag' // 假设这两个接口在tag.ts中
import { 
  getAllArticles, 
  getArticlesByTagId, 
  getArticlesCountByTagId 
} from '@/api/article' // 从你的article.ts引入
import ArticleCard from '@/components/ArticleCard.vue'
import type { Article } from '@/api/article' // 使用你定义的Article接口

// 状态管理
const types = ref<ArticleTag[]>([]) // 标签分类
const allTags = ref<ArticleTag[]>([]) // 所有标签
const activeTypeId = ref('all') // 当前选中的标签ID
const loading = ref(true) // 页面初始加载状态
const articlesLoading = ref(false) // 文章筛选加载状态
const errorMsg = ref('') // 错误提示信息

// 文章数据
const allArticles = ref<Article[]>([])
const filteredArticles = ref<Article[]>([])
const tagCountMap = ref<Record<string, number>>({}) // 标签ID→文章数量

// 当前选中标签名称（用于标题）
const currentTagName = computed(() => {
  const tag = allTags.value.find(t => t.articleTagId === activeTypeId.value)
  return tag?.articleTagName || '相关文章'
})

// 筛选后的标签列表
const filteredTags = computed<ArticleTag[]>(() => {
  return activeTypeId.value === 'all' 
    ? allTags.value 
    : allTags.value.filter(tag => tag.articleTagId.startsWith(activeTypeId.value))
})

// 初始加载所有数据（核心优化：明确接口路径和错误详情）
const fetchData = async () => {
  try {
    loading.value = true
    errorMsg.value = '' // 清空之前的错误

    // 1. 获取标签分类（假设getTypes接口路径正确）
    const { data: typesData } = await getTypes()
    types.value = typesData
    console.log('标签分类加载成功:', typesData)

    // 2. 获取所有标签（按分类加载）
    const allTagsTemp: ArticleTag[] = []
    for (const type of typesData) {
      const { data: tagsData } = await getTagsByTypeId(type.articleTagId)
      allTagsTemp.push(...tagsData)
    }
    allTags.value = allTagsTemp
    console.log('所有标签加载成功:', allTagsTemp)

    // 3. 获取所有标签的文章数量（关键：使用你的getArticlesCountByTagId接口）
    for (const tag of allTagsTemp) {
      const { data: count } = await getArticlesCountByTagId(tag.articleTagId)
      tagCountMap.value[tag.articleTagId] = count
    }
    console.log('标签文章数量加载成功')

    // 4. 获取所有文章（默认显示）
    const { data: articlesData } = await getAllArticles()
    allArticles.value = articlesData
    filteredArticles.value = articlesData
    console.log('所有文章加载成功，共', articlesData.length, '篇')

  } catch (error: any) {
    // 详细错误日志（便于定位问题）
    console.error('数据加载失败详情:', error)
    errorMsg.value = error.message || '数据加载失败，请检查网络'
    
    // 打印错误响应（如果有）
    if (error.response) {
      console.error('错误状态码:', error.response.status)
      console.error('错误响应体:', error.response.data)
    }
  } finally {
    loading.value = false // 无论成功失败，都结束加载
  }
}

// 点击标签筛选文章（核心：正确调用你的getArticlesByTagId接口）
const handleTagClick = async (tagId: string) => {
  if (activeTypeId.value === tagId) return // 避免重复点击

  try {
    activeTypeId.value = tagId
    articlesLoading.value = true

    if (tagId === 'all') {
      // 显示全部文章
      filteredArticles.value = allArticles.value
    } else {
      // 调用你的按标签筛选接口（路径：/api/articles/tag/${tagId}）
      const { data } = await getArticlesByTagId(tagId)
      filteredArticles.value = data
      console.log('按标签筛选成功，tagId:', tagId, '文章数量:', data.length)
    }
  } catch (error: any) {
    console.error('筛选文章失败:', error)
    errorMsg.value = '筛选失败: ' + (error.message || '网络错误')
  } finally {
    articlesLoading.value = false
  }
}

// 页面挂载时加载数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#TagsPage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.page-header {
  text-align: center;
  margin: 20px 0 40px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
  font-size: 16px;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 50px 0;
}

.loading.small {
  padding: 20px 0;
}

.spinner {
  width: 30px;
  height: 30px;
  margin: 0 auto;
  border: 3px solid #eee;
  border-top: 3px solid #77d8d8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 50px 0;
  color: #f5222d;
}

.error-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.retry-btn {
  margin-top: 10px;
  padding: 6px 16px;
  background: #77d8d8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #55b9b9;
}

/* 筛选器 */
.filter-container {
  margin-bottom: 30px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.filter-tag {
  padding: 5px 15px;
  border-radius: 20px;
  background: #f5f5f5;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tag.active {
  background: #77d8d8;
  color: white;
}

/* 标签列表 */
.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 40px;
}

.tag-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.tag-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border-left: #77d8d8 5px solid;
}

.tag-name {
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
}

.tag-count {
  font-size: 14px;
  color: #999;
}

/* 文章区域 */
.articles-section {
  margin-top: 30px;
}

.articles-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 50px 0;
  color: #999;
}

/* 响应式 */
@media (max-width: 768px) {
  .tags-grid, .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>