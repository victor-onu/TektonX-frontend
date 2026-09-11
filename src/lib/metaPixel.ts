// Minimal Meta (Facebook) Pixel loader. Deliberately NOT added to index.html —
// call `initMetaPixel()` from a page's own effect so tracking only runs on
// pages that explicitly opt in (see src/pages/events/TechAiFutureUyo.tsx),
// instead of loading site-wide.

type Fbq = {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: Fbq
  loaded: boolean
  version: string
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

let initialized = false

/** Injects the Meta Pixel base script and fires the initial PageView. Safe to
 * call with an undefined/empty id (no-op) and safe to call more than once. */
export function initMetaPixel(pixelId: string | undefined) {
  if (!pixelId || initialized || typeof window === 'undefined') return
  initialized = true

  if (!window.fbq) {
    const fbq = function (this: Fbq, ...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args)
      } else {
        fbq.queue.push(args)
      }
    } as Fbq
    fbq.queue = []
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    window.fbq = fbq
    window._fbq = fbq

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript?.parentNode?.insertBefore(script, firstScript)
  }

  window.fbq!('init', pixelId)
  window.fbq!('track', 'PageView')
}

/** Fires a standard (or custom) Meta Pixel event. No-op if the pixel was
 * never initialized (e.g. no pixel ID configured for this environment). */
export function trackMetaPixelEvent(eventName: string, params?: Record<string, unknown>) {
  window.fbq?.('track', eventName, params)
}
