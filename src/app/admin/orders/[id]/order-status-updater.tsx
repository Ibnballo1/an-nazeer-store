"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Order } from "@/db/schema";

const ORDER_STATUSES: Order["status"][] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

type Props = {
  orderId: string;
  currentStatus: Order["status"];
  currentTracking: string | null;
};

export function OrderStatusUpdater({
  orderId,
  currentStatus,
  currentTracking,
}: Props) {
  const [status, setStatus] = useState<Order["status"]>(currentStatus);
  const [tracking, setTracking] = useState(currentTracking ?? "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdate() {
    setLoading(true);
    const result = await updateOrderStatus(
      orderId,
      status,
      tracking || undefined,
    );
    setLoading(false);

    if (result.success) {
      toast.success("Order updated. Status has been updated.");
      router.refresh();
    } else {
      toast.error("Update failed. " + result.error);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <h2 className="font-semibold text-sm mb-4">Update Status</h2>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Order Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Order["status"])}
            className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-sm"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Tracking Number</Label>
          <Input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="e.g. GIGS123456789"
            className="h-9 rounded-xl text-sm"
          />
        </div>

        <Button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-brand-green hover:bg-brand-green-dark text-white rounded-xl h-9"
          size="sm"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Update Order"
          )}
        </Button>
      </div>
    </div>
  );
}
