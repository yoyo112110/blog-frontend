<template>
  <div id="ArchiversPage">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>全部文章</h1>
      <p>共 {{ totalArticles }} 篇文章</p>
    </div>

    <!-- 加载状态 -->
    <div class="loading" v-if="loading">加载中...</div>

    <!-- 空状态 -->
    <div class="empty" v-if="!loading && totalArticles === 0">
      <p>暂无文章</p>
    </div>

    <!-- 归档列表 -->
    <div class="archive-container" v-if="!loading && totalArticles > 0">
      <!-- 年份分组 -->
      <div v-for="(yearGroup, year) in groupedArticles" :key="year" class="year-group">
        <div class="year-header">
          <h2>{{ year }} 年</h2>
          <span class="year-count">{{ getYearTotal(year) }} 篇</span>
        </div>

        <!-- 月份列表 -->
        <div class="months-list">
          <div 
            v-for="(monthArticles, month) in yearGroup" 
            :key="month" 
            class="month-item"
            :class="{ active: activeYear === year && activeMonth === month }"
            @click="handleMonthClick(year, month)"
          >
            <div class="month-header">
              <!-- 只使用 DownOutlined 组件，通过 CSS 控制旋转 -->
              <div class="expand-icon">
                <DownOutlined />
              </div>
              
              <h3>{{ month }} 月</h3>
              <span class="month-count">{{ monthArticles.length }} 篇</span>
            </div>

            <!-- 月份文章列表（展开/折叠） -->
            <div class="articles-list" v-if="activeYear === year && activeMonth === month">
              <div class="article-item" v-for="(article, index) in monthArticles" :key="article.articleId" :style="{ '--index': index }">
                <router-link :to="`/articles/${article.articleId}`" class="article-link">
                  <span class="article-date">{{ formatDate(article.articleAddTime) }}</span>
                  <span class="article-title">{{ article.articleTitle }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAllArticles } from '@/api/article';
import { formatDate } from '@/utils/dataUtils';
import { DownOutlined } from '@ant-design/icons-vue';

// 状态管理
const loading = ref(true);
const articles = ref([]);
const activeYear = ref('');
const activeMonth = ref('');

// 按年份和月份分组
const groupedArticles = computed(() => {
  const groups = {};
  
  articles.value.forEach(article => {
    if (!article.articleAddTime) return;
    
    const date = new Date(article.articleAddTime);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    if (!groups[year]) groups[year] = {};
    if (!groups[year][month]) groups[year][month] = [];
    groups[year][month].push(article);
  });
  
  // 按年份倒序
  return Object.keys(groups).sort((a, b) => b.localeCompare(a))
    .reduce((obj, key) => {
      obj[key] = groups[key];
      // 按月份倒序
      obj[key] = Object.keys(obj[key]).sort((a, b) => b.localeCompare(a))
        .reduce((monthObj, monthKey) => {
          monthObj[monthKey] = obj[key][monthKey];
          return monthObj;
        }, {});
      return obj;
    }, {});
});

// 总文章数
const totalArticles = computed(() => articles.value.length);

// 某年份的总文章数
const getYearTotal = (year: string) => {
  const yearData = groupedArticles.value[year] || {};
  return Object.values(yearData).reduce((total, list) => total + list.length, 0);
};

// 点击月份展开/折叠
const handleMonthClick = (year: string, month: string) => {
  if (activeYear.value === year && activeMonth.value === month) {
    activeYear.value = '';
    activeMonth.value = '';
  } else {
    activeYear.value = year;
    activeMonth.value = month;
  }
};

// 加载文章
const fetchArticles = async () => {
  try {
    loading.value = true;
    const { data } = await getAllArticles();
    articles.value = data || [];
    
    // 默认展开最新月份
    if (articles.value.length) {
      const latest = new Date(articles.value[0].articleAddTime);
      activeYear.value = latest.getFullYear().toString();
      activeMonth.value = (latest.getMonth() + 1).toString().padStart(2, '0');
    }
  } catch (err) {
    console.error('加载归档失败:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchArticles());
</script>

<style scoped>
#ArchiversPage {
  max-width: 1000px;
  min-height: 85vh;
  margin: 0 auto;
  padding: 30px 20px;
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
  animation-delay: 0.1s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.loading, .empty {
  text-align: center;
  padding: 60px 0;
  color: #666;
  font-size: 1.2rem;
}

.year-group {
  margin-bottom: 40px;
  border-left: 2px solid #eee;
  padding-left: 20px;
}

.year-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.year-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  position: relative;
}

.year-header h2::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #77d8d8;
  transform: translateY(-50%);
}

.year-count {
  background: #f5f5f5;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #666;
}

.months-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  margin-left: 10px;
  align-items: start; /* 让每个项顶部对齐，高度独立 */
}

.month-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateY(0);
}

.month-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.month-item.active {
  border: 1px solid #77d8d8;
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
}

.month-header h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.month-count {
  color: #77d8d8;
  font-size: 0.9rem;
  background: rgba(119, 216, 216, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.expand-icon {
  margin-right: 10px;
  color: #77d8d8;
  font-size: 14px;
  transition: transform 0.3s ease, color 0.2s ease;
}

/* 折叠状态：箭头向下（默认方向，无需旋转） */
.month-item:not(.active) .expand-icon {
  transform: rotate(0deg);
}

/* 展开状态：箭头向上（旋转180度） */
.month-item.active .expand-icon {
  transform: rotate(180deg);
  color: #55b9b9;
}

.articles-list {
  border-top: 1px dashed #eee;
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease, padding 0.5s ease;
}

.month-item.active .articles-list {
  padding: 10px 20px 15px;
  max-height: 1000px;
}

.article-item {
  padding: 8px 0;
  border-bottom: 1px dashed #f0f0f0;
  opacity: 0;
  transform: translateY(5px);
  animation: fadeInItem 0.3s ease forwards;
  animation-delay: calc(var(--index) * 0.05s);
}

@keyframes fadeInItem {
  to { opacity: 1; transform: translateY(0); }
}

.article-item:last-child {
  border-bottom: none;
}

.article-link {
  display: flex;
  gap: 15px;
  color: #555;
  text-decoration: none;
}

.article-date {
  font-size: 0.85rem;
  color: #999;
  white-space: nowrap;
}

.article-title {
  font-size: 0.95rem;
  transition: color 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.article-link:hover .article-title {
  color: #77d8d8;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .months-list {
    grid-template-columns: 1fr;
  }
}


/* ======================================================== */
/* 找到原有的 .article-link、.article-date、.article-title 样式，替换为以下内容 */
.article-link {
  display: flex;
  flex-direction: column; /* 上下排列 */
  gap: 4px; /* 日期和标题的上下间距 */
  color: #555;
  text-decoration: none;
  padding: 4px 0; /* 增加上下内边距，提升点击区域 */
}

.article-date {
  font-size: 0.75rem; /* 小字日期 */
  color: #999;
  white-space: nowrap;
  text-align: left; /* 左对齐 */
}

.article-title {
  font-size: 0.95rem;
  transition: color 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  text-align: left; /* 左对齐 */
}

/* ========================================= */
/* 在 .month-item 样式中添加固定最小高度和溢出控制 */
.month-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateY(0);
  min-height: 60px; /* 固定最小高度，避免高度突变 */
  overflow: hidden; /* 限制内部溢出，不影响外部布局 */
}

/* 调整展开动画，避免高度突变 */
.articles-list {
  border-top: 1px dashed #eee;
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease, padding 0.5s ease;
}

/* 展开时限制最大高度，避免过高影响同行 */
.month-item.active .articles-list {
  padding: 10px 20px 15px;
  max-height: 500px; /* 限制最大高度，超出可滚动 */
  overflow-y: auto; /* 内容过多时可滚动，不撑开整行 */
}

/* ============================================== */

</style>