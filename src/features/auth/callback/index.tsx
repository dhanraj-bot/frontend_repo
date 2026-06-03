import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { api, POST_LOGIN_REDIRECT_KEY } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

/** Read the JWT the backend put in the URL fragment (#token=...). */
function tokenFromHash(): string | null {
  const hash = window.location.hash.replace(/^#/, '')
  return new URLSearchParams(hash).get('token')
}

/** Only allow same-origin internal paths to prevent open redirects. */
function safeInternalPath(path: string | null): string {
  if (path && path.startsWith('/') && !path.startsWith('//')) return path
  return '/'
}

export function AuthCallback() {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  useEffect(() => {
    const token = tokenFromHash()
    if (!token) {
      navigate({
        to: '/sign-in',
        search: { error: 'oauth_failed' },
        replace: true,
      })
      return
    }

    auth.setAccessToken(token)
    // Strip the token out of the URL so it isn't left in history.
    window.history.replaceState(null, '', '/auth/callback')

    api
      .get('/auth/me')
      .then((res) => {
        const u = res.data.user
        auth.setUser({
          accountNo: String(u.sub),
          email: u.email ?? '',
          role: u.accountOwner ? ['owner'] : ['staff'],
          exp: (u.exp ?? 0) * 1000, // JWT exp is seconds; store uses ms
          name: u.name,
          accountOwner: Boolean(u.accountOwner),
          shop: u.shop,
        })

        const dest = safeInternalPath(
          sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY)
        )
        sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY)
        navigate({ to: dest, replace: true })
      })
      .catch(() => {
        auth.reset()
        navigate({
          to: '/sign-in',
          search: { error: 'oauth_failed' },
          replace: true,
        })
      })
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex min-h-svh items-center justify-center'>
      <p className='text-sm text-muted-foreground'>Signing you in…</p>
    </div>
  )
}
