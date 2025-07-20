import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Article } from '@/api/article'

export const useArticleStore = defineStore('article', () => {
  /* 当前查看的文章 */
  const currentArticle = ref<Article | null>(null)

  /* 更新文章 */
  function setCurrent(article: Article) {
    currentArticle.value = article
  }

  return { currentArticle, setCurrent }
})