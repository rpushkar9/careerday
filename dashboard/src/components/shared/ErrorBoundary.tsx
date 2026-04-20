import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-8">
          <div className="max-w-md rounded-2xl border border-border bg-card p-8 shadow text-center">
            <h1 className="mb-2 text-lg font-semibold text-foreground">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground">
              The dashboard could not load. Check the browser console for
              details.
            </p>
            {this.state.message && (
              <pre className="mt-4 rounded-md bg-muted px-3 py-2 text-left text-xs text-foreground overflow-auto">
                {this.state.message}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
