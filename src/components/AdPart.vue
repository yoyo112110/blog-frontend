<template>
  <div id="AdPart" v-if="visible">
    <!-- 关闭按钮 -->
    <button class="close-btn" @click="closeAd">✕</button>
    <div class="track">
      <!-- 实际数据 -->
      <span class="text" v-for="ad in rollingAds" :key="ad.adId">
        <!-- <img class="icon" src="/logo1.png" alt="🔥" /> -->
        <img class="icon" :src="ad.adIcon || '/logo1.png'" alt="icon" />
        <!-- <div class="time">{{ formatDate2(ad.adBegintTime) }} - {{ formatDate2(ad.adEndTime) }}</div> -->
        <div class="time">截止至{{ formatDate2(ad.adEndTime) }}</div>
        {{ ad.adTitle }}
        <!-- <img class="icon" src="/imgs/discount.png" alt="券" /> -->
        <img class="icon" :src="ad.adUrl || '/imgs/discount.png'" alt="券" />
      </span>

      <!-- 无缝副本：与上面完全一致，保证 dom 结构相同 -->
      <span class="text" v-for="ad in rollingAds" :key="`copy-${ad.adId}`">
        <img class="icon" :src="ad.adIcon || '/logo1.png'" alt="icon" />
        {{ ad.adTitle }}
        <img class="icon" :src="ad.adUrl || '/imgs/discount.png'" alt="券" />
      </span>

      <!-- 兜底：没拿到数据时只显示一条默认 -->
      <template v-if="!rollingAds.length">
        <span class="text">
          <img class="icon" src="/logo1.png" alt="🔥" />
          限时特惠！全场 5 折起！
          <img class="icon" src="/imgs/discount.png" alt="券" />
        </span>
        <span class="text">
          <img class="icon" src="/logo1.png" alt="🔥" />
          限时特惠！全场 5 折起！
          <img class="icon" src="/imgs/discount.png" alt="券" />
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllAds, type Ad } from '@/api/ad'
import { formatDate2 } from '@/utils/dataUtils'

const rollingAds = ref<Ad[]>([])

const visible = ref(true) // 控制显示/隐藏

onMounted(async () => {
  try {
    const all = await getAllAds(1)
    rollingAds.value = all.filter(
      ad => ad.adType?.adTypeTag === 'rolling_announcement'
    )
  } catch (e) {
    console.error('拉取滚动公告失败', e)
  }
})

function closeAd() {
  visible.value = false
}
</script>

<style scoped>
#AdPart {
  position: relative;
  width: 100%;
  height: 30px;
  /* background: linear-gradient(90deg, #1890ff 0%, #722ed1 100%); */
  /* background: linear-gradient(90deg, #77d8d8 0%, #a1c4fd 100%); */
  background: linear-gradient(90deg, #a1c4fd 0%,  #77d8d8 100%);
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  line-height: 30px;
  /* flex-shrink: 0;   不允许收缩 */
  cursor: pointer;
}

.track {
  display: inline-block;
  animation: scroll 15s linear infinite;
}

.text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding-right: 2rem;
}

.icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  vertical-align: middle;
  line-height: 20px;
}

@keyframes scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}













.close-btn {
  position: absolute;
  top: 2px;
  right: 6px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.6);
}
</style>