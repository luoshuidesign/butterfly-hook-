#!/usr/bin/env node
/**
 * 🪝 HOOK ANYTHING — 万能钩取引擎
 *
 * 钩的不是"网页"。钩的是"人类创造的一切数字造物"。
 *
 * 网站·图片·视频·PDF·应用·3D·数据·社交·商业·代码
 * 万物皆可钩。
 */

const CAN_HOOK = {

  // ═══════════════════════════════════════
  // 视觉类
  // ═══════════════════════════════════════
  website: {
    name: '网站', extract: 'CSS·DOM·动画·字体·图片·SEO·性能·响应式·配色·布局',
    channels: ['P1-P20全部', 'L1-L4资源库'],
    output: 'HTML/CSS/React/Vue/Tailwind/SwiftUI/Compose/Flutter'
  },
  image: {
    name: '图片', extract: '配色·构图·主色调·冷暖·明暗·饱和度·复杂度·风格·情感调性',
    channels: ['design-eye/analyze.js', 'vision-support'],
    output: '10维设计基因JSON + 配色方案 + CSS变量'
  },
  screenshot: {
    name: '截图/UI', extract: '布局·组件·文字·按钮·导航·间距·交互元素',
    channels: ['vision-support OCR', 'design-eye', '元素检测'],
    output: 'UI结构JSON + 设计建议 + 复刻代码'
  },

  // ═══════════════════════════════════════
  // 动态类
  // ═══════════════════════════════════════
  video: {
    name: '视频', extract: '帧序列·场景切换·动效参数·色彩变化·文字出现时序',
    channels: ['video-eye/analyze.js', 'ffmpeg抽帧', '逐帧vision分析'],
    output: '场景描述JSON + 关键帧 + 动效时序'
  },
  animation: {
    name: '动画/CSS动效', extract: 'keyframes·transitions·timing·easing·延迟·迭代',
    channels: ['P6-P9', 'Web Animations API', 'getAnimations()'],
    output: '动画参数JSON + 可复用的CSS/JS动画代码'
  },

  // ═══════════════════════════════════════
  // 结构类
  // ═══════════════════════════════════════
  layout: {
    name: '布局系统', extract: 'Grid/Flex定义·间距规律·响应式断点·容器查询',
    channels: ['P14-P16', 'getComputedStyle', 'getBoundingClientRect'],
    output: '完整布局JSON + CSS Grid/Flex代码'
  },
  navigation: {
    name: '导航/信息架构', extract: '导航树·层级·链接关系·站点地图',
    channels: ['DOM遍历', '链接图谱', 'aria结构'],
    output: '导航树JSON + 信息架构图'
  },

  // ═══════════════════════════════════════
  // 内容类
  // ═══════════════════════════════════════
  text: {
    name: '文字/内容策略', extract: '标题层级·内容密度·语气·关键词·可读性·转化文案',
    channels: ['DOM textContent', '自然语言分析'],
    output: '内容策略报告 + SEO建议'
  },
  seo: {
    name: 'SEO/搜索引擎', extract: 'meta·结构化数据·OG标签·sitemap·canonical·预加载',
    channels: ['meta标签', 'JSON-LD', 'link[rel]'],
    output: 'SEO审计报告 + 优化建议'
  },

  // ═══════════════════════════════════════
  // 技术类
  // ═══════════════════════════════════════
  techStack: {
    name: '技术栈', extract: '框架·库·构建工具·CDN·字体服务·分析工具',
    channels: ['script[src]分析', 'link分析', 'window全局变量'],
    output: '技术栈报告'
  },
  performance: {
    name: '性能指标', extract: 'FCP·LCP·CLS·TTFB·DOM加载·资源大小·缓存策略',
    channels: ['Performance API', 'Resource Timing', 'Navigation Timing'],
    output: '性能审计报告 + Lighthouse级别数据'
  },
  security: {
    name: '安全策略', extract: 'CSP·CORS·HSTS·X-Frame-Options·权限策略',
    channels: ['HTTP头', 'meta标签', 'CORS配置'],
    output: '安全审计报告'
  },

  // ═══════════════════════════════════════
  // 商业类
  // ═══════════════════════════════════════
  business: {
    name: '商业模型', extract: '定价策略·CTA模式·转化路径·信任信号·社交证明',
    channels: ['内容分析', '链接分析', 'CTA检测'],
    output: '商业策略报告 + 转化优化建议'
  },
  brand: {
    name: '品牌DNA', extract: '品牌色·语气·价值观·视觉风格·差异化定位',
    channels: ['六维分析', '内容分析', '视觉分析'],
    output: '品牌DNA报告 + 品牌指南'
  },

  // ═══════════════════════════════════════
  // 数据类
  // ═══════════════════════════════════════
  data: {
    name: '数据/API', extract: 'API端点·数据结构·请求模式·响应格式',
    channels: ['Network面板', 'fetch/XHR拦截', 'JSON解析'],
    output: 'API文档 + 数据模型'
  },
  analytics: {
    name: '分析/追踪', extract: 'Google Analytics·Facebook Pixel·Mixpanel·自定义事件',
    channels: ['script分析', '网络请求', 'dataLayer'],
    output: '追踪策略报告'
  },

  // ═══════════════════════════════════════
  // 交互类
  // ═══════════════════════════════════════
  interaction: {
    name: '交互模式', extract: '点击·滑动·拖拽·手势·键盘·表单·微交互',
    channels: ['事件劫持', 'Observer', '表单分析'],
    output: '交互模式文档 + 可用性建议'
  },
  accessibility: {
    name: '无障碍/A11y', extract: 'ARIA标签·语义HTML·对比度·焦点管理·屏幕阅读器',
    channels: ['aria属性', '语义分析', '对比度计算'],
    output: 'A11y审计报告 + WCAG评分 + 修复建议'
  },
};

// ═══════════════════════════════════════
// 智能路由 — 根据目标类型自动选择钩取策略
// ═══════════════════════════════════════
function routeHook(target) {
  if (!target) return { error: '需要目标: URL·文件路径·或描述' };

  const strategies = [];

  // URL检测
  const isURL = /^https?:\/\//.test(target);
  if (isURL) {
    strategies.push('website', 'layout', 'navigation', 'performance', 'seo', 'security', 'techStack');

    // 根据URL特征追加
    if (/shop|store|buy|cart|checkout/i.test(target)) strategies.push('business', 'brand');
    if (/blog|news|article/i.test(target)) strategies.push('text', 'seo');
    if (/app|dashboard|admin/i.test(target)) strategies.push('interaction', 'accessibility');
  }

  // 文件类型检测
  if (/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(target)) strategies.push('image');
  if (/\.(mp4|mov|avi|webm)$/i.test(target)) strategies.push('video');
  if (/\.pdf$/i.test(target)) strategies.push('text', 'layout');

  // 默认：全部钩取
  if (strategies.length === 0) strategies.push(...Object.keys(CAN_HOOK).slice(0, 10));

  return {
    target,
    strategies: [...new Set(strategies)],
    totalDimensions: strategies.length,
    availableDimensions: Object.keys(CAN_HOOK).length,
    hookEverything: strategies.length >= 15,
  };
}

// ═══════════════════════════════════════
// CLI
// ═══════════════════════════════════════
const cmd = process.argv[2];
const arg = process.argv[3];

switch (cmd) {
  case 'dimensions':
    console.log(`🪝 Hook可以钩取的一切 · ${Object.keys(CAN_HOOK).length}个维度\n`);
    const categories = {
      '视觉类': ['website','image','screenshot'],
      '动态类': ['video','animation'],
      '结构类': ['layout','navigation'],
      '内容类': ['text','seo'],
      '技术类': ['techStack','performance','security'],
      '商业类': ['business','brand'],
      '数据类': ['data','analytics'],
      '交互类': ['interaction','accessibility'],
    };
    for (const [cat, dims] of Object.entries(categories)) {
      console.log(`  ${cat}:`);
      for (const d of dims) {
        const info = CAN_HOOK[d];
        console.log(`    ${info.name.padEnd(12)} → ${info.extract}`);
      }
    }
    break;

  case 'route': {
    const result = routeHook(arg || 'https://example.com');
    console.log(JSON.stringify(result, null, 2));
    break;
  }

  case 'all':
    console.log(Object.keys(CAN_HOOK).join('\n'));
    break;

  default:
    console.log('🪝 Hook Anything\n  dimensions  查看全部可钩维度\n  route <URL>  智能路由\n  all          列出全部维度');
}
