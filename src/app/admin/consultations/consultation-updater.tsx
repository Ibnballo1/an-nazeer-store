"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateConsultationStatus } from "@/lib/actions/consultation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const STATUSES = [
  "pending",
  "contacted",
  "scheduled",
  "completed",
  "cancelled",
] as const;

type Props = {
  id: string;
  currentStatus: (typeof STATUSES)[number];
  currentNotes: string | null;
};

export function ConsultationUpdater({
  id,
  currentStatus,
  currentNotes,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes ?? "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleUpdate() {
    startTransition(async () => {
      const result = await updateConsultationStatus(
        id,
        status,
        notes || undefined,
      );
      if (result.success) {
        toast.success("Consultation updated");
        router.refresh();
      } else {
        toast.error("Update failed. " + result.error);
      }
    });
  }

  return (
    <div className="border-t border-border pt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
              status === s
                ? "bg-brand-green text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Internal notes about this consultation…"
        rows={2}
        className="rounded-xl resize-none text-sm"
      />

      <Button
        onClick={handleUpdate}
        disabled={isPending}
        size="sm"
        className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
      >
        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
      </Button>
    </div>
  );
}
