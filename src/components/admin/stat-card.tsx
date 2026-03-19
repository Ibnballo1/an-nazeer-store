import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "green" | "blue" | "amber" | "red";
};

const COLOR_MAP = {
  green: "bg-brand-green-light text-brand-green",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
};

export function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  trend,
  color = "green",
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4">
      <div
        className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
          COLOR_MAP[color],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <p className="font-display text-2xl font-bold mt-0.5 truncate">
          {value}
        </p>
        {sub && (
          <p
            className={cn(
              "text-xs mt-0.5",
              trend === "up"
                ? "text-brand-green"
                : trend === "down"
                  ? "text-red-500"
                  : "text-muted-foreground",
            )}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
