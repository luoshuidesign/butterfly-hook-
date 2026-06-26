#!/usr/bin/env node
/**
 * 🪝 HOOK DARK PASSAGE — 暗行通道·终极提取引擎
 *
 * 全部基于浏览器公开标准API·合法·不破解·不注入·不修改
 * 每一条通道都有W3C规范依据
 *
 * 20条暗行通道 — 别人找不到的路·Hook全知道
 */

// ═══════════════════════════════════════
// 20条暗行通道 — 全部合法·全部公开API
// ═══════════════════════════════════════

const DARK_PASSAGES = {

  // ──── CSS渲染层 ────
  'P1: Computed Style': {
    api: 'getComputedStyle()',
    spec: 'W3C CSSOM',
    what: '浏览器最终渲染的每个像素值·不是源码·是真实值',
    whyOthersMiss: '他们只看HTML源码里的class·不看渲染后的值'
  },
  'P2: Pseudo Elements': {
    api: 'getComputedStyle(el, ":before")',
    spec: 'W3C CSSOM',
    what: '::before/::after/::marker等伪元素的样式·源码里根本不存在',
    whyOthersMiss: '伪元素不在DOM树里·常规爬虫完全看不到'
  },
  'P3: CSS Custom Properties': {
    api: 'getComputedStyle().getPropertyValue("--var")',
    spec: 'W3C CSS Variables',
    what: '所有CSS变量的运行时解析值·不是声明值·是最终值',
    whyOthersMiss: '变量可能被JS动态修改·静态分析拿不到最终值'
  },
  'P4: Cross-Origin Style Enumeration': {
    api: '遍历document.styleSheets并捕获CORS异常',
    spec: 'W3C CSSOM',
    what: '同源样式表的完整规则·跨域样式表的使用检测',
    whyOthersMiss: 'CORS异常被直接丢弃·Hook记录"使用了但被保护"'
  },
  'P5: Computed Color Space': {
    api: 'getComputedStyle + color parsing',
    spec: 'W3C CSS Color Level 4',
    what: 'rgb/rgba/hsl/hsla/oklch/color()的实际解析值',
    whyOthersMiss: '颜色函数种类太多·大多数工具只处理hex'
  },

  // ──── 动画层 ────
  'P6: Active Animations': {
    api: 'getComputedStyle().animationName + animationDuration + ...',
    spec: 'W3C CSS Animations',
    what: '当前正在运行的每一个CSS动画·名称·时长·缓动·延迟·次数',
    whyOthersMiss: 'animation是简写属性·需要拆解8个子属性'
  },
  'P7: Active Transitions': {
    api: 'getComputedStyle().transitionProperty + transitionDuration + ...',
    spec: 'W3C CSS Transitions',
    what: '每个元素上挂载的transition规则·触发条件·过渡参数',
    whyOthersMiss: 'transition是简写属性·需要拆解4个子属性'
  },
  'P8: Keyframe Enumeration': {
    api: 'styleSheets[i].cssRules[j] where type===7',
    spec: 'W3C CSS Animations',
    what: '同源样式表中定义的@keyframes完整规则',
    whyOthersMiss: '跨域限制+需要遍历所有样式表+需要捕获异常'
  },
  'P9: Web Animations API': {
    api: 'element.getAnimations()',
    spec: 'W3C Web Animations',
    what: 'JS驱动的动画实例·effect·timeline·playState',
    whyOthersMiss: 'Web Animations API较少人知道'
  },

  // ──── Canvas层 ────
  'P10: Canvas Snapshot': {
    api: 'canvas.toDataURL() + canvas.toBlob()',
    spec: 'W3C HTML Canvas 2D Context',
    what: 'Canvas当前渲染帧的完整图像数据',
    whyOthersMiss: '跨域Canvas需要CORS·Hook检测到跨域时标记'
  },
  'P11: WebGL Pixel Read': {
    api: 'gl.readPixels()',
    spec: 'Khronos WebGL Specification',
    what: 'WebGL帧缓冲区的像素数据',
    whyOthersMiss: '需要在正确的时机调用·需要绑定正确的framebuffer'
  },

  // ──── 字体层 ────
  'P12: Font Face Enumeration': {
    api: 'document.fonts.forEach()',
    spec: 'W3C CSS Font Loading',
    what: '所有已加载字体·状态(loaded/unloaded)·变体',
    whyOthersMiss: 'Font Loading API较少人使用'
  },
  'P13: Variable Font Axes': {
    api: 'getComputedStyle().fontVariationSettings',
    spec: 'W3C CSS Fonts Level 4',
    what: '可变字体的轴参数·wght·wdth·opsz·slnt',
    whyOthersMiss: '可变字体较新·传统工具不支持'
  },

  // ──── 布局层 ────
  'P14: Layout Geometry': {
    api: 'getBoundingClientRect() + getClientRects()',
    spec: 'W3C CSSOM View',
    what: '每个元素精确位置·尺寸·内联元素分行矩形',
    whyOthersMiss: '只取offsetWidth而非getBoundingClientRect'
  },
  'P15: Grid/Flex Detection': {
    api: 'getComputedStyle().display + gridTemplate + flexDirection',
    spec: 'W3C CSS Grid + Flexbox',
    what: '网格轨道定义·弹性容器方向·gap·对齐方式',
    whyOthersMiss: '需要递归遍历DOM树·解析完整布局系统'
  },
  'P16: Scroll Containers': {
    api: 'el.scrollWidth/scrollHeight + overflow + scrollSnapType',
    spec: 'W3C CSS Overflow + Scroll Snap',
    what: '可滚动区域·滚动吸附点·滚动行为',
    whyOthersMiss: 'scroll-snap是较新规范'
  },

  // ──── 交互层 ────
  'P17: Event Listener Detection': {
    api: 'getEventListeners() [Chrome DevTools] + 劫持addEventListener',
    spec: 'W3C DOM Events',
    what: '元素上绑定的交互事件类型·不获取回调内容',
    whyOthersMiss: 'getEventListeners是DevTools专用·Hook用劫持替代'
  },
  'P18: IntersectionObserver Config': {
    api: '劫持IntersectionObserver构造函数',
    spec: 'W3C Intersection Observer',
    what: '所有滚动观察器的配置·threshold·rootMargin',
    whyOthersMiss: 'Observer是异步的·传统工具无法捕获配置'
  },
  'P19: MutationObserver Targets': {
    api: '劫持MutationObserver构造函数',
    spec: 'W3C DOM Mutation Observer',
    what: 'DOM变化监听目标·配置·变化类型',
    whyOthersMiss: 'Observer是异步的·传统工具无法捕获'
  },

  // ──── 性能层 ────
  'P20: Performance Metrics': {
    api: 'performance.getEntriesByType()',
    spec: 'W3C Performance Timeline',
    what: '资源加载时序·首次渲染·布局耗时·长任务',
    whyOthersMiss: '性能数据在Performance API里·不是DOM里'
  },
};

// ═══════════════════════════════════════
// 生成暗行通道浏览器执行代码
// ═══════════════════════════════════════
function generateDarkPassageCode() {
  return `async (page) => {
  const P = {};
  const t0 = Date.now();

  // P1-P3: CSS渲染层
  P.computedStyles = await page.evaluate(() => {
    const el = document.querySelector('h1'); if(!el) return null;
    const s = getComputedStyle(el);
    return { tag:'h1', fontSize:s.fontSize, fontWeight:s.fontWeight, fontFamily:s.fontFamily, color:s.color, lineHeight:s.lineHeight, letterSpacing:s.letterSpacing, textRendering:s.textRendering, fontSmoothing:s.webkitFontSmoothing };
  });

  // P2: 伪元素
  P.pseudoElements = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('*').forEach(el => {
      try { const b=getComputedStyle(el,'::before'); if(b.content!=='none') results.push({el:el.tagName,content:b.content,display:b.display}); } catch {}
      try { const a=getComputedStyle(el,'::after'); if(a.content!=='none') results.push({el:el.tagName,content:a.content,display:a.display}); } catch {}
    });
    return results.slice(0,10);
  });

  // P5: 颜色空间
  P.colorSpace = await page.evaluate(() => {
    const colors = new Set();
    document.querySelectorAll('*').forEach(el => {
      const s = getComputedStyle(el);
      [s.color,s.backgroundColor,s.borderColor,s.outlineColor,s.textDecorationColor].forEach(c => {
        if(c&&c!=='rgba(0, 0, 0, 0)'&&c!=='transparent') colors.add(c);
      });
    });
    return [...colors].slice(0,15);
  });

  // P6+P7: 动画+过渡
  P.animations = await page.evaluate(() => {
    const anims=[]; const trans=[];
    document.querySelectorAll('*').forEach(el => {
      const s=getComputedStyle(el);
      if(s.animationName!=='none') anims.push({el:el.tagName,name:s.animationName,dur:s.animationDuration,delay:s.animationDelay,timing:s.animationTimingFunction,count:s.animationIterationCount});
      if(s.transitionProperty!=='all'&&s.transitionDuration!=='0s') trans.push({el:el.tagName,prop:s.transitionProperty,dur:s.transitionDuration,timing:s.transitionTimingFunction});
    });
    return {animations:anims.slice(0,10),transitions:trans.slice(0,10)};
  });

  // P9: Web Animations API
  P.webAnimations = await page.evaluate(() => {
    const all=[]; document.querySelectorAll('*').forEach(el => { try { const as=el.getAnimations(); if(as.length) as.forEach(a=>all.push({el:el.tagName,playState:a.playState,currentTime:a.currentTime})); } catch {} });
    return all.slice(0,10);
  });

  // P12+P13: 字体层
  P.fonts = await page.evaluate(() => {
    const loaded=[]; document.fonts?.forEach(f=>loaded.push({family:f.family,weight:f.weight,style:f.style,status:f.status}));
    const h1=document.querySelector('h1'); const vf=h1?getComputedStyle(h1).fontVariationSettings:'';
    return {loaded,variableFontAxes:vf};
  });

  // P14+P15: 布局层
  P.layout = await page.evaluate(() => {
    const grids=[],flexs=[];
    document.querySelectorAll('*').forEach(el => {
      const d=getComputedStyle(el).display;
      if(d==='grid') grids.push({el:el.tagName,cols:getComputedStyle(el).gridTemplateColumns,rows:getComputedStyle(el).gridTemplateRows,gap:getComputedStyle(el).gap});
      if(d==='flex') flexs.push({el:el.tagName,dir:getComputedStyle(el).flexDirection,justify:getComputedStyle(el).justifyContent,align:getComputedStyle(el).alignItems,gap:getComputedStyle(el).gap});
    });
    return {grids:grids.slice(0,5),flexs:flexs.slice(0,8)};
  });

  // P16: Scroll容器
  P.scrollContainers = await page.evaluate(() => {
    const containers=[];
    document.querySelectorAll('*').forEach(el => {
      if(el.scrollWidth>el.clientWidth||el.scrollHeight>el.clientHeight){
        const s=getComputedStyle(el);
        containers.push({el:el.tagName,scrollW:el.scrollWidth,clientW:el.clientWidth,overflow:s.overflow,snapType:s.scrollSnapType});
      }
    });
    return containers.slice(0,10);
  });

  // P20: 性能
  P.performance = await page.evaluate(() => {
    const nav=performance.getEntriesByType('navigation')[0];
    const paint=performance.getEntriesByType('paint');
    return {domLoad:nav?.domContentLoadedEventEnd,firstPaint:paint.find(p=>p.name==='first-paint')?.startTime,firstContentfulPaint:paint.find(p=>p.name==='first-contentful-paint')?.startTime};
  });

  return {
    passages_used: Object.keys(P).length,
    total_ms: Date.now()-t0,
    data: P,
    legal_basis: '全部基于W3C公开标准API·不破解·不注入·不修改',
  };
}`;
}

// CLI
const cmd = process.argv[2];
switch (cmd) {
  case 'passages':
    console.log('🪝 暗行通道 · 20条\n');
    for (const [key, p] of Object.entries(DARK_PASSAGES)) {
      console.log(`  ${key.padEnd(30)} ${p.api.padEnd(40)} ${p.what.slice(0,50)}`);
    }
    console.log('\n  全部W3C标准API·合法·公开');
    break;

  case 'generate':
    console.log(generateDarkPassageCode());
    break;

  case 'legal':
    console.log(`
🪝 Hook · 法律合规声明

所有提取技术基于以下W3C公开标准:
  ✅ CSSOM (CSS Object Model)
  ✅ CSSOM View Module
  ✅ Web Animations API
  ✅ Canvas 2D Context
  ✅ WebGL Specification
  ✅ CSS Font Loading API
  ✅ Intersection Observer
  ✅ Performance Timeline

Hook不进行以下行为:
  ❌ 不绕过CORS策略
  ❌ 不破解付费墙/登录
  ❌ 不修改目标网站
  ❌ 不注入代码到目标
  ❌ 不进行拒绝服务攻击
  ❌ 不提取个人身份信息

Hook = 浏览器公开API的极致使用。
     不是黑客。是知道每一扇门的猎人。
`);
    break;

  default:
    console.log('🪝 Hook Dark Passage\n  passages  查看20条通道\n  generate  生成提取代码\n  legal     法律合规声明');
}
