<template>
  <div id="AboutPage">
    <RollingAd />
    <h1>关于我们</h1>
    <p>我们致力于提供最新、最全的资讯与服务，感谢一路同行！</p>  
    <div class="ad">
    <div v-if="loading" class="loading">广告加载中...</div>
    <div v-else-if="ads.length === 0" class="empty">暂无广告</div>
    <div v-else class="ad-list">
      <div v-for="ad in ads" :key="ad.adId" class="ad-card">
        <img v-if="ad.adUrl" :src="ad.adUrl" :alt="ad.adTitle" />
        <div class="info">
          <h3>{{ ad.adTitle }}</h3>
          <p>{{ ad.adType?.adTypeTitle }}</p>
          <small>有效期：{{ ad.adBegintTime }} ~ {{ ad.adEndTime }}</small>
        </div>
      </div>
    </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllAds } from '@/api/ad'
import type { Ad } from '@/api/ad'
import RollingAd from '@/components/AdPart.vue'

const ads = ref<Ad[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    ads.value = await getAllAds(1) // 1 表示只拿“上线”的广告
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
#AboutPage {
  max-width: 1920px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
  min-height: 88vh;
  padding: 0;
}

.ad {
  position: absolute;  /* 关键：脱离文档流 */
  bottom: 100px;           /* 贴到底边 */
  left: 0;
  right: 0;
  text-align: center;
  margin-top: 0;       /* 移除原本的 margin-top */
}

.ad-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.ad-card {
  width: 280px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

/* .ad-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  cursor: pointer;
} */

.ad-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ad-card:hover img {
  transform: scale(1.05);
}
.ad-card .info {
  padding: 12px;
}
.ad-card h3 {
  margin: 0 0 4px;
  font-size: 16px;
}
.ad-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
.ad-card small {
  color: #999;
}

.loading,
.empty {
  padding: 24px;
  color: #999;
}
</style>