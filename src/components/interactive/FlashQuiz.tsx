import { useState, useMemo, useEffect } from 'react'
import { Trophy, CheckCircle2, XCircle, RefreshCw, Zap, Target } from 'lucide-react'

export interface QuizQuestion {
  id: string
  type: 'single' | 'multi' | 'fill' | 'match'
  question: string
  options?: string[]
  answer: string | string[] // 单选/填空: string, 多选: string[], 连线: 左→右 map
  explanation: string
  points?: number
}

interface Props {
  title?: string
  questions: QuizQuestion[]
  onComplete?: (score: number, total: number) => void
  subject?: string
}

export default function FlashQuiz({ title = '知识点闯关', questions, onComplete, subject = '通用' }: Props) {
  const [idx, setIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState<string | string[]>([])
  const [selected, setSelected] = useState<string[]>([]) // multi-select
  const [fillText, setFillText] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)

  const q = questions[idx]
  const total = questions.length

  useEffect(() => {
    if (selected.length > 0) { setUserAnswer(selected); }
  }, [selected])

  const submit = () => {
    if (!q) return
    let correct = false
    let finalAns: string | string[] = ''

    if (q.type === 'single') {
      finalAns = selected[0] || ''
      correct = finalAns === q.answer
    } else if (q.type === 'multi') {
      const a = Array.isArray(q.answer) ? q.answer : []
      finalAns = selected
      correct = selected.length === a.length && selected.every((s) => a.includes(s))
    } else if (q.type === 'fill') {
      finalAns = fillText.trim()
      const ans = (q.answer as string).trim().toLowerCase()
      correct = finalAns.toLowerCase() === ans
    }

    setFeedback(correct ? 'correct' : 'wrong')
    setAnsweredCount((n) => n + 1)

    if (correct) {
      const points = q.points || 10
      const comboBonus = combo >= 2 ? Math.floor(combo / 2) * 2 : 0
      setScore((s) => s + points + comboBonus)
      const newCombo = combo + 1
      setCombo(newCombo)
      setMaxCombo((m) => Math.max(m, newCombo))
    } else {
      setCombo(0)
    }
  }

  const next = () => {
    if (idx < total - 1) {
      setIdx(idx + 1)
      setFeedback(null)
      setSelected([])
      setFillText('')
    } else {
      setFinished(true)
      onComplete?.(score, total * 10)
    }
  }

  const retry = () => {
    setIdx(0)
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setFeedback(null)
    setSelected([])
    setFillText('')
    setFinished(false)
    setAnsweredCount(0)
  }

  const toggleSelect = (opt: string) => {
    if (q.type === 'single') {
      setSelected([opt])
    } else {
      setSelected((prev) =>
        prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
      )
    }
  }

  if (finished) {
    const maxScore = total * 10
    const pct = Math.round((score / maxScore) * 100)
    return (
      <div className="card p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Trophy className="text-white" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          {pct >= 90 ? '太棒了！通关！' : pct >= 60 ? '还不错，继续加油！' : '再来一次，你可以的！'}
        </h3>
        <div className="grid grid-cols-3 gap-4 my-6 max-w-sm mx-auto">
          <div>
            <p className="text-3xl font-bold text-brand-600">{score}</p>
            <p className="text-xs text-slate-500">得分</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-500">{maxCombo}🔥</p>
            <p className="text-xs text-slate-500">最高连击</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">{pct}%</p>
            <p className="text-xs text-slate-500">正确率</p>
          </div>
        </div>
        <button onClick={retry} className="btn-primary inline-flex items-center gap-2">
          <RefreshCw size={16} /> 再玩一次
        </button>
      </div>
    )
  }

  if (!q) return <div className="text-center py-8 text-slate-500">暂无题目</div>

  const progress = ((idx + 1) / total) * 100

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-brand-500 to-purple-500 rounded">
            {subject}
          </span>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-slate-500">
            <Target size={12} /> {idx + 1} / {total}
          </span>
          <span className="flex items-center gap-1 text-amber-600">
            <Zap size={12} /> {score}
          </span>
          {combo >= 2 && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded font-bold flex items-center gap-1">
              🔥 ×{combo}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
            {q.type === 'single' ? '单选' : q.type === 'multi' ? '多选' : '填空'}
          </span>
        </div>
        <h4 className="text-lg font-semibold text-slate-800 leading-relaxed">{q.question}</h4>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-5">
        {(q.type === 'single' || q.type === 'multi') &&
          q.options?.map((opt, oi) => {
            const chosen = selected.includes(opt)
            const showCorrectHint = feedback !== null && (Array.isArray(q.answer) ? q.answer.includes(opt) : q.answer === opt)
            const isWrongChosen = feedback === 'wrong' && chosen && !showCorrectHint
            return (
              <button
                key={oi}
                disabled={feedback !== null}
                onClick={() => toggleSelect(opt)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  showCorrectHint
                    ? 'border-green-400 bg-green-50 text-green-800'
                    : isWrongChosen
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : chosen
                    ? 'border-brand-400 bg-brand-50 text-brand-800'
                    : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white border border-current flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(65 + oi)}
                </span>
                <span className="flex-1">{opt}</span>
                {showCorrectHint && <CheckCircle2 size={18} className="text-green-500" />}
                {isWrongChosen && <XCircle size={18} className="text-red-500" />}
              </button>
            )
          })}

        {q.type === 'fill' && (
          <input
            value={fillText}
            onChange={(e) => setFillText(e.target.value)}
            disabled={feedback !== null}
            placeholder="在这里输入你的答案..."
            className="input-field text-lg"
          />
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-lg mb-4 border ${
            feedback === 'correct'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold mb-1">
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 size={16} /> 回答正确！
                {combo >= 2 && <span className="text-orange-500">🔥 ×{combo} 连击！</span>}
              </>
            ) : (
              <>
                <XCircle size={16} /> 正确答案：{Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
              </>
            )}
          </div>
          <p className="text-sm opacity-90">💡 {q.explanation}</p>
        </div>
      )}

      {/* Action */}
      {!feedback ? (
        <button
          onClick={submit}
          disabled={
            (q.type === 'single' && selected.length === 0) ||
            (q.type === 'multi' && selected.length === 0) ||
            (q.type === 'fill' && !fillText.trim())
          }
          className="btn-primary w-full disabled:opacity-50"
        >
          提交答案
        </button>
      ) : (
        <button onClick={next} className="btn-primary w-full">
          {idx < total - 1 ? '下一题 →' : '查看成绩'}
        </button>
      )}
    </div>
  )
}

// ---- Built-in 题库（可按学科扩展） ----

export const PYTHON_QUIZ: QuizQuestion[] = [
  {
    id: 'p1',
    type: 'single',
    question: 'Python 中用于定义函数的关键字是？',
    options: ['func', 'def', 'function', 'fn'],
    answer: 'def',
    explanation: 'Python 使用 def 关键字定义函数，如 def my_func():',
    points: 10,
  },
  {
    id: 'p2',
    type: 'fill',
    question: '快速排序的平均时间复杂度用大 O 表示是 ______',
    answer: 'O(n log n)',
    explanation: '快速排序平均情况下每次划分把问题规模减半，递归深度 log n，每层处理 n 个元素',
    points: 15,
  },
  {
    id: 'p3',
    type: 'multi',
    question: '以下哪些是 Python 的不可变类型？（多选）',
    options: ['tuple', 'list', 'str', 'dict', 'int'],
    answer: ['tuple', 'str', 'int'],
    explanation: 'tuple / str / int 创建后内容不可变；list 和 dict 可以增删改',
    points: 20,
  },
]

export const MATH_QUIZ: QuizQuestion[] = [
  {
    id: 'm1',
    type: 'single',
    question: '函数 f(x) = x² 的导数 f\'(x) = ？',
    options: ['x', '2x', 'x²', '2'],
    answer: '2x',
    explanation: '幂函数求导公式：(xⁿ)\' = n·xⁿ⁻¹，所以 (x²)\' = 2x',
    points: 10,
  },
  {
    id: 'm2',
    type: 'fill',
    question: 'ln(e) = ______',
    answer: '1',
    explanation: 'ln 是自然对数，底数为 e，所以 ln(e) = 1',
    points: 10,
  },
  {
    id: 'm3',
    type: 'single',
    question: '一个等差数列首项为 2，公差为 3，第 10 项是？',
    options: ['27', '29', '30', '32'],
    answer: '29',
    explanation: 'aₙ = a₁ + (n-1)d = 2 + 9×3 = 29',
    points: 15,
  },
]
