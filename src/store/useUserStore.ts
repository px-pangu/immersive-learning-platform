import { create } from 'zustand'
import type { User } from '../types'
import { apiAuth } from '../lib/api'

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  init: () => Promise<void>
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (username: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  updateUser: (patch: Partial<User>) => void
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isAuthenticated: false,

  init: async () => {
    try {
      const data = await apiAuth.me()
      if (data.user) {
        set({ currentUser: data.user as User, isAuthenticated: true })
      }
    } catch {
      // token 无效 / 后端挂了 → 静默清空
      apiAuth.saveToken('')
    }
  },

  login: async (account: string, password: string) => {
    try {
      const { user, token } = await apiAuth.login(account, password)
      apiAuth.saveToken(token)
      set({ currentUser: user as User, isAuthenticated: true })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: (e as Error).message }
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const { user, token } = await apiAuth.register(username, email, password)
      apiAuth.saveToken(token)
      set({ currentUser: user as User, isAuthenticated: true })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: (e as Error).message }
    }
  },

  logout: () => {
    apiAuth.saveToken('')
    set({ currentUser: null, isAuthenticated: false })
  },

  updateUser: (patch) => set((s) => (s.currentUser ? { currentUser: { ...s.currentUser, ...patch } } : {})),
}))
