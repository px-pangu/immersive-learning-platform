import { useState, useRef } from 'react'
import { GripVertical, MoveUp, MoveDown, RotateCcw, CheckCircle2, XCircle, Sparkles, Plus, Trash2 } from 'lucide-react'

export interface DerivStep {
  id: string
  formula: string // LaTeX-style pseudo, e.g. "f(x) = x²"
  label: string // 自然语言描述这步做了什么
}

interface Props {
  title?: string
  problem: string
  hint?: string
  steps: DerivStep[] // 正确顺序
}

export default function FormulaDerivation({
  title = '公式推导板',
  problem,
  hint,
  steps,
}: Props) {
  // 初始化：打乱正确顺序作为用户的初始状态
  const shuffle = (arr: DerivStep[]) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    // 防止恰好打乱到正确顺序
    if (a.every((s, i) => s.id === arr[i].id)) {
      ;[a[0], a[1]] = [a[1], a[0]]
    }
    return a
  }

  const [userSteps, setUserSteps] = useState<DerivStep[]>(() => shuffle(steps))
  const [checked, setChecked] = useState(false)
  const [allCorrect, setAllCorrect] = useState(false)
  const dragIdx = useRef<number | null>(null)
  const overIdx = useRef<number | null>(null)

  const correctOrder = steps.map((s) => s.id)

  const onDragStart = (i: number) => {
    dragIdx.current = i
  }
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    overIdx.current = i
  }
  const onDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    const from = dragIdx.current
    if (from === null || from === i) return
    const next = [...userSteps]
    const [moved] = next.splice(from, 1)
    next.splice(i, 0, moved)
    setUserSteps(next)
    setChecked(false)
    dragIdx.current = null
    overIdx.current = null
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= userSteps.length) return
    const next = [...userSteps]
    ;[next[i], next[j]] = [next[j], next[i]]
    setUserSteps(next)
    setChecked(false)
  }

  const check = () => {
    setChecked(true)
    setAllCorrect(userSteps.every((s, i) => s.id === correctOrder[i]))
  }

  const reset = () => {
    setUserSteps(shuffle(steps))
    setChecked(false)
    setAllCorrect(false)
  }

  const showResult = checked && allCorrect

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <span className="text-amber-700 font-bold text-lg">∫</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="text-slate-600 text-sm mt-1">{problem}</p>
            {hint && (
              <p className="text-amber-700/80 text-xs mt-2 flex items-center gap-1.5">
                <Sparkles size={12} /> 💡 提示：{hint}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-slate-500 flex items-center gap-2">
        <GripVertical size={14} />
        拖动左侧把手或使用上下箭头调整步骤顺序，使推导过程逻辑正确
      </p>

      {/* Steps list */}
      <div className="space-y-2">
        {userSteps.map((step, i) => {
          const isCorrectHere = checked && step.id === correctOrder[i]
          const isWrongHere = checked && step.id !== correctOrder[i]
          return (
            <div
              key={step.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDrop={(e) => onDrop(e, i)}
              className={`card p-3 flex items-center gap-3 cursor-move transition-all ${
                isCorrectHere
                  ? 'border-green-300 bg-green-50'
                  : isWrongHere
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5 text-slate-400">
                <GripVertical size={14} className="shrink-0" />
                <span className="text-xs font-bold">{i + 1}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-mono text-base text-slate-800 bg-slate-50 rounded px-2 py-1 mb-1 truncate">
                  {step.formula}
                </div>
                <div className="text-xs text-slate-500 truncate">{step.label}</div>
              </div>

              <div className="flex items-center gap-1">
                {checked && isCorrectHere && (
                  <CheckCircle2 size={18} className="text-green-500" />
                )}
                {checked && isWrongHere && (
                  <XCircle size={18} className="text-red-500" />
                )}
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30"
                  title="上移"
                >
                  <MoveUp size={14} />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === userSteps.length - 1}
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30"
                  title="下移"
                >
                  <MoveDown size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Result banner */}
      {checked && (
        <div
          className={`p-4 rounded-lg border text-center ${
            allCorrect
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {allCorrect ? (
            <p className="font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> 推导链正确！逻辑完美 ✨
            </p>
          ) : (
            <p className="flex items-center justify-center gap-2">
              <XCircle size={16} /> 还有 {(userSteps.filter((s, i) => s.id !== correctOrder[i])).length} 处顺序不对，再试试～
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={check}
          disabled={checked}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          校验推导
        </button>
        <button
          onClick={reset}
          className="btn-secondary flex items-center gap-1"
        >
          <RotateCcw size={14} /> 重新打乱
        </button>
      </div>
    </div>
  )
}

// ---- Built-in 题目 ----

export const CALCULUS_LIMIT: DerivStep[] = [
  { id: 'l1', formula: 'lim(x->0) sin(x) / x = ?', label: '问题：求这个重要极限' },
  { id: 'l2', formula: '当 x = 0 时，分子分母都为 0，属于 0/0 型', label: '第一步：识别不定式类型' },
  { id: 'l3', formula: 'sin(x) approx x - x^3/6 + ... (x->0)', label: '泰勒展开：小角度近似' },
  { id: 'l4', formula: 'lim(x->0) (x - x^3/6) / x = lim 1 - x^2/6 = 1', label: '代入展开式，约分得结果' },
  { id: 'l5', formula: '结论: lim(x->0) sin(x)/x = 1', label: '结论：这个极限等于 1' },
]

export const QUADRATIC_DERIV: DerivStep[] = [
  { id: 'q1', formula: 'f(x) = 3x^2 - 2x + 1', label: '已知函数' },
  { id: 'q2', formula: "(x^n)' = n * x^(n-1)", label: '幂函数求导公式' },
  { id: 'q3', formula: "(3x^2)' = 3 * 2x^1 = 6x", label: '对第一项求导' },
  { id: 'q4', formula: "(-2x)' = -2 * 1x^0 = -2", label: '对第二项求导' },
  { id: 'q5', formula: "(1)' = 0", label: '常数导数为 0' },
  { id: 'q6', formula: "结论: f'(x) = 6x - 2", label: '合并结果' },
]
