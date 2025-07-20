<template>
  <div id="homeLayout">
    <a-row gutter="24">
      <!-- 左侧博客列表 -->
      <a-col :span="18">
        <div class="blog-list">
          <slot name="blog-list"></slot>
        </div>
      </a-col>

      <!-- 右侧分类、标签、推荐 -->
      <a-col :span="6">
        <div class="sidebar">
          <slot name="sidebar"></slot>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
// 暂时不需要引入任何逻辑
</script>

<style scoped>
#homeLayout {
  padding: 20px;
  /* width: 1551.77px; */
}

.blog-list {
  /* background-color: #fff; */
  padding: 10px 0; /* 纵向内边距10px，横向0 */
  border-radius: 8px;
  min-height: 300px; /* 占位高度 */
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 0; /* 纵向内边距10px，横向0 */
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: 100px; /* 占位高度 */
  text-align: center;
}
</style>