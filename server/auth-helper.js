// JWT helper —— 中间件 + sign/verify
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-please'
const JWT_EXPIRES_IN = '30d'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

// Express 中间件：从 query.token 或 Authorization header 提取
export function optionalAuth(req, _res, next) {
  const header = (req.headers.authorization || '').replace('Bearer ', '')
  const token = req.query.token || header
  req.user = token ? verifyToken(token) : null
  next()
}

export function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.user) return res.status(401).json({ error: 'unauthorized' })
    next()
  })
}
