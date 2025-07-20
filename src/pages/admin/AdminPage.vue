<template>
  <div id="AdminPage">
    <a-layout style="min-height: 100vh">
      <!-- 左侧菜单 -->
      <a-layout-sider width="160" theme="light" class="menu-sider">
        <a-menu
          v-model:selectedKeys="selectedKey"
          mode="inline"
          @click="switchTab"
        >
          <a-menu-item key="users">用户</a-menu-item>
          <a-menu-item key="articles">文章</a-menu-item>
          <a-menu-item key="comments">评论</a-menu-item>
          <a-menu-item key="links">友链</a-menu-item>
          <a-menu-item key="ads">广告</a-menu-item>
        </a-menu>
      </a-layout-sider>

      <!-- 右侧主体 -->
      <a-layout-content style="padding: 24px">
        <!-- 用户管理表格 -->
        <template v-if="selectedKey[0] === 'users'">
          <a-table :columns="userColumns" :data-source="users" row-key="userId">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'avatarUrl'">
                <a-image
                  :src="record.avatarUrl"
                  width="60"
                  height="60"
                  style="border-radius: 50%"
                />
              </template>
              <template v-if="column.key === 'userRole'">
                <a-tag :color="record.userRole === 'ADMIN' ? 'green' : 'blue'">
                  {{ record.userRole === 'ADMIN' ? '管理员' : '普通用户' }}
                </a-tag>
              </template>
              <template v-if="column.key === 'userRegisterTime'">
                {{ dayjs(record.userRegisterTime).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
              <template v-if="column.key === 'action'">
                <a-popconfirm title="确定删除吗？" @confirm="handleDelete('users', record.userId)">
                  <a-button type="text" danger>删除</a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
        </template>

        <!-- 文章管理表格 -->
        <template v-if="selectedKey[0] === 'articles'">
          <a-table :columns="articleColumns" :data-source="articles" row-key="articleId">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-popconfirm title="确定删除吗？" @confirm="handleDelete('articles', record.articleId)">
                  <a-button type="text" danger>删除</a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
        </template>

        <!-- 评论管理表格 -->
        <template v-if="selectedKey[0] === 'comments'">
          <a-table :columns="commentColumns" :data-source="comments" row-key="commentId">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-popconfirm title="确定删除吗？" @confirm="handleDelete('comments', record.commentId)">
                  <a-button type="text" danger>删除</a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
        </template>

        <!-- 友链管理表格 -->
        <template v-if="selectedKey[0] === 'links'">
          <a-table :columns="linkColumns" :data-source="links" row-key="linkId">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-popconfirm title="确定删除吗？" @confirm="handleDelete('links', record.linkId)">
                  <a-button type="text" danger>删除</a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
        </template>

        <!-- 广告管理表格 -->
        <template v-if="selectedKey[0] === 'ads'">
          <a-table :columns="adColumns" :data-source="ads" row-key="adId">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'imageUrl'">
                <a-image :src="record.imageUrl" width="100" />
              </template>
              <template v-if="column.key === 'action'">
                <a-popconfirm title="确定删除吗？" @confirm="handleDelete('ads', record.adId)">
                  <a-button type="text" danger>删除</a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
        </template>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  listAllUsers,
  listAllArticles,
  listAllComments,
  listAllLinks,
  listAllAds,
  deleteUser,
  deleteArticle,
  deleteComment,
  deleteLink,
  deleteAd,
} from '@/api/admin'

// 定义标签类型
type Tab = 'users' | 'articles' | 'comments' | 'links' | 'ads'

// 选中的标签
const selectedKey = ref<Tab[]>(['users'])

/* --------------- 表格列定义 --------------- */
const userColumns = [
  { title: 'ID', dataIndex: 'userId', key: 'userId' },
  { title: '用户名', dataIndex: 'userName', key: 'userName' },
  { title: '邮箱', dataIndex: 'userEmail', key: 'userEmail' },
  { title: '头像', key: 'avatarUrl' },
  { title: '角色', key: 'userRole' },
  { title: '注册时间', key: 'userRegisterTime' },
  { title: '操作', key: 'action' },
]

const articleColumns = [
  { title: 'ID', dataIndex: 'articleId', key: 'articleId' },
  { title: '标题', dataIndex: 'articleTitle', key: 'articleTitle' },
  { title: '操作', key: 'action' },
]

const commentColumns = [
  { title: 'ID', dataIndex: 'commentId', key: 'commentId' },
  { title: '内容', dataIndex: 'commentContent', key: 'commentContent' },
  { title: '操作', key: 'action' },
]

const linkColumns = [
  { title: 'ID', dataIndex: 'linkId', key: 'linkId' },
  { title: '名称', dataIndex: 'linkTitle', key: 'linkTitle' },
  { title: '链接', dataIndex: 'linkUrl', key: 'linkUrl' },
  { title: '操作', key: 'action' },
]

const adColumns = [
  { title: 'ID', dataIndex: 'adId', key: 'adId' },
  { title: '标题', dataIndex: 'adTitle', key: 'adTitle' },
  { title: '图片', key: 'imageUrl' },
  { title: '链接', dataIndex: 'adUrl', key: 'adUrl' },
  { title: '操作', key: 'action' },
]

/* --------------- 数据存储 --------------- */
const users = ref([])
const articles = ref([])
const comments = ref([])
const links = ref([])
const ads = ref([])

/* --------------- 切换标签并拉取数据 --------------- */
const switchTab = ({ key }: { key: Tab }) => {
  selectedKey.value = [key]
  fetchData(key)
}

// 拉取对应标签的数据
const fetchData = async (key: Tab) => {
  try {
    let res
    switch (key) {
      case 'users':
        res = await listAllUsers();
        users.value = res.data;
        break
      case 'articles':
        res = await listAllArticles();
        articles.value = res.data;
        break
      case 'comments':
        res = await listAllComments();
        comments.value = res.data;
        break
      case 'links':
        res = await listAllLinks();
        links.value = res.data;
        break
      case 'ads':
        res = await listAllAds();
        ads.value = res.data;
        break
    }
  } catch {
    message.error('获取数据失败')
  }
}

/* --------------- 删除操作 --------------- */
const handleDelete = async (type: Tab, id: string) => {
  try {
    switch (type) {
      case 'users':
        await deleteUser(id);
        break
      case 'articles':
        await deleteArticle(id);
        break
      case 'comments':
        await deleteComment(id);
        break
      case 'links':
        await deleteLink(id);
        break
      case 'ads':
        await deleteAd(id);
        break
    }
    message.success('删除成功')
    fetchData(type) // 重新拉取数据
  } catch {
    message.error('删除失败')
  }
}

/* --------------- 生命周期 --------------- */
// 初始加载用户数据
onMounted(() => fetchData('users'))

// 定时器相关（示例代码）
let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => { /* 定时器逻辑 */ }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>

#AdminPage {
  background-color: #f5f5f5;
  min-height: 85vh;
}

.menu-sider {
    margin-top: 20px;
}
</style>