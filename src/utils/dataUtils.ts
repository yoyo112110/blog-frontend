// // 年月日 时分秒
// 支持 ISO 字符串 或 时间戳
export const formatDate = (input: string | number) => {
  const date = new Date(input);        // 自动识别
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};

// 年月日时分
// 支持 2024-07-19 12:34:56 或 2024-07-19T12:34:56 等格式
export function formatDate1(str?: string | null): string {
  if (!str) return ''
  const d = new Date(str.replace(' ', 'T'))
  if (isNaN(d.getTime())) return ''

  const Y = d.getFullYear()
  const M = String(d.getMonth() + 1).padStart(2, '0')
  const D = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')

  return `${Y}-${M}-${D} ${h}:${m}`
}


//  仅保留 “YYYY年MM月DD日 HH时”
export const formatDate2 = (input: string | number): string => {
  if (!input) return ''
  const str = typeof input === 'string' ? input.replace(' ', 'T') : String(input)
  const date = new Date(str)

  if (isNaN(date.getTime())) return ''

  const Y = date.getFullYear()
  const M = String(date.getMonth() + 1).padStart(2, '0')
  const D = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')

  return `${Y}年${M}月${D}日 ${h}时`
}

// 数字超过一万 以万（w）为单位显示准确的数字
export const formatNumber = (num?: number | null): string => {
  if (num === null || num === undefined || Number.isNaN(num)) return '0';

  const n = Number(num);

  if (n >= 100000) return '10w+';
  if (n >= 10000)  return (n / 10000).toFixed(1) + 'w'; // 保留一位小数

  // 不过万：去掉小数位
  return Math.round(n).toString();
};

// 热门文章算法
export const hotArticle = (articles: any) => {
  const hotList: any = [];
  articles.forEach((article: any) => {           // 遍历文章                          
    const { likes, views, collections, comments } = article;                           
    const hot = likes * 3 + views * 0.2 + collections * 5 + comments * 2; // 热度算法
    hotList.push({...article, hot });           // 合并文章和热度                       
  });                                          
  hotList.sort((a: any, b: any) => b.hot - a.hot); // 排序                                                                 
  return hotList.slice(0, 10);                   // 取前10条                            
};


export const formatContent = (t: string) => t?.replace(/\r\n/g, '<br/>') || ''
// @/utils/dataUtils.ts 中优化 formatContent 函数
// export const formatContent = (content: string): string => {
//   if (!content) return '';
  
//   // 1. 先处理换行符，将 \r\n 或 \n 统一转换为临时标记
//   let formatted = content.replace(/\r?\n/g, '||lineBreak||');
  
//   // 2. 处理标题（假设内容中用 # 表示标题，如 # 一级标题、## 二级标题）
//   formatted = formatted
//     // 一级标题：# 标题内容 → <h2>标题内容</h2>
//     .replace(/\|\|lineBreak\|\|#\s+(.*?)\|\|lineBreak\|\|/g, '</p><h2>$1</h2><p>')
//     // 二级标题：## 标题内容 → <h3>标题内容</h3>
//     .replace(/\|\|lineBreak\|\|##\s+(.*?)\|\|lineBreak\|\|/g, '</p><h3>$1</h3><p>');
  
//   // 3. 处理列表（假设用 - 表示无序列表项）
//   formatted = formatted
//     .replace(/\|\|lineBreak\|\|-(\s+.*?)(?=\|\|lineBreak\|\|)/g, '<li>$1</li>')
//     .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
  
//   // 4. 处理段落（将连续换行转换为段落）
//   formatted = formatted
//     .replace(/\|\|lineBreak\|\|\+\+/g, '</p><p>') // 连续两个换行视为段落分隔
//     .replace(/\|\|lineBreak\|\|/g, '<br/>') // 单个换行视为换行
//     .replace(/^(.+?)$/, '<p>$1</p>'); // 包裹整个内容为段落
  
//   // 5. 清理多余标签（处理开头结尾的空标签）
//   formatted = formatted
//     .replace(/^<p><\/p>/, '')
//     .replace(/<p><\/p>$/, '')
//     .replace(/<br\/><\/p>/g, '</p>')
//     .replace(/<h2><\/h2>/g, '')
//     .replace(/<h3><\/h3>/g, '');
  
//   return formatted;
// };