// 成就定义 + 检查引擎
// 每次"重要事件"调用 checkAchievements(userId, eventType, payload)

export const ACHIEVEMENTS = [
  { id: 'welcome', title: '初次拜访', desc: '注册并登录智学堂', icon: '🎯', check: (e) => e.type === 'register', goal: 1 },
  { id: 'first-lesson', title: '迈出第一步', desc: '完成第一节课程', icon: '📚', check: (e) => e.type === 'chapter_complete', goal: 1 },
  { id: 'streak-7', title: '连胜 7 天', desc: '连续 7 天每天学习', icon: '🔥', check: (e) => e.type === 'streak_update' && e.payload >= 7, goal: 7 },
  { id: 'streak-30', title: '学习达人', desc: '连续 30 天每天学习', icon: '👑', check: (e) => e.type === 'streak_update' && e.payload >= 30, goal: 30 },
  { id: 'code-newbie', title: '代码新星', desc: '写出第一段正确代码', icon: '💻', check: (e) => e.type === 'code_success', goal: 1 },
  { id: 'quiz-master', title: '闯关达人', desc: '闯关获得满分', icon: '🏆', check: (e) => e.type === 'quiz_fullmark', goal: 1 },
  { id: 'ai-friend', title: 'AI 好搭档', desc: 'AI 助手帮你解决 10 次问题', icon: '🤖', check: (e) => e.type === 'ai_qa', goal: 10 },
  { id: 'subject-complete', title: '单科通关', desc: '完成一门课程所有章节', icon: '⭐', check: (e) => e.type === 'subject_complete', goal: 1 },
  { id: 'community-star', title: '社区之星', desc: '帖子获 100 个赞', icon: '🌟', check: (e) => e.type === 'post_like' && e.payload >= 100, goal: 100 },
  { id: 'speed-runner', title: '闪电学习', desc: '一小时内完成 5 节', icon: '⚡', check: (e) => e.type === 'speed_run', goal: 1 },
]

// 根据事件累加"进度计数"，返回新解锁的成就列表
export function evaluateAchievements(existing, eventType, payload = 1) {
  const newlyUnlocked = []
  const updated = []

  for (const ach of ACHIEVEMENTS) {
    if (!ach.check({ type: eventType, payload })) continue
    const current = existing.find((e) => e.ach_id === ach.id)
    if (!current) {
      newlyUnlocked.push({ ...ach, progress: payload })
      updated.push({ ach_id: ach.id, progress: payload, newly: true })
    } else if (current.progress < ach.goal && current.progress < payload) {
      updated.push({ ach_id: ach.id, progress: payload, newly: false })
    }
  }

  return { newlyUnlocked, updates: updated }
}
