import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 从 localStorage 恢复（刷新不丢）
  const token   = ref(localStorage.getItem('token') || '')
  const user    = ref<{ id: string; name: string } | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  )

  /* 登录后调用 */
  const login = (tk: string, u: { id: string; name: string }) => {
    token.value = tk
    user.value  = u
    localStorage.setItem('token', tk)
    localStorage.setItem('user', JSON.stringify(u))
  }

  /* 退出登录 */
  const logout = () => {
    token.value = ''
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  /* 计算属性：是否已登录 */
  const isLoggedIn = computed(() => !!token.value)

  return { token, user, login, logout, isLoggedIn }
})