import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl mb-6">🌿</p>
      <h1 className="font-display text-4xl font-bold mb-3">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you
        back to something wholesome.
      </p>
      <div className="flex gap-3">
        <Button
          asChild
          className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
        >
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/shop">Shop Products</Link>
        </Button>
      </div>
    </div>
  );
}
