import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, RotateCcw, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { apiAI } from '../../lib/api'

interface Props {
  chapterTitle: string
  courseSubject: string
  defaultExpanded?: boolean
}

type ExplanationStyle = 'simple' | 'analogy' | 'deep' | 'exercise'

const STYLE_LABEL: Record<ExplanationStyle, string> = {
  simple: '通俗话解释',
  analogy: '给个类比',
  deep: '再深入一点',
  exercise: '出道练习题',
}

/* ====== Mock fallback (当后端不可用时) ====== */
function mockKB(subject: string, style: ExplanationStyle) {
  const sub = subject.toLowerCase()
  const isCode = sub.includes('python') || sub.includes('代码')
  const isMath = sub.includes('数学') || sub.includes('物理')
  if (style === 'simple') {
    if (isCode) return '用一句话说：Python 像乐高积木，每个函数是一块积木，拼起来就是程序。'
    if (isMath) return '导数就是变化快慢——像汽车仪表盘的瞬时速度。'
    return '把它拆成最小的几个关键点，再一个个理解就好。'
  }
  if (style === 'analogy') {
    if (isCode) return 'Python 函数 ≈ 麦当劳的套餐：叫个名字就拿到一套东西，不用管后厨怎么做。'
    if (isMath) return '导数 = 仪表盘上的速度；速度再导一次 = 加速度。位移、速度、加速度是一条链。'
    return '类比成你熟悉的东西——学新乐器像学骑车，都是肌肉记忆 + 基本姿势。'
  }
  if (style === 'deep') {
    if (isCode) return 'CPython 架构：源码 → 字节码 → 解释器执行。动态类型灵活，GIL 保证线程安全。'
    if (isMath) return 'f\'(x) = lim(h→0) [f(x+h) - f(x)] / h，这个极限存在时函数在 x 处可导。'
    return '第一性原理：任何概念都能追溯到几条不可再拆的基本事实。'
  }
  // exercise
  if (isCode) return '小练习：写 is_prime(n) 判断一个数是否为素数。先动手再看答案～'
  if (isMath) return '小练习：求 f(x) = x³ 在 x=2 处的导数。(提示：幂函数公式)'
  return '试试用自己的话向朋友解释这个概念——说不清就是没真懂 ✨'
}
/* ====== end mock ====== */

const MOCK_KB: Record<string, Record<ExplanationStyle, string>> = {} // 保留兼容，实际走 mockKB()

export default function AIInstantQA({ chapterTitle, courseSubject, defaultExpanded = true }: Props) {
  const [input, setInput] = useState('')
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [messages, setMessages] = useState<{ q: string; a: string; style: ExplanationStyle; timestamp: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [lastStyle, setLastStyle] = useState<ExplanationStyle>('simple')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const ask = async (question: string, style: ExplanationStyle = lastStyle) => {
    if (!question.trim()) return
    setLoading(true)
    setLastStyle(style)
    setInput('')

    let answer: string
    try {
      // 优先走后端（可能是 Mock provider，也可能是真 LLM）
      const res = await apiAI.qa(question, {
        subject: courseSubject,
        style,
        chapterTitle,
      })
      answer = res.reply
    } catch {
      // 后端不可用 → 本地 Mock fallback，保证体验不中断
      answer = mockKB(courseSubject, style) + `\n\n_（当前 AI 服务暂不可用，已使用本地知识回复）_`
    }

    setMessages((prev) => [
      ...prev,
      { q: question, a: answer, style, timestamp: Date.now() },
    ])
    setLoading(false)
  }

  const quickAsk = (style: ExplanationStyle) => {
    const defaultQuestions: Record<ExplanationStyle, string> = {
      simple: `能帮我通俗讲《${chapterTitle}》的核心点吗？`,
      analogy: `用生活里的例子类比一下《${chapterTitle}》`,
      deep: `从原理层面深入讲讲《${chapterTitle}》`,
      exercise: `给我出一道《${chapterTitle}》相关的练习题`,
    }
    ask(defaultQuestions[style], style)
  }

  const reset = () => {
    setMessages([])
    setInput('')
  }

  return (
    <div className="bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100 rounded-xl overflow-hidden mb-6">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="text-white" size={14} />
          </div>
          <span className="text-sm font-semibold text-brand-700">AI 随堂答疑</span>
          <span className="text-xs text-slate-400">· 学完还不懂？让 AI 换种方式讲</span>
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <>
          {/* Chat area */}
          {messages.length > 0 && (
            <div ref={scrollRef} className="px-4 pb-3 space-y-3 max-h-64 overflow-y-auto">
              {messages.map((m, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 mt-0.5">我</div>
                    <p className="text-sm text-slate-700 bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">{m.q}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="text-white" size={10} />
                    </div>
                    <div className="text-sm bg-brand-500/10 text-slate-800 rounded-lg rounded-tl-none px-3 py-2 border border-brand-200">
                      <div className="text-[10px] font-semibold text-brand-600 mb-1">
                        {STYLE_LABEL[m.style]}
                      </div>
                      {m.a}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 shrink-0"></div>
                  <div className="bg-brand-500/10 rounded-lg rounded-tl-none px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick style buttons */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {(Object.keys(STYLE_LABEL) as ExplanationStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => quickAsk(s)}
                disabled={loading}
                className="text-xs px-2.5 py-1 rounded-full bg-white border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-50"
              >
                {STYLE_LABEL[s]}
              </button>
            ))}
            {messages.length > 0 && (
              <button
                onClick={reset}
                className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <RotateCcw size={10} /> 重置
              </button>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-brand-100 bg-white/60 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask(input)}
              placeholder={`对《${chapterTitle}》有什么疑问？`}
              className="flex-1 input-field bg-white text-sm"
            />
            <button
              onClick={() => ask(input)}
              disabled={loading || !input.trim()}
              className="btn-primary px-4 disabled:opacity-50 flex items-center gap-1"
            >
              <Send size={14} />
            </button>
          </div>

          {/* Hint */}
          {messages.length === 0 && (
            <div className="px-4 pb-3 text-xs text-slate-400 flex items-center gap-1.5">
              <Lightbulb size={12} />
              试试上方"通俗话解释"或"出道练习题"快速开始对话
            </div>
          )}
        </>
      )}
    </div>
  )
}
