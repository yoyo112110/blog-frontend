// api/user.ts
import myAxios from '@/request';

/* ========== 类型定义 ========== */
export interface LoginDTO {
  userName?: string;
  userEmail?: string;
  userPassword: string;
}

// 注册 DTO
export interface RegisterDTO {
  userName: string;
  userEmail: string;
  userPassword: string;
}

// 用户信息接口（包含用户ID和用户名，用于查询返回）
export interface UserInfo {
  userId: string;
  userName: string;
  // 可根据实际需求扩展其他字段，如头像、简介等
  avatar?: string;
  introduction?: string;
}

export interface ApiResult<T = any> {
  code: number;
  message: string;
  data: T;
}

/* ========== 邮箱 / 用户名 登录 ========== */

/** 邮箱登录 */
export const loginByUserEmail = (data: Pick<LoginDTO, 'userEmail' | 'userPassword'>) =>
  myAxios.post('/api/user/loginByUserEmail', data);

// 用户名登录
export const loginByUserName = (data: LoginDTO) =>
  myAxios.post<ApiResult<UserInfo>>('/api/user/login', data);

// 注册接口
export const userRegister = (data: RegisterDTO) =>
  myAxios.post<ApiResult>('/api/user/register', data);

// 用户注销
export const userLogout = (data: object = {}) =>
  myAxios.post('/api/user/logout', data);

// 获取当前用户
export const getCurrentUser = (params: { userName: string }) =>
  myAxios.get('/api/users/current', { params });

/** 搜索用户 */
export const searchUsers = (userName: string) =>
  myAxios.get('/api/users/search', { params: { userName } });

/** 删除用户 */
export const deleteUser = (params: { uid: string }) =>
  myAxios.post('/api/users/delete', params, {
    headers: { 'Content-Type': 'application/json' }
  });

/** 新增：根据用户ID查询用户信息（用于获取作者名称）======================= */
export const getUserById = (userId: string) =>
  myAxios.get<UserInfo>(`/api/users/${userId}`); 
// 假设后端接口路径为 /api/users/{userId}，返回类型为 UserInfo
  

/** 发送邮箱验证码 */
export const sendEmailCaptcha = (params: { email: string }) =>
  myAxios.post<ApiResult>('/api/user/sendEmailCaptcha', params);


// 根据用户名获取用户详情
// export const getUserByName = (userName: string) =>
//   myAxios.get<User>(`/api/users/${userName}`)


// 根据用户名获取文章列表
export const getArticlesByUser = (userName: string) =>
  myAxios.get<Article[]>(`/api/users/${userName}/articles`)

// 根据用户名获取评论列表
export const getCommentsByUser = (userName: string) =>
  myAxios.get<Comment[]>(`/api/users/${userName}/comments`)

/* ----------------- 类型 ----------------- */
export interface User {
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  userDesc?: string
  userRegisterTime: string
}

export interface Article {
  articleId: string
  title: string
  summary: string
  createTime: string
  views: number
}

export interface Comment {
  commentId: string
  content: string
  createTime: string
  articleTitle: string
}