/**
 * 增强版 Markdown 工具：
 * 1. 图片：限制宽度 100%
 * 2. 视频：支持 <video>  自适应
 * 3. 音频：支持 <audio>  自适应
 * 4. Iframe：支持 B 站 / YouTube 等，比例 16:9，最大宽度 100%
 */

// 通用写法（自动识别 ESM / CJS）
import { marked } from 'marked';
type MediaRule = {
  pattern: RegExp;
  replacer: (...args: string[]) => string;
};

const rules: MediaRule[] = [
  /* 1. 图片 ![alt](url) */
  {
    pattern: /!\[(.*?)\]\((\S+?)(?:\s+"(.*?)")?\)/g,
    replacer: (_m, alt, url, title) =>
      `<img src="${url}" alt="${alt}" title="${title || ''}"
            style="max-width:100%;height:auto;display:block;margin:16px 0;border-radius:4px;">`
  },

  /* 2. 视频 (video::url) */
  {
    pattern: /\(video::(\S+)\)/g,
    replacer: (_m, url) =>
      `<video controls preload="metadata" style="max-width:100%;height:auto;display:block;margin:16px 0;border-radius:4px;">
         <source src="${url}">
         您的浏览器不支持 video 标签。
       </video>`
  },

  /* 3. 音频 (audio::url) */
  {
    pattern: /\(audio::(\S+)\)/g,
    replacer: (_m, url) =>
      `<audio controls preload="metadata" style="width:100%;max-width:400px;display:block;margin:16px 0;">
         <source src="${url}">
         您的浏览器不支持 audio 标签。
       </audio>`
  },

  /* 4. Iframe 嵌入 (iframe::url) */
  {
    pattern: /\(iframe::(\S+)\)/g,
    replacer: (_m, url) =>
      `<div style="position:relative;width:100%;padding-top:56.25%;border-radius:6px;overflow:hidden;margin:16px 0;">
         <iframe src="${url}" frameborder="0" allowfullscreen
                 style="position:absolute;top:0;left:0;width:100%;height:100%;">
         </iframe>
       </div>`
  }
];

/* 在 enhanceMarkdown 最后追加：统一处理站内链接 */
export async function enhanceMarkdown(md: string): Promise<string> {
  // 1. 先跑自定义规则
  let html = rules.reduce((text, { pattern, replacer }) => text.replace(pattern, replacer), md);

  // 2. 再用 marked 转 HTML（异步）
  html = await marked.parse(html);

  // 3. 给 <a> 打标记（浏览器环境才运行）
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('/') && !href.startsWith('//')) {
        a.setAttribute('data-internal', 'true');
        a.style.cssText = 'color:#1890ff;text-decoration:none;';
      } else if (/^https?:\/\//.test(href)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
    html = div.innerHTML;
  }

  return html;
}

// /** 统一处理函数 */
// export function enhanceMarkdown(md: string): string {
//   return rules.reduce((text, { pattern, replacer }) => text.replace(pattern, replacer), md);
// }
