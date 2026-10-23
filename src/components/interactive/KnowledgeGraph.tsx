import { useState, useMemo } from 'react'
import { BookOpen, CheckCircle2, Circle, ZoomIn, ZoomOut, RotateCcw, Search } from 'lucide-react'

export interface KGNode {
  id: string
  label: string
  group?: string
  mastered?: boolean
  x?: number // percentage 0-100
  y?: number
}

export interface KGEdge {
  from: string
  to: string
  label?: string
}

interface Props {
  title?: string
  subject?: string
  nodes: KGNode[]
  edges: KGEdge[]
  onNodeClick?: (node: KGNode) => void
}

const DEFAULT_COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4', '#ef4444']

export default function KnowledgeGraph({ title = '知识图谱', subject, nodes, edges, onNodeClick }: Props) {
  const [zoom, setZoom] = useState(1)
  const [selected, setSelected] = useState<KGNode | null>(null)
  const [search, setSearch] = useState('')

  const filteredNodes = useMemo(() => {
    if (!search.trim()) return nodes
    const s = search.toLowerCase()
    return nodes.filter((n) => n.label.toLowerCase().includes(s))
  }, [nodes, search])

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])

  // Auto layout if positions missing
  const positioned = useMemo(() => {
    const groups: Record<string, KGNode[]> = {}
    nodes.forEach((n) => {
      const g = n.group || 'default'
      groups[g] = groups[g] || []
      groups[g].push(n)
    })

    const groupKeys = Object.keys(groups)
    return nodes.map((n) => {
      if (n.x !== undefined && n.y !== undefined) return n
      const grp = n.group || 'default'
      const idx = groups[grp].findIndex((x) => x.id === n.id)
      const total = groups[grp].length
      const gIdx = groupKeys.indexOf(grp)
      const cols = Math.min(3, groupKeys.length)
      const rows = Math.ceil(groupKeys.length / cols)
      const col = gIdx % cols
      const row = Math.floor(gIdx / cols)
      const angle = (idx / total) * Math.PI * 2 - Math.PI / 2
      const cx = 15 + col * 35 + total > 3 ? (total - 3) * 3 : 0
      const cy = 20 + row * 40
      const r = total <= 1 ? 0 : Math.min(12, 30 / total)
      return { ...n, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r }
    })
  }, [nodes])

  const groupColors = useMemo(() => {
    const g = new Set(nodes.map((n) => n.group || 'default'))
    const out: Record<string, string> = {}
    let i = 0
    g.forEach((k) => (out[k] = DEFAULT_COLORS[i++ % DEFAULT_COLORS.length]))
    return out
  }, [nodes])

  const nodePos = (id: string) => {
    const n = positioned.find((x) => x.id === id)
    return { x: n?.x ?? 50, y: n?.y ?? 50, node: n! }
  }

  const handleNodeClick = (n: KGNode) => {
    setSelected(n)
    onNodeClick?.(n)
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center">
            <BookOpen className="text-brand-600" size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">
              共 {nodes.length} 个知识点 · {nodes.filter((n) => n.mastered).length} 已掌握
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            title="缩小"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs text-slate-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            title="放大"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            title="重置"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Search + Legend */}
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-1.5 text-sm w-60">
          <Search size={14} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索知识点..."
            className="bg-transparent outline-none flex-1 text-xs"
          />
        </div>
        <div className="flex items-center gap-3 text-xs">
          {Object.entries(groupColors).map(([g, color]) => (
            <span key={g} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
              <span className="text-slate-600">{g === 'default' ? subject || '通用' : g}</span>
            </span>
          ))}
          <span className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
            <CheckCircle2 size={12} className="text-green-500" /> 已掌握
          </span>
          <span className="flex items-center gap-1.5">
            <Circle size={12} className="text-slate-300" /> 待学习
          </span>
        </div>
      </div>

      {/* Graph */}
      <div className="relative bg-gradient-to-br from-slate-50 to-white h-[400px] overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {/* Edges */}
          {edges.map((e, i) => {
            const from = nodePos(e.from)
            const to = nodePos(e.to)
            return (
              <g key={i}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#cbd5e1"
                  strokeWidth="0.3"
                  strokeDasharray="0.8,0.4"
                />
                {e.label && (
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2}
                    fontSize="1.8"
                    fill="#94a3b8"
                    textAnchor="middle"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {filteredNodes.map((n) => {
            const pos = nodePos(n.id)
            const color = groupColors[n.group || 'default']
            const active = selected?.id === n.id
            return (
              <g
                key={n.id}
                onClick={() => handleNodeClick(n)}
                className="cursor-pointer"
              >
                {/* Halo for selected */}
                {active && (
                  <circle cx={pos.x} cy={pos.y} r="5" fill={color} opacity="0.2" />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={n.mastered ? 3 : 2.5}
                  fill={color}
                  opacity={n.mastered ? 1 : 0.55}
                  stroke={active ? '#fff' : 'none'}
                  strokeWidth="0.6"
                  className="transition-all hover:r-4"
                />
                {n.mastered && (
                  <circle cx={pos.x} cy={pos.y} r="3" fill="none" stroke="#fff" strokeWidth="0.4" />
                )}
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  fontSize="2.2"
                  fill="#334155"
                  textAnchor="middle"
                  fontWeight={active ? 'bold' : 'normal'}
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Selected info card */}
        {selected && (
          <div className="absolute bottom-3 left-3 right-3 bg-white rounded-lg shadow-lg border border-slate-200 p-3 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: groupColors[selected.group || 'default'] }}
            >
              {selected.mastered ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">{selected.label}</p>
              <p className="text-xs text-slate-500">
                {selected.mastered ? '✓ 已掌握' : '📖 待学习'}
                {selected.group && <> · {selected.group}</>}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-brand-600 hover:underline"
            >
              关闭
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Built-in 题库（可按学科扩展） ----

export const PYTHON_KG: { nodes: KGNode[]; edges: KGEdge[] } = {
  nodes: [
    { id: 'py1', label: '变量与类型', group: '基础', mastered: true, x: 20, y: 30 },
    { id: 'py2', label: '条件判断', group: '基础', mastered: true, x: 40, y: 25 },
    { id: 'py3', label: '循环', group: '基础', mastered: true, x: 60, y: 30 },
    { id: 'py4', label: '函数', group: '进阶', mastered: false, x: 30, y: 55 },
    { id: 'py5', label: '列表/字典', group: '进阶', mastered: false, x: 55, y: 50 },
    { id: 'py6', label: '面向对象', group: '进阶', mastered: false, x: 75, y: 55 },
    { id: 'py7', label: '装饰器', group: '高级', mastered: false, x: 25, y: 78 },
    { id: 'py8', label: '生成器', group: '高级', mastered: false, x: 55, y: 80 },
    { id: 'py9', label: '上下文管理器', group: '高级', mastered: false, x: 80, y: 78 },
  ],
  edges: [
    { from: 'py1', to: 'py2' },
    { from: 'py2', to: 'py3' },
    { from: 'py3', to: 'py4', label: '→' },
    { from: 'py3', to: 'py5' },
    { from: 'py5', to: 'py6' },
    { from: 'py6', to: 'py7' },
    { from: 'py4', to: 'py7' },
    { from: 'py5', to: 'py8' },
    { from: 'py6', to: 'py9' },
  ],
}

export const MATH_KG: { nodes: KGNode[]; edges: KGEdge[] } = {
  nodes: [
    { id: 'm1', label: '实数与极限', group: '基础', mastered: true, x: 18, y: 25 },
    { id: 'm2', label: '导数', group: '微分学', mastered: true, x: 40, y: 28 },
    { id: 'm3', label: '微分中值定理', group: '微分学', mastered: false, x: 62, y: 25 },
    { id: 'm4', label: '不定积分', group: '积分学', mastered: false, x: 28, y: 55 },
    { id: 'm5', label: '定积分', group: '积分学', mastered: false, x: 55, y: 52 },
    { id: 'm6', label: '级数', group: '进阶', mastered: false, x: 78, y: 55 },
    { id: 'm7', label: '多元函数', group: '进阶', mastered: false, x: 40, y: 80 },
    { id: 'm8', label: '曲线积分', group: '进阶', mastered: false, x: 70, y: 80 },
  ],
  edges: [
    { from: 'm1', to: 'm2' },
    { from: 'm2', to: 'm3' },
    { from: 'm2', to: 'm4' },
    { from: 'm4', to: 'm5' },
    { from: 'm5', to: 'm6' },
    { from: 'm5', to: 'm7' },
    { from: 'm7', to: 'm8' },
  ],
}
