import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDE_INTERVAL = 6000;

const HeroCarousel = () => {
  const slides = useMemo(() => (
    [
      {
        id: 1,
        eyebrow: 'New Collection',
        title: 'Premium Quality Products',
        description:
          'Discover our carefully curated collection of premium products designed to elevate your lifestyle. Experience unmatched quality and craftsmanship.',
        ctaPrimary: {
          label: 'Shop Now',
          href: '/shop',
        },
        ctaSecondary: {
          label: 'View Collection',
          href: '/shop',
        },
        image:
          'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1600&q=80',
        theme: 'slate',
      },
      {
        id: 2,
        eyebrow: 'Summer Sale',
        title: 'Up to 50% Off',
        description:
          'Limited time offer on selected items. Don\'t miss out on these incredible deals. Shop now and save big on your favorite products.',
        ctaPrimary: {
          label: 'Shop Sale',
          href: '/shop',
        },
        ctaSecondary: {
          label: 'View Deals',
          href: '/shop',
        },
        image:
          'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1600&q=80',
        theme: 'indigo',
      },
      {
        id: 3,
        eyebrow: 'New Arrivals',
        title: 'Trending This Week',
        description:
          'Stay ahead of the curve with our latest arrivals. Fresh styles and innovative designs updated weekly to keep your wardrobe current.',
        ctaPrimary: {
          label: 'Explore New',
          href: '/shop',
        },
        ctaSecondary: {
          label: 'See All',
          href: '/shop',
        },
        image:
          'https://images.unsplash.com/photo-1607083206899-5b61b3ec1a8f?auto=format&fit=crop&w=1600&q=80',
        theme: 'gold',
      },
    ]
  ), []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNavigate(1);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleNavigate = (step) => {
    setDirection(step);
    setActiveIndex((prev) => {
      const nextIndex = (prev + step + slides.length) % slides.length;
      return nextIndex;
    });
  };

  const handleDotClick = (index) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const slide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-apple-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] dark:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] transition-all duration-300">
      {/* Decorative gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-28 h-64 w-64 rounded-full bg-apple-blue-500/10 dark:bg-dark-blue-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-apple-gray-200/40 dark:bg-dark-surface-tertiary/40 blur-3xl"></div>
      </div>

      <div className="relative flex flex-col md:flex-row">
        {/* Content */}
        <div className="flex-1 min-w-0 px-6 py-12 sm:px-10 md:pl-14 md:pr-10 lg:pl-16 lg:pr-12 xl:pl-20 xl:pr-16">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={slide.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex h-full flex-col gap-6"
            >
              <span className="text-sm uppercase tracking-[0.3em] text-apple-gray-500 dark:text-dark-text-tertiary transition-colors duration-300">{slide.eyebrow}</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-apple-gray-900 dark:text-dark-text-primary leading-tight transition-colors duration-300">
                {slide.title}
              </h1>
              <p className="text-lg text-apple-gray-600 dark:text-dark-text-secondary leading-relaxed max-w-xl transition-colors duration-300">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  to={slide.ctaPrimary.href}
                  className="apple-button-primary"
                >
                  {slide.ctaPrimary.label}
                </Link>
                <Link
                  to={slide.ctaSecondary.href}
                  className="apple-button-secondary"
                >
                  {slide.ctaSecondary.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={() => handleNavigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-500 hover:text-gray-900 dark:hover:border-gray-400 dark:hover:text-white transition-colors duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleNavigate(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-500 hover:text-gray-900 dark:hover:border-gray-400 dark:hover:text-white transition-colors duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="ml-3 flex items-center gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleDotClick(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-blue-500 dark:bg-blue-400'
                      : 'w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-72 md:h-auto md:w-1/2 lg:w-[44%] overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={slide.image}
              custom={direction}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent dark:from-dark-bg/60 dark:via-dark-bg/20 pointer-events-none" />
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;