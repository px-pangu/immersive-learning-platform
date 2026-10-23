// POST /api/progress/mark  — 标记章节完成 + 发 XP + 触发成就
// GET  /api/progress/list   — 当前用户所有进度
import express from 'express'
import db from '../db.js'
import { optionalAuth } from '../auth-helper.js'

const router = express.Router()

router.use(optionalAuth)

const XP_PER_CHAPTER = 10
const LEVEL_STEP = 100

router.post('/mark', optionalAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' })
  const { courseId, chapterId, score = 0 } = req.body || {}
  if (!courseId || !chapterId) return res.status(400).json({ error: 'courseId + chapterId required' })

  const existing = db.prepare('SELECT id, completed FROM progress WHERE user_id=? AND course_id=? AND chapter_id=?').get(
    req.user.id, courseId, chapterId
  )
  let newly = false
  if (existing) {
    if (!existing.completed) {
      db.prepare('UPDATE progress SET completed=1, score=MAX(score,?), updated_at=CURRENT_TIMESTAMP WHERE id=?').run(score, existing.id)
      newly = true
    } else {
      db.prepare('UPDATE progress SET score=MAX(score,?), updated_at=CURRENT_TIMESTAMP WHERE id=?').run(score, existing.id)
    }
  } else {
    db.prepare('INSERT INTO progress (user_id, course_id, chapter_id, completed, score) VALUES (?,?,?,1,?)').run(
      req.user.id, courseId, chapterId, score
    )
    newly = true
  }

  // 发 XP + 升级
  if (newly) {
    db.prepare('UPDATE users SET total_xp = total_xp + ?, level = 1 + total_xp / ? WHERE id=?').run(XP_PER_CHAPTER, LEVEL_STEP, req.user.id)
  }

  // 触发成就：chapter_complete
  const ach = db.prepare('INSERT OR IGNORE INTO achievements (user_id, ach_id) VALUES (?,?)').run(req.user.id, 'first-lesson')

  // 发 AI QA 事件
  db.prepare('INSERT OR IGNORE INTO achievements (user_id, ach_id, progress) VALUES (?,?,1)').run(req.user.id, 'ai-friend')

  const user = db.prepare('SELECT total_xp, level FROM users WHERE id=?').get(req.user.id)
  res.json({ ok: true, newlyCompleted: newly, xpGained: newly ? XP_PER_CHAPTER : 0, user })
})

router.get('/list', optionalAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' })
  const rows = db.prepare('SELECT * FROM progress WHERE user_id=? ORDER BY updated_at DESC').all(req.user.id)
  res.json(rows)
})

// POST /api/progress/ai-event  — 外部（比如 AI QA 调用后）告诉后端 +1 进度
router.post('/ai-event', optionalAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' })
  const { achId } = req.body || {}
  if (!achId) return res.status(400).json({ error: 'achId required' })
  // 累加 progress（最多 10）
  db.prepare(`
    INSERT INTO achievements (user_id, ach_id, progress) VALUES (?, ?, 1)
    ON CONFLICT(user_id, ach_id) DO UPDATE SET progress = MIN(achievements.progress + 1, 10)
  `).run(req.user.id, achId)
  const row = db.prepare('SELECT progress FROM achievements WHERE user_id=? AND ach_id=?').get(req.user.id, achId)
  res.json({ ok: true, progress: row?.progress || 0 })
})

export default router
