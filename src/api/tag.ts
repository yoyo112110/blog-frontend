import myAxios from '@/request'; // 假设这是你的 axios 实例

export interface ArticleTag {
  articleTagId: string;
  articleTagName: string;
  articleTagAddTime?: string;
}

/* ========== 类型定义 ========== */
export interface ArticleTag {
  articleTagId: string;      // 标签ID（1位=分类，2-3位=标签）
  articleTagName: string;    // 标签名称
  articleTagAddTime?: string; // 添加时间（可选）
}

/** 查询所有分类和标签 */
export const getAllTags = () => {
  return myAxios.get<ArticleTag[]>('/api/article-tags');
};

/** 查询所有分类（一位数ID） */
export const getTypes = () => {
  return myAxios.get<ArticleTag[]>('/api/article-tags/types');
};

/** 查询某个分类下的所有标签 */
export const getTagsByTypeId = (typeId: string) => {
  return myAxios.get<ArticleTag[]>(`/api/article-tags/tags/${typeId}`);
};

/** 根据ID查询单个分类/标签 */
export const getTagById = (tagId: string) => {
  return myAxios.get<ArticleTag>(`/api/article-tags/${tagId}`);
};

/** 新增分类/标签 */
export const addTag = (data: ArticleTag) => {
  return myAxios.post<ArticleTag>('/api/article-tags', data);
};

/** 删除分类/标签 */
export const deleteTag = (tagId: string) => {
  return myAxios.delete(`/api/article-tags/${tagId}`);
};

/** 工具函数：判断是否为分类（一位数ID） */
export const isType = (tagId: string) => {
  return tagId.length === 1;
};

/** 工具函数：获取标签所属的分类ID */
export const getParentTypeId = (tagId: string) => {
  return tagId.length >= 2 ? tagId.substring(0, 1) : null;
};

/** 批量查询标签（根据标签ID列表） */
export const getTagsByIds = (tagIds: string[]) => {
  return myAxios.post<ArticleTag[]>(`/api/tags/batch`, tagIds);
};

/** 批量查询标签名称（根据标签ID列表） */
export const getTagNames = (tagIds: string[]) => {
  return myAxios.post<string[]>('/api/tags/batch', tagIds);
};