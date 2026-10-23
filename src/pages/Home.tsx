import { Link } from 'react-router-dom'
import {
  BookOpen,
  Sparkles,
  Brain,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react'
import { SUBJECT_META } from '../data/courses'
import ProgressRing from '../components/ProgressRing'
import { useUserStore } from '../store/useUserStore'

export default function Home() {
  const { isAuthenticated, currentUser } = useUserStore()
  const subjects = Object.entries(SUBJECT_META)

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-4">
            <Sparkles size={14} /> 沉浸式学习 · 专为深度学习者打造
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            9 门主流学科
            <br />
            <span className="text-brand-200">一个沉浸式学习空间</span>
          </h1>
          <p className="text-brand-100 text-lg mb-6">
            从语文到人工智能，从入门到精通。AI 驱动的互动课堂、智能答疑、个性化学习路径。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="bg-white text-brand-700 font-medium px-6 py-3 rounded-lg hover:bg-brand-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              开始探索课程 <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/20 transition-all"
              >
                免费注册
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      {isAuthenticated && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 flex items-center gap-4">
            <ProgressRing value={42} size={56} />
            <div>
              <p className="text-xs text-slate-500">学习进度</p>
              <p className="font-bold text-slate-800">{currentUser?.username || '学习者'}</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <TrendingUp className="text-amber-500" size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500">当前经验</p>
              <p className="font-bold text-slate-800">{currentUser?.exp || 0} EXP</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Zap className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500">连续学习</p>
              <p className="font-bold text-slate-800">7 天</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Award className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500">已获成就</p>
              <p className="font-bold text-slate-800">{currentUser?.achievements.length || 0} 枚</p>
            </div>
          </div>
        </section>
      )}

      {/* 学科入口 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">选择学科开始学习</h2>
          <Link to="/courses" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
            全部课程 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {subjects.map(([key, meta]) => {
            const Icon = BookOpen
            return (
              <Link
                key={key}
                to={`/courses?subject=${key}`}
                className="card p-3 flex flex-col items-center gap-2 text-center group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                >
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-slate-700">{meta.name}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 特别板块 */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">✨ 特别板块</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/ai-agent" className="card p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-100 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="text-white" size={28} />
              </div>
              <ArrowRight className="text-pink-400 group-hover:translate-x-1 transition-transform" size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">AI Agent 能力板块</h3>
            <p className="text-sm text-slate-600">
              从会用 AI 到会做 AI Agent。Prompt 工程、工具调用、多 Agent 协作，掌握下一代生产力。
            </p>
          </Link>
          <Link to="/cognition" className="card p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Brain className="text-white" size={28} />
              </div>
              <ArrowRight className="text-indigo-400 group-hover:translate-x-1 transition-transform" size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">认知跃迁板块</h3>
            <p className="text-sm text-slate-600">
              不止学知识，更要升级大脑。元认知训练、思维模型图谱、深度反思工作流，让学习本身成为能力。
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
