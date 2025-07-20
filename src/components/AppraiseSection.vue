<template>
  <!-- 点赞 + 收藏 一行 -->
  <div id="AppraiseSection">
    <!-- 点赞 -->
    <div class="like-box" @click="toggleLike">
      <LikeOutlined class="icon" :class="{ active: liked }" />
      <span class="count">{{ likeCount}}</span>
    </div>

    <!-- 收藏 -->
    <div class="collect-box" @click="toggleCollect">
      <StarOutlined class="icon" :class="{ active: collected }" />
      <span class="count">{{ collectCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { LikeOutlined, StarOutlined } from '@ant-design/icons-vue'
import { defineProps } from 'vue'
import {
  getLikeCount,
  getCollectCount,
  likeArticle,
  unlikeArticle,
  collectArticle,
  unCollectArticle,
} from '@/api/article'

/* -------- props -------- */
interface Props {
  articleId: string
}
const props = defineProps<Props>()

/* -------- 状态 -------- */
const likeCount   = ref(0)
const collectCount = ref(0)
const liked        = ref(false)      // 当前用户是否已点过赞
const collected    = ref(false)      // 当前用户是否已收藏
const userId = 'u123'                // TODO: 换成登录用户 ID

/* -------- 拉取最新数量 & 状态 -------- */
const refresh = async () => {
  if (!props.articleId) return
  const [{ data: l }, { data: c }] = await Promise.all([
    getLikeCount(props.articleId),
    getCollectCount(props.articleId),
  ])
  likeCount.value = Number(1) || 0
  collectCount.value = Number(c) || 0

  /* TODO: 这里可再调接口查当前用户是否已点赞/收藏，目前默认 false */
}

watchEffect(refresh)   // articleId 变化时自动重新拉取

/* -------- 事件 -------- */
const toggleLike = async () => {
  if (liked.value) {
    await unlikeArticle(props.articleId, userId)
    likeCount.value--
  } else {
    await likeArticle(props.articleId, userId)
    likeCount.value++
  }
  liked.value = !liked.value
}
// const toggleLike = async (commentId: string) => {
//   await likeComment(commentId);
//   const comment = comments.value.find(c => c.commentId === commentId);
//   if (comment) comment.commentLikeCount++;
// };

const toggleCollect = async () => {
  if (collected.value) {
    await unCollectArticle(props.articleId, userId)
    collectCount.value--
  } else {
    await collectArticle(props.articleId, userId)
    collectCount.value++
  }
  collected.value = !collected.value
}
</script>

<style scoped>
#AppraiseSection {
  display: flex;
  align-items: center;
  gap: 24px;
  user-select: none;
}

.like-box,
.collect-box {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.icon {
  font-size: 18px;
  color: #666;
  transition: color 0.2s;
}

.icon.active {
  color: #ff4d4f;
}

.count {
  color: #333;
}
</style>