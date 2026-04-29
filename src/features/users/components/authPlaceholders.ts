type PlaceholderAction = 'create-account' | 'edit-profile' | 'reset-password'

const labels: Record<PlaceholderAction, string> = {
  'create-account': 'Creare cont',
  'edit-profile': 'Editare profil',
  'reset-password': 'Reset parolă',
}

export function runAuthPlaceholder(action: PlaceholderAction, context: Record<string, unknown>) {
  console.info(`[AUTH_PLACEHOLDER] ${action}`, context)
  window.alert(`${labels[action]} este placeholder momentan. Vezi consola pentru context.`)
}
