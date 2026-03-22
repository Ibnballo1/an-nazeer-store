"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-xl"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
        )
        .reduce<(number | "...")[]>((acc, p, i, arr) => {
          if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) {
            acc.push("...");
          }
          acc.push(p);
          return acc;
        }, [])
        .map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => goTo(p as number)}
              className={`rounded-xl ${
                p === currentPage
                  ? "bg-brand-green hover:bg-brand-green-dark text-white"
                  : ""
              }`}
            >
              {p}
            </Button>
          ),
        )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-xl"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
