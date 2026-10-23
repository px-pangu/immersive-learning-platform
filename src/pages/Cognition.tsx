import {
  Brain,
  Lightbulb,
  Network,
  Target,
  Sparkles,
  BookOpen,
  ChevronRight,
  Compass,
  RefreshCw,
  Zap,
  MessageCircle,
} from 'lucide-react'

const THINKING_MODELS = [
  { name: '费曼学习法', desc: '用简单语言解释复杂概念', icon: BookOpen, color: '#ef4444', mastery: 70 },
  { name: '第一性原理', desc: '回到最基本的公理，重新推导', icon: Target, color: '#3b82f6', mastery: 45 },
  { name: '思维导图', desc: '放射性思维，知识全景图', icon: Network, color: '#8b5cf6', mastery: 85 },
  { name: '刻意练习', desc: '有目的、有反馈地训练', icon: RefreshCw, color: '#22c55e', mastery: 60 },
  { name: '元认知监控', desc: '观察自己的思考过程', icon: Brain, color: '#f59e0b', mastery: 30 },
  { name: '类比迁移', desc: '将一个领域的知识用到另一个', icon: Compass, color: '#06b6d4', mastery: 50 },
]

const TODAY_REFLECTION = [
  { q: '今天我学到的最重要的一个概念是什么？', placeholder: '...' },
  { q: '我在哪个知识点上卡壳了？可能的原因是？', placeholder: '...' },
  { q: '如果用 3 句话向朋友解释今天的学习内容？', placeholder: '...' },
  { q: '明天我想重点攻克的一个小目标是？', placeholder: '...' },
]

const COGNITION_STATS = [
  { label: '今日认知负荷', value: '68%', icon: Zap, color: '#f59e0b', hint: '适中，建议休息一下' },
  { label: '深度专注时长', value: '42 min', icon: Brain, color: '#6366f1', hint: '超过平均值 18 min' },
  { label: '本周反思次数', value: '5 次', icon: RefreshCw, color: '#22c55e', hint: '保持这个频率！' },
]

export default function Cognition() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-4">
            <Brain size={14} /> 特别板块 · 认知跃迁
          </span>
          <h1 className="text-3xl font-bold mb-2">不止学习知识，更要升级大脑</h1>
          <p className="text-indigo-100 max-w-xl">
            元认知训练 · 思维模型图谱 · 深度反思工作流。
            让"学会学习"本身成为你最强的能力。
          </p>
        </div>
      </section>

      {/* Cognition Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {COGNITION_STATS.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card p-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${s.color}15`, color: s.color }}
              >
                <Icon size={22} />
              </div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.hint}</p>
            </div>
          )
        })}
      </div>

      {/* Thinking Models */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Lightbulb className="text-amber-500" size={20} /> 思维模型图谱
            </h2>
            <p className="text-sm text-slate-500 mt-1">掌握 10+ 种思维模型，让学习效率翻倍</p>
          </div>
          <button className="text-sm text-brand-600 hover:underline flex items-center gap-1">
            查看完整图谱 <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THINKING_MODELS.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.name}
                className="p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all cursor-default group bg-white"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${m.color}15`, color: m.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">{m.name}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{m.desc}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">掌握度</span>
                  <span style={{ color: m.color }} className="font-medium">{m.mastery}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${m.mastery}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Reflection */}
      <div className="card p-6 bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} /> 今日元认知反思
            </h2>
            <p className="text-sm text-slate-500 mt-1">每天 5 分钟，让大脑在"学习如何学习"上持续进化</p>
          </div>
          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
            Day 7 / 30
          </span>
        </div>
        <div className="space-y-4">
          {TODAY_REFLECTION.map((r, i) => (
            <div key={i}>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">
                {i + 1}. {r.q}
              </label>
              <textarea
                placeholder={r.placeholder}
                className="w-full input-field bg-white resize-none h-16 text-sm"
              />
            </div>
          ))}
          <button className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
            <RefreshCw size={16} /> 提交今日反思，生成认知洞察
          </button>
        </div>
      </div>

      {/* Socratic Dialogue AI */}
      <div className="card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
        <h2 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <MessageCircle className="text-indigo-600" size={20} /> 苏格拉底式对话 AI
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          不用直接给答案，而是通过层层递进的提问帮你自己想明白。选一个话题开始：
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            '为什么递归函数必须有终止条件？',
            '导数的几何意义到底是什么？',
            '为什么说 Python 是"鸭子类型"？',
            '如何用第一性原理拆解这个问题？',
          ].map((t) => (
            <button
              key={t}
              className="text-sm px-4 py-2 bg-white rounded-lg border border-indigo-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Path Brainmap */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Network className="text-brand-600" size={20} /> 个人学习路径脑图
        </h2>
        <div className="relative h-56 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Center */}
            <circle cx="200" cy="100" r="28" fill="#6366f1" />
            <text x="200" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              我
            </text>
            {/* Connections */}
            {[
              { x: 80, y: 50, label: 'Python', color: '#22c55e' },
              { x: 80, y: 150, label: '数学', color: '#8b5cf6' },
              { x: 320, y: 50, label: 'AI', color: '#ec4899' },
              { x: 320, y: 150, label: '英语', color: '#3b82f6' },
            ].map((n, i) => (
              <g key={i}>
                <line x1="200" y1="100" x2={n.x} y2={n.y} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,2" />
                <circle cx={n.x} cy={n.y} r="18" fill={n.color} opacity="0.2" />
                <circle cx={n.x} cy={n.y} r="14" fill={n.color} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                  {n.label}
                </text>
              </g>
            ))}
            {/* Sub nodes sample */}
            <circle cx="60" cy="25" r="8" fill="#86efac" />
            <circle cx="110" cy="170" r="8" fill="#c4b5fd" />
            <circle cx="300" cy="30" r="8" fill="#f9a8d4" />
            <circle cx="340" cy="175" r="8" fill="#93c5fd" />
            <line x1="80" y1="50" x2="60" y2="25" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="80" y1="150" x2="110" y2="170" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="320" y1="50" x2="300" y2="30" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="320" y1="150" x2="340" y2="175" stroke="#cbd5e1" strokeWidth="1" />
          </svg>
          <div className="absolute bottom-2 right-3 text-xs text-slate-400">AI 自动生成 · 点击节点深入</div>
        </div>
      </div>
    </div>
  )
}
