<template>
  <div id="CommentSection">
    <h1>评论</h1>
    <!-- 评论输入框（未登录时禁用） -->
    <div class="comment-input">
      <textarea
        v-model="commentContent"
        placeholder="写下你的评论..."
        :maxlength="500"
        class="input-area"
        :disabled="!isLoggedIn"
      ></textarea>
      <div class="input-footer">
        <span class="word-count">{{ commentContent.length }}/500</span>
        <button 
          class="publish-btn" 
          @click="handlePublish" 
          :disabled="!commentContent.trim() || !isLoggedIn"
        >
          {{ isLoggedIn ? '发布评论' : '请先登录' }}
        </button>
      </div>
    </div>

    <!-- 评论列表（保持不变） -->
    <div class="comment-list">
      <h3 class="list-title">{{ comments.length }} 条评论</h3>
      
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="!loading && comments.length === 0" class="empty">暂无评论，快来抢沙发～</div>
      
      <div 
        v-for="comment in comments" 
        :key="comment.commentId" 
        class="comment-item"
      >
        <img 
          :src="comment.user?.avatar || defaultAvatar" 
          alt="用户头像" 
          class="avatar"
        >
        <div class="comment-content">
          <div class="user-info">
            <span class="username">{{ comment.user?.userName || '匿名用户' }}</span>
            <span class="time">{{ formatTime(comment.commentTime) }}</span>
          </div>
          <p class="content">{{ comment.commentContent }}</p>
          <div class="actions">
            <button 
              class="like-btn" 
              @click="handleLike(comment.commentId)"
            >
              <i class="like-icon">👍</i> <!-- 简化为 emoji -->
              <span>{{ comment.commentLikeCount }}</span>
            </button>
            <button 
              v-if="comment.userId === currentUserId" 
              class="delete-btn" 
              @click="handleDelete(comment.commentId)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLoginUserStore } from '@/store/useLoginUserStore'; // 导入登录状态
import { message } from 'ant-design-vue';

import { 
  getCommentsByArticleId, 
  publishComment, 
  likeComment, 
  deleteComment, 
  Comment 
} from '@/api/comment';

const currentUserId = computed(() => {
  // 正确从 loginUser.userId 获取（与后端字段匹配）
  return loginUserStore.loginUser?.userId || ''; 
});

// 常量
const defaultAvatar = 'https://picsum.photos/40/40';

// 状态
const commentContent = ref('');
const comments = ref<Comment[]>([]);
const loading = ref(false);
const route = useRoute();
// 根据路由配置的参数名调整（如路由是 /articles/:id，则用 params.id）
const articleId = ref(route.params.id as string); // 假设路由参数是 id
// 登录状态（从 Pinia 中获取）
const loginUserStore = useLoginUserStore();
const isLoggedIn = computed(() => loginUserStore.isLoggedIn); // 响应式判断是否登录

// 格式化时间
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 加载评论列表（直接调用接口，无需路由）
const loadComments = async () => {
  if (!articleId.value) return;
  loading.value = true;
  // 直接调用 getCommentsByArticleId 接口
  const fetchedComments = await getCommentsByArticleId(articleId.value);
  comments.value = fetchedComments; // 赋值到评论列表
  loading.value = false;
};

// 发表评论（直接调用接口）
const handlePublish = async () => {
  // 1. 处理评论内容（去空格、校验长度）
  const commentContentTrimmed = commentContent.value.trim();
  if (!commentContentTrimmed) {
    message.warning('评论内容不能为空');
    return;
  }
  if (commentContentTrimmed.length > 500) {
    message.warning('评论内容不能超过500字');
    return;
  }

  // 2. 校验登录状态和用户ID（确保 userId 为 string 且非空）
  if (!isLoggedIn.value) {
    message.warning('请先登录再发表评论');
    return;
  }
  const userId = currentUserId.value; // 从登录状态获取，类型为 string
  if (!userId || typeof userId !== 'string') {
    message.error('用户信息异常，请重新登录');
    return;
  }

  // 3. 校验文章ID（确保 articleId 为 string 且非空）
  if (!articleId.value || typeof articleId.value !== 'string') {
    message.error('文章信息异常，无法发表评论');
    return;
  }

  try {
    // 4. 构造评论数据（所有字段均为 string 类型）
    const newCommentData = {
      articleId: articleId.value, // string 类型
      userId: userId, // string 类型（已校验）
      commentContent: commentContentTrimmed // string 类型
    };

    // 5. 调用发表评论接口
    const result = await publishComment(newCommentData);

    // 6. 处理成功/失败逻辑
    if (result) {
      // 发表成功：添加到评论列表顶部
      comments.value.unshift(result);
      // 清空输入框
      commentContent.value = '';
      message.success('评论发表成功！');
    } else {
      message.error('评论发表失败，请稍后重试');
    }
  } catch (error: any) {
    // 捕获接口调用异常（如网络错误）
    message.error(`发表失败：${error.message || '服务器异常'}`);
  }
};

// 点赞和删除评论
const handleLike = async (commentId: string) => {
  await likeComment(commentId);
  const comment = comments.value.find(c => c.commentId === commentId);
  if (comment) comment.commentLikeCount++;
};

const handleDelete = async (commentId: string) => {
  if (!confirm('确定删除这条评论吗？')) return;
  await deleteComment(commentId);
  comments.value = comments.value.filter(c => c.commentId !== commentId);
};

// 初始化加载评论
onMounted(() => {
  loadComments();
});
</script>

<style scoped>
#CommentSection{
  max-width: 800px;
  /* margin: 20px auto; 左右居中*/
  padding: 0 15px;
}

/* 输入框样式 */
.comment-input {
  margin-bottom: 30px;
}
.input-area {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  outline: none;
}
.input-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.word-count {
  color: #999;
  font-size: 14px;
}
.publish-btn {
  padding: 6px 16px;
  background: #4096ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.publish-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 评论列表样式 */
.list-title {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}
.comment-item {
  display: flex;
  gap: 10px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.user-info {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
}
.username {
  font-weight: 500;
  color: #333;
}
.time {
  font-size: 12px;
  color: #999;
}
.content {
  margin: 5px 0;
  color: #666;
  line-height: 1.5;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}
.like-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
}
.like-btn:hover {
  color: #4096ff;
}
.delete-btn {
  color: #f5222d;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
.delete-btn:hover {
  text-decoration: underline;
}

/* 加载和空状态 */
.loading, .empty {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>