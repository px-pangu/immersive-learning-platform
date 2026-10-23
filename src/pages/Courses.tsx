import { useState, useMemo } from 'react'
import { BookOpen, Languages, Calculator, Scale, Atom, Terminal, Code2, Sparkles, Filter } from 'lucide-react'
import { useCourseStore, SUBJECT_META, LEVEL_META } from '../store/useCourseStore'
import type { Subject, Level } from '../types'
import SubjectCard from '../components/SubjectCard'

const ICON_MAP: Record<string, typeof BookOpen> = { BookOpen, Languages, Calculator, Scale, Atom, Terminal, Code2, Sparkles }

export default function Courses() {
  const { courses, filterSubject, filterLevel, setFilterSubject, setFilterLevel } = useCourseStore()

  const filtered = useMemo(() => {
    return courses.filter(
      (c) =>
        (filterSubject === 'all' || c.subject === filterSubject) &&
        (filterLevel === 'all' || c.level === filterLevel)
    )
  }, [courses, filterSubject, filterLevel])

  const subjects = Object.entries(SUBJECT_META) as [Subject, typeof SUBJECT_META[keyof typeof SUBJECT_META]][]
  const levels = Object.entries(LEVEL_META) as [Level, typeof LEVEL_META[keyof typeof LEVEL_META]][]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">分级课程体系</h1>
        <p className="text-slate-500 text-sm">
          9 大学科 × 3 个难度等级，覆盖从零基础到精通的完整学习路径
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Filter size={16} /> 学科筛选
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterSubject('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterSubject === 'all'
                ? 'bg-brand-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部
          </button>
          {subjects.map(([key, meta]) => {
            const Icon = ICON_MAP[meta.icon] || BookOpen
            return (
              <button
                key={key}
                onClick={() => setFilterSubject(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filterSubject === key
                    ? 'text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={filterSubject === key ? { backgroundColor: meta.color } : undefined}
              >
                <Icon size={14} /> {meta.name}
              </button>
            )
          })}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
            难度等级
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterLevel('all')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                filterLevel === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部等级
            </button>
            {levels.map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setFilterLevel(key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterLevel === key
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {meta.name}
                <span className="ml-1.5 text-xs opacity-70">· {meta.desc.split('，')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => (
          <SubjectCard key={course.id} course={course} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
          <p>没有匹配的课程，试试调整筛选条件</p>
        </div>
      )}
    </div>
  )
}
