import { NavLink } from 'react-router-dom'
import {
  Home,
  BookOpen,
  Code2,
  Users,
  Trophy,
  Brain,
  Sparkles,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: '学习首页', icon: Home },
  { to: '/courses', label: '分级课程', icon: BookOpen },
  { to: '/playground', label: '代码沙箱', icon: Code2 },
  { to: '/community', label: '学习社区', icon: Users },
  { to: '/achievements', label: '成就勋章', icon: Trophy },
]

const SPECIAL_ITEMS = [
  { to: '/ai-agent', label: 'AI Agent 能力', icon: Sparkles, color: '#ec4899' },
  { to: '/cognition', label: '认知跃迁', icon: Brain, color: '#8b5cf6' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:block fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-100 shadow-sm overflow-y-auto">
      <div className="p-4 space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          学习导航
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-100">
          <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            ✨ 特别板块
          </p>
          {SPECIAL_ITEMS.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'shadow-sm text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: color } : undefined
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  )
}
