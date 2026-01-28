'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

export interface AlphabetErrorBoundaryProps {
  children: ReactNode
  componentName?: string
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class AlphabetErrorBoundary extends Component<AlphabetErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: AlphabetErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`Error in ${this.props.componentName || 'component'}:`, error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-4 border-2 border-red-500 rounded-lg bg-red-50 text-center">
          <p className="text-red-700 font-semibold">
            Something went wrong{this.props.componentName ? ` in ${this.props.componentName}` : ''}.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
