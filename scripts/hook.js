#!/usr/bin/env node
/**
 * 🦋 butterfly-hook · 蝶变钩子
 *
 * 融合7大工具精华的终极复刻引擎:
 *   decant → manifest+design-tokens
 *   SkillUI → CLAUDE.md自动生成
 *   flyrank/dna → 10维DNA
 *   clone-architect → pixelmatch保真度
 *   extraktor → 链式处理
 *   perfect-web-clone → 组件级输出
 *   clone-study → 用自己资产重建
 *
 * Hook = 钩住 → 拉取 → 化为己用
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOOK_DIR = path.join(os.homedir(), '.claude', 'butterfly-hook');
if (!fs.existsSync(HOOK_DIR)) fs.mkdirSync(HOOK_DIR, { recursive: true });

/**
 * 生成浏览器内执行的钩取代码 — 10维DNA
 */
function generateHookCode(url, options = {}) {
  const { deep = true, outputFormat = 'html' } = options;

  return `async (page) => {
  const hook = { url: '${url}', timestamp: new Date().toISOString(), dimensions: {} };
  const D = hook.dimensions;

  await page.goto('${url}', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);

  // ═══ D1: 配色体系 (借flyrank/dna palette) ═══
  D.colors = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const all = new Set();
    document.querySelectorAll('*').slice(0, 500).forEach(el => {
      const s = getComputedStyle(el);
      if (s.color !== 'rgb(0, 0, 0)') all.add(s.color);
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'rgba(0,0,0,0)') all.add(s.backgroundColor);
    });
    return { bg: body.backgroundColor, text: body.color, palette: [...all].slice(0, 15) };
  });

  // ═══ D2: 字体系统 (借SkillUI typography) ═══
  D.typography = await page.evaluate(() => {
    const fonts = new Map();
    document.querySelectorAll('h1,h2,h3,h4,p,a,button,span').forEach(el => {
      const s = getComputedStyle(el);
      const key = s.fontFamily.split(',')[0].trim() + '|' + s.fontSize;
      fonts.set(key, { tag: el.tagName, family: s.fontFamily.split(',')[0].trim(), size: s.fontSize, weight: s.fontWeight, lineHeight: s.lineHeight });
    });
    return [...fonts.values()];
  });

  // ═══ D3: 间距系统 ═══
  D.spacing = await page.evaluate(() => {
    const spacings = new Set();
    document.querySelectorAll('*').slice(0, 300).forEach(el => {
      const s = getComputedStyle(el);
      ['padding', 'margin', 'gap'].forEach(p => spacings.add(p + ':' + s[p]));
    });
    return [...spacings].slice(0, 20);
  });

  // ═══ D4: 圆角系统 ═══
  D.borderRadius = await page.evaluate(() => {
    const radii = new Set();
    document.querySelectorAll('*').slice(0, 200).forEach(el => {
      const r = getComputedStyle(el).borderRadius;
      if (r !== '0px' && r !== '') radii.add(r);
    });
    return [...radii].slice(0, 10);
  });

  // ═══ D5: 阴影系统 ═══
  D.shadows = await page.evaluate(() => {
    const shadows = new Set();
    document.querySelectorAll('*').slice(0, 200).forEach(el => {
      const s = getComputedStyle(el).boxShadow;
      if (s !== 'none') shadows.add(s);
    });
    return [...shadows].slice(0, 10);
  });

  // ═══ D6: 导航结构 (借decant page-tree) ═══
  D.navigation = await page.evaluate(() => ({
    header: [...document.querySelectorAll('header a, nav a')].map(a => ({ text: a.textContent?.trim()?.slice(0,40), href: a.getAttribute('href') })).filter(l => l.text),
    footer: [...document.querySelectorAll('footer a')].map(a => ({ text: a.textContent?.trim()?.slice(0,40), href: a.getAttribute('href') })).filter(l => l.text),
  }));

  // ═══ D7: 布局结构 ═══
  D.layout = await page.evaluate(() => ({
    sections: [...document.querySelectorAll('section, [role="main"], main')].map(s => ({
      tag: s.tagName, children: s.children.length, hasGrid: s.querySelectorAll('[class*="grid"]').length,
      hasFlex: getComputedStyle(s).display === 'flex',
    })),
    viewportWidth: window.innerWidth,
    responsive: window.innerWidth !== document.documentElement.scrollWidth,
  }));

  // ═══ D8: 内容层级 ═══
  D.content = await page.evaluate(() => ({
    h1: [...document.querySelectorAll('h1')].map(h => h.textContent?.trim()),
    h2: [...document.querySelectorAll('h2')].map(h => h.textContent?.trim()).slice(0, 5),
    heroImages: document.querySelectorAll('section:first-of-type img, [role="main"] img').length,
    totalParagraphs: document.querySelectorAll('p').length,
  }));

  // ═══ D9: 交互模式 ═══
  D.interaction = await page.evaluate(() => ({
    buttons: [...document.querySelectorAll('button')].map(b => b.textContent?.trim()?.slice(0,30)),
    hasDropdown: !!document.querySelector('[class*="dropdown"], [class*="menu"], [aria-haspopup]'),
    hasStickyNav: [...document.querySelectorAll('header, nav')].some(el => getComputedStyle(el).position === 'sticky'),
    hasCarousel: !!document.querySelector('[class*="carousel"], [class*="slider"], [class*="swiper"]'),
  }));

  // ═══ D10: 技术指纹 ═══
  D.tech = await page.evaluate(() => {
    const metas = {};
    document.querySelectorAll('meta').forEach(m => { const n = m.name || m.property; if(n) metas[n] = m.content?.slice(0,100); });
    return {
      meta: metas,
      isNextJS: !!document.querySelector('#__next'),
      isReact: !!document.querySelector('[data-reactroot]') || !!window.React,
      isTailwind: [...document.styleSheets].some(s => { try { return s.href?.includes('tailwind'); } catch { return false; }}),
      scriptCount: document.querySelectorAll('script').length,
      styleCount: document.querySelectorAll('link[rel="stylesheet"]').length,
      pageSizeKB: Math.round((document.body?.innerHTML?.length || 0) / 1024),
    };
  });

  // 截图
  await page.screenshot({ path: 'hook-screenshot.png', type: 'png', fullPage: true });
  hook.screenshot = 'hook-screenshot.png';
  hook.meta = { dimensions: 10, format: 'butterfly-hook-v1', pipeline: 'hook→extract→replicate→verify→evolve' };

  return hook;
}`;
}

// CLI
const command = process.argv[2];

switch (command) {
  case 'generate': {
    const url = process.argv[3];
    if (!url) { console.log('用法: node hook.js generate <URL>'); process.exit(1); }
    console.log(generateHookCode(url, { deep: true }));
    break;
  }

  case 'info': {
    console.log(`
🦋 butterfly-hook · 蝶变钩子 v1.0

融合精华:
  decant(9.3k★) → manifest+design-tokens
  SkillUI       → CLAUDE.md自动生成
  flyrank/dna   → 10维DNA提取
  clone-architect → pixelmatch保真度
  extraktor     → 链式处理
  perfect-web-clone → 组件级输出
  clone-study   → 自身资产重建

独有优势:
  ✅ 10维DNA (行业最全)
  ✅ 零费用 (全部免费)
  ✅ 自我进化 (butterfly-core)
  ✅ 全链路 (钩取→复刻→验证→进化)
  ✅ 多输出 (HTML/CSS/React/Tailwind)

命名论证:
  Webhook = 钩住事件   Git Hook = 钩住动作
  React Hook = 钩住状态  🦋 Hook = 钩住设计
  不是clone(复制品) 不是extract(分离)
  是Hook(鹰爪入肉·不松口·不遗漏)
`);
    break;
  }

  default:
    console.log('🦋 butterfly-hook\n用法: generate <URL> | info');
}
