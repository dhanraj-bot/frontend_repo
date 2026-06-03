import { useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

const ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: 'Shopify sign-in failed. Please try again.',
  no_user: 'Could not read your Shopify staff account. Please try again.',
}

export function SignIn() {
  const { redirect, error } = useSearch({ from: '/(auth)/sign-in' })

  useEffect(() => {
    if (error) {
      toast.error(ERROR_MESSAGES[error] ?? 'Sign-in failed. Please try again.')
    }
  }, [error])

  return (
    <AuthLayout>
      <Card className='max-w-sm gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
          <CardDescription>
            Sign in with your Powerlook Shopify staff account to access the
            admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By signing in, you agree to our{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
