import { LogIn } from 'lucide-react'
import { startShopifyLogin } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  return (
    <div className={cn('grid gap-3', className)} {...props}>
      <Button type='button' onClick={() => startShopifyLogin(redirectTo)}>
        <LogIn />
        Login with Shopify
      </Button>
      <p className='text-center text-xs text-muted-foreground'>
        Use your Powerlook Shopify staff account.
      </p>
    </div>
  )
}
