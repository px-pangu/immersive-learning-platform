import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, RotateCcw, CheckCircle2, XCircle, Sparkles, AlertCircle } from 'lucide-react'

interface Props {
  title?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

const LEVELS = {
  easy: {
    label: '简单',
    color: '#22c55e',
    sentences: [
      { en: 'Good morning! How are you today?', zh: '早上好！你今天怎么样？' },
      { en: 'I would like a cup of coffee, please.', zh: '请给我一杯咖啡。' },
      { en: 'Nice to meet you.', zh: '很高兴认识你。' },
    ],
  },
  medium: {
    label: '中等',
    color: '#f59e0b',
    sentences: [
      {
        en: 'Technology has transformed the way we communicate with each other.',
        zh: '科技改变了我们相互沟通的方式。',
      },
      {
        en: 'Learning a new language requires patience and consistent practice.',
        zh: '学习一门新语言需要耐心和持续的练习。',
      },
    ],
  },
  hard: {
    label: '困难',
    color: '#ef4444',
    sentences: [
      {
        en: 'The intergovernmental panel on climate change warned that immediate action is necessary.',
        zh: '联合国气候变化专门委员会警告必须立即采取行动。',
      },
      {
        en: 'Quantum computing promises to revolutionize cryptography within the next decade.',
        zh: '量子计算有望在未来十年内彻底改变密码学。',
      },
    ],
  },
}

// Web Speech API type declaration (minimal)
type RecogResult = {
  isFinal: boolean
  0: { transcript: string; confidence: number }
}
type Recognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((e: { results: RecogResult[] }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
  start: () => void
  stop: () => void
}

function getRecognition(): Recognition | null {
  const anyWin = window as unknown as {
    SpeechRecognition?: new () => Recognition
    webkitSpeechRecognition?: new () => Recognition
  }
  const Ctor = anyWin.SpeechRecognition || anyWin.webkitSpeechRecognition
  return Ctor ? new Ctor() : null
}

// Simple word-level similarity (Levenshtein)
function similarity(a: string, b: string): number {
  const la = a.toLowerCase().replace(/[^a-z\s]/g, '').trim()
  const lb = b.toLowerCase().replace(/[^a-z\s]/g, '').trim()
  if (!la || !lb) return 0
  const wordsA = la.split(/\s+/)
  const wordsB = lb.split(/\s+/)
  let matches = 0
  const used = new Set<number>()
  for (const wa of wordsA) {
    let bestIdx = -1
    let bestScore = 0
    for (let i = 0; i < wordsB.length; i++) {
      if (used.has(i)) continue
      const score = wordSim(wa, wordsB[i])
      if (score > bestScore) { bestScore = score; bestIdx = i }
    }
    if (bestScore > 0.6) { matches++; used.add(bestIdx) }
  }
  return matches / Math.max(wordsA.length, wordsB.length)
}

function wordSim(a: string, b: string): number {
  if (a === b) return 1
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1]
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  const dist = dp[m][n]
  return 1 - dist / Math.max(m, n)
}

export default function VoiceFollow({ title = '跟读评测', difficulty = 'easy' }: Props) {
  const [diff, setDiff] = useState(difficulty)
  const level = LEVELS[diff]
  const [idx, setIdx] = useState(0)
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'pass' | 'fail' | null>(null)
  const [recErr, setRecErr] = useState<string | null>(null)
  const recognitionRef = useRef<Recognition | null>(null)

  const sentence = level.sentences[idx]
  const supported = typeof window !== 'undefined' && !!(window as any).webkitSpeechRecognition && 'speechSynthesis' in window

  useEffect(() => {
    setTranscript(''); setScore(null); setFeedback(null); setRecErr(null)
  }, [idx, difficulty])

  const speak = () => {
    const u = new SpeechSynthesisUtterance(sentence.en)
    u.lang = 'en-US'
    u.rate = 0.9
    speechSynthesis.speak(u)
  }

  const startRecord = () => {
    setTranscript(''); setScore(null); setFeedback(null); setRecErr(null)
    const rec = getRecognition()
    if (!rec) {
      // Fallback: manual input for unsupported browsers
      setRecErr('浏览器不支持语音识别，请手动输入你的朗读内容作为替代')
      return
    }
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      let t = ''
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript
      setTranscript(t)
    }
    rec.onerror = (e) => { setRecErr(e.error); setRecording(false) }
    rec.onend = () => setRecording(false)
    recognitionRef.current = rec
    setRecording(true)
    rec.start()
  }

  const stopRecord = () => {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  const evaluate = () => {
    if (!transcript.trim()) { setFeedback('fail'); setScore(0); return }
    const sim = Math.round(similarity(transcript, sentence.en) * 100)
    setScore(sim)
    setFeedback(sim >= 70 ? 'pass' : 'fail')
  }

  return (
    <div className="space-y-4">
      {/* Difficulty badge */}
      <div className="flex items-center gap-2">
        {Object.entries(LEVELS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => { setDiff(k as keyof typeof LEVELS); setIdx(0); setTranscript(''); setScore(null); setFeedback(null) }}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
              k === diff ? 'text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            style={k === diff ? { backgroundColor: v.color } : {}}
          >
            {v.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">
          {idx + 1} / {level.sentences.length}
        </span>
      </div>

      {/* Target sentence card */}
      <div className="card p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-blue-700 font-bold text-lg">📖</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 text-lg leading-relaxed">{sentence.en}</h4>
            <p className="text-slate-500 text-sm mt-1">{sentence.zh}</p>
          </div>
          <button
            onClick={speak}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
          >
            <Play size={14} /> 听发音
          </button>
        </div>
      </div>

      {/* Record + Transcript */}
      <div className="card p-5">
        <p className="text-xs text-slate-500 mb-3">
          {supported
            ? '点击麦克风，跟着朗读这句话。系统会用 AI 识别并打分。'
            : '你的浏览器不完全支持，可用下方文本框手动输入朗读内容。'}
        </p>

        <div className="flex gap-3 items-center">
          {supported ? (
            recording ? (
              <button
                onClick={stopRecord}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center shadow-lg transition-all animate-pulse"
              >
                <Square size={24} />
              </button>
            ) : (
              <button
                onClick={startRecord}
                className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-lg transition-all"
              >
                <Mic size={24} />
              </button>
            )
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center">
              <Mic size={24} className="text-slate-400" />
            </div>
          )}

          <input
            value={transcript}
            onChange={(e) => { setTranscript(e.target.value); setScore(null); setFeedback(null) }}
            placeholder={supported ? '识别到的文字会出现在这里...' : '手动输入你朗读的内容...'}
            className="flex-1 input-field bg-white"
          />
        </div>

        {recErr && (
          <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 flex items-center gap-2">
            <AlertCircle size={14} /> {recErr}
          </div>
        )}

        {recording && (
          <div className="mt-3 flex items-center gap-2 text-xs text-red-500">
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-1 bg-red-500 rounded-full animate-bounce"
                  style={{ height: `${6 + i * 2}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            正在录音...
          </div>
        )}

        {feedback !== null && (
          <div
            className={`mt-4 p-3 rounded-lg border flex items-center gap-3 ${
              feedback === 'pass'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {feedback === 'pass' ? (
              <CheckCircle2 size={20} className="text-green-500" />
            ) : (
              <XCircle size={20} className="text-amber-500" />
            )}
            <div>
              <p className="font-semibold">
                {feedback === 'pass' ? `发音不错！得分 ${score}/100` : `得分 ${score}/100，继续练习！`}
              </p>
              <p className="text-xs opacity-80">
                {feedback === 'pass'
                  ? '语素匹配度高，重音和停顿基本正确'
                  : '注意重音位置，多听几遍示范再读'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={evaluate}
          disabled={!transcript.trim()}
          className="btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Sparkles size={16} /> AI 打分
        </button>
        <button
          onClick={() => setIdx((i) => (i + 1) % level.sentences.length)}
          className="btn-secondary flex items-center gap-1"
        >
          <RotateCcw size={14} /> 下一句
        </button>
      </div>
    </div>
  )
}
