import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const AUTH_USER = 'auth_user'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
  /** Shopify staff display name. */
  name?: string
  /** Whether the Shopify user is the store account owner. */
  accountOwner?: boolean
  /** The myshopify store domain this session belongs to. */
  shop?: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

function readUserCookie(): AuthUser | null {
  const raw = getCookie(AUTH_USER)
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(raw)) as AuthUser
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  return {
    auth: {
      // Persisted so the profile (name/email) survives page reloads.
      user: readUserCookie(),
      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(AUTH_USER, encodeURIComponent(JSON.stringify(user)))
          } else {
            removeCookie(AUTH_USER)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(AUTH_USER)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
