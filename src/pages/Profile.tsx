import { User, Mail, Trophy, Calendar, Flame, BookOpen, Star, Award } from 'lucide-react'
import { useUserStore } from '../store/useUserStore'
import ProgressRing from '../components/ProgressRing'

export default function Profile() {
  const { currentUser } = useUserStore()
  const user = currentUser || {
    username: '访客',
    email: 'guest@example.com',
    exp: 0,
    achievements: [],
    level: 'beginner',
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card p-6 bg-gradient-to-br from-brand-50 via-white to-purple-50 border-brand-100">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-lg shrink-0">
            <User className="text-white" size={36} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">{user.username}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
              <Mail size={14} /> {user.email}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-medium">
                {user.level === 'beginner' ? '入门级' : user.level === 'intermediate' ? '进阶级' : '精通级'}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1">
                <Star size={12} /> {user.exp} EXP
              </span>
            </div>
          </div>
          <ProgressRing value={42} size={72} label="总进度" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: '连续学习', value: '7 天', color: '#f97316' },
          { icon: BookOpen, label: '已学章节', value: '12 / 36', color: '#6366f1' },
          { icon: Trophy, label: '已获成就', value: `${user.achievements.length} 枚`, color: '#eab308' },
          { icon: Calendar, label: '学习天数', value: '23 天', color: '#22c55e' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: `${color}15`, color }}
            >
              <Icon size={20} />
            </div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-lg font-bold text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Learning Path */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-brand-600" /> 我的学习路径
        </h3>
        <div className="space-y-3">
          {[
            { subject: 'python', name: 'Python 入门', progress: 85 },
            { subject: 'math', name: '高等数学进阶', progress: 42 },
            { subject: 'english', name: '英语口语突破', progress: 60 },
          ].map((c) => (
            <div key={c.subject} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700 text-sm">{c.name}</span>
                  <span className="text-xs text-slate-500">{c.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Award size={18} className="text-amber-500" /> 最近获得的成就
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { title: '初次探索', desc: '完成第一节课', icon: '🎯' },
            { title: '连胜 7 天', desc: '连续学习一周', icon: '🔥' },
            { title: '代码新星', desc: '写出第一段正确代码', icon: '💻' },
          ].map((a) => (
            <div key={a.title} className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="text-xs font-semibold text-slate-700">{a.title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
