import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-[#0f7a3a]/10 rounded-full flex items-center justify-center mb-6">
        <Leaf className="w-10 h-10 text-[#0f7a3a]" />
      </div>
      <h1 className="font-display text-6xl font-bold text-stone-900 mb-3">
        404
      </h1>
      <h2 className="font-display text-2xl font-semibold text-stone-700 mb-3">
        Page Not Found
      </h2>
      <p className="text-stone-500 max-w-md mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#0f7a3a] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#0a5c2c] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
