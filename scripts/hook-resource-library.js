#!/usr/bin/env node
/**
 * 🪝 HOOK RESOURCE LIBRARY — 动态效果资源库
 *
 * 借字当头·化为己用
 * 别人有的动态效果 → 提取参数 → 匹配资源库 → 生成我们自己的实现
 * 不复制代码·不偷素材·只提取"技术参数"·用自己的方式重现
 *
 * 资源库:
 *   ① 粒子系统 (Particles)       — 3种·参数化
 *   ② 渐变动效 (Gradients)       — 4种·参数化
 *   ③ 滚动揭示 (Scroll Reveal)   — 3种·参数化
 *   ④ 跑马灯 (Marquee)           — 2种·参数化
 *   ⑤ 视差效果 (Parallax)        — 2种·参数化
 *   ⑥ 数字递增 (Count Up)        — 1种·参数化
 *   ⑦ 手风琴 (Accordion)         — 1种·参数化
 *   ⑧ 悬浮效果 (Hover Effects)   — 4种·参数化
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════
// 资源库 — 每种动态效果的可参数化实现
// ═══════════════════════════════════════

const RESOURCE_LIBRARY = {

  // ① 粒子系统
  particles: {
    wave: {
      name: '波浪粒子', inspired: 'Stripe hero-wave',
      params: { count: 120, radius: '1-3.5', speed: 0.4, connectionDistance: 120, color: 'primary', opacity: '0.02-0.15' },
      generate: (p) => `
const c=document.getElementById('${p.canvasId||'particle-canvas'}');if(!c)return;
const ctx=c.getContext('2d');let w,h,particles=[];
function resize(){w=c.width=c.offsetWidth;h=c.height=c.offsetHeight}resize();window.addEventListener('resize',resize);
for(let i=0;i<${p.count||120};i++)particles.push({x:Math.random()*w,y:Math.random()*h,r:${p.minR||1}+Math.random()*${p.maxR||2.5},vx:(Math.random()-.5)*${p.speed||0.4},vy:(Math.random()-.5)*${p.speed||0.4},alpha:${p.minAlpha||0.05}+Math.random()*${p.maxAlpha||0.15}});
function draw(){ctx.clearRect(0,0,w,h);
particles.forEach(pt=>{pt.x+=pt.vx;pt.y+=pt.vy;if(pt.x<0)pt.x=w;if(pt.x>w)pt.x=0;if(pt.y<0)pt.y=h;if(pt.y>h)pt.y=0;ctx.beginPath();ctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2);ctx.fillStyle='rgba(${p.colorR||83},${p.colorG||58},${p.colorB||253},'+pt.alpha+')';ctx.fill()});
for(let i=0;i<particles.length;i++){for(let j=i+1;j<particles.length;j++){const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<${p.connectionDistance||120}){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle='rgba(${p.colorR||83},${p.colorG||58},${p.colorB||253},'+(0.02*(1-d/${p.connectionDistance||120}))+')';ctx.stroke()}}}}
requestAnimationFrame(draw)}draw();`
    },
    floating: {
      name: '浮动粒子', inspired: 'Vercel hero',
      params: { count: 80, radius: '2-6', speed: 0.2, connectionDistance: 0, color: 'accent', opacity: '0.03-0.08' },
      generate: (p) => `/* floating particles - ${p.count||80} dots, no connections */
const c=document.getElementById('${p.canvasId||'float-canvas'}');if(!c)return;
const ctx=c.getContext('2d');let w,h,pts=[];
function R(){w=c.width=c.offsetWidth;h=c.height=c.offsetHeight}R();window.addEventListener('resize',R);
for(let i=0;i<${p.count||80};i++)pts.push({x:Math.random()*w,y:Math.random()*h,r:${p.minR||2}+Math.random()*${p.maxR||4},vx:(Math.random()-.5)*${p.speed||0.2},vy:(Math.random()-.5)*${p.speed||0.2}});
(function D(){ctx.clearRect(0,0,w,h);pts.forEach(t=>{t.x+=t.vx;t.y+=t.vy;if(t.x<0)t.x=w;if(t.x>w)t.x=0;if(t.y<0)t.y=h;if(t.y>h)t.y=0;ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,Math.PI*2);ctx.fillStyle='rgba(${p.colorR||83},${p.colorG||58},${p.colorB||253},${p.minAlpha||0.03})';ctx.fill()});requestAnimationFrame(D)})();`
    },
    burst: {
      name: '爆发粒子', inspired: 'Linear.app effects',
      params: { count: 40, radius: '1-2', speed: 1.0, connectionDistance: 0, color: 'white', opacity: '0.1-0.3', life: 2000 },
      generate: (p) => `/* burst particles - short lived, fast */
const bursts=[];function addBurst(x,y){for(let i=0;i<${p.count||40};i++){const a=Math.random()*Math.PI*2,s=${p.speed||1}*(.5+Math.random());bursts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:${p.life||2000},born:Date.now(),r:${p.minR||1}+Math.random()*${p.maxR||1}})}}
const bc=document.getElementById('${p.canvasId||'burst-canvas'}');if(!bc)return;const bctx=bc.getContext('2d');let bw,bh;function bR(){bw=bc.width=bc.offsetWidth;bh=bc.height=bc.offsetHeight}bR();window.addEventListener('resize',bR);
(function bD(){bctx.clearRect(0,0,bw,bh);const n=Date.now();bursts.forEach((b,i)=>{const a=(n-b.born)/b.life;if(a>1){bursts.splice(i,1);return}b.x+=b.vx;b.y+=b.vy;bctx.beginPath();bctx.arc(b.x,b.y,b.r,0,Math.PI*2);bctx.fillStyle='rgba(${p.colorR||255},${p.colorG||255},${p.colorB||255},'+((${p.minAlpha||0.1}+${p.maxAlpha||0.2})*(1-a))+')';bctx.fill()});requestAnimationFrame(bD)})();addBurst(window.innerWidth/2,window.innerHeight/2);`
    }
  },

  // ② 渐变动效
  gradients: {
    radialShift: {
      name: '径向渐变位移', inspired: 'Stripe gradient section',
      generate: (p) => `
const gc=document.getElementById('${p.canvasId||'gradient-canvas'}');if(!gc)return;
const gctx=gc.getContext('2d');let gw,gh,gt=0;
function gR(){gw=gc.width=gc.offsetWidth;gh=gc.height=gc.offsetHeight}gR();window.addEventListener('resize',gR);
(function gD(){gt+=${p.speed||0.004};const g=gctx.createRadialGradient(gw/2+Math.sin(gt)*${p.shiftX||120},gh/2+Math.cos(gt)*${p.shiftY||100},0,gw/2,gh/2,Math.max(gw,gh)*${p.scale||0.7});
g.addColorStop(0,'rgba(${p.c1r||83},${p.c1g||58},${p.c1b||253},${p.c1a||0.12})');g.addColorStop(.5,'rgba(${p.c2r||243},${p.c2g||99},${p.c2b||243},${p.c2a||0.06})');g.addColorStop(1,'rgba(255,255,255,0)');
gctx.fillStyle=g;gctx.fillRect(0,0,gw,gh);requestAnimationFrame(gD)})();`
    },
    wave: {
      name: '波浪渐变', inspired: 'Stripe hero',
      generate: (p) => `.hero-bg{background:radial-gradient(circle at 50% 0%,${p.c1||'#7f7dfc'} 0%,${p.c2||'#f44bcc'} 25%,${p.c3||'#e5edf5'} 66%);background-size:200% 200%;animation:heroWave ${p.duration||8}s ease infinite}
@keyframes heroWave{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`
    },
    morph: {
      name: '变形渐变', inspired: 'Linear.app',
      generate: (p) => `.morph-bg{background:linear-gradient(${p.angle||135}deg,${p.c1||'#7c5cfc'},${p.c2||'#f44bcc'},${p.c3||'#ffcf5e'},${p.c4||'#81b81a'});background-size:300% 300%;animation:morphGradient ${p.duration||10}s ease infinite}
@keyframes morphGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`
    },
    noise: {
      name: '噪点纹理', inspired: 'Stripe grain texture',
      generate: () => `.grain-overlay{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px}`
    }
  },

  // ③ 滚动揭示
  scrollReveal: {
    fadeUp: {
      name: '淡入上浮', inspired: 'Stripe sections',
      generate: () => `const ro=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';ro.unobserve(e.target)}})},{threshold:.15});document.querySelectorAll('.reveal').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(30px)';el.style.transition='opacity .6s cubic-bezier(.25,.46,.45,.94),transform .6s cubic-bezier(.25,.46,.45,.94)';ro.observe(el)})`
    },
    stagger: {
      name: '逐项揭示', inspired: 'Stripe bento',
      generate: (p) => `document.querySelectorAll('${p.selector||'.stagger-item'}').forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(20px)';el.style.transition='opacity .5s ease '+(i*${p.delay||0.1})+'s,transform .5s ease '+(i*${p.delay||0.1})+'s';const o=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';o.unobserve(e.target)}})});o.observe(el)})`
    },
    scaleIn: {
      name: '缩放入场', inspired: 'Stripe cards',
      generate: () => `const sio=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='scale(1)';sio.unobserve(e.target)}})},{threshold:.2});document.querySelectorAll('.scale-reveal').forEach(el=>{el.style.opacity='0';el.style.transform='scale(.95)';el.style.transition='opacity .5s cubic-bezier(.25,.46,.45,.94),transform .5s cubic-bezier(.25,.46,.45,.94)';sio.observe(el)})`
    }
  },

  // ④ 跑马灯
  marquee: {
    infinite: {
      name: '无限滚动', inspired: 'Stripe logo carousel',
      generate: (p) => `.marquee-wrap{overflow:hidden;position:relative}
.marquee-wrap::before,.marquee-wrap::after{content:'';position:absolute;top:0;bottom:0;width:${p.fadeWidth||120}px;z-index:1;pointer-events:none}
.marquee-wrap::before{left:0;background:linear-gradient(to right,${p.bgColor||'#fff'},transparent)}
.marquee-wrap::after{right:0;background:linear-gradient(to left,${p.bgColor||'#fff'},transparent)}
.marquee-track{display:flex;gap:${p.gap||48}px;animation:marquee ${p.duration||30}s linear infinite;width:max-content}
.marquee-track>*{flex-shrink:0;white-space:nowrap}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`
    },
    bounce: {
      name: '反弹滚动', inspired: 'Apple product carousel',
      generate: (p) => `.bounce-track{display:flex;gap:${p.gap||24}px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.bounce-track::-webkit-scrollbar{display:none}
.bounce-track>*{scroll-snap-align:start;flex-shrink:0;width:${p.itemWidth||300}px}`
    }
  },

  // ⑤ 视差
  parallax: {
    mouseFollow: {
      name: '鼠标跟随', inspired: 'Stripe hero parallax',
      generate: () => `document.querySelector('.parallax-container')?.addEventListener('mousemove',e=>{const x=(e.clientX/window.innerWidth-.5)*20,y=(e.clientY/window.innerHeight-.5)*20;document.querySelectorAll('.parallax-layer').forEach((el,i)=>{const d=(i+1)*.5;el.style.transform='translate('+(x*d)+'px,'+(y*d)+'px)'})})`
    },
    scrollSpeed: {
      name: '滚动视差', inspired: 'Apple product pages',
      generate: () => `window.addEventListener('scroll',()=>{const sy=window.scrollY;document.querySelectorAll('.parallax-bg').forEach(el=>{el.style.transform='translateY('+(sy*0.5)+'px)'});document.querySelectorAll('.parallax-fg').forEach(el=>{el.style.transform='translateY('+(-sy*0.2)+'px)'})},{passive:true})`
    }
  },

  // ⑥ 计数器
  countUp: {
    animate: {
      name: '数字递增', inspired: 'Stripe stats',
      generate: () => `const co=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){const el=e.target,t=parseInt(el.getAttribute('data-target'));if(!t)return;let c=0;const s=Math.ceil(t/40);const i=setInterval(()=>{c+=s;if(c>=t){el.textContent=t.toLocaleString();clearInterval(i)}else{el.textContent=c.toLocaleString()}},30);co.unobserve(el)}})},{threshold:.5});document.querySelectorAll('.count-up').forEach(el=>{const t=parseInt(el.textContent.replace(/[^0-9]/g,''));if(t){el.setAttribute('data-target',t);el.textContent='0';co.observe(el)}})`
    }
  },

  // ⑦ 手风琴
  accordion: {
    smooth: {
      name: '平滑展开', inspired: 'Stripe enterprise accordion',
      generate: () => `document.querySelectorAll('.accordion-header').forEach(h=>{h.addEventListener('click',()=>{const item=h.parentElement;item.classList.toggle('open')})})`
    }
  },

  // ⑧ 悬浮效果
  hoverEffects: {
    lift: { name:'卡片抬起', css:'.hover-lift{transition:transform .3s,box-shadow .3s}.hover-lift:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.08)}' },
    glow: { name:'发光边框', css:'.hover-glow{transition:border-color .3s,box-shadow .3s}.hover-glow:hover{border-color:var(--purple,#533afd);box-shadow:0 0 20px rgba(83,58,253,.1)}' },
    scale: { name:'微放大', css:'.hover-scale{transition:transform .3s}.hover-scale:hover{transform:scale(1.02)}' },
    reveal: { name:'内容揭示', css:'.hover-reveal .hidden-content{opacity:0;transition:opacity .3s}.hover-reveal:hover .hidden-content{opacity:1}' }
  }
};

// ═══════════════════════════════════════
// 智能匹配引擎 — 根据提取的参数·匹配最佳资源
// ═══════════════════════════════════════
function matchResources(extractedDNA) {
  const matches = [];

  // 检测粒子 → 匹配粒子系统
  if (extractedDNA.canvases > 3) matches.push({ type:'particles', variant:'wave', confidence:'high', reason:'多个Canvas+粒子密度高' });
  else if (extractedDNA.canvases > 0) matches.push({ type:'particles', variant:'floating', confidence:'medium', reason:'有Canvas·简单粒子' });

  // 检测渐变 → 匹配渐变动效
  if (extractedDNA.gradients?.some(g => g.includes('radial-gradient'))) matches.push({ type:'gradients', variant:'radialShift', confidence:'high', reason:'径向渐变检测' });
  if (extractedDNA.gradients?.some(g => g.includes('linear-gradient'))) matches.push({ type:'gradients', variant:'morph', confidence:'medium', reason:'线性渐变检测' });

  // 检测跑马灯 → 匹配跑马灯
  if (extractedDNA.carousels > 5) matches.push({ type:'marquee', variant:'infinite', confidence:'high', reason:'大量轮播元素' });

  // 检测滚动 → 匹配滚动揭示
  if (extractedDNA.scrollElements > 0) matches.push({ type:'scrollReveal', variant:'fadeUp', confidence:'medium', reason:'滚动相关class检测' });

  // 检测数字 → 匹配计数器
  if (extractedDNA.hasStats) matches.push({ type:'countUp', variant:'animate', confidence:'high', reason:'统计数字区域' });

  // 悬浮效果 → 匹配hover
  if (extractedDNA.hoverElements > 5) matches.push({ type:'hoverEffects', variant:'lift', confidence:'medium', reason:'多个hover效果' });

  // 手风琴 → 匹配手风琴
  if (extractedDNA.hasAccordion) matches.push({ type:'accordion', variant:'smooth', confidence:'high', reason:'手风琴结构检测' });

  return matches;
}

// ═══════════════════════════════════════
// 生成完整资源注入代码
// ═══════════════════════════════════════
function generateResourceInjection(matches, options = {}) {
  const cssBlocks = [];
  const jsBlocks = [];

  for (const match of matches) {
    const resource = RESOURCE_LIBRARY[match.type]?.[match.variant];
    if (!resource) continue;

    if (resource.css) cssBlocks.push(resource.css);
    if (resource.generate) {
      const code = resource.generate(options);
      if (code.includes('@keyframes') || code.includes('animation') || code.includes('.hover-') || code.includes('.marquee-') || code.includes('.parallax-') || code.includes('.grain-') || code.includes('.morph-') || code.includes('.hero-bg')) {
        cssBlocks.push(code);
      } else {
        jsBlocks.push(code);
      }
    }
  }

  return { css: cssBlocks.join('\n'), js: jsBlocks.join('\n'), count: matches.length };
}

// CLI
const cmd = process.argv[2];
switch (cmd) {
  case 'library':
    console.log('🪝 Hook Resource Library · 8大类·20种动态效果\n');
    for (const [cat, variants] of Object.entries(RESOURCE_LIBRARY)) {
      console.log(`  ${cat}:`);
      for (const [key, v] of Object.entries(variants)) {
        console.log(`    ${key.padEnd(14)} ${v.name.padEnd(12)} ← ${v.inspired}`);
      }
    }
    console.log('\n  全部自研·不侵权·参数化·可调度');
    break;

  case 'match': {
    const dna = JSON.parse(fs.readFileSync(0, 'utf8'));
    const matches = matchResources(dna);
    console.log(JSON.stringify(matches, null, 2));
    break;
  }

  case 'inject': {
    const dna = JSON.parse(fs.readFileSync(0, 'utf8'));
    const matches = matchResources(dna);
    const injection = generateResourceInjection(matches);
    console.log(JSON.stringify(injection, null, 2));
    break;
  }

  default:
    console.log('🪝 Hook Resource Library\n  library  查看全部资源\n  match    从stdin读取DNA·输出匹配\n  inject   从stdin读取DNA·生成完整注入代码');
}
