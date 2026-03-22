"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="font-display text-2xl font-bold mb-2">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mb-8 max-w-sm text-sm">
        We encountered an unexpected error. Our team has been notified. Please
        try again.
      </p>
      <div className="flex gap-3">
        <Button
          onClick={reset}
          className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="rounded-xl"
        >
          Go Home
        </Button>
      </div>
      {error.digest && (
        <p className="text-xs text-muted-foreground mt-6 font-mono">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
