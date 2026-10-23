// LLM 统一代理层 —— 默认 OpenAI 兼容格式（DeepSeek / 硅基流动 / one-api 等都走这个）
// 没配 AI_API_KEY 时自动走本地 mock engine，保证 demo 不中断

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// === 必须在任何 import 之前执行！ES module import 会提升并先于顶层代码运行 ===
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) {
  const p = path.join(projectRoot, f)
  if (fs.existsSync(p)) { dotenv.config({ path: p }); break }
}

console.log(`[llm] AI_API_KEY=${process.env.AI_API_KEY ? '✓ loaded (' + process.env.AI_API_KEY.length + ' chars)' : '✗ missing (will use mock)'}`)

function currentProvider() {
  return process.env.AI_API_KEY ? 'deepseek' : 'mock'
}

// ============ 真实 LLM：OpenAI 兼容格式 ============
async function callOpenAICompat({ system, messages, temperature = 0.7, jsonMode = false }) {
  const baseUrl = (process.env.AI_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/$/, '')
  const model = process.env.AI_MODEL || 'deepseek-chat'
  const apiKey = process.env.AI_API_KEY

  const payload = {
    model,
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages,
    ],
    temperature,
    stream: false,
  }
  // JSON mode：DeepSeek 和 OpenAI 都支持 response_format
  if (jsonMode) {
    payload.response_format = { type: 'json_object' }
  }

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000),
  })

  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`LLM ${resp.status}: ${text.slice(0, 300)}`)
  }
  const data = await resp.json()
  const content = data?.choices?.[0]?.message?.content || ''
  return content
}

// ============ 本地 Mock Engine（无 Key 时 fallback） ============
function mockEngine({ system = '', messages }) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || ''

  // JSON mode：回一个假的评分/回复
  if (system.includes('JSON') || system.includes('json')) {
    if (system.includes('写作') || system.includes('overall')) {
      return JSON.stringify({
        overall: 72, grade: '中等',
        criteria: [
          { name: '内容', score: 15, comment: '基本切题但不够深入' },
          { name: '结构', score: 14, comment: '段落分明但过渡稍生硬' },
          { name: '语言', score: 15, comment: '有几处病句需修正' },
          { name: '语法', score: 16, comment: '整体正确，细节待打磨' },
          { name: '创意', score: 12, comment: '可以更有个人特色' },
        ],
        strengths: ['主题明确', '字数达标', '开头有吸引力'],
        issues: ['缺少具体例子', '句式重复', '结尾仓促'],
        rewrite: lastUser.length > 30 ? lastUser : '（mock 模式下的示范改写）这里是一段示例文字，请接入真实 AI 后重新生成。',
      })
    }
    if (system.includes('npc') || system.includes('角色扮演')) {
      return JSON.stringify({ reply: '（Mock NPC）嗯，你说的我想想，有道理～', scoreDelta: 0, shouldEnd: false, endingTitle: '' })
    }
  }

  // 普通 QA mock
  const q = lastUser.toLowerCase()
  if (q.includes('python') || q.includes('函数')) {
    return `好问题！Python 里的函数：\n1️⃣ 核心概念：一段可复用的代码块，用 def 定义\n2️⃣ 类比：像麦当劳套餐——说个名字就拿到一套东西\n3️⃣ 小练习：写一个 is_prime(n) 判断素数试试？\n\n换种方式讲一遍还是出道题？`
  }
  if (q.includes('导数') || q.includes('数学')) {
    return `导数就是"变化快慢"：\n1️⃣ 核心：f'(x) = lim(h→0) [f(x+h)-f(x)]/h\n2️⃣ 类比：汽车仪表盘的瞬时速度\n3️⃣ 小练习：求 x³ 在 x=2 处的导数？\n\n换种方式还是出道题？`
  }
  return `根据你提到的内容：\n1️⃣ 核心概念：${lastUser.slice(0, 20)}...\n2️⃣ 类比：可以把它类比成你熟悉的某个工具\n3️⃣ 实践建议：动手写 20 行代码试试\n\n换种方式讲一遍还是出道题试试？`
}

// ============ 统一入口 ============
export async function callLLM(opts) {
  const key = process.env.AI_API_KEY
  if (key) {
    try {
      return await callOpenAICompat(opts)
    } catch (e) {
      console.warn(`[LLM] 真实 API 失败，降级 mock：`, e.message)
      return mockEngine(opts)
    }
  }
  return mockEngine(opts)
}

export { currentProvider }
