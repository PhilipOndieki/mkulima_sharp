import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-reveal animations
 * Triggers when element enters viewport
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Percentage of element visible before trigger (0-1)
 * @param {string} options.rootMargin - Margin around viewport for early/late trigger
 * @param {boolean} options.once - If true, animation triggers only once
 * @returns {Array} [ref, isVisible] - Ref to attach to element and visibility state
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // If once option is true, stop observing after first trigger
          if (options.once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!options.once) {
          // If once is false, toggle visibility based on intersection
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold || 0.2,
        rootMargin: options.rootMargin || '0px'
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, isVisible];
};

/**
 * Hook to track scroll position
 * Useful for navbar behavior and scroll-based effects
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      setScrollPosition(currentScrollY);
      setLastScrollY(currentScrollY);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return { scrollPosition, scrollDirection };
};

/**
 * Hook for intersection observer without state
 * Useful when you need the observer instance directly
 */
export const useIntersectionObserver = (callback, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      threshold: options.threshold || 0,
      rootMargin: options.rootMargin || '0px',
      root: options.root || null
    });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [callback, options.threshold, options.rootMargin, options.root]);

  return ref;
};
