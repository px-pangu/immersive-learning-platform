import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, PlayCircle, FileText, Code, MessageSquare, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Send, Lightbulb } from 'lucide-react'
import { useCourseStore } from '../store/useCourseStore'
import { useProgressStore } from '../store/useProgressStore'

const INTERACTIVE_LABEL: Record<string, { label: string; icon: typeof Sparkles }> = {
  'code-playground': { label: '代码沙箱', icon: Code },
  'formula-derivation': { label: '公式推导板', icon: FileText },
  'dynamic-experiment': { label: '动态实验台', icon: Sparkles },
  'scenario-roleplay': { label: '情景对话', icon: MessageSquare },
  'text-annotation': { label: '文本标注', icon: FileText },
  'voice-follow': { label: '跟读评测', icon: PlayCircle },
  'ai-writing-feedback': { label: '写作批改', icon: Lightbulb },
  'knowledge-graph': { label: '知识图谱', icon: Sparkles },
  'algorithm-viz': { label: '算法可视化', icon: Sparkles },
  'ai-agent-lite': { label: 'AI Agent 工坊', icon: Sparkles },
  'flash-quiz': { label: '闯关小游戏', icon: MessageSquare },
  'path-brainmap': { label: '学习脑图', icon: Sparkles },
}

export default function Learning() {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>()
  const { getCourseById } = useCourseStore()
  const { markComplete } = useProgressStore()
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

  const course = courseId ? getCourseById(courseId) : undefined
  const chapter = course?.chapters.find((c) => c.id === chapterId)
  const sections = chapter?.sections || []
  const currentSection = sections[currentSectionIdx]

  if (!course || !chapter) {
    return (
      <div className="text-center py-12">
        <p>课程或章节未找到</p>
        <Link to="/courses" className="text-brand-600 hover:underline">返回课程列表</Link>
      </div>
    )
  }

  const markDone = () => {
    if (!currentSection) return
    setCompletedSections((prev) => new Set(prev).add(currentSection.id))
    markComplete({
      courseId: course.id,
      chapterId: chapter.id,
      sectionId: currentSection.id,
    })
  }

  const gotoSection = (idx: number) => {
    if (idx >= 0 && idx < sections.length) setCurrentSectionIdx(idx)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1">
        <Link to={`/courses/${course.id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-4">
          <ArrowLeft size={16} /> 返回课程
        </Link>

        {/* Section Player Area */}
        <div className="card overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
            <div className="text-center text-white">
              <PlayCircle size={64} className="mx-auto mb-3 opacity-60" />
              <p className="text-lg font-medium">
                {currentSection?.type === 'video' ? '视频播放器占位' :
                 currentSection?.type === 'reading' ? '富文本阅读区' :
                 currentSection?.type === 'interactive' ? '互动学习模块' :
                 currentSection?.type === 'code' ? '代码工坊' : '闯关测验'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {currentSection?.title}
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{currentSection?.title}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {course.subjectName} · {chapter.title} · 第 {currentSectionIdx + 1}/{sections.length} 节
                </p>
              </div>
              <button
                onClick={markDone}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  completedSections.has(currentSection?.id || '')
                    ? 'bg-green-100 text-green-700'
                    : 'btn-primary'
                }`}
              >
                <CheckCircle2 size={16} />
                {completedSections.has(currentSection?.id || '') ? '已完成' : '标记完成'}
              </button>
            </div>

            {/* AI Ask Bar */}
            <div className="bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-brand-600" size={16} />
                <span className="text-sm font-medium text-brand-700">AI 随堂答疑</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="这里没听懂？输入问题让 AI 换种方式讲解..."
                  className="flex-1 input-field bg-white"
                />
                <button className="btn-primary px-4">
                  <Send size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['用通俗话解释', '给个类比', '再深入一点', '出道练习题'].map((tip) => (
                  <button
                    key={tip}
                    className="text-xs px-3 py-1 rounded-full bg-white border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Module Preview */}
            {(currentSection?.type === 'interactive' || currentSection?.type === 'code') && (
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">本章节可用互动模块</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {chapter.interactiveTypes.map((type) => {
                    const meta = INTERACTIVE_LABEL[type] || { label: type, icon: Sparkles }
                    const Icon = meta.icon
                    return (
                      <div
                        key={type}
                        className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-200 transition-all cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                          <Icon size={18} />
                        </div>
                        <span className="font-medium text-slate-700">{meta.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={() => gotoSection(currentSectionIdx - 1)}
                disabled={currentSectionIdx === 0}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} /> 上一节
              </button>
              <button
                onClick={() => gotoSection(currentSectionIdx + 1)}
                disabled={currentSectionIdx >= sections.length - 1}
                className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
              >
                下一节 <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Outline */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="card p-5 sticky top-20">
          <h3 className="font-semibold text-slate-800 mb-1">{chapter.title}</h3>
          <p className="text-xs text-slate-400 mb-4">{chapter.duration} 分钟 · {sections.length} 节</p>
          <div className="space-y-1">
            {sections.map((s, idx) => {
              const active = idx === currentSectionIdx
              const done = completedSections.has(s.id)
              const Icon = s.type === 'video' ? PlayCircle : s.type === 'code' ? Code : s.type === 'quiz' ? MessageSquare : Sparkles
              return (
                <button
                  key={s.id}
                  onClick={() => gotoSection(idx)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    active ? 'bg-brand-50 border border-brand-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-brand-600' : 'text-slate-400'} />
                  <span className={`text-sm flex-1 ${active ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                    {s.title}
                  </span>
                  {done && <CheckCircle2 size={14} className="text-green-500" />}
                </button>
              )
            })}
          </div>
        </div>
      </aside>
    </div>
  )
}
