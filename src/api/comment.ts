// import myAxios from '@/request';

// export interface Comment {
//     commentId: string;
//     articleId: string;
//     userId: string;
//     commentContent: string;
//     commentTime: string;
//     commentLikeCount: number;
//     user?: {
//         // 关联的用户信息
//         userId: string;
//         userName: string;
//     }
// }

// // 1. 根据文章ID获取评论列表
// export const getCommentsByArticleId = async (articleId: string): Promise<Comment[]> => {
//   const { data } = await myAxios.get(`/api/comments/article/${articleId}`);
//   return data;
// };

// // 2. 发表评论
// export const publishComment = async (comment: Omit<Comment, 'commentId' | 'commentTime' | 'commentLikeCount'>): Promise<Comment> => {
//   const { data } = await myAxios.post('/api/comments', comment);
//   return data;
// };

// // 3. 点赞评论
// export const likeComment = async (commentId: string): Promise<void> => {
//   await myAxios.patch(`/api/comments/${commentId}/like`);
// };

// // 4. 删除评论
// export const deleteComment = async (commentId: string): Promise<void> => {
//   await myAxios.delete(`/api/comments/${commentId}`);
// };



// @/api/comment.ts
import myAxios from '@/request';
import { message } from 'ant-design-vue'; // 导入消息提示组件

export interface Comment { 
  commentId: string;
  articleId: string;
  userId: string;
  commentContent: string;
  commentTime: string;
  commentLikeCount: number;
  user?: {
    userId: string;
    userName: string;
    avatar?: string; // 补充头像字段，用于显示用户头像
  }
}

// 1. 根据文章ID获取评论列表（优化：处理后端返回格式）
export const getCommentsByArticleId = async (articleId: string): Promise<Comment[]> => {
  try {
    const { data } = await myAxios.get(`/api/comments/article/${articleId}`);
    // 后端直接返回数组，无需处理 code，直接返回
    console.log('从数据库获取的评论：', data); // 打印确认数据
    return data; 
  } catch (error: any) {
    message.error('获取评论失败：' + error.message);
    return [];
  }
};

// 2. 发表评论（优化：处理后端返回格式和错误提示）
/**
 * 发表评论
 * @param comment 评论数据（包含 articleId, userId, commentContent）
 * @returns 成功返回新评论对象，失败返回 null
 */
export const publishComment = async (
  comment: Omit<Comment, 'commentId' | 'commentTime' | 'commentLikeCount'>
): Promise<Comment | null> => {
  try {
    // 发送 POST 请求到评论接口
    const { data } = await myAxios.post<Comment>('/api/comments', comment);

    // 后端成功时直接返回评论对象（包含 commentId, commentTime 等字段）
    // 验证返回数据是否包含必要的 commentId（避免后端返回异常格式）
    if (data?.commentId) {
      return data; // 成功：返回新评论对象
    } else {
      // 数据格式异常（有返回但无 commentId）
      message.error('发表评论失败：数据格式异常');
      return null;
    }
  } catch (error: any) {
    // 捕获网络错误或后端 500/400 等异常
    const errorMsg = 
      error.response?.data?.message || // 优先取后端返回的错误信息
      error.message || // 其次取错误对象的 message
      '服务器异常，请稍后再试'; // 兜底提示
    message.error(`发表评论失败：${errorMsg}`);
    return null;
  }
};

// 其他接口保持不变（likeComment、deleteComment等）
export const likeComment = async (commentId: string): Promise<void> => {
  try {
    await myAxios.patch(`/api/comments/${commentId}/like`);
    message.success('点赞成功！');
  } catch (error: any) {
    message.error('点赞失败：' + (error.message || '网络错误'));
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await myAxios.delete(`/api/comments/${commentId}`);
    message.success('评论已删除');
  } catch (error: any) {
    message.error('删除失败：' + (error.message || '网络错误'));
  }
};

// 其余接口（listCommentsByUserId、getCommentCountByArticleId等）...
// 5. 获取用户的评论列表
// 某用户的全部评论
    // @GetMapping("/user/{userId}")
    // public List<Comment> listByUser(@PathVariable String userId) {
    //     return commentService.listByUserId(userId);
// }
export const listCommentsByUserId = async (userId: string): Promise<Comment[]> => {
  const { data } = await myAxios.get(`/api/comments/user/${userId}`);
  return data;
};

// 6. 获取文章的评论数量
    // @GetMapping("/count/article/{articleId}")
    // public Long getCommentCountByArticle(@PathVariable String articleId) {
    //     return commentService.countByArticleId(articleId);
// }
export const getCommentCountByArticleId = async (articleId: string): Promise<number> => {
  const { data } = await myAxios.get(`/api/comments/count/article/${articleId}`);
  return data;
};

// 7. 获取多个评论的用户名称映射
    // @PostMapping("/user-names")
    // public Map<String, String> getCommentUserNames(@RequestBody List<String> commentIds) {
    //     return commentService.getCommentUserNames(commentIds);
// }
export const getCommentUserNames = async (commentIds: string[]): Promise<{ [key: string]: string }> => {
  const { data } = await myAxios.post('/api/comments/user-names', commentIds);
  return data;
};