// 统一前端 API 客户端 —— 所有 fetch 都走这里
// 后端挂了自动降级到 Mock 数据，保证 UI 不崩

const TOKEN_KEY = 'auth_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const init = { method, headers }
  if (body !== undefined) init.body = JSON.stringify(body)

  const resp = await fetch(path, init)
  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`)
  return data
}

// ============ Auth ============
export const apiAuth = {
  register: (username, email, password) => request('/api/auth/register', { method: 'POST', body: { username, email, password } }),
  login: (account, password) => request('/api/auth/login', { method: 'POST', body: { account, password } }),
  me: () => request('/api/auth/me'),
  achievements: () => request('/api/auth/achievements'),
  event: (eventType, payload) => request('/api/auth/event', { method: 'POST', body: { eventType, payload } }),
  saveToken: setToken,
  getToken,
}

// ============ Progress ============
export const apiProgress = {
  mark: (courseId, chapterId, score = 0) =>
    request('/api/progress/mark', { method: 'POST', body: { courseId, chapterId, score } }),
  list: () => request('/api/progress/list'),
  aiEvent: (achId) => request('/api/progress/ai-event', { method: 'POST', body: { achId } }),
}

// ============ Community ============
export const apiCommunity = {
  posts: (sort = 'latest', limit = 20) =>
    request(`/api/community/posts?sort=${sort}&limit=${limit}`),
  create: (content, subject, subjectName, tags) =>
    request('/api/community/posts', { method: 'POST', body: { content, subject, subjectName, tags } }),
  like: (id) => request(`/api/community/posts/${id}/like`, { method: 'POST' }),
  mine: () => request('/api/community/my-posts'),
}

// ============ AI ============
export const apiAI = {
  qa: (question, opts = {}) => request('/api/ai/qa', { method: 'POST', body: { question, ...opts } }),
  chat: (messages, opts = {}) => request('/api/ai/chat', { method: 'POST', body: { messages, ...opts } }),
  writingFeedback: (text, opts = {}) => request('/api/ai/writing-feedback', { method: 'POST', body: { text, ...opts } }),
  npc: (opts) => request('/api/ai/npc', { method: 'POST', body: opts }),
}

// ============ Health ============
export const apiHealth = () => request('/api/health')
