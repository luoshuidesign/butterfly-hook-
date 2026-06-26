# 🪝 Hook · 弱点自白书

> 诚实面对每一个弱点。每一个弱点都是下一次蝶变的起点。

---

## vs ai-website-cloner (19,300★)

```
他们有的                    Hook有吗    差距
──────────────────────────────────────────────
5阶段自动流水线              🟡 定义有·未自动  需自动串联Recon→QA
并行git worktree构建         ❌ 没有         需实现
自动化视觉diff               🟡 有引擎·未集成  需集成pixelmatch
Next.js 16输出               ❌ 没有         需添加Next.js模板
13+ AI平台支持               ❌ 仅Claude     需多平台适配
Chrome MCP集成               ❌ 用Playwright  考虑MCP
$4-9/次 (Sonnet)             ✅ $0 免费      优势！
```

## vs dembrandt (1,900★)

```
他们有的                    Hook有吗    差距
──────────────────────────────────────────────
MCP服务器                    ❌ 没有         需构建MCP server
PDF品牌指南                  ❌ 没有         需PDF生成
整站sitemap爬取              🟡 单页·未爬整站 需多页爬取
隐身模式                     🟡 部分         需完整stealth
npm包发布                    ❌ 没有         需发布npm
npx一键命令                  🟡 CLI有·未npm  需npm发布
```

## vs design-extract (1,000+★)

```
他们有的                    Hook有吗    差距
──────────────────────────────────────────────
VS Code扩展                  ❌ 没有         平台依赖
Chrome扩展                   ❌ 没有         平台依赖
Figma插件                    ❌ 没有         平台依赖
11个斜杠命令                 ❌ 没有         可补·非核心
GitHub Action                ❌ 没有         需添加CI
SwiftUI/Compose/Flutter输出  ✅ 已有         打平！
WordPress输出                ❌ 没有         可补
```

## vs clone-architect (9,300★)

```
他们有的                    Hook有吗    差距
──────────────────────────────────────────────
公开pixelmatch基准           ❌ 没有         需发布基准数据
16节DESIGN.md                ❌ 只有基础版    需扩写
截图验证声明                 🟡 有截图·未声明 需公开验证
```

## vs SkillUI (878★)

```
他们有的                    Hook有吗    差距
──────────────────────────────────────────────
零AI·纯静态分析              ❌ 依赖浏览器    可补静态模式
.skill ZIP打包               ❌ 没有         打包格式差异
Ultra模式(Playwright)        ✅ 已有         打平！
```

## vs taste-skill (106★)

```
他们有的                    Hook有吗    差距
──────────────────────────────────────────────
设计trade-off深度推理        🟡 有·不够深    需增强REASON层
Cursor/Windsurf规则导出      ❌ 没有         可补
```

## vs decant (9,300★)

```
他们有的                    Hook有吗    差距
──────────────────────────────────────────────
Rust性能                     ❌ Node.js     语言差异·非核心
AI-ready context.md          ❌ 没有         需添加
manifest.json                ✅ 已有         打平！
```

## vs brandmd

```
他们有的                    Hook有吗    差距
──────────────────────────────────────────────
30+ AI平台支持               ❌ 仅Claude     可补·非核心
--agent自动SKILL.md          ❌ 没有         可补
Tailwind @theme格式          ❌ 没有         需添加
```

---

## 弱点汇总·优先级

```
🔴 致命 (必须立刻补):
  1. 5阶段自动流水线执行  (定义有·没跑起来)
  2. 自动化visual diff     (引擎有·没集成)
  3. MCP服务器            (dembrandt/design-extract都有)
  4. 公开保真度基准       (clone-architect有·我们没有)
  5. npm发布              (所有对手都在npm上)

🟡 重要 (近期补):
  6. Next.js 16模板输出
  7. Tailwind @theme格式
  8. 16节DESIGN.md
  9. 整站多页爬取
  10. PDF品牌指南
  11. GitHub Action CI
  12. 隐身模式完善

🟢 增强 (有替代或非核心):
  13. 30+ AI平台支持 (专注Claude即可)
  14. Rust性能 (Node.js够用)
  15. .skill ZIP打包 (格式差异)
  16. VS Code/Chrome/Figma扩展 (平台依赖·未来产品化)
```

---

> **弱点 = 进化方向。每一个❌都是下一次蝶变的触发点。**
> **承认弱点·分析弱点·攻克弱点。这就是蝶变。** 🦋
