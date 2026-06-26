#!/usr/bin/env node
/**
 * 🪝 HOOK CREATE — 第三重·自我创造引擎
 *
 * 借 = 提取 + 理解
 * 化 = 抽象 + 规则化
 * 创 = 融合 + 涌现
 *
 * 输入: 多个设计DNA + 创作意图
 * 输出: 全新原创设计
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const KNOWLEDGE_BASE = path.join(os.homedir(), '.claude', 'butterfly-hook', 'knowledge-base.json');

// ═══════════════════════════════════════
// 设计基因池 — 从知识库中提取所有已知模式
// ═══════════════════════════════════════
function loadDesignGenePool() {
  try {
    const kb = JSON.parse(fs.readFileSync(KNOWLEDGE_BASE, 'utf8'));
    return { sites: kb.sites || [], patterns: kb.patterns || [], tokens: kb.tokens || {} };
  } catch {
    return { sites: [], patterns: [], tokens: {} };
  }
}

// ═══════════════════════════════════════
// 设计意图 → 设计DNA映射
// ═══════════════════════════════════════
const INTENT_MAP = {
  premium:      { colors: 'dark+gold', fonts: 'serif-display+sans-body', spacing: 'generous', density: 'low' },
  tech:         { colors: 'dark+purple', fonts: 'mono-display+sans-body', spacing: 'moderate', density: 'medium' },
  friendly:     { colors: 'light+warm', fonts: 'rounded-sans', spacing: 'tight', density: 'high' },
  minimal:      { colors: 'white+black', fonts: 'single-sans', spacing: 'airy', density: 'low' },
  editorial:    { colors: 'cream+dark', fonts: 'serif-body', spacing: 'generous', density: 'medium' },
  enterprise:   { colors: 'navy+white', fonts: 'professional-sans', spacing: 'moderate', density: 'high' },
  playful:      { colors: 'bright+pastel', fonts: 'display+sans', spacing: 'tight', density: 'high' },
  futuristic:   { colors: 'dark+neon', fonts: 'geometric-display', spacing: 'airy', density: 'low' },
};

// ═══════════════════════════════════════
// 跨源融合引擎
// ═══════════════════════════════════════
function crossPollinate(sources, intent = 'tech') {
  const intentDNA = INTENT_MAP[intent] || INTENT_MAP.tech;
  const pool = loadDesignGenePool();

  // 策略: 从每个源取最擅长的部分
  const fusion = {
    intent,
    sources: sources.map(s => s.name || s.url || 'unknown'),

    // 配色: 取第一个源的配色基调·用意图调整
    colors: {
      primary: sources[0]?.colors?.bg || '#0a0a14',
      text: sources[0]?.colors?.text || '#ffffff',
      accent: sources[1]?.colors?.palette?.[3] || sources[0]?.colors?.palette?.[5] || '#533afd',
      strategy: intentDNA.colors,
    },

    // 字体: 取排版最好的源
    typography: (() => {
      const best = sources.sort((a,b) => (b.fonts?.length||0) - (a.fonts?.length||0))[0];
      return {
        display: best?.fonts?.find(f => f.tag === 'H1')?.family || 'system-ui',
        body: best?.fonts?.find(f => f.tag === 'P' || f.tag === 'A')?.family || 'system-ui',
        scale: best?.fonts?.map(f => f.size).filter(Boolean).slice(0, 6) || ['64px','48px','32px','20px','16px','14px'],
        strategy: intentDNA.fonts,
      };
    })(),

    // 布局: 取结构最清晰的源
    layout: {
      navStyle: sources.find(s => s.nav?.length > 5) ? 'expanded' : 'minimal',
      heroStyle: sources.some(s => s.layout?.images > 20) ? 'visual-heavy' : 'text-focused',
      gridColumns: sources.find(s => s.layout?.sections > 4) ? 3 : 2,
      strategy: `${intentDNA.density} density·${intentDNA.spacing} spacing`,
    },

    // 动态: 从资源库匹配
    dynamics: {
      recommended: [],
      fromPool: [],
    },
  };

  // 匹配动态效果
  if (intent === 'premium' || intent === 'tech') {
    fusion.dynamics.recommended.push('particles/wave', 'scrollReveal/fadeUp', 'gradients/radialShift');
  }
  if (intent === 'enterprise' || intent === 'friendly') {
    fusion.dynamics.recommended.push('countUp/animate', 'hoverEffects/lift', 'marquee/infinite');
  }

  // 从知识库中找匹配的设计模式
  for (const pattern of (pool.patterns || [])) {
    if (pattern.count > 2 && fusion.sources.length < 5) {
      fusion.dynamics.fromPool.push({ pattern: pattern.name, count: pattern.count });
    }
  }

  return fusion;
}

// ═══════════════════════════════════════
// 风格迁移
// ═══════════════════════════════════════
function styleTransfer(source, targetStyle = 'dark') {
  const transfers = {
    dark: {
      bg: (c) => c.replace(/rgb\(255,\s*255,\s*255\)/, 'rgb(10,10,20)').replace(/rgb\(\d+,\s*\d+,\s*\d+\)/, (m) => {
        const [r,g,b] = m.match(/\d+/g).map(Number);
        return `rgb(${Math.round(255-r)},${Math.round(255-g)},${Math.round(255-b)})`;
      }),
      text: (c) => c.replace(/rgb\(0,\s*0,\s*0\)/, 'rgb(240,240,250)'),
      description: '亮色→暗色·所有颜色反转·保持对比关系',
    },
    vibrant: {
      description: '饱和度+30%·色调偏移15°·更活泼',
    },
    calm: {
      description: '饱和度-50%·对比度降低·更平静',
    },
  };

  const transfer = transfers[targetStyle] || transfers.dark;
  return { original: source, transferred: transfer, style: targetStyle };
}

// ═══════════════════════════════════════
// 智能变体生成
// ═══════════════════════════════════════
function generateVariants(baseDesign) {
  return {
    original: baseDesign,
    variants: {
      conservative: { desc: '保留80%原设计·微调配色和间距', adjust: { saturation: 0.9, spacing: 1.0 } },
      balanced:    { desc: '保留50%原设计·优化字体层级和动效', adjust: { saturation: 1.1, spacing: 1.1 } },
      radical:     { desc: '保留20%原设计·完全重构布局和配色', adjust: { saturation: 1.3, spacing: 1.3 } },
    },
    usage: 'A/B测试·用户偏好测试·快速迭代',
  };
}

// ═══════════════════════════════════════
// 空白生成 — 纯意图驱动
// ═══════════════════════════════════════
function generateFromIntent(description) {
  // 意图关键词提取
  const keywords = {
    tech: ['科技','AI','智能','数字','tech','AI','digital'],
    premium: ['高端','奢华','精英','premium','luxury','elite'],
    minimal: ['极简','干净','简洁','minimal','clean','simple'],
    friendly: ['温暖','友好','亲切','warm','friendly','cute'],
    enterprise: ['企业','专业','商务','enterprise','business','corporate'],
    futuristic: ['未来','科幻','赛博','future','cyber','neo'],
  };

  let detectedIntent = 'tech';
  for (const [intent, words] of Object.entries(keywords)) {
    if (words.some(w => description.toLowerCase().includes(w))) {
      detectedIntent = intent; break;
    }
  }

  return {
    intent: detectedIntent,
    description,
    generatedFrom: '纯意图·零参考·100%原创',
    dna: INTENT_MAP[detectedIntent],
  };
}

// ═══════════════════════════════════════
// CLI
// ═══════════════════════════════════════
const cmd = process.argv[2];

switch (cmd) {
  case 'fuse': {
    // 跨源融合
    const sources = [
      { name: 'Apple', colors: { bg: 'rgb(255,255,255)', text: 'rgb(29,29,31)', palette: ['#000','#fff','#f5f5f7','#0071e3'] }, fonts: [{ tag: 'H1', family: 'SF Pro Display', size: '56px' }, { tag: 'P', family: 'SF Pro Text', size: '17px' }], layout: { images: 49, sections: 5 }, nav: ['Store','Mac','iPad','iPhone','Watch'] },
      { name: 'Stripe', colors: { bg: 'rgb(255,255,255)', text: 'rgb(6,27,49)', palette: ['#000','#fff','#533afd','#64748d','#81b81a'] }, fonts: [{ tag: 'H1', family: 'sohne-var', size: '48px' }, { tag: 'P', family: 'sohne-var', size: '16px' }], layout: { images: 44, sections: 12 }, nav: ['产品','解决方案','开发者','资源','定价'] },
      { name: 'Linear', colors: { bg: 'rgb(8,9,10)', text: 'rgb(247,248,248)', palette: ['rgb(8,9,10)','rgb(247,248,248)','rgb(138,143,152)'] }, fonts: [{ tag: 'H1', family: 'Inter Variable', size: '64px' }, { tag: 'P', family: 'Inter Variable', size: '15px' }], layout: { images: 0, sections: 4 }, nav: ['Features','Method','Customers','Pricing','Docs'] },
    ];
    const intent = process.argv[3] || 'tech';
    const fusion = crossPollinate(sources, intent);
    console.log(JSON.stringify(fusion, null, 2));
    break;
  }

  case 'transfer': {
    const style = process.argv[3] || 'dark';
    const source = { colors: { bg: 'rgb(255,255,255)', text: 'rgb(0,0,0)' } };
    console.log(JSON.stringify(styleTransfer(source, style), null, 2));
    break;
  }

  case 'variants': {
    console.log(JSON.stringify(generateVariants({ name: 'base' }), null, 2));
    break;
  }

  case 'intent': {
    const desc = process.argv.slice(3).join(' ') || '科技感·暗色·粒子效果';
    console.log(JSON.stringify(generateFromIntent(desc), null, 2));
    break;
  }

  case 'trinity':
    console.log(`
🪝 Hook 三位一体

第一重·钩: 30条暗行通道 → 提取一切
第二重·化: 六维理解 + 资源库 → 化为智慧
第三重·创: 跨源融合 + 风格迁移 + 智能变体 + 空白生成 → 创造新生

借 = 不是偷。是站在巨人肩膀上·看得比巨人更远。
    `);
    break;

  default:
    console.log('🪝 Hook Create\n  fuse [intent]    跨源融合\n  transfer [style] 风格迁移\n  variants         智能变体\n  intent [描述]    空白生成\n  trinity          三位一体');
}
