import { useScrollReveal } from '../../hooks/useScrollReveal';
import clsx from 'clsx';

/**
 * AnimatedSection Component
 * Wraps content and animates it when it enters the viewport
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.animation - Animation type: 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'scale'
 * @param {number} props.delay - Delay before animation starts (ms)
 * @param {number} props.duration - Animation duration (ms)
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.threshold - Intersection threshold (0-1)
 */
const AnimatedSection = ({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.2
}) => {
  const [ref, isVisible] = useScrollReveal({ threshold, once: true });

  const animationClasses = {
    'fade-up': isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-10',
    'fade-down': isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 -translate-y-10',
    'fade-left': isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 translate-x-10',
    'fade-right': isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 -translate-x-10',
    'scale': isVisible 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95',
  };

  return (
    <div
      ref={ref}
      className={clsx(
        'transition-all',
        animationClasses[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
