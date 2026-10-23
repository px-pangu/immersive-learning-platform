import { Link } from 'react-router-dom'
import {
  BookOpen,
  Languages,
  Calculator,
  Scale,
  Atom,
  Terminal,
  Code2,
  Sparkles,
} from 'lucide-react'
import type { Subject, Level, Course } from '../types'

const ICON_MAP: Record<string, typeof BookOpen> = {
  BookOpen,
  Languages,
  Calculator,
  Scale,
  Atom,
  Terminal,
  Code2,
  Sparkles,
}

interface Props {
  course: Course
}

export default function SubjectCard({ course }: Props) {
  const Icon = ICON_MAP[course.icon] || BookOpen
  return (
    <Link
      to={`/courses/${course.id}`}
      className="card p-5 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3"
          style={{ backgroundColor: `${course.color}15`, color: course.color }}
        >
          <Icon size={24} />
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
          {course.levelName}
        </span>
      </div>
      <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-brand-600 transition-colors">
        {course.subjectName} · {course.levelName}
      </h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-3">
        {course.description}
      </p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{course.chapters.length} 章 · {course.chapters.reduce((a, c) => a + c.duration, 0)} 分钟</span>
        <span className="text-brand-600 group-hover:translate-x-1 transition-transform">开始学习 →</span>
      </div>
    </Link>
  )
}
