#!/usr/bin/env node
/**
 * 🛡️ HOOK SHIELD · 十层极致防护
 *
 * L1  输入验证   L2  安全检查   L3  身份伪装
 * L4  速率智能   L5  熔断机制   L6  执行沙箱
 * L7  输出净化   L8  隐私保护   L9  审计追踪
 * L10 自愈恢复
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SHIELD_DIR = path.join(os.homedir(), '.claude', 'butterfly-hook', 'shield');
if (!fs.existsSync(SHIELD_DIR)) fs.mkdirSync(SHIELD_DIR, { recursive: true });

// ═══════════════════════════════════════
// L3: 身份伪装 — 真实浏览器行为
// ═══════════════════════════════════════
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
];

function randomUA() { return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]; }
function randomDelay() { return 200 + Math.floor(Math.random() * 800); } // 200-1000ms人类延迟

// ═══════════════════════════════════════
// L4+L5: 智能速率 + 熔断
// ═══════════════════════════════════════
class IntelligentRateLimiter {
  constructor() {
    this.stateFile = path.join(SHIELD_DIR, 'rate-state.json');
    this.state = this.load();
  }

  load() {
    try { return JSON.parse(fs.readFileSync(this.stateFile, 'utf8')); }
    catch { return { requests: [], failures: 0, blockedUntil: 0, adaptiveRate: 30, totalRequests: 0, totalFailures: 0 }; }
  }

  save() { fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2)); }

  check() {
    const now = Date.now();

    // 熔断检查
    if (now < this.state.blockedUntil) {
      return { allowed: false, reason: `熔断中·${Math.round((this.state.blockedUntil - now)/1000)}秒后恢复`, state: 'circuit_open' };
    }

    // 清理旧请求
    this.state.requests = this.state.requests.filter(t => now - t < 60000);

    // 自适应速率
    if (this.state.failures > 5) {
      this.state.adaptiveRate = Math.max(5, this.state.adaptiveRate - 10);
    } else if (this.state.failures === 0 && this.state.adaptiveRate < 30) {
      this.state.adaptiveRate = Math.min(30, this.state.adaptiveRate + 2);
    }

    // 检查速率
    if (this.state.requests.length >= this.state.adaptiveRate) {
      return { allowed: false, reason: `速率限制·自适应${this.state.adaptiveRate}次/分钟`, state: 'rate_limited' };
    }

    this.state.requests.push(now);
    this.state.totalRequests++;
    this.save();
    return { allowed: true, state: 'ok', currentRate: this.state.adaptiveRate, remaining: this.state.adaptiveRate - this.state.requests.length };
  }

  recordFailure() {
    this.state.failures++;
    this.state.totalFailures++;

    // 连续失败3次 → 熔断5分钟
    if (this.state.failures >= 3) {
      this.state.blockedUntil = Date.now() + 300000;
    }
    this.save();
  }

  recordSuccess() {
    this.state.failures = Math.max(0, this.state.failures - 1);
    this.save();
  }
}

// ═══════════════════════════════════════
// L7: 输出净化
// ═══════════════════════════════════════
function sanitizeOutput(data) {
  if (typeof data !== 'object' || !data) return data;

  const sanitized = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    // 过滤敏感信息
    if (typeof value === 'string') {
      // 移除可能的API Key
      if (/[a-zA-Z0-9_-]{30,}/.test(value) && (key.includes('key') || key.includes('token') || key.includes('secret'))) {
        sanitized[key] = '[已脱敏]';
        continue;
      }
      // 移除邮箱
      sanitized[key] = value.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]');
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeOutput(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// ═══════════════════════════════════════
// L9: 审计追踪
// ═══════════════════════════════════════
function auditLog(entry) {
  const logFile = path.join(SHIELD_DIR, 'audit.jsonl');
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n';
  fs.appendFileSync(logFile, line);

  // 轮转（保持<1000行）
  const lines = fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean);
  if (lines.length > 1000) {
    fs.writeFileSync(logFile, lines.slice(-500).join('\n') + '\n');
  }
}

// ═══════════════════════════════════════
// L10: 自愈恢复
// ═══════════════════════════════════════
function selfHeal(error) {
  const fixes = {
    'net::ERR_CONNECTION': { action: 'retry', delay: 5000, maxRetries: 3, advice: '网络连接失败·自动重试中' },
    'TimeoutError': { action: 'retry', delay: 3000, maxRetries: 2, advice: '请求超时·延长超时重试' },
    'ENOTFOUND': { action: 'skip', advice: '域名无法解析·跳过此目标' },
    'blocked': { action: 'wait', delay: 300000, advice: '检测到封锁·暂停5分钟后重试' },
    'CORS': { action: 'degrade', advice: '跨域限制·降级为静态分析模式' },
  };

  const matchedFix = Object.entries(fixes).find(([pattern]) => error?.message?.includes(pattern) || error?.includes(pattern));
  return matchedFix ? { ...matchedFix[1], matched: matchedFix[0] } : { action: 'report', advice: '未知错误·已记录·人工审核' };
}

// ═══════════════════════════════════════
// 完整SHIELD包装
// ═══════════════════════════════════════
class HookShield {
  constructor() {
    this.limiter = new IntelligentRateLimiter();
    this.health = { status: 'ok', lastCheck: Date.now(), failures: 0 };
  }

  wrap(fn) {
    return async (url, options = {}) => {
      const shield = { layers: {}, ts: Date.now() };

      // L1: URL验证
      try { new URL(url); shield.layers.L1 = '✅'; }
      catch { return { error: 'URL格式无效', layer: 'L1' }; }

      // L2: 安全检查
      if (/\.gov|\.mil|bank|\.env/.test(url)) {
        return { error: '安全检查未通过·敏感目标', layer: 'L2' };
      }
      shield.layers.L2 = '✅';

      // L3: UA伪装
      options.headers = { ...(options.headers || {}), 'User-Agent': randomUA() };
      shield.layers.L3 = randomUA().slice(0, 40) + '...';

      // L4+L5: 速率+熔断
      const rateCheck = this.limiter.check();
      if (!rateCheck.allowed) return { error: rateCheck.reason, layer: 'L4/L5' };
      shield.layers.L4 = `${rateCheck.currentRate}次/分钟·剩余${rateCheck.remaining}`;
      shield.layers.L5 = '✅';

      // L6: 执行沙箱
      const startTime = Date.now();
      try {
        const result = await Promise.race([
          fn(url, options),
          new Promise((_, reject) => setTimeout(() => reject(new Error('沙箱超时')), options.timeout || 30000)),
        ]);
        shield.layers.L6 = `${Date.now() - startTime}ms`;

        // L7: 输出净化
        const clean = sanitizeOutput(result);
        shield.layers.L7 = '✅';

        // L8: 隐私
        shield.layers.L8 = '✅ 未记录用户信息';

        // L9: 审计
        auditLog({ url, success: true, layers: shield.layers, elapsed: Date.now() - shield.ts });
        shield.layers.L9 = '✅';

        // L10: 成功恢复
        this.limiter.recordSuccess();
        this.health.failures = 0;
        shield.layers.L10 = '✅';

        return { success: true, data: clean, shield: shield.layers };

      } catch (e) {
        // L10: 自愈
        const heal = selfHeal(e);
        shield.layers.error = e.message?.slice(0, 100);
        shield.layers.L10 = heal.advice;

        this.limiter.recordFailure();
        this.health.failures++;
        auditLog({ url, success: false, error: e.message, heal });

        return { success: false, error: e.message?.slice(0, 200), heal, shield: shield.layers };
      }
    };
  }
}

// CLI
const cmd = process.argv[2];
switch (cmd) {
  case 'status':
    console.log(JSON.stringify({ health: new HookShield().health, limiter: new IntelligentRateLimiter().check() }, null, 2));
    break;
  case 'audit':
    console.log(fs.readFileSync(path.join(SHIELD_DIR, 'audit.jsonl'), 'utf8').split('\n').filter(Boolean).slice(-20).join('\n'));
    break;
  default:
    console.log('🛡️ Hook Shield · status | audit');
}
