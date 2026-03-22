import { Badge } from "@/components/ui/badge";

type Props = { status: string };

const STATUS_STYLES: Record<string, string> = {
  // Order status
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-700 border-gray-200",
  // Payment status
  paid: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  // Product status
  active: "bg-green-100 text-green-800 border-green-200",
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  archived: "bg-red-100 text-red-800 border-red-200",
  // Consultation
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  scheduled: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};

export function StatusBadge({ status }: Props) {
  const style =
    STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <Badge className={`${style} border text-[11px] font-medium capitalize`}>
      {status}
    </Badge>
  );
}
