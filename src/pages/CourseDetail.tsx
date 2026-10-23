import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, PlayCircle, FileText, Code, MessageSquare, ChevronRight, Clock, BookOpen, Sparkles } from 'lucide-react'
import { useCourseStore } from '../store/useCourseStore'
import { useProgressStore } from '../store/useProgressStore'

const SECTION_ICON: Record<string, typeof PlayCircle> = {
  video: PlayCircle,
  reading: FileText,
  interactive: Sparkles,
  quiz: MessageSquare,
  code: Code,
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const { getCourseById } = useCourseStore()
  const { getProgressByCourse } = useProgressStore()
  const course = id ? getCourseById(id) : undefined

  if (!course) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p>课程未找到</p>
        <Link to="/courses" className="text-brand-600 hover:underline mt-4 inline-block">
          返回课程列表
        </Link>
      </div>
    )
  }

  const progress = getProgressByCourse(course.id)
  const totalMinutes = course.chapters.reduce((a, c) => a + c.duration, 0)
  const totalSections = course.chapters.reduce((a, c) => a + c.sections.length, 0)

  return (
    <div className="space-y-6">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 transition-colors">
        <ArrowLeft size={16} /> 返回课程列表
      </Link>

      {/* Course Header */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)`,
        }}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
              {course.levelName}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
              {course.chapters.length} 章 · {totalSections} 节
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="opacity-90 mb-4 max-w-xl">{course.description}</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock size={16} /> 约 {totalMinutes} 分钟
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen size={16} /> 可达成进度 {progress}%
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={16} /> AI 互动模块 {course.chapters.reduce((a, c) => a + c.interactiveTypes.length, 0)} 个
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-3">
        <h2 className="font-bold text-slate-800">课程大纲</h2>
        {course.chapters.map((chapter, idx) => (
          <div key={chapter.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="font-semibold text-slate-800">{chapter.title}</h3>
                </div>
                <p className="text-sm text-slate-500 ml-9">{chapter.summary}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{chapter.duration} 分钟</span>
            </div>
            <div className="ml-9 space-y-1.5">
              {chapter.sections.map((section, sIdx) => {
                const Icon = SECTION_ICON[section.type] || FileText
                return (
                  <Link
                    key={section.id}
                    to={`/learn/${course.id}/${chapter.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-slate-400 group-hover:text-brand-600" />
                      <span className="text-sm text-slate-700 group-hover:text-brand-600">
                        {idx + 1}.{sIdx + 1} {section.title}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          to={`/learn/${course.id}/${course.chapters[0]?.id}`}
          className="btn-primary inline-flex items-center gap-2"
        >
          <PlayCircle size={18} /> 开始学习第一章
        </Link>
      </div>
    </div>
  )
}
