import { useCallback, useEffect, useState } from 'react'

const DISMISS_KEY = 'carousel-studio-install-dismissed'

// Chrome/Edge/Android fire `beforeinstallprompt` once the PWA criteria (manifest + service
// worker + served over https) are met; the browser won't show its own prompt unless we call
// .prompt() on the captured event, so the UI needs to hold onto it and surface a button.
// Safari/iOS never fires this event — there, "install" is always manual (Share → Add to
// Home Screen), so this hook simply never reports installable there.
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [installed, setInstalled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)').matches,
  )
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault()
      setDeferred(event)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }, [deferred])

  const dismiss = useCallback(() => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Banner just reappears next visit if storage is unavailable — not worth failing over.
    }
  }, [])

  return { canInstall: !!deferred && !installed && !dismissed, promptInstall, dismiss }
}
