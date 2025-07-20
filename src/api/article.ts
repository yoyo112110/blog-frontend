import myAxios from '@/request';

// 假设已有 Article 接口定义
export interface Article {
  articleId: string;
  userId: string;
  articleTitle: string;
  articleAddTime: string;
  articleContent: string;
  articleViewCount: number;
  articleLikeCount: number;
  articleCollectionCount: number;
  user?: {
      // 关联的用户信息
      userId: string;
      userName: string;
  }
}
// 获取所有文章
export const getAllArticles = async () => {
  return myAxios.request({
    url: '/api/articles/all',
    method: 'GET'
  });
};

// 新增文章
export const createArticle = async (data: any) => {
  return myAxios.request({
    url: '/api/articles',
    method: 'POST',
    data
  });
};



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 后端接口没有实现
// 发布/保存文章（POST /api/articles）
export const saveArticle = async (data: any) => {
  return myAxios.request({
    url: '/api/articles', // 复数接口
    method: 'POST',
    data
  });
};

// 更新文章（PUT /api/articles/{id}）
export const updateArticle = async (id: string, data: any) => {
  return myAxios.request({
    url: `/api/articles/${id}`, // 复数接口
    method: 'PUT',
    data
  });
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 根据用户ID获取文章
export const getArticlesByUserId = async (userId: string) => {
  return myAxios.request({
    url: `/api/articles/user/${userId}`,
    method: 'GET'
  });
};

// 删除文章
export const deleteArticle = async (id: string) => {
  return myAxios.request({
    url: `/api/articles/${id}`,
    method: 'DELETE'
  });
};

// 根据文章ID获取文章详情
export const getArticleById = async (id: string) => {
  return myAxios.request({
    url: `/api/articles/${id}`,
    method: 'GET'
  });
};

// 获取文章作者?????后端实现？？？
export const getArticleAuthor = async (id: string) => {
  return myAxios.request({
    url: `/api/articles/${id}/author`,
    method: 'GET'
  });
};

/** 根据文章ID查询关联的标签ID列表 */
export const getArticleTagIds = (articleId: string) => {
  return myAxios.get<string[]>(`/api/articles/${articleId}/tags`);
};

// 根据标签ID获取文章
export const getArticlesByTagId = (tagId: string) => {
  return myAxios.get<Article[]>(`/api/articles/tag/${tagId}`);
};

// 获取某标签下文章数量
export const getArticlesCountByTagId = (tagId: string) => {
  return myAxios.get<number>(`/api/articles/tag/${tagId}/count`);
}

// 获取最新文章
export const getLatestArticles = (limit: number) => {
  return myAxios.get<Article[]>(`/api/articles/latest?limit=${limit}`);
};

// 获取最热门文章    
export const getHottestArticles = (limit: number) => {
  return myAxios.get<Article[]>(`/api/articles/hot?limit=${limit}`);
};

// ======================== 点赞 / 收藏 相关接口 ========================

/**
 * 点赞文章
 * @param articleId 文章 ID
 * @param userId    用户 ID
 */
export const likeArticle = (articleId: string, userId: string) =>
  myAxios.post(`/api/articles/${articleId}/like`, null, { params: { userId } });

/**
 * 取消点赞文章
 * @param articleId 文章 ID
 * @param userId    用户 ID
 */
export const unlikeArticle = (articleId: string, userId: string) =>
  myAxios.delete(`/api/articles/${articleId}/like`, { params: { userId } });

/**
 * 收藏文章
 * @param articleId 文章 ID
 * @param userId    用户 ID
 */
export const collectArticle = (articleId: string, userId: string) =>
  myAxios.post(`/api/articles/${articleId}/collect`, null, { params: { userId } });

/**
 * 取消收藏文章
 * @param articleId 文章 ID
 * @param userId    用户 ID
 */
export const unCollectArticle = (articleId: string, userId: string) =>
  myAxios.delete(`/api/articles/${articleId}/collect`, { params: { userId } });

/**
 * 获取文章点赞数
 * @param articleId 文章 ID
 */
export const getLikeCount = (articleId: string) =>
  myAxios.get<number>(`/api/articles/${articleId}/like-count`) .then(res => res.data)   ;

/**
 * 获取文章收藏数
 * @param articleId 文章 ID
 */
export const getCollectCount = (articleId: string) =>
  myAxios.get<number>(`/api/articles/${articleId}/collect-count`).then(res => res.data)  ;

/**
 * 获取用户点赞过的文章列表
 * @param userId 用户 ID
 */
export const getUserLikedArticles = (userId: string) =>
  myAxios.get<Article[]>(`/api/articles/user/${userId}/liked`);

/**
 * 获取用户收藏过的文章列表
 * @param userId 用户 ID
 */
export const getUserCollectedArticles = (userId: string) =>
  myAxios.get<Article[]>(`/api/articles/user/${userId}/collected`);



/**
 * 浏览文章（幂等：24h 内同一 IP 只算一次）
 * @param articleId 文章 ID
 */
export const viewArticle = (articleId: string) =>
  myAxios.post(`/api/articles/${articleId}/view`);

/**
 * 获取文章浏览总数
 * @param articleId 文章 ID
 */
export const getViewCount = (articleId: string) =>
  myAxios.get<number>(`/api/articles/${articleId}/view-count`).then(res => res.data)  ;

/**
 * 获取用户已浏览过的文章列表
 * @param userId 用户 ID
 */
export const getUserViewedArticles = (userId: string) =>
  myAxios.get<Article[]>(`/api/articles/user/${userId}/viewed`);

/**
 * 当前用户是否已点赞
 * @param articleId 文章 ID
 * @param userId    用户 ID
 */
export const hasLiked = (articleId: string, userId: string) =>
  myAxios.get<boolean>(`/api/articles/${articleId}/liked`, { params: { userId } })
         .then(r => r.data)

/**
 * 当前用户是否已收藏
 * @param articleId 文章 ID
 * @param userId    用户 ID
 */
export const hasCollected = (articleId: string, userId: string) =>
  myAxios.get<boolean>(`/api/articles/${articleId}/collected`, { params: { userId } })
         .then(r => r.data)