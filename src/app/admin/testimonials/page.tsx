import { Metadata } from "next";
import { requireAdmin } from "@/lib/server";
import { getAllTestimonials } from "@/lib/actions/testimonials";
import { TestimonialsManager } from "./testimonials-manager";
import { Star } from "lucide-react";

export const metadata: Metadata = { title: "Testimonials — Admin" };

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  const testimonials = await getAllTestimonials();

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-brand-green-light rounded-xl flex items-center justify-center">
          <Star className="h-5 w-5 text-brand-green" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground text-sm">
            Manage customer testimonials shown on the homepage
          </p>
        </div>
      </div>

      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
