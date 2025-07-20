// 存储键名
const TOKEN_KEY = 'blog_token';

/**
 * 设置 Token 到本地存储
 * @param token - 用户 Token
 * @param remember - 是否记住登录状态（持久化存储）
 */
// export const setToken = (token: string, remember: boolean = false) => {
//   if (remember) {
//     // 使用 localStorage 持久化存储（关闭浏览器后仍保留）
//     localStorage.setItem(TOKEN_KEY, token);
//   } else {
//     // 使用 sessionStorage 会话存储（关闭浏览器后清除）
//     sessionStorage.setItem(TOKEN_KEY, token);
//   }
// };
export const setToken = (token: string, remember = false) => {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * 获取存储的 Token
 * @returns Token 字符串或 null
 */
export const getToken = (): string | null => {
  // 优先从 localStorage 获取
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  
  // 再从 sessionStorage 获取
  return sessionStorage.getItem(TOKEN_KEY);
};

/**
 * 移除存储的 Token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

/**
 * 检查是否存在 Token
 * @returns 是否存在 Token
 */
export const hasToken = (): boolean => {
  return !!getToken();
};