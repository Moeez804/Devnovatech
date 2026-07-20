"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Wraps risky client subtrees (primarily 3D canvases) so a WebGL/runtime failure degrades gracefully instead of crashing the whole page. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Replace with real error-reporting (Sentry, etc.) once available
    console.error("Caught by ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="glass-panel flex h-full min-h-[200px] items-center justify-center rounded-xl2 text-sm text-text-faint">
            Unable to load this visual.
          </div>
        )
      );
    }
    return this.props.children;
  }
}