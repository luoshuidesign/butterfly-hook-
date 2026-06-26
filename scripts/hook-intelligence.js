#!/usr/bin/env node
/**
 * 🪝 HOOK INTELLIGENCE — 深层智能引擎
 *
 * Hook之前只能"钩"。现在能"评"、"建"、"修"、"策"。
 *
 * 六大盲区补齐:
 *   ① 质量评分 (Quality Score)      — 设计好坏·自动打分
 *   ② 设计系统生成 (Design System)   — tokens→完整Design System
 *   ③ 内容策略 (Content Strategy)    — 内容结构·可读性·转化分析
 *   ④ 自修复 (Auto-Fix)             — A11y·SEO·性能·自动修复
 *   ⑤ 命名规范 (Token Naming)       — 原始值→语义化Design Token
 *   ⑥ 跨站智能 (Cross-Site Intel)   — 多站对比·趋势发现·最佳实践
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ═══════════════════════════════════════
// ① 质量评分引擎
// ═══════════════════════════════════════
function scoreQuality(hookData) {
  const c = hookData.collect || hookData.layers?.collect || {};
  const e = hookData.enrich || hookData.layers?.enrich || {};

  const scores = {
    colorHarmony:     scoreColorHarmony(c.colors),
    typographyScale:  scoreTypography(c.fonts),
    spacingConsistency: scoreSpacing(c),
    accessibility:    scoreA11y(e.a11y),
    performance:      scorePerf(c.tech),
    seoHealth:        scoreSEO(e.seo || c.meta),
    responsiveness:   scoreResponsive(e.responsive),
    brandConsistency: scoreBrand(c),
    total: 0,
    grade: '',
    strengths: [],
    weaknesses: [],
  };

  scores.total = Math.round(
    scores.colorHarmony * 0.15 +
    scores.typographyScale * 0.15 +
    scores.spacingConsistency * 0.10 +
    scores.accessibility * 0.20 +
    scores.performance * 0.10 +
    scores.seoHealth * 0.10 +
    scores.responsiveness * 0.10 +
    scores.brandConsistency * 0.10
  );

  scores.grade = scores.total >= 90 ? '🏆 卓越'
    : scores.total >= 75 ? '🟢 优秀'
    : scores.total >= 60 ? '🟡 良好'
    : scores.total >= 40 ? '🟠 一般'
    : '🔴 需改进';

  // 强弱项
  Object.entries(scores).forEach(([k, v]) => {
    if (k === 'total' || k === 'grade' || k === 'strengths' || k === 'weaknesses') return;
    if (v >= 80) scores.strengths.push(k);
    if (v < 50) scores.weaknesses.push(k);
  });

  return scores;
}

function scoreColorHarmony(colors) {
  if (!colors) return 50;
  const palette = colors.palette || [];
  let score = 70;
  if (palette.length >= 5 && palette.length <= 15) score += 15; // 适中的配色数量
  if (palette.length < 3) score -= 20; // 太少
  if (palette.length > 20) score -= 10; // 太多
  return Math.max(0, Math.min(100, score));
}

function scoreTypography(fonts) {
  if (!fonts || !fonts.length) return 40;
  let score = 60;
  const hasH1 = fonts.some(f => f.tag === 'H1' && parseInt(f.size) > 24);
  const hasBody = fonts.some(f => (f.tag === 'P' || f.tag === 'A') && parseInt(f.size) >= 14 && parseInt(f.size) <= 20);
  const families = new Set(fonts.map(f => f.family));
  if (hasH1) score += 15;
  if (hasBody) score += 10;
  if (families.size <= 3) score += 10; // 字体族控制好
  if (families.size > 5) score -= 15; // 字体太多
  return Math.max(0, Math.min(100, score));
}

function scoreSpacing(c) { return c?.spacings?.length > 0 ? 70 : 50; }
function scoreA11y(a11y) {
  if (!a11y) return 30;
  let s = 40;
  if (a11y.hasMain) s += 20;
  if (a11y.ariaLabels > 0) s += 15;
  if (a11y.formLabels > 0) s += 10;
  const [alt, total] = (a11y.altTexts || '0/0').split('/').map(Number);
  if (total > 0 && alt/total > 0.5) s += 15;
  return Math.min(100, s);
}
function scorePerf(tech) { return tech?.pageKB < 500 ? 80 : tech?.pageKB < 1000 ? 60 : 40; }
function scoreSEO(seo) {
  if (!seo && !seo?.description) return 30;
  let s = 40;
  if (seo?.description) s += 20;
  if (seo?.hasOGTags) s += 15;
  if (seo?.hasCanonical) s += 10;
  if (seo?.hasStructuredData) s += 15;
  return Math.min(100, s);
}
function scoreResponsive(r) { return r?.breakpoints?.desktop ? 80 : 50; }
function scoreBrand(c) {
  if (!c) return 50;
  let s = 60;
  if (c.layout?.header && c.layout?.footer) s += 20;
  if (c.nav?.length >= 3) s += 10;
  return Math.min(100, s);
}

// ═══════════════════════════════════════
// ② 设计系统生成器
// ═══════════════════════════════════════
function generateDesignSystem(hookData) {
  const c = hookData.collect || hookData.layers?.collect || {};
  const colors = c.colors || {};
  const fonts = c.fonts || [];
  const radii = c.radii || [];
  const shadows = c.shadows || [];

  // Token命名
  const palette = colors.palette || [];
  const tokens = {
    colors: {
      'color-surface-primary': colors.bg || '#ffffff',
      'color-surface-secondary': palette[2] || palette[0] || '#f5f5f5',
      'color-surface-card': palette[3] || palette[1] || '#ffffff',
      'color-text-primary': colors.text || '#000000',
      'color-text-secondary': palette[4] || '#666666',
      'color-accent': palette.find(p => p?.includes('227') || p?.includes('113')) || palette[5] || '#0066cc',
      'color-border': palette[6] || 'rgba(128,128,128,0.2)',
    },
    typography: {
      'font-family-display': fonts.find(f => f.tag === 'H1')?.family || 'system-ui',
      'font-family-body': fonts.find(f => f.tag === 'P' || f.tag === 'A')?.family || 'system-ui',
      'font-size-display': fonts.find(f => f.tag === 'H1')?.size || '48px',
      'font-size-heading': fonts.find(f => f.tag === 'H2')?.size || '32px',
      'font-size-body': fonts.find(f => f.tag === 'P')?.size || '16px',
      'font-size-caption': fonts.find(f => parseInt(f.size) < 14)?.size || '12px',
      'font-weight-bold': fonts.find(f => parseInt(f.weight) >= 600)?.weight || '700',
      'font-weight-normal': '400',
    },
    spacing: {
      'space-xs': '4px', 'space-sm': '8px', 'space-md': '16px',
      'space-lg': '24px', 'space-xl': '32px', 'space-2xl': '48px',
    },
    radius: {
      'radius-sm': radii[0] || '4px',
      'radius-md': radii[1] || '8px',
      'radius-lg': radii[2] || '12px',
      'radius-full': '9999px',
    },
    shadows: {
      'shadow-sm': shadows[0] || '0 1px 2px rgba(0,0,0,0.05)',
      'shadow-md': shadows[1] || shadows[0] || '0 4px 6px rgba(0,0,0,0.1)',
      'shadow-lg': shadows[2] || shadows[1] || shadows[0] || '0 10px 25px rgba(0,0,0,0.15)',
    },
  };

  // 生成完整的CSS :root 块
  const cssRoot = ':root {\n' + Object.entries(tokens).map(([category, vars]) =>
    `  /* ${category} */\n` + Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`).join('\n')
  ).join('\n\n') + '\n}\n';

  return { tokens, cssRoot };
}

// ═══════════════════════════════════════
// ③ 内容策略分析
// ═══════════════════════════════════════
function analyzeContent(hookData) {
  const c = hookData.collect || hookData.layers?.collect || {};
  const content = c.content || {};

  return {
    structure: {
      h1Count: (content.h1 || []).length,
      h2Count: (content.h2 || []).length,
      paragraphCount: content.paragraphs || 0,
      hasClearHierarchy: (content.h1 || []).length === 1 && (content.h2 || []).length >= 2,
    },
    readability: {
      hasSlogan: (content.h1 || []).some(h => h?.length < 20),
      hasLongForm: (content.paragraphs || 0) > 10,
      contentDensity: (content.paragraphs || 0) > 20 ? '高密度·内容丰富' : (content.paragraphs || 0) > 5 ? '中等密度·平衡' : '低密度·视觉为主',
    },
    conversion: {
      hasCTA: (c.nav || []).some(n => n.t?.includes('开始') || n.t?.includes('Start') || n.t?.includes('Buy') || n.t?.includes('Shop')),
      ctaCount: (c.nav || []).filter(n => n.t?.includes('开始') || n.t?.includes('Start') || n.t?.includes('Buy') || n.t?.includes('Get')).length,
      trust: {
        hasAboutLink: (c.nav || []).some(n => n.h === '/personal' || n.t?.includes('About')),
        hasContactLink: (c.nav || []).some(n => n.t?.includes('联系') || n.t?.includes('Contact')),
        hasSocialProof: false, // 需要更深入的检测
      },
    },
    suggestions: [],
  };
}

// ═══════════════════════════════════════
// ④ 自修复建议引擎
// ═══════════════════════════════════════
function generateFixes(hookData, qualityScores) {
  const fixes = [];

  // A11y修复
  const a11y = (hookData.enrich || hookData.layers?.enrich || {}).a11y || {};
  if (!a11y.hasMain) fixes.push({ priority: 'high', category: 'a11y', issue: '缺少<main>标签', fix: '添加<main>包裹主体内容', impact: '屏幕阅读器导航' });
  const [alt, total] = (a11y.altTexts || '0/0').split('/').map(Number);
  if (total > 0 && alt/total < 0.5) fixes.push({ priority: 'high', category: 'a11y', issue: `${alt}/${total}图片缺少alt`, fix: '为所有图片添加描述性alt属性', impact: '视障用户体验' });
  if (!a11y.formLabels) fixes.push({ priority: 'medium', category: 'a11y', issue: '表单缺少label', fix: '为所有input添加关联label', impact: '表单可访问性' });

  // SEO修复
  const seo = (hookData.enrich || hookData.layers?.enrich || {}).seo || {};
  const meta = (hookData.collect || hookData.layers?.collect || {}).meta || {};
  if (!meta.description) fixes.push({ priority: 'high', category: 'seo', issue: '缺少meta description', fix: '添加描述性meta description(120-160字符)', impact: '搜索引擎摘要' });
  if (!seo.hasOGTags) fixes.push({ priority: 'medium', category: 'seo', issue: '缺少OG标签', fix: '添加og:title/og:description/og:image', impact: '社交分享预览' });
  if (!seo.hasStructuredData) fixes.push({ priority: 'low', category: 'seo', issue: '缺少结构化数据', fix: '添加JSON-LD structured data', impact: '富媒体搜索结果' });

  // 性能修复
  const tech = (hookData.collect || hookData.layers?.collect || {}).tech || {};
  if (tech?.pageKB > 500) fixes.push({ priority: 'medium', category: 'performance', issue: `页面过大(${tech.pageKB}KB)`, fix: '代码分割·图片懒加载·压缩资源', impact: '加载速度' });

  return fixes;
}

// ═══════════════════════════════════════
// ⑤ 跨站智能
// ═══════════════════════════════════════
class CrossSiteIntel {
  constructor(kbPath) {
    this.kbPath = kbPath;
  }

  analyze() {
    let kb;
    try { kb = JSON.parse(fs.readFileSync(this.kbPath, 'utf8')); } catch { return null; }

    const sites = kb.sites || [];
    if (sites.length < 2) return { message: '需要至少2个站点才能进行跨站分析', current: sites.length };

    const patterns = kb.patterns || [];
    const colorCounts = kb.tokens || {};

    return {
      sampleSize: sites.length,
      topStyles: patterns.sort((a,b) => b.count - a.count).slice(0, 5),
      topColorSchemes: Object.entries(colorCounts).sort((a,b) => b[1] - a[1]).slice(0, 5),
      insights: [
        patterns.length > 3 ? `发现${patterns.length}种设计模式，行业多元化` : '设计模式集中，行业趋同',
        sites.every(s => s.colors?.bg?.includes('255')) ? '全样本采用浅色背景' : '背景色选择多样',
      ],
      bestPractices: this.extractBestPractices(sites),
    };
  }

  extractBestPractices(sites) {
    const practices = [];
    const withNav = sites.filter(s => s.nav?.length > 3);
    if (withNav.length / sites.length > 0.8) practices.push('清晰导航(3+项)是行业标准');
    return practices;
  }
}

// ═══════════════════════════════════════
// CLI
// ═══════════════════════════════════════
const cmd = process.argv[2];

switch (cmd) {
  case 'score': {
    const input = fs.readFileSync(0, 'utf8');
    try {
      const data = JSON.parse(input);
      const scores = scoreQuality(data);
      const fixes = generateFixes(data, scores);
      const ds = generateDesignSystem(data);
      const content = analyzeContent(data);
      console.log(JSON.stringify({ scores, fixes, designSystem: ds.tokens, content }, null, 2));
    } catch (e) { console.log(JSON.stringify({ error: e.message })); }
    break;
  }

  case 'design-system': {
    const input = fs.readFileSync(0, 'utf8');
    try {
      const data = JSON.parse(input);
      const ds = generateDesignSystem(data);
      console.log(ds.cssRoot);
    } catch (e) { console.log('/* Error: ' + e.message + ' */'); }
    break;
  }

  case 'intel': {
    const intel = new CrossSiteIntel(
      path.join(os.homedir(), '.claude', 'butterfly-hook', 'knowledge-base.json')
    );
    console.log(JSON.stringify(intel.analyze(), null, 2));
    break;
  }

  case 'all': {
    const input = fs.readFileSync(0, 'utf8');
    try {
      const data = JSON.parse(input);
      console.log(JSON.stringify({
        quality: scoreQuality(data),
        designSystem: generateDesignSystem(data).tokens,
        content: analyzeContent(data),
        fixes: generateFixes(data),
      }, null, 2));
    } catch (e) { console.log(JSON.stringify({ error: e.message })); }
    break;
  }

  default:
    console.log('🪝 Hook Intelligence\n  score < hook.json          — 质量评分\n  design-system < hook.json   — 生成Design System\n  intel                       — 跨站智能\n  all < hook.json             — 全部分析');
}
