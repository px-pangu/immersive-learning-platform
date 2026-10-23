import express from 'express'
import cors from 'cors'

// 统一 LLM 调用（支持 deepseek / 其他 OpenAI 兼容 / 本地 mock）
// 注意：llm.js 内部自己先跑 dotenv.config()，必须在任何 process.env 读取之前
import { callLLM, currentProvider } from './llm.js'

// 业务路由（auth / progress / community）
import authRouter from './routes/auth.js'
import progressRouter from './routes/progress.js'
import communityRouter from './routes/community.js'

const PORT = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use((req, _res, next) => { console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`); next() })

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, provider: currentProvider(), model: process.env.AI_MODEL || 'deepseek-chat' })
})

// === 业务路由 ===
app.use('/api/auth', authRouter)
app.use('/api/progress', progressRouter)
app.use('/api/community', communityRouter)

// --- AI 路由 ---

// POST /api/ai/chat  通用聊天
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, system, temperature = 0.7 } = req.body || {}
    if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: 'messages required' })
    const reply = await callLLM({ messages, system, temperature })
    res.json({ reply, provider: currentProvider() })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/ai/qa  随堂答疑（AIInstantQA）
app.post('/api/ai/qa', async (req, res) => {
  try {
    const { question, subject, chapterTitle, style = 'simple' } = req.body || {}
    if (!question) return res.status(400).json({ error: 'question required' })

    const styleDesc = {
      simple: '用最简单的话解释，类比生活场景',
      analogy: '给一个生动的类比',
      deep: '深入底层原理讲清楚',
      exercise: '最后给一道小练习，带答案提示',
    }[style] || '简单解释'

    const systemPrompt = `你是一名耐心的助教。当前章节：${chapterTitle || '未知'}（学科：${subject || '未知'}）。
请按以下风格回答：${styleDesc}。
要求：
- 分点清晰（用 1️⃣ 2️⃣ 3️⃣ 等 emoji 序号）
- 控制在 300 字以内
- 结尾问「需要我换种方式讲一遍，还是出道题试试？」`

    const reply = await callLLM({
      system: systemPrompt,
      messages: [{ role: 'user', content: question }],
      temperature: 0.7,
    })
    res.json({ reply, provider: currentProvider() })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/ai/writing-feedback  写作评分（强制 JSON）
app.post('/api/ai/writing-feedback', async (req, res) => {
  try {
    const { text, prompt } = req.body || {}
    if (!text) return res.status(400).json({ error: 'text required' })

    const systemPrompt = `你是写作评委。请严格输出以下 JSON（不要任何解释文字，纯 JSON）：
{
  "overall": 0-100,
  "grade": "优秀|良好|中等|及格|不及格",
  "criteria": [{"name":"维度名","score":0-20,"comment":"短评"}],
  "strengths": ["最多3条优点"],
  "issues": ["最多3条具体问题"],
  "rewrite": "一段改写后的范文（100-300字）"
}
评分维度：内容充实度、结构逻辑、语言表达、语法正确、创意亮点。`

    const raw = await callLLM({
      system: systemPrompt,
      messages: [
        ...(prompt ? [{ role: 'user', content: `写作题目：${prompt}` }] : []),
        { role: 'user', content: `学生的作文：\n${text}\n\n请评分，严格按要求返回 JSON。` },
      ],
      temperature: 0.4,
      jsonMode: true,
    })

    let data
    try {
      // 去掉可能的 ```json 代码块包裹
      const cleaned = raw.replace(/^```(json)?\s*/i, '').replace(/```\s*$/, '').trim()
      data = JSON.parse(cleaned)
    } catch {
      // JSON 解析失败 → 把原文塞进 rewrite 兜底，前端能显示
      data = {
        overall: 60, grade: '及格',
        criteria: [{ name: '综合', score: 12, comment: 'AI 输出解析异常' }],
        strengths: [], issues: ['评分数据解析失败，请稍后重试'],
        rewrite: raw,
      }
    }
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/ai/npc  角色扮演 NPC
app.post('/api/ai/npc', async (req, res) => {
  try {
    const { subject, npcName, npcPersona, history = [], userInput } = req.body || {}
    if (!npcName || !userInput) return res.status(400).json({ error: 'npcName & userInput required' })

    const systemPrompt = `你是【${npcName}】，在一次教育场景中扮演角色。人设：${npcPersona || '自然的对话者'}。
严格输出 JSON（不要任何解释）：
{
  "reply": "你对玩家输入的自然回应，口语化",
  "scoreDelta": 0 或 1 或 -1（答对+1，答错-1，中性0）,
  "shouldEnd": true 或 false（true 表示玩家输/赢了，该结束了）,
  "endingTitle": "结束标题，仅 shouldEnd=true 时填写"
}
当前学科主题：${subject || '综合'}。`

    const messages = [
      ...history,
      { role: 'user', content: userInput },
    ]
    const raw = await callLLM({ system: systemPrompt, messages, temperature: 0.8, jsonMode: true })

    let data
    try {
      const cleaned = raw.replace(/^```(json)?\s*/i, '').replace(/```\s*$/, '').trim()
      data = JSON.parse(cleaned)
    } catch {
      data = { reply: raw, scoreDelta: 0, shouldEnd: false, endingTitle: '' }
    }
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`\n🚀 后端启动：http://localhost:${PORT}`)
  console.log(`🤖 LLM Provider: ${currentProvider()}`)
  console.log(`📦 Model: ${process.env.AI_MODEL || '(default)'}`)
  console.log(`✅ health:  http://localhost:${PORT}/api/health\n`)
})
