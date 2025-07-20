<template>
  <a-layout id="editor-layout">
    <!-- 顶部 Header -->
    <a-layout-header class="editor-header">
      <h1 class="title">{{ isEdit ? '编辑文章' : '发布新文章' }}</h1>
      <a-space>
        <a-button @click="handleSaveDraft">保存草稿</a-button>
        <a-button type="primary" @click="handlePublish">发布文章</a-button>
      </a-space>
    </a-layout-header>

    <a-layout-content class="editor-body">
      <a-row :gutter="16" class="h-100">
        <!-- 左侧表单 -->
        <a-col :xs="24" :lg="12" class="left-panel">
          <a-form layout="vertical" :model="form">
            <!-- 标题 -->
            <a-form-item label="文章标题">
              <a-input
                v-model:value="form.articleTitle"
                placeholder="请输入标题"
                size="large"
              />
            </a-form-item>

            <!-- 正文 -->
            <a-form-item label="正文（支持 Markdown）">
              <a-textarea
                v-model:value="form.articleContent"
                :rows="20"
                placeholder="请使用 Markdown 编写正文..."
              />
            </a-form-item>

            <!-- 标签 -->
            <a-form-item label="标签">
              <a-select
                v-model:value="form.tags"
                mode="tags"
                placeholder="输入标签后回车"
              />
            </a-form-item>
          </a-form>
        </a-col>

        <!-- 右侧预览 -->
        <a-col :xs="24" :lg="12" class="right-panel">
          <div class="preview-wrapper">
            <h3>实时预览</h3>
            <div
              class="preview"
              v-html="renderedHtml"
            ></div>
          </div>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { message } from 'ant-design-vue'
import { saveArticle, updateArticle, getArticleById } from '@/api/article'

/* 1. 高亮配置 */
(marked as any).setOptions({
  highlight: (code: string, lang: string) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  breaks: true,
  gfm: true
})

/* 2. 路由与模式 */
const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

/* 3. 表单数据（与原字段保持一致） */
const form = reactive({
  articleTitle: '',
  articleContent: '',
  tags: [] as string[]
})

/* 4. 实时预览 */
const renderedHtml = computed(() => marked.parse(form.articleContent))

/* 5. 保存草稿 */
const handleSaveDraft = async () => {
  if (!validate()) return
  const payload = getPayload(true)
  try {
    if (isEdit.value) {
      await updateArticle(route.params.id as string, payload)
      message.success('草稿更新成功')
    } else {
      await saveArticle({ ...payload, status: 'draft' })
      message.success('草稿保存成功')
    }
  } catch (e) {
    console.error('保存草稿失败', e)
    message.error('保存失败，请重试')
  }
}

/* 6. 发布文章 */
// const handlePublish = async () => {
//   if (!validate()) return
//   const payload = getPayload(false)
//   try {
//     if (isEdit.value) {
//       await updateArticle(route.params.id as string, payload)
//     } else {
//       await saveArticle(payload)
//     }
//     message.success(isEdit.value ? '文章更新成功' : '文章发布成功')
//     router.push('/article')//?????{id: route.params.id}????
//   } catch (e) {
//     console.error('发布失败', e)
//     message.error('发布失败，请重试')
//   }
// }
const handlePublish = async () => {
  if (!validate()) return;
  const payload = getPayload(false);
  try {
    let id: string;
    if (isEdit.value) {
      await updateArticle(route.params.id as string, payload);
      id = route.params.id as string;
    } else {
      const { data } = await saveArticle(payload);
      id = data.articleId; // 后端返回的新文章 ID
    }
    message.success(isEdit.value ? '文章更新成功' : '文章发布成功');
    router.push(`/articles/${id}`);
  } catch (e) {
    console.error('发布失败', e);
    message.error('发布失败，请重试');
  }
};

/* 7. 工具函数 */
const validate = () => {
  if (!form.articleTitle.trim()) {
    message.warning('请输入文章标题')
    return false
  }
  if (!form.articleContent.trim()) {
    message.warning('请输入文章内容')
    return false
  }
  return true
}

const getPayload = (isDraft: boolean) => ({
  articleTitle: form.articleTitle,
  articleContent: form.articleContent,
  tags: form.tags,
  status: isDraft ? 'draft' : 'published',
  coverImg: ''
})

/* 8. 编辑模式数据回填 */
onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await getArticleById(route.params.id as string)
      form.articleTitle = data.articleTitle
      form.articleContent = data.articleContent
      form.tags = data.tags || []
    } catch (e) {
      message.error('加载文章失败')
    }
  }
})
</script>

<style scoped>
#editor-layout {
  height: 100vh;
  background: var(--color-bg-1);
  margin-top: 20px;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.title {
  margin: 0;
  color: var(--color-text);
}

.editor-body {
  padding: 24px;
  overflow: auto;
}

.left-panel,
.right-panel {
  height: calc(100vh - 64px - 48px);
  overflow: auto;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.right-panel {
  background: #fafafa;
}

.preview-wrapper h3 {
  margin: 0 0 16px;
}

.preview {
  padding: 12px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  min-height: 400px;
  line-height: 1.8;
  overflow: auto;
}

/* 响应式 */
@media (max-width: 992px) {
  .left-panel,
  .right-panel {
    height: auto;
    margin-bottom: 16px;
  }
}
</style>