import { useState } from 'react'
import { Terminal, Play, RotateCcw, Copy, Check, MessageSquare, Sparkles } from 'lucide-react'

const SAMPLES: Record<string, string> = {
  python: `# 欢迎来到 Python 沙箱！\n# 点击运行按钮执行代码\n\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint("前 10 个斐波那契数：")\nfor i in range(10):\n    print(fibonacci(i), end=" ")`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\\\n");\n    for (int i = 1; i <= 5; i++) {\n        printf("%d * %d = %d\\\\n", i, i, i * i);\n    }\n    return 0;\n}`,
  cpp: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {5, 3, 8, 1, 9, 2};\n    for (auto n : nums) std::cout << n << " ";\n    std::cout << std::endl;\n    return 0;\n}`,
  js: `// JavaScript 沙箱\nconst greet = (name) => \`Hello, \${name}!\`;\nconsole.log(greet("智学堂学员"));\n\nconst nums = [1, 2, 3, 4, 5];\nconsole.log("总和:", nums.reduce((a, b) => a + b, 0));`,
}

export default function CodePlayground() {
  const [lang, setLang] = useState('python')
  const [code, setCode] = useState(SAMPLES.python)
  const [output, setOutput] = useState('// 运行结果将显示在这里')
  const [copied, setCopied] = useState(false)

  const handleRun = () => {
    setOutput('⏳ 代码正在沙箱中执行...\n')
    setTimeout(() => {
      const mockOutputs: Record<string, string> = {
        python: '前 10 个斐波那契数：\n0 1 1 2 3 5 8 13 21 34',
        c: 'Hello, World!\n1 * 1 = 1\n2 * 2 = 4\n3 * 3 = 9\n4 * 4 = 16\n5 * 5 = 25',
        cpp: '5 3 8 1 9 2',
        js: 'Hello, 智学堂学员!\n总和: 15',
      }
      setOutput(mockOutputs[lang] || '运行完成')
    }, 800)
  }

  const handleReset = () => setCode(SAMPLES[lang])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const changeLang = (l: string) => {
    setLang(l)
    setCode(SAMPLES[l])
    setOutput('// 运行结果将显示在这里')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">代码沙箱</h1>
        <p className="text-slate-500 text-sm">在浏览器中实时编写和运行代码，支持多语言切换</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {Object.keys(SAMPLES).map((l) => (
          <button
            key={l}
            onClick={() => changeLang(l)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              lang === l
                ? 'bg-brand-600 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-slate-300 text-sm">
            <div className="flex items-center gap-2">
              <Terminal size={14} />
              <span>main.{lang === 'c' ? 'c' : lang === 'cpp' ? 'cpp' : lang === 'js' ? 'js' : 'py'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                title="复制代码"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                title="重置"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={handleRun}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white transition-colors"
              >
                <Play size={14} /> 运行
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 bg-slate-900 text-green-300 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="card overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-slate-800 text-slate-300 text-sm border-b border-slate-700">
            输出结果
          </div>
          <pre className="flex-1 bg-slate-950 text-slate-200 font-mono text-sm p-4 whitespace-pre-wrap overflow-auto min-h-96">
{output}
          </pre>
        </div>
      </div>

      {/* AI Code Help */}
      <div className="card p-5 bg-gradient-to-r from-purple-50 to-brand-50 border-purple-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-purple-600" size={18} />
          <h3 className="font-semibold text-slate-800">AI 代码助手</h3>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { icon: Sparkles, label: '生成代码' },
            { icon: MessageSquare, label: '解释这段代码' },
            { icon: MessageSquare, label: '找 Bug' },
            { icon: Sparkles, label: '代码优化建议' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-purple-200 text-sm text-slate-700 hover:bg-white/80 hover:border-purple-400 transition-all"
            >
              <Icon size={14} className="text-purple-500" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
