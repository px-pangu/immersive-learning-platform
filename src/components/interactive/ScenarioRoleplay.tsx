import { useState, useEffect } from 'react'
import { MessageSquare, User, Bot, Trophy, ChevronRight, RotateCcw, BookOpen, Award, Zap } from 'lucide-react'

export interface DialogueNode {
  id: string
  speaker: 'npc' | 'user' | 'system'
  text: string
  score?: number // AI 给玩家选择的评分（-2 ~ +2）
  choices?: { label: string; next: string }[]
  next?: string // 无 choices 时自动跳转
  ending?: boolean
  endingTitle?: string
}

interface Scenario {
  id: string
  title: string
  description: string
  subject: string
  npcName: string
  npcRole: string
  startId: string
  nodes: Record<string, DialogueNode>
  maxScore: number
}

interface Props {
  scenario?: Scenario
}

/* ---- 三个预设剧情 ---- */

export const ENGLISH_CAFE: Scenario = {
  id: 'cafe',
  title: '英语情景：咖啡店点单',
  subject: '英语',
  npcName: 'Barista Amy',
  npcRole: '咖啡店店员',
  startId: 's0',
  maxScore: 10,
  description: '扮演顾客，在一家英语咖啡店点单。用英语与 Amy 对话，越自然得分越高！',
  nodes: {
    s0: { speaker: 'npc', text: "Hi there! Welcome to Sunny Café. What can I get for you today?", next: 's0c' },
    s0c: {
      speaker: 'user', text: '做出回应...',
      choices: [
        { label: "Hi! I'd like a medium latte, please.", next: 's1a' },
        { label: "Hello. One coffee.", next: 's1b' },
        { label: "Give me drink. Now.", next: 's1c' },
      ],
    },
    s1a: { speaker: 'npc', text: "Great choice! A medium latte. Would you like anything with that — maybe a croissant or muffin?", score: 2, next: 's1ac' },
    s1ac: {
      speaker: 'user', text: '店员推荐点心...',
      choices: [
        { label: "Yes, a blueberry muffin sounds perfect!", next: 's2a' },
        { label: "No thanks, just the latte.", next: 's2b' },
      ],
    },
    s1b: { speaker: 'npc', text: "Sure... just one coffee. Anything else?", score: 0, next: 's1bc' },
    s1bc: {
      speaker: 'user', text: '店员追问...',
      choices: [
        { label: "Actually, yes — could I also get a cookie?", next: 's2c' },
        { label: "No, that's all.", next: 's2b' },
      ],
    },
    s1c: { speaker: 'npc', text: "(slightly taken aback) R-right away... your drink will be out shortly.", score: -2, next: 's2d' },
    s2a: { speaker: 'npc', text: "Excellent! I'll have that latte and muffin ready for you in about three minutes.", score: 1, ending: true, endingTitle: '✅ 完美！自然又礼貌' },
    s2b: { speaker: 'npc', text: "Okay, coming right up. That'll be $4.50.", score: 0, ending: true, endingTitle: '👍 还行，偏简短' },
    s2c: { speaker: 'npc', text: "Sure thing! We have chocolate chip today — would that work?", score: 1, ending: true, endingTitle: '👍 不错！追加点心' },
    s2d: { speaker: 'npc', text: "Here you are... enjoy.", score: -1, ending: true, endingTitle: '😅 店员不太高兴了' },
  },
}

export const POLITICS_DEBATE: Scenario = {
  id: 'debate',
  title: '政治辩论：AI 是否应该被监管',
  subject: '政治',
  npcName: '辩方张教授',
  npcRole: 'AI 伦理专家',
  startId: 'd0',
  maxScore: 12,
  description: '正方 vs 反方。你持正方立场：AI 需要更严格的监管。张教授是反方，请你回应他的论点。',
  nodes: {
    d0: { speaker: 'npc', text: "我们反对过度监管。技术进步会因此受到压制，AI 创新的黄金窗口只有这几年！", next: 'd0c' },
    d0c: {
      speaker: 'user', text: '回应反方论点...',
      choices: [
        { label: "创新不应以牺牲公共安全为代价。汽车有监管，互联网有监管，AI 凭什么例外？", next: 'd1a' },
        { label: "我觉得监管确实可能有些阻碍... 那就先不监管吧。", next: 'd1b' },
        { label: "你根本不懂 AI！就是得监管！", next: 'd1c' },
      ],
    },
    d1a: { speaker: 'npc', text: "有趣的类比。但汽车监管是出了事故之后才逐步加强的——为什么不给 AI 同样的试错空间？", score: 2, next: 'd1ac' },
    d1ac: {
      speaker: 'user', text: '继续回应...',
      choices: [
        { label: "因为 AI 的试错成本是灾难性的。一次自动驾驶事故、一次医疗 AI 误诊，代价可能是生命。", next: 'd2a' },
        { label: "你说得有道理... 也许我们可以再讨论。", next: 'd2b' },
      ],
    },
    d1b: { speaker: 'npc', text: "嗯？正方立场还没站稳就动摇了？请拿出你方论据。", score: -2, ending: true, endingTitle: '❌ 立场不坚定，辩论失败' },
    d1c: { speaker: 'npc', text: "（皱眉）请保持理性。情绪化表达无法说服评委。", score: -1, ending: true, endingTitle: '😅 情绪化了，扣分' },
    d2a: { speaker: 'npc', text: "非常有力的论点，我必须承认。但你方监管方案的具体细则呢？", score: 2, ending: true, endingTitle: '🏆 优秀！逻辑严密，驳倒对方' },
    d2b: { speaker: 'npc', text: "好，让我们给评委呈现一场好的辩论。", score: 0, ending: true, endingTitle: '👍 及格，但缺乏杀伤力' },
  },
}

export const CHINESE_DRAMA: Scenario = {
  id: 'drama',
  title: '语文经典：与苏轼夜游赤壁',
  subject: '语文',
  npcName: '苏轼',
  npcRole: '宋代大文豪',
  startId: 'c0',
  maxScore: 12,
  description: '穿越到黄州赤壁，与苏东坡夜游。你是他的好友杨世昌，和他对话中体会《赤壁赋》的意境。',
  nodes: {
    c0: { speaker: 'npc', text: "（举杯）月出于东山之上，徘徊于斗牛之间。世昌兄，此景何如？", next: 'c0c' },
    c0c: {
      speaker: 'user', text: '如何回应苏轼？',
      choices: [
        { label: "白露横江，水光接天。纵一苇之所如，凌万顷之茫然——好景，好景！", next: 'c1a' },
        { label: "月挺圆的，江也挺宽的。", next: 'c1b' },
        { label: "子瞻兄，咱们聊点别的吧，我不太懂诗文。", next: 'c1c' },
      ],
    },
    c1a: { speaker: 'npc', text: "（大笑）世昌兄竟能诵我新作《赤壁赋》！此乃人生快事也！", score: 3, next: 'c1ac' },
    c1ac: {
      speaker: 'user', text: '苏轼邀你继续...',
      choices: [
        { label: "此赋意境开阔，「寄蜉蝣于天地，渺沧海之一粟」尤令人感怀，兄以为何作此叹？", next: 'c2a' },
        { label: "哈哈过奖过奖，再喝一杯！", next: 'c2b' },
      ],
    },
    c1b: { speaker: 'npc', text: "（摇头微笑）兄台所言甚是直白——可惜辜负了这江月。", score: -1, ending: true, endingTitle: '😅 太口语化，苏东坡无奈' },
    c1c: { speaker: 'npc', text: "（温和）无妨无妨，诗酒趁年华，不懂亦是一种快乐。", score: 0, ending: true, endingTitle: '👍 苏轼体谅你，虽平淡但真诚' },
    c2a: { speaker: 'npc', text: "此叹非悲。天地无尽，人生短暂——但正因短暂，方显得每一瞬的可贵。", score: 3, ending: true, endingTitle: '🏆 满分！你与苏轼心意相通' },
    c2b: { speaker: 'npc', text: "好！好一个「再喝一杯」——这便是东坡啊！", score: 1, ending: true, endingTitle: '😆 豪放派！苏轼大笑' },
  },
}

const ALL_SCENARIOS = [ENGLISH_CAFE, POLITICS_DEBATE, CHINESE_DRAMA]

export default function ScenarioRoleplay({ scenario: external }: Props) {
  const [scenarioId, setScenarioId] = useState<string>(external?.id || 'cafe')
  const scenario = external || ALL_SCENARIOS.find((s) => s.id === scenarioId)!
  const [currentId, setCurrentId] = useState(scenario.startId)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState<DialogueNode[]>([])
  const [ended, setEnded] = useState(false)

  const node = scenario.nodes[currentId]

  const start = () => {
    setCurrentId(scenario.startId)
    setScore(0)
    setHistory([])
    setEnded(false)
  }

  const stepFromNpc = (n: DialogueNode) => {
    setHistory((h) => [...h, n])
    if (n.ending) {
      setEnded(true)
      return
    }
    if (n.next) setCurrentId(n.next)
  }

  const handleUserChoice = (choice: { label: string; next: string }, userScore?: number) => {
    const choiceRecord: DialogueNode = {
      id: `choice-${Date.now()}`,
      speaker: 'user',
      text: choice.label,
      score: userScore,
    }
    setHistory((h) => [...h, choiceRecord])
    const target = scenario.nodes[choice.next]
    if (target?.score) setScore((s) => s + (target.score || 0))
    setCurrentId(choice.next)
  }

  const isNpcResponsePhase = node && node.speaker === 'npc' && !node.choices && !node.ending

  // Auto-step effect
  useEffect(() => {
    if (isNpcResponsePhase) {
      const t = setTimeout(() => stepFromNpc(node), 1800)
      return () => clearTimeout(t)
    }
  }, [currentId])

  return (
    <div className="space-y-4">
      {/* Scenario selector */}
      {!external && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ALL_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setScenarioId(s.id); start() }}
              className={`card p-3 text-left transition-all ${
                scenarioId === s.id ? 'border-brand-400 shadow-md bg-brand-50/40' : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={14} className="text-brand-500" />
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-brand-100 text-brand-600 rounded">
                  {s.subject}
                </span>
              </div>
              <p className="font-semibold text-sm text-slate-800">{s.title}</p>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{s.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="card p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {scenario.npcName[0]}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">{scenario.title}</p>
            <p className="text-xs text-slate-500">{scenario.description}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">当前得分</p>
            <p className="text-xl font-bold text-brand-600 flex items-center gap-1">
              <Trophy size={14} className="text-amber-500" /> {score}/{scenario.maxScore}
            </p>
          </div>
        </div>
      </div>

      {/* Dialogue */}
      <div className="card p-4 space-y-3 max-h-96 overflow-y-auto bg-slate-50">
        {history.map((m, i) => (
          <MessageBubble key={i} node={m} />
        ))}
        {node && !isNpcResponsePhase && <MessageBubble node={node} />}
      </div>

      {/* Actions */}
      {ended ? (
        <div className="card p-6 text-center border-2 border-brand-200 bg-brand-50/50">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3">
            <Award className="text-white" size={24} />
          </div>
          <h4 className="font-bold text-lg text-slate-800">{node?.endingTitle}</h4>
          <p className="text-sm text-slate-600 mt-2">
            最终得分：<span className="font-bold text-brand-600">{score}</span> / {scenario.maxScore}
            {score >= scenario.maxScore * 0.8 ? ' 🏆' : score >= scenario.maxScore * 0.4 ? ' 👍' : ' 加油！'}
          </p>
          <button
            onClick={start}
            className="btn-primary mt-4 inline-flex items-center gap-2"
          >
            <RotateCcw size={14} /> 再来一局
          </button>
        </div>
      ) : node?.choices ? (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <ChevronRight size={12} /> 选择你的回应：
          </p>
          {node.choices.map((c) => (
            <button
              key={c.next}
              onClick={() => handleUserChoice(c)}
              className="w-full text-left card p-3 hover:bg-brand-50 hover:border-brand-200 transition-all flex items-start gap-3 group"
            >
              <Zap size={14} className="text-amber-400 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm text-slate-700">{c.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 py-3">
          <Bot size={14} className="animate-pulse" /> NPC 正在回应...
        </div>
      )}
    </div>
  )
}

function MessageBubble({ node }: { node: DialogueNode }) {
  if (node.speaker === 'user') {
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[75%]">
          <div className="bg-brand-600 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm">
            {node.text}
          </div>
          {node.score !== undefined && (
            <div className="text-right text-[10px] mt-1">
              {node.score > 0 ? (
                <span className="text-green-600">+{node.score} 分</span>
              ) : node.score < 0 ? (
                <span className="text-red-600">{node.score} 分</span>
              ) : (
                <span className="text-slate-400">±0 分</span>
              )}
            </div>
          )}
        </div>
        <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center shrink-0">
          <User size={14} className="text-white" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shrink-0">
        <Bot size={14} className="text-white" />
      </div>
      <div className="max-w-[75%] bg-white rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-slate-700 border border-slate-100">
        {node.text}
      </div>
    </div>
  )
}
