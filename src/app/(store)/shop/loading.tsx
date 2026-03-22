import { ProductGridSkeleton } from "@/components/ui/skeleton-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container-safe py-8 md:py-10">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-3 mb-6">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-44 rounded-xl" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
      <ProductGridSkeleton count={12} />
    </div>
  );
}
