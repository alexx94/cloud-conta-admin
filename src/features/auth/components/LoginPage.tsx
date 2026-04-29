import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearch } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/features/auth/api/useLogin'

const schema = z.object({
  email: z.string().email('Email invalid'),
  password: z.string().min(1, 'Parola este obligatorie'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const search = useSearch({ from: '/login' }) as { error?: string }
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    login(values)
  }

  const errorMessage = (() => {
    if (search.error === 'unauthorized') {
      return 'Acces restricționat. Doar conturile de administrator pot accesa această aplicație.'
    }
    if (!error) return null
    const msg = (error as Error).message
    if (msg === 'unauthorized') {
      return 'Acces restricționat. Doar conturile de administrator pot accesa această aplicație.'
    }
    return 'Email sau parolă incorectă.'
  })()

  return (
    <div className="min-h-svh bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <ShieldCheck className="size-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              CloudConta Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Panou de administrare
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="admin@exemplu.ro"
              autoComplete="email"
              autoFocus
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Parolă"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {errorMessage && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                <p className="text-xs text-destructive leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <Button type="submit" size="lg" loading={isPending} className="w-full mt-1">
              {isPending ? 'Se autentifică...' : 'Autentificare'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Acces restricționat · Doar administratori
        </p>
      </div>
    </div>
  )
}
