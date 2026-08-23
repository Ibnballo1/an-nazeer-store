"use client";

import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type HorizontalScrollCarouselProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  scrollAmount?: number;
  showArrows?: boolean;
  arrowSize?: "sm" | "md" | "lg";
  gap?: number;
  ariaLabel?: string;
};

export function HorizontalScrollCarousel({
  children,
  className = "",
  contentClassName = "",
  scrollAmount,
  showArrows = true,
  arrowSize = "md",
  gap = 16,
  ariaLabel = "Scrollable content",
}: HorizontalScrollCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /*
   * Check whether the container can scroll
   */
  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;

    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    const tolerance = 2;

    setCanScrollLeft(scrollLeft > tolerance);

    setCanScrollRight(
      scrollLeft + clientWidth < scrollWidth - tolerance
    );
  }, []);

  /*
   * Scroll left/right
   */
  const scroll = useCallback(
    (direction: "left" | "right") => {
      const container = scrollRef.current;

      if (!container) return;

      let amount = scrollAmount;

      /*
       * If scrollAmount isn't provided,
       * scroll approximately one visible card.
       */
      if (!amount) {
        const firstChild =
          container.firstElementChild as HTMLElement | null;

        if (firstChild) {
          amount = firstChild.offsetWidth + gap;
        } else {
          amount = container.clientWidth * 0.8;
        }
      }

      container.scrollBy({
        left:
          direction === "right"
            ? amount
            : -amount,
        behavior: "smooth",
      });
    },
    [gap, scrollAmount]
  );

  /*
   * Monitor scroll position
   */
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [updateScrollState]);

  /*
   * Monitor window resizing
   */
  useEffect(() => {
    const handleResize = () => {
      updateScrollState();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [updateScrollState]);

  /*
   * ResizeObserver handles changes to the
   * actual content/container size.
   */
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const observer = new ResizeObserver(() => {
      updateScrollState();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [updateScrollState]);

  /*
   * Arrow dimensions
   */
  const arrowClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const hasMultipleChildren =
    Children.count(children) > 1;

  return (
    <div
      className={`group/scroll relative ${className}`}
    >
      {/* LEFT ARROW */}
      {showArrows && hasMultipleChildren && (
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className={`
            absolute
            left-2
            top-1/2
            z-30
            flex
            ${arrowClasses[arrowSize]}
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-black/10
            bg-white/95
            text-gray-800
            shadow-lg
            backdrop-blur-sm

            transition-all
            duration-300
            ease-out

            hover:scale-105
            hover:bg-brand-green
            hover:text-white

            focus:outline-none
            focus:ring-2
            focus:ring-brand-green

            disabled:pointer-events-none
            disabled:opacity-0

            ${
              canScrollLeft
                ? "translate-x-0 opacity-100"
                : "-translate-x-3 opacity-0"
            }
          `}
        >
          <ArrowLeft
            className={iconClasses[arrowSize]}
          />
        </button>
      )}

      {/* SCROLL AREA */}
      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className={`
          flex
          w-full
          overflow-x-auto
          overscroll-x-contain
          scroll-smooth
          no-scrollbar
          ${contentClassName}
        `}
      >
        {children}
      </div>

      {/* RIGHT ARROW */}
      {showArrows && hasMultipleChildren && (
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className={`
            absolute
            right-2
            top-1/2
            z-30
            flex
            ${arrowClasses[arrowSize]}
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-black/10
            bg-white/95
            text-gray-800
            shadow-lg
            backdrop-blur-sm

            transition-all
            duration-300
            ease-out

            hover:scale-105
            hover:bg-brand-green
            hover:text-white

            focus:outline-none
            focus:ring-2
            focus:ring-brand-green

            disabled:pointer-events-none
            disabled:opacity-0

            ${
              canScrollRight
                ? "translate-x-0 opacity-100"
                : "translate-x-3 opacity-0"
            }
          `}
        >
          <ArrowRight
            className={iconClasses[arrowSize]}
          />
        </button>
      )}
    </div>
  );
}