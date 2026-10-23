import { useState, useMemo } from 'react'
import { Atom, RotateCcw, Play, Pause, Sparkles, Settings } from 'lucide-react'

interface ExperimentProps {
  title?: string
}

/* ========== 平抛运动实验 ========== */
function ProjectileMotion() {
  const [v0, setV0] = useState(25) // 初速度 m/s
  const [angle, setAngle] = useState(45) // 角度度
  const [gravity, setGravity] = useState(9.8) // 重力加速度
  const [running, setRunning] = useState(true)

  const angleRad = (angle * Math.PI) / 180
  const vx = v0 * Math.cos(angleRad)
  const vy = v0 * Math.sin(angleRad)

  const tFlight = (2 * vy) / gravity
  const maxHeight = (vy * vy) / (2 * gravity)
  const range = vx * tFlight

  // 生成轨迹点
  const points = useMemo(() => {
    const pts: [number, number][] = []
    const steps = 80
    for (let i = 0; i <= steps; i++) {
      const t = (tFlight * i) / steps
      const x = vx * t
      const y = vy * t - 0.5 * gravity * t * t
      if (y >= 0) pts.push([x, y])
    }
    return pts
  }, [v0, angle, gravity, tFlight, vx, vy])

  // SVG 坐标映射
  const svgW = 520
  const svgH = 320
  const pad = 30
  const maxX = Math.max(range * 1.1, 50)
  const maxY = Math.max(maxHeight * 1.2, 30)
  const scaleX = (svgW - pad * 2) / maxX
  const scaleY = (svgH - pad * 2) / maxY

  const sx = (x: number) => pad + x * scaleX
  const sy = (y: number) => svgH - pad - y * scaleY

  return (
    <div className="space-y-4">
      {/* 画布 */}
      <div className="card p-2 overflow-hidden bg-slate-900 rounded-xl">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
          {/* 地面 */}
          <line x1={pad} y1={svgH - pad} x2={svgW - pad} y2={svgH - pad} stroke="#475569" strokeWidth="2" />
          {/* 原点 */}
          <circle cx={sx(0)} cy={sy(0)} r="4" fill="#ef4444" />

          {/* 网格 */}
          {Array.from({ length: 10 }).map((_, i) => {
            const gx = pad + ((svgW - pad * 2) / 10) * i
            const gy = pad + ((svgH - pad * 2) / 10) * i
            return (
              <g key={i} opacity="0.15">
                <line x1={gx} y1={pad} x2={gx} y2={svgH - pad} stroke="#64748b" strokeWidth="0.5" />
                <line x1={pad} y1={gy} x2={svgW - pad} y2={gy} stroke="#64748b" strokeWidth="0.5" />
              </g>
            )
          })}

          {/* 轨迹虚线（无空气阻力） */}
          <polyline
            points={points.map((p) => `${sx(p[0])},${sy(p[1])}`).join(' ')}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={running ? '' : '4,4'}
          />

          {/* 起点箭头（速度方向） */}
          <g>
            <line
              x1={sx(0)}
              y1={sy(0)}
              x2={sx(Math.cos(angleRad) * 30)}
              y2={sy(0) + Math.sin(angleRad) * 30}
              stroke="#f87171"
              strokeWidth="2"
              opacity="0.6"
            />
            <text x={sx(0) + 8} y={sy(0) - 6} fill="#94a3b8" fontSize="10">
              v₀={v0}m/s · {angle}°
            </text>
          </g>

          {/* 最高点标记 */}
          <circle cx={sx((range || 0) / 2)} cy={sy(maxHeight)} r="3" fill="#22c55e" />
          <text x={sx((range || 0) / 2) + 6} y={sy(maxHeight) - 4} fill="#22c55e" fontSize="9">
            H={maxHeight.toFixed(1)}m
          </text>

          {/* 落地点 */}
          <circle cx={sx(range)} cy={sy(0)} r="4" fill="#3b82f6" />
          <text x={sx(range) - 20} y={sy(0) + 14} fill="#3b82f6" fontSize="9">
            R={range.toFixed(1)}m
          </text>

          {/* 坐标轴 */}
          <text x={svgW - 20} y={svgH - 10} fill="#94a3b8" fontSize="10">x(m)</text>
          <text x={pad + 4} y={pad + 12} fill="#94a3b8" fontSize="10">y(m)</text>
        </svg>
      </div>

      {/* 参数面板 */}
      <div className="grid sm:grid-cols-3 gap-3">
        <SliderCard label="初速度 v₀" value={v0} min={5} max={60} step={1} unit="m/s" onChange={setV0} color="from-red-500 to-orange-500" />
        <SliderCard label="发射角度 θ" value={angle} min={5} max={85} step={1} unit="°" onChange={setAngle} color="from-amber-500 to-yellow-500" />
        <SliderCard label="重力加速度 g" value={gravity} min={1.6} max={25} step={0.1} unit="m/s²" onChange={setGravity} color="from-purple-500 to-indigo-500" />
      </div>

      {/* 测量值 */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <Metric label="飞行时间" value={tFlight.toFixed(2)} unit="s" />
        <Metric label="最大高度" value={maxHeight.toFixed(2)} unit="m" />
        <Metric label="水平射程" value={range.toFixed(2)} unit="m" highlight />
      </div>
    </div>
  )
}

/* ========== 二次函数实验 ========== */
function QuadraticGraph() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const [c, setC] = useState(0)

  const vertexX = a !== 0 ? -b / (2 * a) : 0
  const vertexY = a !== 0 ? c - (b * b) / (4 * a) : c

  // 计算 y=0 根的个数
  const disc = b * b - 4 * a * c
  const roots: number[] = []
  if (a !== 0 && disc >= 0) {
    roots.push((-b + Math.sqrt(disc)) / (2 * a))
    if (disc > 0) roots.push((-b - Math.sqrt(disc)) / (2 * a))
  }

  const svgW = 520
  const svgH = 320
  const pad = 30
  const viewX = 10
  const viewY = 8
  const scaleX = (svgW - pad * 2) / (viewX * 2)
  const scaleY = (svgH - pad * 2) / (viewY * 2)
  const sxp = (x: number) => svgW / 2 + x * scaleX
  const syp = (y: number) => svgH / 2 - y * scaleY

  // 生成抛物线点
  const curvePts = useMemo(() => {
    const pts: string[] = []
    const steps = 150
    for (let i = 0; i <= steps; i++) {
      const x = -viewX + ((viewX * 2) * i) / steps
      const y = a * x * x + b * x + c
      pts.push(`${sxp(x)},${syp(y)}`)
    }
    return pts.join(' ')
  }, [a, b, c])

  return (
    <div className="space-y-4">
      <div className="card p-2 overflow-hidden bg-slate-900 rounded-xl">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
          {/* 坐标轴 */}
          <line x1={pad} y1={svgH / 2} x2={svgW - pad} y2={svgH / 2} stroke="#475569" strokeWidth="1.5" />
          <line x1={svgW / 2} y1={pad} x2={svgW / 2} y2={svgH - pad} stroke="#475569" strokeWidth="1.5" />

          {/* 网格 */}
          {Array.from({ length: 9 }).map((_, i) => {
            const vx = sxp(-viewX + i * (viewX * 2) / 9)
            const vy = syp(-viewY + i * (viewY * 2) / 9)
            return (
              <g key={i} opacity="0.12">
                <line x1={vx} y1={pad} x2={vx} y2={svgH - pad} stroke="#64748b" />
                <line x1={pad} y1={vy} x2={svgW - pad} y2={vy} stroke="#64748b" />
              </g>
            )
          })}

          {/* 抛物线 */}
          <polyline
            points={curvePts}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 顶点 */}
          {a !== 0 && (
            <g>
              <circle cx={sxp(vertexX)} cy={syp(vertexY)} r="4" fill="#f472b6" />
              <text x={sxp(vertexX) + 8} y={syp(vertexY) - 4} fill="#f472b6" fontSize="9">
                ({vertexX.toFixed(1)}, {vertexY.toFixed(1)})
              </text>
              {/* 对称轴虚线 */}
              <line
                x1={sxp(vertexX)}
                y1={pad}
                x2={sxp(vertexX)}
                y2={svgH - pad}
                stroke="#f472b6"
                strokeWidth="0.8"
                strokeDasharray="3,3"
                opacity="0.5"
              />
            </g>
          )}

          {/* 根 */}
          {roots.map((r, i) => (
            <g key={i}>
              <circle cx={sxp(r)} cy={syp(0)} r="4" fill="#22c55e" />
              <text x={sxp(r) + 6} y={syp(0) + 12} fill="#22c55e" fontSize="9">
                x={r.toFixed(2)}
              </text>
            </g>
          ))}

          {/* 原点 */}
          <circle cx={sxp(0)} cy={syp(0)} r="2" fill="#64748b" />
          <text x={sxp(0) + 4} y={syp(0) + 14} fill="#94a3b8" fontSize="9">O</text>
        </svg>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <SliderCard label="系数 a" value={a} min={-3} max={3} step={0.1} unit="" onChange={setA} color="from-sky-500 to-blue-500" />
        <SliderCard label="系数 b" value={b} min={-5} max={5} step={0.1} unit="" onChange={setB} color="from-emerald-500 to-teal-500" />
        <SliderCard label="常数 c" value={c} min={-5} max={5} step={0.1} unit="" onChange={setC} color="from-rose-500 to-pink-500" />
      </div>

      <div className="card p-3 text-sm bg-slate-50">
        <span className="font-mono text-base text-slate-800">
          f(x) = {a.toFixed(1)}x² {b >= 0 ? '+' : '-'} {Math.abs(b).toFixed(1)}x {c >= 0 ? '+' : '-'} {Math.abs(c).toFixed(1)}
        </span>
        <p className="text-slate-500 text-xs mt-1">
          顶点 ({vertexX.toFixed(2)}, {vertexY.toFixed(2)}) ·
          {a === 0 ? ' 非二次函数' : a > 0 ? ' 开口向上 ↑' : ' 开口向下 ↓'} ·
          判别式 Δ={disc.toFixed(2)}
          {a !== 0 && (disc > 0 ? ' · 两个实根' : disc === 0 ? ' · 一个重根' : ' · 无实根')}
        </p>
      </div>
    </div>
  )
}

/* ========== 通用子组件 ========== */

function SliderCard({
  label, value, min, max, step, unit, onChange, color,
}: {
  label: string; value: number; min: number; max: number; step: number;
  unit: string; onChange: (v: number) => void; color: string;
}) {
  return (
    <div className="card p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className={`text-xs font-bold text-white px-2 py-0.5 rounded bg-gradient-to-r ${color}`}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-brand-600"
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

function Metric({ label, value, unit, highlight = false }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div className={`card p-3 ${highlight ? 'bg-gradient-to-br from-brand-50 to-purple-50 border-brand-200' : ''}`}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-brand-700' : 'text-slate-800'}`}>
        {value}<span className="text-xs font-normal ml-0.5 text-slate-400">{unit}</span>
      </p>
    </div>
  )
}

/* ========== 主组件：实验选择切换 ========== */

export default function DynamicExperiment({ title = '动态实验台' }: ExperimentProps) {
  const [exp, setExp] = useState<'projectile' | 'quadratic'>('projectile')

  const experiments = [
    { id: 'projectile', label: '平抛运动', icon: Atom, desc: '发射角度 · 速度 · 重力' },
    { id: 'quadratic', label: '二次函数图像', icon: Settings, desc: '抛物线 · 顶点 · 根' },
  ] as const

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
          <Atom className="text-cyan-600" size={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">拖参数滑块实时观察变化</p>
        </div>
      </div>

      {/* Switcher */}
      <div className="flex gap-2">
        {experiments.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            onClick={() => setExp(id)}
            className={`flex-1 card p-3 flex items-center gap-3 transition-all ${
              exp === id ? 'border-brand-400 shadow-md bg-brand-50/50' : 'hover:border-slate-300'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                exp === id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Icon size={16} />
            </div>
            <div className="text-left">
              <p className={`text-sm font-semibold ${exp === id ? 'text-brand-700' : 'text-slate-700'}`}>{label}</p>
              <p className="text-[10px] text-slate-500">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Experiment */}
      {exp === 'projectile' ? <ProjectileMotion /> : <QuadraticGraph />}
    </div>
  )
}
