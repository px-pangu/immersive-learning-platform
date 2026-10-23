import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Menu, X, User, LogOut } from 'lucide-react'
import { useUserStore } from '../store/useUserStore'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, currentUser, logout } = useUserStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="text-lg font-bold text-slate-800">智学堂</span>
          </Link>
          <span className="hidden md:inline-block text-xs px-2 py-0.5 bg-brand-50 text-brand-600 rounded-full font-medium">
            沉浸式多学科学习平台
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/courses" className="px-3 py-2 text-sm text-slate-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors">
            分级课程
          </Link>
          <Link to="/ai-agent" className="px-3 py-2 text-sm text-slate-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors">
            AI Agent
          </Link>
          <Link to="/cognition" className="px-3 py-2 text-sm text-slate-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors">
            认知跃迁
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={14} />
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                  {currentUser?.username}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">
                登录
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                免费注册
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
