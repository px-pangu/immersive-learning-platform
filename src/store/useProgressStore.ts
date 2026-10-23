import { create } from 'zustand'
import type { Progress } from '../types'

interface ProgressState {
  records: Progress[]
  getProgressByCourse: (courseId: string) => number
  markComplete: (record: Progress) => void
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  records: [],

  getProgressByCourse: (courseId) => {
    const { records } = get()
    const done = records.filter((r) => r.courseId === courseId && r.completed).length
    // 简单估算：每门课约 15 个 section（9门课 × 3等级的结构）
    return Math.min(100, Math.round((done / 10) * 100))
  },

  markComplete: (record) =>
    set((state) => {
      const exists = state.records.find(
        (r) =>
          r.courseId === record.courseId &&
          r.sectionId === record.sectionId
      )
      if (exists) return state
      return { records: [...state.records, { ...record, completed: true, timestamp: Date.now() }] }
    }),
}))
