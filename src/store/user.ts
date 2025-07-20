import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const id = ref<string>('')          // 当前登录用户 id
  const setId = (val: string) => (id.value = val)
  return { id, setId }
})