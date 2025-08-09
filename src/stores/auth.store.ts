import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/services/auth/AuthService'

interface AuthStoreState {
  // Authentication state
  isAuthenticated: boolean
  user: User | null
  sessionId: string | null
  token: string | null
  
  // Actions
  setAuthenticated: (user: User, sessionId: string, token: string) => void
  setUnauthenticated: () => void
  updateToken: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      sessionId: null,
      token: null,
      
      // Actions
      setAuthenticated: (user, sessionId, token) => {
        set({
          isAuthenticated: true,
          user,
          sessionId,
          token,
        })
      },
      
      setUnauthenticated: () => {
        set({
          isAuthenticated: false,
          user: null,
          sessionId: null,
          token: null,
        })
      },
      
      updateToken: (token) => {
        set((state) => ({
          ...state,
          token,
        }))
      },
      
      clearAuth: () => {
        set({
          isAuthenticated: false,
          user: null,
          sessionId: null,
          token: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      // Don't persist sensitive data like tokens for security
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        sessionId: state.sessionId,
        // Note: token is not persisted for security reasons
      }),
    }
  )
)