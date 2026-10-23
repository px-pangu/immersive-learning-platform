import { useState, useEffect } from 'react'
import { Trophy, Star, Code, Brain, Flame, Award, Lock, Loader2 } from 'lucide-react'
import { apiAuth } from '../lib/api'
import { useUserStore } from '../store/useUserStore'

type AchItem = {
  id: string
  title: string
  desc: string
  icon: string
  goal: number
  unlocked: boolean
  progress: number
}

const MOCK_ALL: AchItem[] = [
  { id: 'welcome', title: '初次拜访', desc: '注册并登录智学堂', icon: '🎯', goal: 1, unlocked: true, progress: 1 },
  { id: 'first-lesson', title: '迈出第一步', desc: '完成第一节课程', icon: '📚', goal: 1, unlocked: true, progress: 1 },
  { id: 'streak-7', title: '连胜 7 天', desc: '连续 7 天每天学习', icon: '🔥', goal: 7, unlocked: false, progress: 3 },
  { id: 'streak-30', title: '学习达人', desc: '连续 30 天每天学习', icon: '👑', goal: 30, unlocked: false, progress: 3 },
  { id: 'code-newbie', title: '代码新星', desc: '写出第一段正确代码', icon: '💻', goal: 1, unlocked: false, progress: 0 },
  { id: 'quiz-master', title: '闯关达人', desc: '闯关获得满分', icon: '🏆', goal: 1, unlocked: false, progress: 0 },
  { id: 'ai-friend', title: 'AI 好搭档', desc: 'AI 助手帮你解决 10 次问题', icon: '🤖', goal: 10, unlocked: false, progress: 4 },
  { id: 'subject-complete', title: '单科通关', desc: '完成一门课程所有章节', icon: '⭐', goal: 1, unlocked: false, progress: 0 },
  { id: 'community-star', title: '社区之星', desc: '帖子获 100 个赞', icon: '🌟', goal: 100, unlocked: false, progress: 0 },
  { id: 'speed-runner', title: '闪电学习', desc: '一小时内完成 5 节', icon: '⚡', goal: 1, unlocked: false, progress: 0 },
]

export default function Achievements() {
  const [items, setItems] = useState<AchItem[]>([])
  const [summary, setSummary] = useState({ total: MOCK_ALL.length, got: 0, percent: 0 })
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useUserStore()

  const load = async () => {
    setLoading(true)
    try {
      const data = await apiAuth.achievements()
      setItems(data.achievements || MOCK_ALL)
      setSummary(data.summary || { total: MOCK_ALL.length, got: 0, percent: 0 })
    } catch {
      setItems(MOCK_ALL)
      const got = MOCK_ALL.filter((a) => a.unlocked).length
      setSummary({ total: MOCK_ALL.length, got, percent: Math.round((got / MOCK_ALL.length) * 100) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [isAuthenticated])

  const categories = [
    { icon: Trophy, name: '成就勋章', count: summary.got, total: summary.total },
    { icon: Star, name: '学习等级', count: 3, total: 10 },
    { icon: Code, name: '代码技能', count: 4, total: 9 },
    { icon: Brain, name: '认知成长', count: 2, total: 6 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">成就系统</h1>
        <p className="text-slate-500 text-sm">每一次进步都值得被铭记</p>
      </div>

      {/* Overview */}
      <div className="card p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-200">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#fde68a" strokeWidth="8" fill="none" />
              <circle cx="48" cy="48" r="40" stroke="#f59e0b" strokeWidth="8" fill="none" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - summary.percent / 100)}
                className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="text-amber-600" size={28} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">已解锁 {summary.got} / {summary.total} 枚</h2>
            <p className="text-slate-600 text-sm mt-1">完成更多挑战，解锁属于你的荣耀勋章</p>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Flame key={i} size={12} className={i < Math.min(Math.ceil(summary.percent / 10), 10) ? 'text-orange-500' : 'text-slate-200'} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(({ icon: Icon, name, count, total }) => (
          <div key={name} className="card p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3">
              <Icon size={22} />
            </div>
            <p className="font-semibold text-slate-700 text-sm">{name}</p>
            <p className="text-xs text-slate-500 mt-1">{count} / {total}</p>
          </div>
        ))}
      </div>

      {/* All */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Award size={18} className="text-brand-600" /> 全部勋章
        </h3>
        {loading && <div className="text-center py-8 text-slate-400"><Loader2 size={20} className="animate-spin mx-auto" /> 加载中...</div>}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((a) => {
              const pct = a.goal > 1 ? Math.min(100, Math.round((a.progress / a.goal) * 100)) : 100
              return (
                <div key={a.id}
                  className={`p-4 rounded-xl text-center transition-all ${
                    a.unlocked
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:scale-105 cursor-default'
                      : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div className={`text-4xl mb-2 ${!a.unlocked && 'grayscale'}`}>{a.unlocked ? a.icon : '🔒'}</div>
                  <p className="font-semibold text-slate-700 text-xs leading-tight">{a.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{a.desc}</p>
                  {a.goal > 1 && !a.unlocked && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: pct + '%' }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{a.progress}/{a.goal}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
