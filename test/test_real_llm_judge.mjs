import assert from 'node:assert';
import { BufferManager } from '../index.js';

console.log('=== 测试真实 Antigravity Gemini 轻量初筛模型 ===\n');

const mockConfig = {
  enabled: true,
  idle_timeout_sec: 1,
  mention_wait_sec: 1,
  max_wait_sec: 5,
  max_buffer_count: 5,
  active_context_sec: 60,
  max_file_size_mb: 10,
  lightweight_model: 'gemini-3.5-flash-lite',
  mention_keywords: '哈基米,(@you)',
};

const mockLogger = {
  info: (msg) => console.log('   [LOG:INFO]', msg),
  warn: (msg) => console.log('   [LOG:WARN]', msg),
  error: (msg) => console.error('   [LOG:ERROR]', msg),
  debug: () => {},
};

const bm = new BufferManager({}, () => mockConfig, mockLogger);

// Case 1: 群友在聊游戏配置
const bufNo = {
  messages: [
    { senderId: '1001', senderName: '张三', content: '我这显卡跑黑神话只有40帧' },
    { senderId: '1002', senderName: '李四', content: '把超分辨率关了试试看' },
  ],
  lastBotReplyText: '',
};

console.log('测试用例 1: 闲聊（显卡游戏讨论），期望 -> false (NO)');
const res1 = await bm.callLightweightModelJudge(bufNo, false);
console.log('结果 1:', res1);
assert.strictEqual(res1, false, '闲聊不应触发回复');

// Case 2: 群友在询问机器人
const bufYes = {
  messages: [
    { senderId: '1003', senderName: '王五', content: '哈基米你在吗？帮我查一下今天天气' },
  ],
  lastBotReplyText: '',
};

console.log('\n测试用例 2: 询问（哈基米你在吗），期望 -> true (YES)');
const res2 = await bm.callLightweightModelJudge(bufYes, false);
console.log('结果 2:', res2);
assert.strictEqual(res2, true, '直接询问必须触发回复');

console.log('\n=== 真实轻量模型初筛验证 100% 通过！===');
