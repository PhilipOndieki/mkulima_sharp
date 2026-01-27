import { useState, useEffect } from 'react';

/**
 * Custom hook to detect scroll direction and position
 * Optimized with requestAnimationFrame for 60fps performance
 * 
 * @param {number} threshold - Minimum scroll distance to trigger direction change (default: 100)
 * @returns {Object} { scrollDirection, scrollPosition, isScrolled }
 */
export const useScrollDirection = (threshold = 100) => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      
      // Update scroll position
      setScrollPosition(scrollY);

      // Determine direction only if scroll distance exceeds threshold
      if (Math.abs(scrollY - prevScrollPosition) < 15 ) {
        ticking = false;
        return;
      }

      // Scrolling DOWN - hide top tier
      if (scrollY > prevScrollPosition && scrollY > threshold) {
        setScrollDirection('down');
      } 
      // Scrolling UP - show top tier
      else if (scrollY < prevScrollPosition) {
        setScrollDirection('up');
      }

      setPrevScrollPosition(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // Set initial scroll position
    setPrevScrollPosition(window.scrollY);
    setScrollPosition(window.scrollY);

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { 
    scrollDirection, 
    scrollPosition,
    isScrolled: scrollPosition > threshold 
  };
};