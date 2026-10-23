# 🧠 Immersive Learning Platform — 智学堂

> 面向学生和自学者的 **沉浸式 AI 辅助在线教育平台**，
> 结合互动练习台、AI 随堂答疑、写作自动评分、角色扮演口语对话，
> 后端统一代理 LLM 调用，前端零密钥暴露。

<div align="center">

![Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite)
![Express](https://img.shields.io/badge/Express-5.3-000?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![DeepSeek](https://img.shields.io/badge/LLM-DeepSeek-ff6b35)
![License](https://img.shields.io/badge/license-MIT-green)

**⭐ Star this repo if you find it useful!**

</div>

---

## 📸 预览截图（占位）

> _首页 / 课程列表 / 学习页 / AI 随堂答疑 / 写作评分 / 角色扮演 NPC_

| 首页 | 课程详情 |
| :-: | :-: |
| ![](docs/screenshots/home.png) | ![](docs/screenshots/course.png) |

| AI 随堂答疑 | 写作评分 |
| :-: | :-: |
| ![](docs/screenshots/qa.png) | ![](docs/screenshots/writing.png) |

---

## ✨ 功能亮点

### 🤖 AI 能力（4 大核心端点）

| 端点 | 能力 | 关键参数 |
|---|---|---|
| `POST /api/ai/chat` | 通用多轮聊天 | `messages[]`, `system`, `temperature` |
| `POST /api/ai/qa` | **随堂答疑** — 4 种解释风格 | `style`: `simple` / `analogy` / `deep` / `exercise` |
| `POST /api/ai/writing-feedback` | **写作自动评分** — 5 维度打分 + 范文改写 | 强制 JSON 输出 |
| `POST /api/ai/npc` | **角色扮演 NPC** — 动态剧情回复 + 得分 | 返回 `reply` / `scoreDelta` / `shouldEnd` |

### 🎨 前端（12 个页面）

| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | Home | 学习仪表盘、推荐课程、今日进度 |
| `/login` · `/register` | Login / Register | 登录注册（当前 Mock） |
| `/courses` | Courses | 9 学科 × 3 级别 = 27 门课程 |
| `/courses/:id` | CourseDetail | 课程章节列表 + 章节概览 |
| `/learn/:courseId/:chapterId` | Learning | 学习主舞台 + 互动练习台 |
| `/playground` | CodePlayground | 在线代码运行（Monaco） |
| `/ai-agent` | AIAgent | AI 能力总览 + 多场景切换 |
| `/cognition` | Cognition | 认知图谱 / 学习轨迹 |
| `/community` | Community | 社区帖子 |
| `/achievements` | Achievements | 成就徽章系统 |
| `/profile` | Profile | 个人中心 |

### 🧩 9 学科 × 3 级别

```
chinese · english · math · politics · physics · c · cpp · python · ai
beginner · intermediate · advanced
```

共 **27 门课程**，每门 2-3 章节，每章节含互动练习台（代码运行 / 知识图谱 / 公式推导 / 角色扮演 / AI 写作评分 等）。

---

## 🏗️ 技术栈

### 前端

| 技术 | 版本 | 用途 |
|---|---|---|
| React | 18.3.1 | UI 框架 |
| React Router DOM | 6.26 | 路由 |
| Zustand | 4.5 | 状态管理 |
| TypeScript | 5.5 | 类型安全 |
| Vite | 5.4 | 构建 / Dev Server / HMR |
| Tailwind CSS | 3.4 | 原子化 CSS |
| lucide-react | 0.441 | 图标库 |
| clsx | 2.1 | 条件 class |

### 后端

| 技术 | 版本 | 用途 |
|---|---|---|
| Node.js | ≥ 20 | 运行时 |
| Express | 5.3 | HTTP 框架 |
| dotenv | 18.x | `.env` 加载 |
| cors | 2.8 | CORS 中间件 |
| `global fetch` | Node 内置 | LLM HTTP 调用（Node 18+） |

### LLM

| Provider | 说明 | 切换方式 |
|---|---|---|
| **DeepSeek** | 当前默认，性价比高 | `.env.local` 里配置即可 |
| 任何 OpenAI 兼容格式 | 硅基流动 / one-api / 自建 | 改 `AI_BASE_URL` |
| 本地 Mock Engine | **零 Key 也能跑** | 删除 `AI_API_KEY` → 自动降级 |

---

## 📁 项目结构

```
immersive-learning-platform/
├── 📁 server/                  # Express 后端（Node）
│   ├── index.js               # 入口：4 个 AI 路由 + health
│   └── llm.js                 # LLM 统一代理 + 本地 mock fallback
│
├── 📁 src/                     # 前端源码（React + TS）
│   ├── 📁 components/         # 通用 UI 组件
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProgressRing.tsx
│   │   └── SubjectCard.tsx
│   ├── 📁 layouts/
│   │   └── MainLayout.tsx
│   ├── 📁 pages/              # 12 个页面组件
│   │   ├── Home / Login / Register
│   │   ├── Courses / CourseDetail
│   │   ├── Learning / CodePlayground
│   │   ├── Profile / Community / Achievements
│   │   ├── AIAgent / Cognition
│   │   └── ...
│   ├── 📁 store/              # Zustand Stores
│   │   ├── useCourseStore.ts
│   │   ├── useProgressStore.ts
│   │   └── useUserStore.ts
│   ├── 📁 data/
│   │   └── courses.ts         # 9 学科 × 3 级别 Mock 课程数据
│   ├── 📁 router/
│   │   └── index.tsx          # React Router 配置
│   ├── 📁 types/
│   │   └── index.ts
│   ├── main.tsx
│   └── index.css
│
├── .env.example               # 配置模板 → 复制为 .env.local 后填写
├── .gitignore
├── vite.config.ts             # Vite 配置 + /api → :3001 proxy
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig*.json
└── LICENSE                    # MIT
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** ≥ 20（推荐 22 LTS）
- **npm** ≥ 10

### 1. Clone

```bash
git clone https://github.com/px-pangu/immersive-learning-platform.git
cd immersive-learning-platform
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
# Windows PowerShell / CMD
copy .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

然后编辑 `.env.local`，填入你的 **DeepSeek API Key**（或其他 OpenAI 兼容服务）：

```ini
# DeepSeek（默认，推荐）
AI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AI_BASE_URL=https://api.deepseek.com/v1
AI_MODEL=deepseek-chat

# 如果你没有 API Key —— 删掉 AI_API_KEY 这一行即可
# 后端会自动使用内置 Mock Engine，所有功能照常演示
```

### 4. 启动（两种方式）

#### 方式 A：一键同时拉起前后端（推荐）

```bash
npm run dev:all
```

concurrently 会自动启动：
- 🔵 **后端** → http://localhost:3001
- 🟣 **前端** → http://localhost:5173
- 🔁 **Vite proxy** → `/api/*` 转发到 `localhost:3001`

#### 方式 B：分开启动

```bash
# 终端 1：后端
npm run server      # http://localhost:3001

# 终端 2：前端
npm run dev         # http://localhost:5173
```

### 5. 验证

浏览器打开 http://localhost:5173 ，在控制台执行：

```js
// 验证 proxy → DeepSeek 链路
fetch('/api/health').then(r => r.json()).then(console.log)
// 期望：{ ok: true, provider: "deepseek", model: "deepseek-chat" }
```

或直接用 curl：

```bash
curl http://localhost:3001/api/health
```

### 6. 构建生产版本

```bash
npm run build      # 输出到 dist/
npm run preview    # 本地预览
```

---

## 🔌 API 文档

### 基础信息

- **Base URL（开发模式）**：`http://localhost:5173/api/*`（通过 Vite proxy 转发）
- **后端直连**：`http://localhost:3001/api/*`
- **Content-Type**：`application/json`
- **无 Key 也能跑**：所有端点自动降级到本地 Mock Engine

### `GET /api/health` — 健康检查

**Response**
```json
{ "ok": true, "provider": "deepseek", "model": "deepseek-chat" }
```
> `provider` 值：`deepseek`（真实 LLM）· `mock`（无 Key / API 降级）

---

### `POST /api/ai/chat` — 通用聊天

**Request Body**
```json
{
  "messages": [
    { "role": "system", "content": "你是一名 Python 老师" },
    { "role": "user", "content": "写一个冒泡排序" }
  ],
  "temperature": 0.7
}
```

**Response**
```json
{ "reply": "```python\ndef bubble_sort(arr):\n    ...\n```", "provider": "deepseek" }
```

---

### `POST /api/ai/qa` — 随堂答疑（4 种风格）

**Request Body**
```json
{
  "question": "Python 的装饰器是什么？",
  "subject": "编程",
  "chapterTitle": "进阶 · 装饰器",
  "style": "analogy"
}
```

**`style` 枚举**

| 值 | 含义 | 示例效果 |
|---|---|---|
| `simple` | 最简单的话，类比生活场景 | "装饰器就是给函数套个壳" |
| `analogy` | 生动类比 | "像给手机套壳，手机不变但多了功能" |
| `deep` | 深入底层原理 | 讲清楚 `@decorator` 语法糖的真实过程 |
| `exercise` | 最后给一道小练习 + 答案提示 | "试试给这个函数加日志装饰器" |

**Response**
```json
{
  "reply": "1️⃣ 一句话：装饰器就是给函数套个外壳的工具...\n2️⃣ 生活类比：像给手机套壳...\n3️⃣ 写法：在函数上面加 @装饰器名\n\n需要换种方式讲一遍，还是出道题试试？",
  "provider": "deepseek"
}
```

---

### `POST /api/ai/writing-feedback` — 写作评分（强制 JSON）

**Request Body**
```json
{
  "text": "Python 是一种高级编程语言...（学生作文原文）",
  "prompt": "以 编程语言 为题写一篇 200 字短文"   // 可选
}
```

**Response**（严格 JSON，后端 `response_format: json_object`）
```json
{
  "overall": 72,
  "grade": "中等",
  "criteria": [
    { "name": "内容充实度", "score": 15, "comment": "主题明确但不够深入" },
    { "name": "结构逻辑", "score": 14, "comment": "段落分明但过渡生硬" },
    { "name": "语言表达", "score": 15, "comment": "有几处病句" },
    { "name": "语法正确", "score": 16, "comment": "整体正确" },
    { "name": "创意亮点", "score": 12, "comment": "可以更有个人特色" }
  ],
  "strengths": ["主题明确", "字数达标", "开头有吸引力"],
  "issues": ["缺少具体例子", "句式重复", "结尾仓促"],
  "rewrite": "Python 是一门简洁易读的高级编程语言..."
}
```

> JSON 解析失败时后端自动降级为默认评分 + 原文塞入 `rewrite`，前端正常渲染不崩。

---

### `POST /api/ai/npc` — 角色扮演 NPC

**Request Body**
```json
{
  "npcName": "咖啡店老板",
  "npcPersona": "热情的外国大叔，喜欢给顾客推荐饮品",
  "subject": "英语 · 口语",
  "history": [
    { "role": "user", "content": "Good morning! I'd like a coffee." }
  ],
  "userInput": "What do you recommend today?"
}
```

**Response**（强制 JSON）
```json
{
  "reply": "Well hey there! Today we've got a lovely pumpkin spice latte — fresh cinnamon straight from the farm! Wanna give it a shot?",
  "scoreDelta": 1,
  "shouldEnd": false,
  "endingTitle": ""
}
```

---

## 🔀 LLM Provider 切换

后端使用 **OpenAI 兼容协议**，任何支持 `POST /v1/chat/completions` 的服务端都能直接换。

### 切换硅基流动（便宜，多模型）

```ini
# .env.local
AI_API_KEY=your-siliconflow-key
AI_BASE_URL=https://api.siliconflow.cn/v1
AI_MODEL=Qwen/Qwen2.5-7B-Instruct
```

### 切换智谱 glm-4-flash

```ini
AI_API_KEY=your-zhipu-key
AI_BASE_URL=https://open.bigmodel.cn/api/paas/v4
AI_MODEL=glm-4-flash
```

### 切换 one-api 自建网关

```ini
AI_API_KEY=your-oneapi-token
AI_BASE_URL=https://your-oneapi.example.com/v1
AI_MODEL=gpt-4o-mini
```

### 完全关闭真实 LLM（纯 Mock 演示）

```ini
# 把 AI_API_KEY 这行删掉或注释掉即可
# 后端会在 /api/health 显示 provider: mock
# 所有 4 个 AI 端点都会返回内置 Mock Engine 的回复
```

切换 **零代码改动**，只改 `.env.local`。

---

## 🏛️ 架构

```
┌──────────────────────────────────────────────────────────────┐
│                    浏览器（React + Vite）                      │
│                                                              │
│  pages/  components/  stores/  router/                        │
│       ↓                                                      │
│  fetch('/api/ai/qa', { question, style... })                 │
│       ↓                                                      │
│  ┌─────────── Vite Proxy ───────────┐                         │
│  │    /api/*  →  localhost:3001     │                         │
│  └──────────────────────────────────┘                         │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP
┌──────────────────────▼───────────────────────────────────────┐
│               Express Backend (:3001)                         │
│                                                              │
│  ┌───────── index.js ───────────┐                             │
│  │  4 AI 路由 + health + CORS    │                             │
│  └─────────────┬────────────────┘                             │
│                │                                              │
│  ┌─────────────▼────────────────┐                             │
│  │  llm.js 统一代理              │                             │
│  │  ├─ callOpenAICompat()        │ ← fetch → DeepSeek API     │
│  │  └─ mockEngine()              │ ← 无 Key / API 失败降级     │
│  └──────────────────────────────┘                             │
└──────────────────────────────────────────────────────────────┘
                       │ HTTPS + Bearer Token
                       ↓
             https://api.deepseek.com/v1/chat/completions
```

### 安全模型

- ✅ **API Key 永不进入前端** — 只在 `server/llm.js` 读取 `.env.local`
- ✅ **`.env.local` 在 `.gitignore` 中** — 不会被提交
- ✅ **统一代理入口** — 所有 LLM 调用走 `llm.js`，方便监控 + 限流 + 换 provider
- ✅ **JSON mode 强制** — 写作评分 / NPC 用 `response_format: json_object`
- ✅ **自动降级** — 真实 API 30s timeout 或返回非 2xx → 降级本地 Mock Engine
- ✅ **ES module 陷阱已规避** — `dotenv.config()` 放在 `llm.js` 顶层第一个 `import` 之后，保证所有代码执行时 Key 已加载

### ES Module dotenv 陷阱说明

> **问题**：ESM 中 `import` 语句会被 **提升（hoist）** 到所有顶层代码之前执行。
> 如果在 `index.js` 里写 `import dotenv` → `dotenv.config()` → `import { callLLM } from './llm.js'`，
> 那么当 `llm.js` 执行时，`dotenv.config()` **还没跑**，`process.env` 是空的。
>
> **解法**：把 `dotenv.config()` 放进 `llm.js` 自己的顶层，放在它自己的第一个 `import` 之后 ——
> 因为 `llm.js` 的 import 先跑，config 跑完才 export 函数给 `index.js` 用。

---

## 🛠️ 常用命令

| 命令 | 说明 |
|---|---|
| `npm install` | 安装依赖 |
| `npm run dev` | 只启前端 Vite（:5173） |
| `npm run server` | 只启后端 Express（:3001） |
| `npm run dev:all` | **同时拉起前后端（推荐）** |
| `npm run build` | `tsc -b && vite build`，产物在 `dist/` |
| `npm run preview` | 本地预览 build 产物 |

---

## 🗂️ 路线图 / TODO

- [ ] 后端用户体系（JWT + SQLite）— `routes/auth.js`
- [ ] 学习进度持久化 — `routes/progress.js`
- [ ] 社区帖子 CRUD — `routes/community.js`
- [ ] ScenarioRoleplay 混合模式 — 保留剧情树骨架 + LLM 自由对话兜底
- [ ] AI 流式输出（SSE）— 接 `stream: true` 到 LLM
- [ ] Monaco 在线代码运行 Docker sandbox
- [ ] Docker Compose 一键部署（前后端 + SQLite）
- [ ] 截图文档补全（`docs/screenshots/`）
- [ ] CI：GitHub Actions build + 自动部署

---

## 🤝 贡献

欢迎 PR！

1. Fork → Clone → `git checkout -b feature/your-feature`
2. `npm run dev:all` 本地开发
3. Commit → Push → PR

请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：
`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`

---

## 📄 License

[MIT License](./LICENSE) — Copyright (c) 2026 px-pangu

> 你可以自由地使用、复制、修改、合并、发布、分发、 sublicense 和销售本软件的副本，
> 只要在所有副本或重要部分中保留原版权声明和本许可声明。
