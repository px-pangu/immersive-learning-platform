import express from 'express'
import { chat } from '../llm.js'

const router = express.Router()

// POST /api/ai/chat
// body: { messages: [{role, content}], system?, temperature? }
router.post('/chat', async (req, res) => {
  try {
    const { messages = [], system, temperature } = req.body || {}
    if (!messages.length) return res.status(400).json({ error: 'messages required' })
    const reply = await chat({ system, messages, temperature })
    res.json({ reply, provider: process.env.AI_PROVIDER || 'mock' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/ai/qa — 随堂答疑（AIInstantQA）
// body: { question, subject='通用', style='simple', chapterTitle }
router.post('/qa', async (req, res) => {
  try {
    const { question, subject = '通用', style = 'simple', chapterTitle } = req.body || {}
    if (!question) return res.status(400).json({ error: 'question required' })

    const stylePrompts = {
      simple: '用最简单的人话解释，像给一个没接触过的同学讲一样',
      analogy: '用一个生活里的类比来帮助理解',
      deep: '从原理层面深入讲解，解释底层机制',
      exercise: '不动手，先出一道和这个知识点相关的练习题',
    }

    const system = `你是一个"${subject}"课程的 AI 助教，当前在讲《${chapterTitle || '某个章节'}》。
回答必须简洁（100-200 字），用中文。${stylePrompts[style] || stylePrompts.simple}`

    const reply = await chat({ system, messages: [{ role: 'user', content: question }] })
    res.json({ reply, provider: process.env.AI_PROVIDER || 'mock' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/ai/writing-feedback
// body: { text, prompt='', subject='' }
// Returns structured JSON (grade + criteria + issues)
router.post('/writing-feedback', async (req, res) => {
  try {
    const { text, prompt = '', subject = '' } = req.body || {}
    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: 'text too short' })
    }
    const system = `你是一名"${subject || '语文/英语'}"老师，正在批改这道作文题："${prompt || '通用作文题'}"。
必须返回严格的 JSON 对象（不要 markdown 代码块），格式：
{
  "overall": 0-100 的整数总分,
  "grade": "A 优秀" / "B 良好" / "C 及格" / "D 需改进" / "F 不及格",
  "criteria": [
    {"name": "内容充实度", "score": 0-25, "feedback": "一句话评价"},
    {"name": "逻辑结构", "score": 0-25, "feedback": "一句话评价"},
    {"name": "论证严密", "score": 0-25, "feedback": "一句话评价"},
    {"name": "语言表达", "score": 0-25, "feedback": "一句话评价"}
  ],
  "strengths": ["亮点1", "亮点2"],
  "issues": ["问题1", "问题2"],
  "rewrite": "改写后的片段（100-200字示例）"
}`
    const reply = await chat({
      system,
      messages: [{ role: 'user', content: text }],
      temperature: 0.4,
      jsonMode: true,
    })
    // 确保返回的是合法 JSON
    let parsed
    try { parsed = JSON.parse(reply) } catch { parsed = JSON.parse(reply.replace(/```json|```/g, '').trim()) }
    res.json(parsed)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/ai/npc
// body: { subject, scenarioId, history: [{role, text}], npcName, userInput }
// Returns: { reply, scoreDelta (-2..+2), shouldEnd, endingTitle? }
router.post('/npc', async (req, res) => {
  try {
    const { subject = '通用', scenarioId = '', history = [], npcName = 'AI NPC', userInput = '' } = req.body || {}
    if (!userInput) return res.status(400).json({ error: 'userInput required' })

    const system = `你正在扮演"${subject}"情景对话中的 NPC "${npcName}"。
对话 ID：${scenarioId}
你需要以 NPC 的身份自然回应玩家的话。返回严格 JSON：
{
  "reply": "NPC 说的话（不超过 120 字，中文或英文依场景而定）",
  "scoreDelta": -2 到 +2 的整数（根据玩家回应的质量打分，正面 + 负面 - 平庸 0）,
  "shouldEnd": true/false（是否应该结束对话）,
  "endingTitle": "如果 shouldEnd=true，一句话总结"
}
仅返回 JSON，不要任何解释。`

    const messages = [
      ...history.map((m) => ({ role: m.role, content: m.text })),
      { role: 'user', content: userInput },
    ]

    const reply = await chat({ system, messages, temperature: 0.8, jsonMode: true })
    let parsed
    try { parsed = JSON.parse(reply) } catch { parsed = JSON.parse(reply.replace(/```json|```/g, '').trim()) }
    res.json(parsed)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
