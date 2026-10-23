import { useState } from 'react'
import {
  Sparkles,
  Bot,
  Code2,
  Calculator,
  BookOpen,
  Send,
  Wrench,
  Link2,
  Workflow,
  ChevronRight,
  Zap,
  GraduationCap,
} from 'lucide-react'

const AGENTS = [
  { id: 'code', name: '代码专家', desc: '帮你写代码、找 Bug、解释原理', icon: Code2, color: '#6366f1' },
  { id: 'math', name: '数学导师', desc: '公式推导、步骤解析、答疑解惑', icon: Calculator, color: '#8b5cf6' },
  { id: 'lang', name: '语文老师', desc: '作文批改、文言文精讲、写作思路', icon: BookOpen, color: '#ef4444' },
  { id: 'english', name: '英语口语陪练', desc: '情景对话、发音评测、地道表达', icon: BookOpen, color: '#3b82f6' },
]

const TOOLS = [
  { name: '代码执行沙箱', icon: Code2, available: true },
  { name: '公式渲染器', icon: Calculator, available: true },
  { name: '网络搜索', icon: Link2, available: true },
  { name: '文件解析', icon: BookOpen, available: false },
]

const PIPELINE_STEPS = [
  { label: '用户提问', icon: Send },
  { label: '意图识别 Agent', icon: Bot },
  { label: '工具路由', icon: Wrench },
  { label: '结果合成 Agent', icon: Sparkles },
  { label: '最终回答', icon: Workflow },
]

export default function AIAgent() {
  const [activeAgent, setActiveAgent] = useState('code')
  const [chatInput, setChatInput] = useState('帮我写一个 Python 快速排序')

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-4">
              <Sparkles size={14} /> 特别板块 · AI Agent 能力
            </span>
            <h1 className="text-3xl font-bold mb-2">从"用 AI"到"造 Agent"</h1>
            <p className="text-purple-100 max-w-xl">
              掌握 Prompt 工程、工具调用、多 Agent 协作，让 AI 成为你的数字分身。
              本板块将你从"AI 用户"升级为"Agent 开发者"。
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-center">
              <p className="text-3xl font-bold">12+</p>
              <p className="text-xs text-purple-200">Agent 模板</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-xs text-purple-200">可调用工具</p>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Switcher + Chat */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Agent Selection */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 mb-2">选择你的 Agent</h2>
          {AGENTS.map((a) => {
            const Icon = a.icon
            const active = activeAgent === a.id
            return (
              <button
                key={a.id}
                onClick={() => setActiveAgent(a.id)}
                className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-3 ${
                  active
                    ? 'shadow-lg scale-[1.02] border-2 border-transparent'
                    : 'bg-white border border-slate-200 hover:shadow-md'
                }`}
                style={active ? { background: `linear-gradient(135deg, ${a.color}10, ${a.color}25)`, borderColor: a.color } : undefined}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${a.color}20`, color: a.color }}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{a.name}</p>
                  <p className="text-xs text-slate-500 truncate">{a.desc}</p>
                </div>
                {active && <ChevronRight size={18} style={{ color: a.color }} />}
              </button>
            )
          })}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 card p-0 flex flex-col overflow-hidden h-[500px]">
          <div className="px-5 py-3 bg-gradient-to-r from-brand-50 to-purple-50 border-b border-slate-100 flex items-center gap-2">
            <Bot className="text-brand-600" size={18} />
            <span className="font-semibold text-slate-800">多 Agent 对话工作台</span>
            <span className="text-xs text-slate-400 ml-auto">在线 · 多模型切换</span>
          </div>
          <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-slate-50">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">我</div>
              <div className="bg-white rounded-xl rounded-tl-none p-3 max-w-md shadow-sm text-sm text-slate-700">
                帮我写一个 Python 快速排序，要带注释
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-brand-50 rounded-xl rounded-tl-none p-3 max-w-lg shadow-sm text-sm">
                <p className="font-semibold text-brand-700 text-xs mb-2 flex items-center gap-1">
                  <Zap size={12} /> 调用了 代码执行沙箱 工具
                </p>
                <pre className="bg-slate-900 text-green-300 text-xs p-3 rounded-lg overflow-auto leading-relaxed">
{`def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3,6,8,10,1,2,1]))`}
                </pre>
                <p className="text-slate-600 mt-2">已在沙箱中运行通过 ✅ 耗时 0.3ms</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 input-field text-sm"
                placeholder="向 Agent 提问..."
              />
              <button className="btn-primary px-4 flex items-center gap-1">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Pipeline Visualization */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Workflow className="text-purple-600" size={20} /> 多 Agent 协作流水线
        </h2>
        <p className="text-sm text-slate-500 mb-6">复杂任务如何被拆解并由多个 Agent 协同完成</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <>
                <div key={step.label} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-100 to-purple-100 border-2 border-brand-300 flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                    <Icon size={20} className="text-brand-600" />
                  </div>
                  <p className="text-xs font-medium text-slate-700">{step.label}</p>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="flex items-center text-brand-400 mx-1">
                    <ChevronRight size={20} />
                  </div>
                )}
              </>
            )
          })}
        </div>
      </div>

      {/* Available Wrenchs */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Wrench className="text-amber-500" size={20} /> Agent 可调用工具
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {TOOLS.map(({ name, icon: Icon, available }) => (
            <div
              key={name}
              className={`p-4 rounded-xl border text-center transition-all ${
                available
                  ? 'bg-green-50 border-green-200 hover:border-green-400'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <Icon size={20} className={`mx-auto mb-2 ${available ? 'text-green-600' : 'text-slate-400'}`} />
              <p className="text-sm font-medium text-slate-700">{name}</p>
              <p className={`text-xs mt-1 ${available ? 'text-green-600' : 'text-slate-400'}`}>
                {available ? '✓ 已接入' : '· 待解锁'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Path */}
      <div className="card p-6 bg-gradient-to-br from-brand-50 to-indigo-50 border-brand-100">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <GraduationCap className="text-brand-600" size={20} /> Agent 能力认证路径
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { level: 'L1', name: 'AI 初级用户', desc: '会用 AI 辅助学习', color: '#22c55e', progress: 100 },
            { level: 'L2', name: 'Prompt 工程师', desc: '掌握结构化提示词', color: '#f59e0b', progress: 45 },
            { level: 'L3', name: 'Agent 开发者', desc: '能构建多 Agent 系统', color: '#ef4444', progress: 10 },
          ].map((c) => (
            <div key={c.level} className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.level}
                </span>
                <span className="text-xs text-slate-500">{c.progress}%</span>
              </div>
              <p className="font-semibold text-slate-800">{c.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">{c.desc}</p>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.progress}%`, backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
