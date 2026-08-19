"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type SponsoredProduct = {
  id: number;
  img: string;
  slug: string;
};

type SponsoredProductsCarouselProps = {
  products: SponsoredProduct[];
};

const AUTOPLAY_DELAY = 5000; // 5 seconds

const formatSponsoredTitle = (slug: string) => {
  const raw = slug.split("/").pop() ?? "";

  return raw
    .split("-")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

export function SponsoredProductsCarousel({
  products,
}: SponsoredProductsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  /*
   * Go to previous slide
   */
  const goPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? products.length - 1 : current - 1
    );
  }, [products.length]);

  /*
   * Go to next slide
   */
  const goNext = useCallback(() => {
    setActiveIndex((current) =>
      current === products.length - 1 ? 0 : current + 1
    );
  }, [products.length]);

  /*
   * Automatic carousel
   *
   * The carousel changes every 5 seconds.
   * It stops completely while the user is hovering over it.
   */
  useEffect(() => {
    if (products.length <= 1 || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === products.length - 1 ? 0 : current + 1
      );
    }, AUTOPLAY_DELAY);

    return () => clearInterval(interval);
  }, [products.length, isHovered]);

  /*
   * Reset active index if products change
   */
  // useEffect(() => {
  //   if (activeIndex >= products.length) {
  //     setActiveIndex(0);
  //   }
  // }, [products.length, activeIndex]);

  if (!products.length) {
    return null;
  }

  return (
    <section
      className="group relative w-full"
      aria-label="Sponsored products"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <div className="relative w-full overflow-hidden rounded-2xl aspect-1366/768 bg-white shadow-card ring-8 ring-brand-cream">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === activeIndex
                ? "translate-x-0 opacity-100"
                : index < activeIndex
                  ? "-translate-x-full opacity-0" 
                  : "translate-x-full opacity-0"
            }`}
            aria-hidden={index !== activeIndex}
          >
            <Link
              href={`/${product.slug}`}
              className="group relative block h-full w-full overflow-hidden bg-white"
              tabIndex={index === activeIndex ? 0 : -1}
            >
              <div className="relative h-full w-full">
                <Image
                  src={product.img}
                  alt={formatSponsoredTitle(product.slug)}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-contain"
                />

                {/* Optional subtle overlay */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
              </div>

              {/* Sponsored badge */}
              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
                  Sponsored
                </span>
              </div>
            </Link>
          </div>
        ))}

        {/* Previous button */}
        {products.length > 1 && (
        <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous sponsored product"
            className="
            absolute left-3 top-1/2 z-30
            flex h-11 w-11
            -translate-y-1/2
            items-center justify-center
            rounded-full
            border border-border
            bg-white/95
            text-foreground
            shadow-lg
            opacity-0
            pointer-events-none
            transition-all duration-300
            hover:scale-105
            hover:border-brand-green
            hover:text-brand-green
            group-hover:opacity-100
            group-hover:pointer-events-auto
            focus-visible:opacity-100
            focus-visible:pointer-events-auto
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-brand-green
            md:left-5
            "
        >
            <ArrowLeft className="h-5 w-5" />
        </button>
        )}

        {/* Next button */}
        {products.length > 1 && (
        <button
            type="button"
            onClick={goNext}
            aria-label="Next sponsored product"
            className="
            absolute right-3 top-1/2 z-30
            flex h-11 w-11
            -translate-y-1/2
            items-center justify-center
            rounded-full
            border border-border
            bg-white/95
            text-foreground
            shadow-lg
            opacity-0
            pointer-events-none
            transition-all duration-300
            hover:scale-105
            hover:border-brand-green
            hover:text-brand-green
            group-hover:opacity-100
            group-hover:pointer-events-auto
            focus-visible:opacity-100
            focus-visible:pointer-events-auto
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-brand-green
            md:right-5
            "
        >
            <ArrowRight className="h-5 w-5" />
        </button>
        )}

        {/* Dots */}
        {products.length > 1 && (
          <div
            className="
              absolute bottom-3 left-1/2 z-20
              flex -translate-x-1/2
              items-center gap-2
              rounded-full
              bg-black/20
              px-3 py-2
              backdrop-blur-sm
              md:bottom-5
            "
          >
            {products.map((product, index) => (
              <button
                key={product.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${formatSponsoredTitle(
                  product.slug
                )}`}
                aria-current={
                  index === activeIndex ? "true" : undefined
                }
                className={`
                  h-2.5 w-2.5
                  rounded-full
                  transition-all duration-300
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-1
                  ${
                    index === activeIndex
                      ? "w-7 bg-brand-green"
                      : "bg-white/70 hover:bg-white"
                  }
                `}
              />
            ))}
          </div>
        )}

        {/* Screen-reader status */}
        <div className="sr-only" aria-live="polite">
          Showing sponsored product{" "}
          {activeIndex + 1} of {products.length}
        </div>
      </div>
    </section>
  );
}

