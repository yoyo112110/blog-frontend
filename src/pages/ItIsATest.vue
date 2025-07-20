<template>
  <a-table :columns="columns" :data-source="users" row-key="userId">
    <!-- 头像 -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'avatarUrl'">
        <a-image :src="record.avatarUrl" width="60" height="60" style="border-radius: 50%" />
      </template>

      <!-- 角色 -->
      <template v-if="column.key === 'userRole'">
        <a-tag :color="record.userRole === 'ADMIN' ? 'green' : 'blue'">
          {{ record.userRole === 'ADMIN' ? '管理员' : '普通用户' }}
        </a-tag>
      </template>

      <!-- 创建时间 -->
      <template v-if="column.key === 'userRegisterTime'">
        {{ dayjs(record.userRegisterTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>

      <!-- 删除按钮 -->
      <template v-if="column.key === 'action'">
        <a-popconfirm title="确定删除吗？" @confirm="handleDelete(record.userId)">
          <a-button type="text" danger>删除</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import myAxios from '@/request'

interface User {
  userId: string
  userName: string
  userEmail: string
  avatarUrl?: string
  userRole: 'USER' | 'ADMIN'
  userRegisterTime: string
}

const users = ref<User[]>([])

const columns = [
  { title: 'ID', dataIndex: 'userId', key: 'userId' },
  { title: '用户名', dataIndex: 'userName', key: 'userName' },
  { title: '邮箱', dataIndex: 'userEmail', key: 'userEmail' },
  { title: '头像', key: 'avatarUrl' },
  { title: '角色', key: 'userRole' },
  { title: '创建时间', key: 'userRegisterTime' },
  { title: '操作', key: 'action' }
]

// 获取用户列表
const fetchUsers = async () => {
  try {
    const { data } = await myAxios.get('/api/admin/users')
    users.value = data
  } catch (e) {
    message.error('获取用户列表失败')
  }
}

// 删除用户
const handleDelete = async (userId: string) => {
  try {
    await myAxios.delete(`/api/admin/users/${userId}`)
    message.success('删除成功')
    fetchUsers()
  } catch (e) {
    message.error('删除失败')
  }
}

onMounted(fetchUsers)
</script>