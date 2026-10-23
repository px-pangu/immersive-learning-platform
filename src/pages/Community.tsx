import { useState, useEffect } from 'react'
import { MessageCircle, Heart, Send, TrendingUp, BookOpen, Code, Sparkles, Loader2 } from 'lucide-react'
import { apiCommunity } from '../lib/api'
import { useUserStore } from '../store/useUserStore'

type Post = {
  id: number
  username: string
  subject?: string
  subject_name?: string
  content: string
  likes: number
  liked?: number | boolean
  comments_count?: number
  created_at: string
}

const formatTime = (ts?: string) => {
  if (!ts) return ''
  const diff = Date.now() - new Date(ts + 'Z').getTime()
  if (isNaN(diff)) return ts
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  return `${Math.floor(diff / 86400000)} 天前`
}

// ---- 本地 Mock fallback（后端挂了就用这个）----
const MOCK_POSTS: Post[] = [
  { id: 1, username: 'Python小能手', subject: 'python', subject_name: 'Python', content: '刚完成了第一章所有章节！AI Agent 工坊太酷了，用自然语言写函数完全不是梦 🚀', likes: 128, liked: false, comments_count: 23, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, username: '数学博士候选人', subject: 'math', subject_name: '数学', content: '公式推导板功能太强了！以前学微积分链式法则总迷糊，现在一步步拆居然秒懂了，强烈推荐 📐', likes: 89, liked: false, comments_count: 15, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, username: 'C语言新手2026', subject: 'c', subject_name: 'C语言', content: '指针终于搞懂了！给大家分享一个调试技巧：写个迷你 debug 函数，每次操作后打印值，比瞎想强 100 倍 💡', likes: 56, liked: false, comments_count: 8, created_at: new Date(Date.now() - 86400000).toISOString() },
]

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [tab, setTab] = useState<'latest' | 'hot'>('latest')
  const [subjectFilter, setSubjectFilter] = useState('')
  const { isAuthenticated } = useUserStore()

  const load = async () => {
    setLoading(true)
    try {
      const list = await apiCommunity.posts(tab, 50)
      setPosts(list)
    } catch {
      setPosts(MOCK_POSTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [tab])

  const createPost = async () => {
    if (!input.trim()) return
    if (!isAuthenticated) { alert('请先登录再发帖'); return }
    try {
      await apiCommunity.create(input.trim(), subjectFilter, subjectFilter, '')
      setInput('')
      load()
    } catch (e) {
      alert('发帖失败：' + (e as Error).message)
    }
  }

  const toggleLike = async (postId: number) => {
    if (!isAuthenticated) { alert('请先登录'); return }
    try {
      const res = await apiCommunity.like(postId)
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: res.likes, liked: res.liked } : p)))
    } catch {
      // 本地先乐观更新
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)))
    }
  }

  const filtered = subjectFilter
    ? posts.filter((p) => (p.subject || '').toLowerCase() === subjectFilter.toLowerCase())
    : posts

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">学习社区</h1>
        <p className="text-slate-500 text-sm">和志同道合的学习者一起成长，分享经验、互相解答</p>
      </div>

      {/* Composer */}
      <div className="card p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isAuthenticated ? '分享你的学习心得、提问或晒成就...' : '登录后即可发帖交流'}
          className="w-full input-field resize-none h-24 bg-white"
          disabled={!isAuthenticated}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2 flex-wrap">
            {['', 'python', 'math', 'english', 'c'].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setSubjectFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${
                  subjectFilter === s ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s === '' ? <Sparkles size={12} /> : s === 'python' ? <Code size={12} /> : <BookOpen size={12} />}
                {s === '' ? '全部' : s}
              </button>
            ))}
          </div>
          <button className="btn-primary text-sm flex items-center gap-1.5" onClick={createPost} disabled={!input.trim()}>
            <Send size={14} /> 发布
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-2">
        <button onClick={() => setTab('latest')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${tab === 'latest' ? 'text-brand-600 border-b-2 border-brand-600 -mb-2' : 'text-slate-500 hover:text-slate-700'}`}>
          <Sparkles size={14} /> 推荐
        </button>
        <button onClick={() => setTab('hot')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${tab === 'hot' ? 'text-brand-600 border-b-2 border-brand-600 -mb-2' : 'text-slate-500 hover:text-slate-700'}`}>
          <TrendingUp size={14} /> 热门
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {loading && <div className="text-center py-12 text-slate-400"><Loader2 size={24} className="animate-spin mx-auto" /> 加载中...</div>}
        {!loading && filtered.length === 0 && <div className="card p-12 text-center text-slate-400">暂时没有帖子，成为第一个发帖人吧 ✨</div>}
        {!loading && filtered.map((post) => {
          const liked = !!post.liked
          return (
            <div key={post.id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {post.username[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{post.username}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    {post.subject_name && <span className="px-1.5 py-0.5 rounded bg-slate-100">{post.subject_name}</span>}
                    · {formatTime(post.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
              <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}>
                  <Heart size={16} className={liked ? 'fill-current' : ''} /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
                  <MessageCircle size={16} /> {post.comments_count || 0}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
