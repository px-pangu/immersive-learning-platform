// GET  /api/community/posts         — 帖子列表（最新 + 热榜）
// POST /api/community/posts          — 发帖
// POST /api/community/posts/:id/like — 点赞 / 取消点赞
import express from 'express'
import db from '../db.js'
import { optionalAuth } from '../auth-helper.js'

const router = express.Router()

router.use(optionalAuth)

// 列表：按 created_at DESC，带作者信息 + 点赞状态
router.get('/posts', optionalAuth, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 50)
  const sort = req.query.sort === 'hot' ? 'ORDER BY p.likes DESC, p.created_at DESC' : 'ORDER BY p.created_at DESC'
  const rows = db.prepare(`
    SELECT p.*, u.username, u.avatar,
      CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END AS liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN likes l ON l.post_id = p.id AND l.user_id = ?
    ${sort}
    LIMIT ?
  `).all(req.user?.id || -1, limit)
  res.json(rows)
})

// 发帖
router.post('/posts', optionalAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' })
  const { content, subject, subjectName, tags } = req.body || {}
  if (!content || !content.trim()) return res.status(400).json({ error: '内容不能为空' })
  if (content.length > 2000) return res.status(400).json({ error: '内容过长（最多 2000 字）' })

  const info = db.prepare('INSERT INTO posts (user_id, subject, subject_name, content, tags) VALUES (?,?,?,?,?)').run(
    req.user.id, subject || '', subjectName || '', content.trim(), tags || ''
  )
  res.json({ id: info.lastInsertRowid })
})

// 点赞切换
router.post('/posts/:id/like', optionalAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' })
  const postId = parseInt(req.params.id)
  const exists = db.prepare('SELECT 1 FROM posts WHERE id=?').get(postId)
  if (!exists) return res.status(404).json({ error: '帖子不存在' })

  const already = db.prepare('SELECT 1 FROM likes WHERE user_id=? AND post_id=?').get(req.user.id, postId)
  if (already) {
    db.prepare('DELETE FROM likes WHERE user_id=? AND post_id=?').run(req.user.id, postId)
    db.prepare('UPDATE posts SET likes = MAX(likes - 1, 0) WHERE id=?').run(postId)
  } else {
    db.prepare('INSERT INTO likes (user_id, post_id) VALUES (?,?)').run(req.user.id, postId)
    db.prepare('UPDATE posts SET likes = likes + 1 WHERE id=?').run(postId)
  }
  const post = db.prepare('SELECT id, likes FROM posts WHERE id=?').get(postId)

  // 触发成就：社区之星（likes>=100）
  if (post.likes >= 100) {
    db.prepare('INSERT OR IGNORE INTO achievements (user_id, ach_id, progress) VALUES (?,?,?)').run(exists.user_id, 'community-star', post.likes)
  }
  res.json({ id: post.id, likes: post.likes, liked: !already })
})

// 我的帖子
router.get('/my-posts', optionalAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' })
  const rows = db.prepare(`
    SELECT p.*, u.username
    FROM posts p JOIN users u ON p.user_id = u.id
    WHERE p.user_id=? ORDER BY p.created_at DESC
  `).all(req.user.id)
  res.json(rows)
})

export default router
