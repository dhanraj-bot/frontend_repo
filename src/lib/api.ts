import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

/** Key used to remember where to land after a Shopify OAuth round-trip. */
export const POST_LOGIN_REDIRECT_KEY = 'post_login_redirect'

/**
 * Axios instance for the powerlook-admin-server backend.
 * Attaches the app JWT from the auth store as a Bearer token.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Full-page redirect into the backend's Shopify OAuth flow. */
export function startShopifyLogin(redirectTo?: string): void {
  if (redirectTo) {
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, redirectTo)
  }
  window.location.assign(`${API_BASE_URL}/auth/shopify`)
}
