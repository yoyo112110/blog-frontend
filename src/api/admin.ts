// src/api/admin.ts
import myAxios from '@/request'
import { AxiosResponse } from 'axios'

/* ---------- 通用类型 ---------- */
export interface User {
  userId?: string
  userName: string
  userPassword?: string
  userEmail: string
  userRole: 'USER' | 'ADMIN'
  userRegisterTime?: string
}

export interface Article {
  id?: string
  title: string
  content: string
}

export interface Comment {
  id?: string
  content: string
}

export interface ArticleTag {
  id?: string
  name: string
}

export interface Ad {
  id?: string
  title: string
  imageUrl: string
  linkUrl: string
}

export interface Link {
  id?: string
  name: string
  url: string
}

/* ---------- 统一 API 实例 ---------- */
const api = myAxios   // 直接复用 myAxios，避免二次 baseURL

/* ---------- 用户 ---------- */
export const listAllUsers    = () => api.get<User[]>('api/admin/users')
export const getUser         = (id: string) => api.get<User>(`api/admin/users/${id}`)
export const addUser         = (user: User) => api.post<User>('api/admin/users', user)
export const updateUser      = (id: string, user: User) => api.put<User>(`api/admin/users/${id}`, user)
export const deleteUser      = (id: string) => api.delete<void>(`api/admin/users/${id}`)

/* ---------- 文章 ---------- */
export const listAllArticles = () => api.get<Article[]>('api/admin/articles')
export const deleteArticle   = (id: string) => api.delete<void>(`api/admin/articles/${id}`)

/* ---------- 评论 ---------- */
export const listAllComments = () => api.get<Comment[]>('api/admin/comments')
export const deleteComment   = (id: string) => api.delete<void>(`api/admin/comments/${id}`)

/* ---------- 标签 ---------- */
export const listAllArticleTags = () => api.get<ArticleTag[]>('api/admin/tags')
export const deleteTag            = (id: string) => api.delete<void>(`api/admin/tags/${id}`)

/* ---------- 广告 ---------- */
export const listAllAds = () => api.get<Ad[]>('api/admin/ads')
export const addAd      = (ad: Ad) => api.post<Ad>('api/admin/ads', ad)
export const deleteAd   = (id: string) => api.delete<void>(`api/admin/ads/${id}`)

/* ---------- 友链 ---------- */
export const listAllLinks = () => api.get<Link[]>('api/admin/links')
export const addLink      = (link: Link) => api.post<Link>('api/admin/links', link)
export const deleteLink   = (id: string) => api.delete<void>(`api/admin/links/${id}`)