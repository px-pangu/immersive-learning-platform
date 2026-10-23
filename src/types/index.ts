// 学科类型
export type Subject =
  | 'chinese'
  | 'english'
  | 'math'
  | 'politics'
  | 'physics'
  | 'c'
  | 'cpp'
  | 'python'
  | 'ai'

// 学习等级
export type Level = 'beginner' | 'intermediate' | 'advanced'

// 课程（一门课程 = 某学科 × 某等级）
export interface Course {
  id: string
  subject: Subject
  subjectName: string
  level: Level
  levelName: string
  title: string
  description: string
  icon: string
  color: string
  chapters: Chapter[]
}

// 章节
export interface Chapter {
  id: string
  title: string
  summary: string
  duration: number // 分钟
  interactiveTypes: InteractiveType[]
  sections: Section[]
}

// 章节内的学习段落（视频 + 文本 + 互动的组合单元）
export interface Section {
  id: string
  type: 'video' | 'reading' | 'interactive' | 'quiz' | 'code'
  title: string
  content?: string
  videoUrl?: string
  interactiveId?: string
}

// 互动组件类型
export type InteractiveType =
  | 'code-playground'
  | 'formula-derivation'
  | 'dynamic-experiment'
  | 'scenario-roleplay'
  | 'text-annotation'
  | 'voice-follow'
  | 'ai-writing-feedback'
  | 'knowledge-graph'
  | 'algorithm-viz'
  | 'ai-agent-lite'
  | 'flash-quiz'
  | 'path-brainmap'

// 模块进度
export interface Progress {
  courseId: string
  chapterId: string
  sectionId: string
  completed: boolean
  score?: number
  timestamp?: number
}

// 用户
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  level: Level
  exp: number
  achievements: string[]
  createdAt: number
}

// 成就
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: string
  unlockedAt?: number
}

// 社区帖子
export interface Post {
  id: string
  userId: string
  username: string
  subject: Subject
  content: string
  likes: number
  comments: Comment[]
  createdAt: number
}

export interface Comment {
  id: string
  userId: string
  username: string
  content: string
  createdAt: number
}
