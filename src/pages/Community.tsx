import { useState } from 'react'
import { MessageCircle, Heart, Send, TrendingUp, BookOpen, Code, Sparkles } from 'lucide-react'

const MOCK_POSTS = [
  {
    id: 'p1',
    username: 'Python小能手',
    subject: 'python',
    subjectName: 'Python',
    content: '刚完成了第一章所有章节！AI Agent 工坊太酷了，用自然语言写函数完全不是梦 🚀',
    likes: 128,
    comments: 23,
    createdAt: Date.now() - 3600000,
    hot: true,
  },
  {
    id: 'p2',
    username: '数学博士候选人',
    subject: 'math',
    subjectName: '数学',
    content: '公式推导板功能太强了！以前学微积分链式法则总迷糊，现在一步步拆居然秒懂了，强烈推荐 📐',
    likes: 89,
    comments: 15,
    createdAt: Date.now() - 7200000,
    hot: true,
  },
  {
    id: 'p3',
    username: 'C语言新手2026',
    subject: 'c',
    subjectName: 'C语言',
    content: '指针终于搞懂了！给大家分享一个调试技巧：写个迷你 debug 函数，每次操作后打印值，比瞎想强 100 倍 💡',
    likes: 56,
    comments: 8,
    createdAt: Date.now() - 86400000,
  },
]

const formatTime = (ts: number) => {
  const diff = Date.now() - ts
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  return `${Math.floor(diff / 86400000)} 天前`
}

export default function Community() {
  const [input, setInput] = useState('')
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">学习社区</h1>
        <p className="text-slate-500 text-sm">和志同道合的学习者一起成长，分享经验、互相解答</p>
      </div>

      {/* Post Composer */}
      <div className="card p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="分享你的学习心得、提问或晒成就..."
          className="w-full input-field resize-none h-24 bg-white"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1">
              <BookOpen size={12} /> 学科
            </button>
            <button className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1">
              <Code size={12} /> 代码
            </button>
          </div>
          <button className="btn-primary text-sm flex items-center gap-1.5" disabled={!input.trim()}>
            <Send size={14} /> 发布
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-2">
        {[
          { label: '推荐', icon: Sparkles, active: true },
          { label: '热门', icon: TrendingUp, active: false },
          { label: 'Python', icon: Code, active: false },
          { label: '数学', icon: BookOpen, active: false },
        ].map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${
              active ? 'text-brand-600 border-b-2 border-brand-600 -mb-2' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="card p-5">
            {post.hot && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded mb-2">
                🔥 热门
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {post.username[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{post.username}</p>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100">{post.subjectName}</span>
                  · {formatTime(post.createdAt)}
                </p>
              </div>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  liked.has(post.id) ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                }`}
              >
                <Heart size={16} className={liked.has(post.id) ? 'fill-current' : ''} />
                {post.likes + (liked.has(post.id) ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
                <MessageCircle size={16} /> {post.comments}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
