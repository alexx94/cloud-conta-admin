import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createAccountantOptions } from '@/features/users/api/accountant-mutations'
import { accountantKeys } from '@/shared/api/accountants/queries'

interface Props {
  onClose: () => void
}

function Field({ label, required, children, error }: {
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function CreateContabilModal({ onClose }: Props) {
  const [denumire, setDenumire] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  // // TODO - Contabil modal trebuie sa aiba mutations si queries puse ca hooks, nu asa la gramada

  const queryClient = useQueryClient()

  const emailError = emailTouched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? 'Introdu o adresă de email validă.'
    : undefined
  const passwordError = passwordTouched && password.length < 8
    ? 'Parola trebuie să aibă cel puțin 8 caractere.'
    : undefined

  const isValid =
    !!denumire.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    password.length >= 8

  const createMutation = useMutation({
    ...createAccountantOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountantKeys.all })
      toast.success('Contabil creat cu succes.')
      onClose()
    },
  })

  function handleClose() {
    if (createMutation.isPending) return
    onClose()
  }

  function handleCreate() {
    createMutation.mutate({
      denumire: denumire.trim(),
      email: email.trim(),
      password,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      onKeyDown={e => { if (e.key === 'Escape') handleClose() }}
    >
      <div
        className="bg-background border border-border rounded-xl shadow-xl w-full max-w-md flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Contabil nou</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Date cont contabil</p>
          </div>
          <button
            onClick={handleClose}
            disabled={createMutation.isPending}
            className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 disabled:opacity-40 disabled:pointer-events-none"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Conținut */}
        <div className="px-5 py-4 flex flex-col gap-4">
          <Field label="Denumire" required>
            <Input
              value={denumire}
              onChange={e => setDenumire(e.target.value)}
              placeholder="Nume Prenume / Firma SRL"
              autoFocus
              disabled={createMutation.isPending}
            />
          </Field>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Credențiale cont</p>
            <div className="flex flex-col gap-3 mt-1">
              <Field label="Email" required error={emailError}>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="contabil@exemplu.ro"
                  disabled={createMutation.isPending}
                  className={emailError ? 'border-red-500 focus-visible:ring-red-500/30' : ''}
                />
              </Field>
              <Field label="Parolă" required error={passwordError}>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="min. 8 caractere"
                    disabled={createMutation.isPending}
                    className={`pr-9 ${passwordError ? 'border-red-500 focus-visible:ring-red-500/30' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    disabled={createMutation.isPending}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" className="flex-1" onClick={handleClose} disabled={createMutation.isPending}>
            Anulează
          </Button>
          <Button
            className="flex-1"
            onClick={handleCreate}
            disabled={!isValid || createMutation.isPending}
            loading={createMutation.isPending}
          >
            {createMutation.isPending ? 'Se creează...' : 'Creează contabil'}
          </Button>
        </div>
      </div>
    </div>
  )
}
