"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const products = [
  {id: 1, img: "/images/heros/spice-hero.jpeg", slug: "spice-hero"},
  {id: 2, img: "/images/heros/oil-hero.jpeg", slug: "oil-hero"},
  {id: 3, img: "/images/heros/herb-hero.jpeg", slug: "herb-hero"},
  {id: 4, img: "/images/heros/seeds-hero.jpeg", slug: "seeds-hero"},
  {id: 5, img: "/images/heros/beauty-hero.jpeg", slug: "beauty-hero"},
];

const AUTOPLAY_DELAY = 5000; // 5 seconds

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
  }, [isHovered]);

  /*
   * Reset active index if products change
   */
  // useEffect(() => {
  //   if (activeIndex >= products.length) {
  //     setActiveIndex(0);
  //   }
  // }, [activeIndex]);

  if (!products.length) {
    return null;
  }

  return (
    <section
      className="relative w-full"
      aria-label="Hero products"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <div className="relative w-full overflow-hidden aspect-1024/1536 bg-white shadow-card">
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
            <div className="relative h-full w-full">
                <Image
                    src={product.img}
                    alt={product.slug}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-contain"
                />

            {/* Optional subtle overlay */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
            </div>
          </div>
        ))}

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
                aria-label={`Show ${product.slug}`}
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
          Showing hero product{" "}
          {activeIndex + 1} of {products.length}
        </div>
      </div>
    </section>
  );
}

