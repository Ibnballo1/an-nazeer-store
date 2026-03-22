"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean; message: string };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="font-display text-lg font-semibold mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {this.state.message ||
                "An unexpected error occurred. Please try again."}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, message: "" })}
              className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
            >
              Try Again
            </Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
