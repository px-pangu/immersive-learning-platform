import { create } from 'zustand'
import type { User } from '../types'

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateExp: (amount: number) => void
}

const MOCK_USER: User = {
  id: 'u-001',
  username: '智学新星',
  email: 'demo@zhixuetang.com',
  level: 'beginner',
  exp: 120,
  achievements: ['welcome', 'first-lesson'],
  createdAt: Date.now(),
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isAuthenticated: false,

  login: async (email: string, _password: string) => {
    // Mock 实现：任何 email 都成功，真实项目替换为 API 调用
    await new Promise((r) => setTimeout(r, 400))
    set({ currentUser: { ...MOCK_USER, email }, isAuthenticated: true })
    return true
  },

  register: async (username: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 400))
    set({
      currentUser: { ...MOCK_USER, username, email },
      isAuthenticated: true,
    })
    return true
  },

  logout: () => set({ currentUser: null, isAuthenticated: false }),

  updateExp: (amount: number) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, exp: state.currentUser.exp + amount }
        : null,
    })),
}))
