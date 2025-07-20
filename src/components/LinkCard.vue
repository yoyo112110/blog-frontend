<template>
    <div id="LinkCard" class="link-card">
        <!-- 左侧Logo -->
        <div class="left-content">
            <div class="link-logo">
                <img 
                    :src="getLogoUrl(link.linkLogoUrl)" 
                    alt="网站logo" 
                    class="logo-img"
                    @error="handleImgError"
                >
            </div>
        </div>
        
        <!-- 右侧信息 -->
        <div class="right-content">
            <div class="link-title">
                <a 
                    :href="link.linkUrl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    :title="link.linkTitle"
                >
                    {{ link.linkTitle }}
                </a>
            </div>
            <div class="link-url">
                {{ formatUrl(link.linkUrl) }}
            </div>
            <div class="link-time">
                添加于 {{ formatTime(link.linkAddTime) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Link } from '@/api/link';
// import { formatUrl, formatTime } from '@/utils/format';
// import { defineProps } from 'vue';
// 接收父组件传入的单个链接数据
const props = defineProps<{
    link: Link; // 必须传入完整的Link对象
}>();

// 默认Logo（当linkLogoUrl为null或加载失败时使用）
const defaultLogo = "https://picsum.photos/80/80?grayscale";

// 处理图片路径（相对路径转绝对路径）
const getLogoUrl = (logoUrl: string | null) => {
    if (!logoUrl) return defaultLogo;
    
    // 后端基础URL
    // const baseUrl = "http://localhost:8080";
    
    // 如果是相对路径（以/开头），拼接基础URL
    // return logoUrl.startsWith('/') 
    //     ? `${baseUrl}${logoUrl}` 
    //     : logoUrl;
    return logoUrl; 
};

// 图片加载失败时显示默认图
const handleImgError = (e: Event) => {
    (e.target as HTMLImageElement).src = defaultLogo;
};

// 格式化URL显示（只展示域名，更简洁）
const formatUrl = (url: string) => {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname; // 例如：https://tuxun.fun/ → tuxun.fun
    } catch {
        return url; // 解析失败时显示原始URL
    }
};

// 格式化时间（只显示年月日）
const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleDateString(); // 例如：2025-07-16
};
</script>

<style scoped>
#LinkCard {
    background-color: #fff;
    width: auto;
    width: 280px;
    height: 170px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    padding: 15px;
    box-sizing: border-box;
    transition: transform 0.2s;
    margin: 0 auto;
}

#LinkCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.10);
    border-top: 3px solid #77d8d8;
    border-right: 1px solid #77d8d8;
    transition: all 0.25s ease;
}

/* 左侧Logo区域 */
.left-content {
    width: 80px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.link-logo {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    overflow: hidden;
    background-color: #f5f5f5;
}

.logo-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* 右侧信息区域 */
.right-content {
    flex: 1;
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.link-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 8px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.link-title a {
    color: #333;
    text-decoration: none;
}

.link-title a:hover {
    color: #77d8d8;
    text-decoration: underline;
}

.link-url {
    font-size: 12px;
    color: #666;
    margin: 0 0 5px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.link-time {
    font-size: 12px;
    color: #999;
    margin: 0;
}
</style>