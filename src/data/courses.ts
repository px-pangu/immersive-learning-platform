import type { Course, Subject, Level } from '../types'

// 学科元数据
export const SUBJECT_META: Record<
  Subject,
  { name: string; icon: string; color: string }
> = {
  chinese: { name: '语文', icon: 'BookOpen', color: '#ef4444' },
  english: { name: '英语', icon: 'Languages', color: '#3b82f6' },
  math: { name: '数学', icon: 'Calculator', color: '#8b5cf6' },
  politics: { name: '政治', icon: 'Scale', color: '#f59e0b' },
  physics: { name: '物理', icon: 'Atom', color: '#06b6d4' },
  c: { name: 'C语言', icon: 'Terminal', color: '#0ea5e9' },
  cpp: { name: 'C++', icon: 'Code2', color: '#6366f1' },
  python: { name: 'Python', icon: 'Code2', color: '#22c55e' },
  ai: { name: '人工智能', icon: 'Sparkles', color: '#ec4899' },
}

export const LEVEL_META: Record<Level, { name: string; desc: string }> = {
  beginner: { name: '入门', desc: '零基础起步，核心概念精讲' },
  intermediate: { name: '进阶', desc: '能力构建，结构化练习驱动' },
  advanced: { name: '精通', desc: '深度原理 + 综合项目实战' },
}

// Mock 课程数据（每学科 × 每等级 各 1 门课程，每课 2-3 章节占位）
export const COURSES: Course[] = (Object.keys(SUBJECT_META) as Subject[]).flatMap(
  (subject) => {
    const meta = SUBJECT_META[subject]
    return (Object.keys(LEVEL_META) as Level[]).map<Course>((level) => ({
      id: `${subject}-${level}`,
      subject,
      subjectName: meta.name,
      level,
      levelName: LEVEL_META[level].name,
      title: `${meta.name} · ${LEVEL_META[level].name}必修`,
      description: LEVEL_META[level].desc,
      icon: meta.icon,
      color: meta.color,
      chapters: [
        {
          id: `${subject}-${level}-c1`,
          title: '第一章 · 核心概念',
          summary: '建立学科思维框架，掌握最基本的定义和规则',
          duration: 45,
          interactiveTypes: ['flash-quiz', 'knowledge-graph'],
          sections: [
            { id: 's1', type: 'video', title: '导论视频' },
            { id: 's2', type: 'reading', title: '核心定义详解' },
            { id: 's3', type: 'quiz', title: '知识点闯关' },
          ],
        },
        {
          id: `${subject}-${level}-c2`,
          title: '第二章 · 实战演练',
          summary: '通过互动式练习巩固理解',
          duration: 60,
          interactiveTypes:
            subject === 'python' || subject === 'c' || subject === 'cpp' || subject === 'ai'
              ? ['code-playground', 'flash-quiz', 'ai-agent-lite']
              : subject === 'math' || subject === 'physics'
              ? ['formula-derivation', 'dynamic-experiment', 'flash-quiz']
              : subject === 'english'
              ? ['scenario-roleplay', 'voice-follow', 'ai-writing-feedback']
              : ['text-annotation', 'scenario-roleplay', 'knowledge-graph'],
          sections: [
            { id: 's4', type: 'interactive', title: '互动练习台' },
            { id: 's5', type: 'quiz', title: '阶段性检测' },
          ],
        },
        level === 'advanced'
          ? {
              id: `${subject}-${level}-c3`,
              title: '第三章 · 综合项目',
              summary: '真实场景的综合挑战，检验学习成果',
              duration: 90,
              interactiveTypes: ['ai-agent-lite', 'path-brainmap'],
              sections: [
                { id: 's6', type: 'code', title: '项目工坊' },
                { id: 's7', type: 'interactive', title: 'Peer Review' },
              ],
            }
          : null,
      ].filter(Boolean) as Course['chapters'],
    }))
  }
)
