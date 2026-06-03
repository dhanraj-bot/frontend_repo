import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

function getInitials(name?: string, email?: string): string {
  const base = (name || email || '').trim()
  if (!base) return 'U'
  const parts = base.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return base.slice(0, 2).toUpperCase()
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='space-y-1'>
      <p className='text-sm font-medium'>{label}</p>
      <div className='text-sm text-muted-foreground'>{value || '—'}</div>
    </div>
  )
}

export function ShopifyAccount() {
  const { auth } = useAuthStore()
  const user = auth.user

  const name = user?.name ?? '—'
  const email = user?.email ?? '—'
  const shop = user?.shop ?? '—'
  const isOwner = Boolean(user?.accountOwner)

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Avatar className='h-14 w-14'>
          <AvatarFallback className='text-base'>
            {getInitials(user?.name, user?.email)}
          </AvatarFallback>
        </Avatar>
        <div className='space-y-1'>
          <p className='text-base font-medium'>{name}</p>
          <p className='text-sm text-muted-foreground'>{email}</p>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <Field label='Name' value={name} />
        <Field label='Email' value={email} />
        <Field
          label='Role'
          value={
            <Badge variant={isOwner ? 'default' : 'secondary'}>
              {isOwner ? 'Store owner' : 'Staff'}
            </Badge>
          }
        />
        <Field label='Store' value={shop} />
      </div>

      <p className='text-xs text-muted-foreground'>
        Your identity is managed by Shopify. To change your name, email, or
        permissions, update your staff account in the Shopify admin.
      </p>
    </div>
  )
}
