import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">
          {/* Brand */}
          <span className="font-heading text-3xl gradient-text">TektonX</span>

          {/* Error illustration */}
          <div className="flex size-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
            <span className="font-heading text-4xl text-red-400">!</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl text-white">SOMETHING WENT WRONG</h1>
            <p className="text-sm text-white/50 leading-relaxed">
              An unexpected error occurred. Please reload the page and try again.
            </p>
          </div>

          {/* Show error detail in development */}
          {import.meta.env.DEV && this.state.error && (
            <div className="w-full rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-left">
              <p className="text-xs font-mono text-red-400 break-all">{this.state.error.message}</p>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg bg-tekton-purple-bright px-5 py-2.5 text-sm font-medium text-white hover:bg-tekton-purple-bright/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }
}
