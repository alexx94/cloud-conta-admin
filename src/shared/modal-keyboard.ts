import type { KeyboardEvent } from 'react'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function focusInitialModalControl(node: HTMLElement | null) {
  if (!node || node.dataset.initialFocus === 'true') return

  node.dataset.initialFocus = 'true'
  setTimeout(() => node.focus(), 0)
}

export function handleModalKeyboard(event: KeyboardEvent<HTMLElement>, onClose: () => void) {
  if (event.key === 'Escape') {
    onClose()
    return
  }

  if (event.key !== 'Tab') return

  const focusableElements = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  )
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (!firstElement || !lastElement) {
    event.preventDefault()
    return
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
    return
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}
