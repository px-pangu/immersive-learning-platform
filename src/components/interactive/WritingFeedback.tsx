import { useState } from 'react'
import { Send, Sparkles, RotateCcw, CheckCircle2, XCircle, FileText, Star, AlertTriangle, ThumbsUp } from 'lucide-react'
import { apiAI } from '../../lib/api'

interface Props {
  title?: string
  prompt?: string
}

interface Criterion {
  name: string
  score: number // 0-25
  feedback: string
  color: string
}

interface FullReview {
  overall: number
  grade: string
  criteria: Criterion[]
  strengths: string[]
  issues: { text: string; type: 'grammar' | 'logic' | 'content' | 'structure' }[]
  rewrite: string
}

const GRADES: { min: number; grade: string; color: string }[] = [
  { min: 85, grade: 'A 优秀', color: '#22c55e' },
  { min: 70, grade: 'B 良好', color: '#84cc16' },
  { min: 60, grade: 'C 及格', color: '#f59e0b' },
  { min: 40, grade: 'D 需改进', color: '#ef4444' },
  { min: 0, grade: 'F 不及格', color: '#b91c1c' },
]

function gradeFor(score: number) {
  return GRADES.find((g) => score >= g.min) || GRADES[GRADES.length - 1]
}

/* ---- Mock AI 评分（根据文本统计特征生成） ---- */

function mockGrade(text: string): FullReview {
  const n = text.trim().length
  const sentences = text.split(/[.!?。！？]+/).filter((s) => s.trim().length > 0)
  const avgLen = sentences.length ? n / sentences.length : 0
  const hasStructure = /首先|其次|再者|最后|第一|第二|第三|综上所述|总而言之|therefore|moreover|finally/i.test(text)
  const hasEvidence = /例如|比如|举例|据|数据显示|research|studies|研究表明|根据/i.test(text)
  const hasTransition = /但是|然而|不过|although|however|but/i.test(text)
  const properNouns = (text.match(/[A-Z][a-z]+/g) || []).length

  // Heuristic scores
  const logicScore = Math.min(25, 8 + (hasStructure ? 8 : 0) + (avgLen > 15 && avgLen < 40 ? 5 : 0) + Math.min(4, sentences.length))
  const contentScore = Math.min(25, 5 + (hasEvidence ? 10 : 0) + Math.min(8, properNouns) + Math.min(2, Math.floor(n / 200)))
  const structureScore = Math.min(25, 5 + (hasStructure ? 10 : 0) + (hasTransition ? 5 : 0) + Math.min(5, Math.floor(sentences.length / 2)))
  const grammarScore = Math.min(25, 15 + (avgLen > 10 ? 5 : 0) + (n > 200 ? 3 : 0) + Math.floor(Math.random() * 3))

  const criteria: Criterion[] = [
    {
      name: '内容充实度',
      score: contentScore,
      color: '#22c55e',
      feedback: hasEvidence
        ? '内容有具体证据支撑，论述较为饱满'
        : '论点较多但缺少数据/例子支撑，建议增加案例',
    },
    {
      name: '逻辑结构',
      score: structureScore,
      color: '#3b82f6',
      feedback: hasStructure
        ? '结构清晰，能看出层次（首先/其次/最后）'
        : '段落之间缺乏明显层次，建议用连接词串联',
    },
    {
      name: '论证严密',
      score: logicScore,
      color: '#f59e0b',
      feedback: avgLen > 15 && avgLen < 40
        ? '句子长度适中，表达清楚'
        : avgLen < 12
        ? '句子过短，可适当合并提升流畅度'
        : '句子过长，可拆分为短句避免冗长',
    },
    {
      name: '语言表达',
      score: grammarScore,
      color: '#a855f7',
      feedback: hasTransition
        ? '有使用关联词体现逻辑转折'
        : '整体流畅，但可多使用过渡词（然而/因此/此外）',
    },
  ]

  const overall = criteria.reduce((a, c) => a + c.score, 0)

  const strengths: string[] = []
  if (hasStructure) strengths.push('✅ 文章有清晰的结构框架')
  if (hasEvidence) strengths.push('✅ 使用了具体的例子/数据支撑论点')
  if (sentences.length >= 4) strengths.push('✅ 段落展开比较充分')
  if (properNouns >= 3) strengths.push('✅ 提及了多个具体概念/专有名词')
  if (avgLen > 15 && avgLen < 35) strengths.push('✅ 句子长度适中，读感流畅')

  const issues: FullReview['issues'] = []
  if (!hasStructure) issues.push({ text: '缺少"首先/其次/最后"等结构标记', type: 'structure' })
  if (!hasEvidence) issues.push({ text: '建议加入 1-2 个具体例子或数据', type: 'content' })
  if (!hasTransition && sentences.length > 3) issues.push({ text: '段落之间缺少过渡词衔接', type: 'logic' })
  if (n < 100) issues.push({ text: '字数偏少（< 100 字），可进一步展开论述', type: 'content' })
  if (avgLen > 40) issues.push({ text: '部分句子过长，建议拆分', type: 'grammar' })

  // Mock rewrite suggestion
  let rewrite = text
    .replace(/。/g, '。 ')
    .replace(/，/g, '， ')
  if (!hasStructure && sentences.length >= 2) {
    const parts = sentences.slice(0, Math.min(3, sentences.length))
    rewrite = `首先，${parts[0].trim()}。其次，${parts[1].trim()}。${
      parts[2] ? `再者，${parts[2].trim()}。` : ''
    }综上所述，本文的核心观点是：${sentences[sentences.length - 1].trim()}。`
  } else if (!hasEvidence) {
    rewrite = text.trim() + '（例如，据某项研究显示，这一观点在实际场景中得到了有效验证。）'
  }

  if (strengths.length === 0) strengths.push('📝 已完成一次写作，继续打磨就能进步！')

  return { overall, grade: gradeFor(overall).grade, criteria, strengths, issues, rewrite }
}

export default function WritingFeedback({
  title = '写作智能批改',
  prompt = '请写一篇关于"AI 对教育的影响"的议论文（300-500 字）',
}: Props) {
  const [text, setText] = useState('')
  const [review, setReview] = useState<FullReview | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (text.trim().length < 20) return
    setLoading(true)
    setReview(null)
    try {
      // 走后端（真实 LLM 或 mock），后端返回结构化 JSON
      const data = await apiAI.writingFeedback(text, { prompt })
      setReview({
        overall: data.overall ?? 0,
        grade: data.grade ?? '及格',
        criteria: data.criteria ?? [],
        strengths: data.strengths ?? [],
        issues: data.issues ?? [],
        rewrite: data.rewrite ?? text,
      })
    } catch {
      // 后端不可用 → 本地 fallback
      setReview(mockGrade(text))
    }
    setLoading(false)
  }

  const reset = () => { setText(''); setReview(null) }

  const currentGrade = review ? gradeFor(review.overall) : null

  return (
    <div className="space-y-4">
      {/* Prompt */}
      <div className="card p-4 bg-gradient-to-br from-purple-50 to-brand-50 border-purple-100">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={14} className="text-purple-600" />
          <span className="text-xs font-bold text-purple-700">写作题目</span>
        </div>
        <p className="font-medium text-slate-800 text-sm">{prompt}</p>
      </div>

      {/* Editor */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">你的作文</span>
          <span className="text-xs text-slate-400">{text.length} 字</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="在这里开始写作...（建议 100-600 字以上）"
          className="w-full p-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all font-mono leading-relaxed"
        />

        <div className="flex gap-3 mt-3">
          <button
            onClick={submit}
            disabled={text.trim().length < 20 || loading}
            className="btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles size={16} className="animate-spin" /> AI 批改中...
              </>
            ) : (
              <>
                <Sparkles size={16} /> 提交批改
              </>
            )}
          </button>
          <button
            onClick={reset}
            className="btn-secondary flex items-center gap-1"
          >
            <RotateCcw size={14} /> 清空
          </button>
        </div>
      </div>

      {/* Review Result */}
      {review && currentGrade && (
        <div className="space-y-4 animate-in fade-in">
          {/* Score Header */}
          <div
            className="card p-6 text-center text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${currentGrade.color}, ${currentGrade.color}cc)` }}
          >
            <div className="absolute inset-0 opacity-20">
              <Star className="absolute top-3 right-6" size={80} />
            </div>
            <div className="relative">
              <p className="text-sm opacity-90">AI 综合评分</p>
              <p className="text-6xl font-bold my-2">{review.overall}</p>
              <p className="text-lg font-semibold">{review.grade}</p>
            </div>
          </div>

          {/* Radar-ish criterion cards */}
          <div className="grid grid-cols-2 gap-3">
            {review.criteria.map((c) => (
              <div key={c.name} className="card p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">{c.name}</span>
                  <span className="text-xs font-bold" style={{ color: c.color }}>
                    {c.score}/25
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(c.score / 25) * 100}%`, backgroundColor: c.color }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-snug">{c.feedback}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {review.strengths.length > 0 && (
            <div className="card p-4 border-green-200 bg-green-50/40">
              <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1">
                <ThumbsUp size={14} /> 亮点总结
              </h4>
              <ul className="space-y-1">
                {review.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-green-700">{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {review.issues.length > 0 && (
            <div className="card p-4 border-amber-200 bg-amber-50/40">
              <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1">
                <AlertTriangle size={14} /> 改进建议
              </h4>
              <ul className="space-y-1">
                {review.issues.map((is, i) => (
                  <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                    {is.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rewrite */}
          <div className="card p-4 bg-gradient-to-br from-slate-50 to-white">
            <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <Sparkles size={14} className="text-purple-500" /> AI 改写建议（片段示例）
            </h4>
            <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-3 leading-relaxed">
              {review.rewrite}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
