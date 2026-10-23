import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Code, MessageSquare, Sparkles, FileText, Atom } from 'lucide-react'
import { useCourseStore } from '../store/useCourseStore'
import FlashQuiz, { PYTHON_QUIZ, MATH_QUIZ, type QuizQuestion } from '../components/interactive/FlashQuiz'
import KnowledgeGraph, { PYTHON_KG, MATH_KG, type KGNode, type KGEdge } from '../components/interactive/KnowledgeGraph'
import AIInstantQA from '../components/interactive/AIInstantQA'
import FormulaDerivation, { CALCULUS_LIMIT, QUADRATIC_DERIV, type DerivStep } from '../components/interactive/FormulaDerivation'
import DynamicExperiment from '../components/interactive/DynamicExperiment'
import ScenarioRoleplay from '../components/interactive/ScenarioRoleplay'
import VoiceFollow from '../components/interactive/VoiceFollow'
import WritingFeedback from '../components/interactive/WritingFeedback'

type InteractiveType =
  | 'flash-quiz'
  | 'knowledge-graph'
  | 'code-playground'
  | 'formula-derivation'
  | 'dynamic-experiment'
  | 'scenario-roleplay'
  | 'text-annotation'
  | 'voice-follow'
  | 'ai-writing-feedback'
  | 'algorithm-viz'
  | 'ai-agent-lite'
  | 'path-brainmap'

interface InteractiveMeta {
  type: InteractiveType
  label: string
  icon: typeof BookOpen
  desc: string
  implemented: boolean
  color: string
}

const ALL_INTERACTIVES: Record<InteractiveType, InteractiveMeta> = {
  'flash-quiz': { type: 'flash-quiz', label: '闯关小游戏', icon: MessageSquare, desc: '知识点消化卡，答对积分连击奖励', implemented: true, color: '#8b5cf6' },
  'knowledge-graph': { type: 'knowledge-graph', label: '知识图谱', icon: BookOpen, desc: '章节节点 + 前置依赖 + 掌握状态', implemented: true, color: '#22c55e' },
  'code-playground': { type: 'code-playground', label: '代码沙箱', icon: Code, desc: 'Monaco Editor + Pyodide 运行时', implemented: false, color: '#6366f1' },
  'formula-derivation': { type: 'formula-derivation', label: '公式推导板', icon: FileText, desc: '拖拽步骤排序 · 逻辑链校验', implemented: true, color: '#f59e0b' },
  'dynamic-experiment': { type: 'dynamic-experiment', label: '动态实验台', icon: Atom, desc: '平抛运动 / 二次函数 · SVG 实时渲染', implemented: true, color: '#06b6d4' },
  'scenario-roleplay': { type: 'scenario-roleplay', label: '情景角色扮演', icon: MessageSquare, desc: '多分支剧情树 AI NPC 对话', implemented: true, color: '#ec4899' },
  'text-annotation': { type: 'text-annotation', label: '文本深度标注', icon: FileText, desc: '段落高亮 + 词汇悬浮释义', implemented: false, color: '#ef4444' },
  'voice-follow': { type: 'voice-follow', label: '音频跟读评测', icon: Sparkles, desc: 'Web Speech API 录音 + AI 打分', implemented: true, color: '#3b82f6' },
  'ai-writing-feedback': { type: 'ai-writing-feedback', label: '写作智能批改', icon: Sparkles, desc: '语法/结构评分 + AI 改写建议', implemented: true, color: '#a855f7' },
  'algorithm-viz': { type: 'algorithm-viz', label: '算法可视化', icon: Sparkles, desc: '排序/搜索动态过程渲染', implemented: false, color: '#14b8a6' },
  'ai-agent-lite': { type: 'ai-agent-lite', label: 'AI Agent 迷你工坊', icon: Sparkles, desc: 'Prompt 链构建 + 工具调用模拟', implemented: false, color: '#d946ef' },
  'path-brainmap': { type: 'path-brainmap', label: '学习路径脑图', icon: Sparkles, desc: '个人知识图谱 + 推荐下一步', implemented: false, color: '#64748b' },
}

// 根据 subject 选择对应的题库和知识图谱
function getSubjectResources(subject: string): {
  quiz: QuizQuestion[]
  kg: { nodes: KGNode[]; edges: KGEdge[] }
} {
  const sub = subject.toLowerCase()
  if (sub.includes('python') || sub.includes('c语言') || sub.includes('c++') || sub.includes('代码') || sub.includes('ai')) {
    return { quiz: PYTHON_QUIZ, kg: PYTHON_KG }
  }
  if (sub.includes('数学') || sub.includes('物理')) {
    return { quiz: MATH_QUIZ, kg: MATH_KG }
  }
  // 默认：Python 相关资源（通用编程思维）
  return { quiz: PYTHON_QUIZ, kg: PYTHON_KG }
}

export default function InteractivePlayground() {
  const { type, courseId, chapterId } = useParams<{
    type: InteractiveType
    courseId: string
    chapterId: string
  }>()
  const { getCourseById } = useCourseStore()

  const course = courseId ? getCourseById(courseId) : undefined
  const chapter = course?.chapters.find((c) => c.id === chapterId)
  const meta = type ? ALL_INTERACTIVES[type] : undefined

  if (!meta) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold text-slate-700 mb-2">互动模块未找到</p>
        <Link to="/courses" className="text-brand-600 hover:underline">
          返回课程列表
        </Link>
      </div>
    )
  }

  const subjectName = course?.subjectName || '当前课程'
  const resources = getSubjectResources(subjectName)

  const renderContent = () => {
    switch (meta.type) {
      case 'flash-quiz':
        return (
          <FlashQuiz
            title={`${chapter?.title || '章节'} · 知识点闯关`}
            subject={subjectName}
            questions={resources.quiz}
          />
        )

      case 'knowledge-graph':
        return (
          <KnowledgeGraph
            title={`${chapter?.title || '章节'} · 知识图谱`}
            subject={subjectName}
            nodes={resources.kg.nodes}
            edges={resources.kg.edges}
          />
        )

      case 'formula-derivation': {
        const isMath = subjectName.includes('数学') || subjectName.includes('物理')
        const steps: DerivStep[] = isMath ? CALCULUS_LIMIT : QUADRATIC_DERIV
        return (
          <FormulaDerivation
            title={`${chapter?.title || '章节'} · 公式推导`}
            problem={isMath ? '重要极限 lim(x→0) sin(x)/x = ?' : '求 f(x) = 3x² - 2x + 1 的导数'}
            hint={isMath ? '小角度近似：当 x 很小时 sin(x) ≈ x' : '使用幂函数求导法则，逐项求导'}
            steps={steps}
          />
        )
      }

      case 'dynamic-experiment':
        return (
          <DynamicExperiment title={`${chapter?.title || '章节'} · 动态实验`} />
        )

      case 'scenario-roleplay':
        return <ScenarioRoleplay />

      case 'voice-follow':
        return <VoiceFollow title={`${chapter?.title || '章节'} · 跟读评测`} />

      case 'ai-writing-feedback':
        return (
          <WritingFeedback
            title={`${chapter?.title || '章节'} · 写作批改`}
            prompt={
              subjectName.includes('英语')
                ? 'Write a 300-word essay on: "How AI will change education in the next 10 years."'
                : subjectName.includes('语文')
                ? '请以《科技与人文》为题，写一篇 500 字左右的议论文。'
                : subjectName.includes('政治')
                ? '请谈谈你对"国家治理现代化"的理解（不少于 400 字）。'
                : '请写一段关于本章节知识点的总结（200-400 字）。'
            }
          />
        )

      default:
        return (
          <div className="card p-10 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
            >
              <meta.icon size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {meta.label}
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              {meta.desc}
              <span className="block mt-2 text-amber-600 text-xs">
                🚧 此模块正在开发中，预计第二批上线。第一批已上线：闯关小游戏 + 知识图谱 + AI 即时答疑
              </span>
            </p>
            <div className="flex items-center justify-center gap-3">
              {course && chapter && (
                <Link
                  to={`/learn/${course.id}/${chapter.id}`}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> 返回学习中心
                </Link>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {course && (
          <Link to={`/courses/${course.id}`} className="hover:text-brand-600">
            {course.subjectName}
          </Link>
        )}
        {course && chapter && <span>/</span>}
        {chapter && (
          <Link
            to={`/learn/${course!.id}/${chapter!.id}`}
            className="hover:text-brand-600"
          >
            {chapter.title}
          </Link>
        )}
        <span>/</span>
        <span className="font-medium text-slate-700">{meta.label}</span>
      </div>

      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)`,
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative flex items-center gap-4">
          <meta.icon size={32} />
          <div>
            <h1 className="text-2xl font-bold">{meta.label}</h1>
            <p className="opacity-90 text-sm mt-1">
              {course?.subjectName} · {chapter?.title || '当前章节'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">{renderContent()}</div>

        {/* Sidebar: AI 答疑 + 返回 */}
        <aside className="space-y-4">
          {chapter && course && (
            <Link
              to={`/learn/${course.id}/${chapter.id}`}
              className="card p-4 hover:shadow-md transition-all flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                <ArrowLeft size={18} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">返回学习中心</p>
                <p className="text-xs text-slate-500">继续本课其他互动</p>
              </div>
            </Link>
          )}

          <div className="card p-4">
            <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="text-brand-500" size={14} /> 遇到问题？
            </h4>
            <AIInstantQA
              chapterTitle={chapter?.title || '当前内容'}
              courseSubject={subjectName}
              defaultExpanded={false}
            />
          </div>

          {/* Other available interactives for this chapter */}
          {chapter && (
            <div className="card p-4">
              <h4 className="font-semibold text-slate-700 text-sm mb-3">本章节其他互动</h4>
              <div className="space-y-1.5">
                {chapter.interactiveTypes
                  .filter((t) => t !== type)
                  .map((it) => {
                    const m = ALL_INTERACTIVES[it]
                    if (!m) return null
                    return (
                      <Link
                        key={it}
                        to={`/interactive/${it}/${course!.id}/${chapter!.id}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600 hover:text-brand-600 transition-colors"
                      >
                        <m.icon size={14} /> {m.label}
                        {!m.implemented && (
                          <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded">
                            开发中
                          </span>
                        )}
                      </Link>
                    )
                  })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
