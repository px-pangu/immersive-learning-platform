// POST /api/auth/register
// POST /api/auth/login
// GET  /api/auth/me
// GET  /api/auth/achievements
import express from 'express'
import bcrypt from 'bcryptjs'
import db from '../db.js'
import { signToken, optionalAuth } from '../auth-helper.js'
import { ACHIEVEMENTS, evaluateAchievements } from '../achievements.js'

const router = express.Router()

router.post('/register', (req, res) => {
  const { username, email, password } = req.body || {}
  if (!username || !email || !password) return res.status(400).json({ error: '缺少必填字段' })
  if (password.length < 4) return res.status(400).json({ error: '密码至少 4 位' })
  try {
    const hash = bcrypt.hashSync(password, 10)
    const info = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?,?,?)').run(username, email, hash)
    const user = db.prepare('SELECT id, username, email, total_xp, level FROM users WHERE id=?').get(info.lastInsertRowid)
    // 注册 = welcome 成就
    db.prepare('INSERT OR IGNORE INTO achievements (user_id, ach_id) VALUES (?,?)').run(user.id, 'welcome')
    res.json({ user, token: signToken({ id: user.id }) })
  } catch (e) {
    if (String(e).includes('UNIQUE')) return res.status(409).json({ error: '用户名或邮箱已存在' })
    res.status(500).json({ error: e.message })
  }
})

router.post('/login', (req, res) => {
  const { account, password } = req.body || {}
  if (!account || !password) return res.status(400).json({ error: '缺少账号或密码' })
  const row = db.prepare('SELECT * FROM users WHERE username=? OR email=?').get(account, account)
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: '账号或密码错误' })
  }
  const user = { id: row.id, username: row.username, email: row.email, total_xp: row.total_xp, level: row.level }
  res.json({ user, token: signToken({ id: row.id }) })
})

router.get('/me', optionalAuth, (req, res) => {
  if (!req.user) return res.json({ user: null })
  const row = db.prepare('SELECT id, username, email, total_xp, level FROM users WHERE id=?').get(req.user.id)
  res.json({ user: row || null })
})

router.get('/achievements', optionalAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' })
  const unlocked = db.prepare('SELECT ach_id, progress FROM achievements WHERE user_id=?').all(req.user.id)
  const unlockedIds = new Set(unlocked.map((u) => u.ach_id))
  const progressMap = Object.fromEntries(unlocked.map((u) => [u.ach_id, u.progress]))
  const all = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: unlockedIds.has(a.id),
    progress: progressMap[a.id] || 0,
  }))
  const total = ACHIEVEMENTS.length
  const got = unlockedIds.size
  res.json({
    achievements: all,
    summary: { total, got, percent: Math.round((got / total) * 100) },
  })
})

// 事件触发：其他路由在用户完成某动作后调这里解锁成就
router.post('/event', optionalAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' })
  const { eventType, payload } = req.body || {}
  if (!eventType) return res.status(400).json({ error: 'eventType required' })

  const existing = db.prepare('SELECT ach_id, progress FROM achievements WHERE user_id=?').all(req.user.id)
  const { newlyUnlocked, updates } = evaluateAchievements(existing, eventType, payload)

  const ins = db.prepare('INSERT OR REPLACE INTO achievements (user_id, ach_id, progress) VALUES (?,?,?)')
  for (const u of updates) ins.run(req.user.id, u.ach_id, u.progress)

  res.json({ newlyUnlocked, updatedCount: updates.length })
})

export default router
