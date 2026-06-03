import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { UserAuthForm } from './user-auth-form'

const startShopifyLoginMock = vi.fn()

vi.mock('@/lib/api', () => ({
  startShopifyLogin: (redirectTo?: string) => startShopifyLoginMock(redirectTo),
}))

describe('UserAuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Login with Shopify button', async () => {
    const screen = await render(<UserAuthForm />)
    await expect
      .element(screen.getByRole('button', { name: /login with shopify/i }))
      .toBeInTheDocument()
  })

  it('starts Shopify login on click (no redirect)', async () => {
    const screen = await render(<UserAuthForm />)
    await userEvent.click(
      screen.getByRole('button', { name: /login with shopify/i })
    )
    expect(startShopifyLoginMock).toHaveBeenCalledOnce()
    expect(startShopifyLoginMock).toHaveBeenCalledWith(undefined)
  })

  it('passes redirectTo through to Shopify login', async () => {
    const screen = await render(<UserAuthForm redirectTo='/settings' />)
    await userEvent.click(
      screen.getByRole('button', { name: /login with shopify/i })
    )
    expect(startShopifyLoginMock).toHaveBeenCalledWith('/settings')
  })
})
