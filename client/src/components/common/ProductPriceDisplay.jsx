import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const ProductPriceDisplay = ({ 
  price,
  wholesalePrice,
  showSavings = true,
  currency = 'KSh',
  size = 'medium',
  className = '',
  testId = 'product-price-display'
}) => {
  
  // ==================== INPUT VALIDATION ====================
  
  /**
   * Validate and sanitize numeric price input
   * Handles: null, undefined, NaN, negative numbers, strings
   */
  const validatePrice = (value) => {
    if (value === null || value === undefined) return null;
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue) || !isFinite(numValue)) {
      console.warn('[ProductPriceDisplay] Invalid price value:', value);
      return null;
    }
    
    if (numValue < 0) {
      console.warn('[ProductPriceDisplay] Negative price value:', numValue);
      return null;
    }
    
    return numValue;
  };

  /**
   * Validate currency string
   */
  const validateCurrency = (value) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
      console.warn('[ProductPriceDisplay] Invalid currency:', value);
      return 'KSh'; // Safe default
    }
    return value.trim();
  };

  /**
   * Validate size prop
   */
  const validateSize = (value) => {
    const validSizes = ['small', 'medium', 'large'];
    if (!validSizes.includes(value)) {
      console.warn('[ProductPriceDisplay] Invalid size:', value);
      return 'medium'; // Safe default
    }
    return value;
  };

  // ==================== SANITIZED VALUES ====================
  
  const sanitizedPrice = useMemo(() => validatePrice(price), [price]);
  const sanitizedWholesalePrice = useMemo(() => validatePrice(wholesalePrice), [wholesalePrice]);
  const sanitizedCurrency = useMemo(() => validateCurrency(currency), [currency]);
  const sanitizedSize = useMemo(() => validateSize(size), [size]);

  // ==================== BUSINESS LOGIC ====================
  
  /**
   * Calculate pricing state
   * Memoized for performance - only recalculates when prices change
   */
  const pricingState = useMemo(() => {
    const hasRetail = sanitizedPrice !== null && sanitizedPrice > 0;
    const hasWholesale = sanitizedWholesalePrice !== null && sanitizedWholesalePrice > 0;
    
    const state = {
      hasBothPrices: hasRetail && hasWholesale,
      hasOnlyRetail: hasRetail && !hasWholesale,
      hasOnlyWholesale: !hasRetail && hasWholesale,
      hasNoPrices: !hasRetail && !hasWholesale,
      retailPrice: sanitizedPrice,
      wholesalePrice: sanitizedWholesalePrice
    };
    
    // Calculate savings only if both prices exist
    if (state.hasBothPrices) {
      const savingsAmount = sanitizedPrice - sanitizedWholesalePrice;
      
      // Only show savings if wholesale is actually cheaper
      if (savingsAmount > 0) {
        state.savings = {
          amount: savingsAmount,
          percentage: Math.round((savingsAmount / sanitizedPrice) * 100)
        };
      }
    }
    
    return state;
  }, [sanitizedPrice, sanitizedWholesalePrice]);

  // ==================== STYLE CONFIGURATION ====================
  
  /**
   * Size-based styling configuration
   * Immutable and type-safe
   */
  const sizeConfig = useMemo(() => ({
    small: {
      label: 'text-xs',
      price: 'text-base',
      badge: 'text-xs',
      icon: 'w-3.5 h-3.5',
      gap: 'gap-1.5',
      spacing: 'space-y-1.5'
    },
    medium: {
      label: 'text-sm',
      price: 'text-lg md:text-xl',
      badge: 'text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2',
      spacing: 'space-y-2'
    },
    large: {
      label: 'text-base',
      price: 'text-xl md:text-2xl',
      badge: 'text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2.5',
      spacing: 'space-y-2.5'
    }
  }), []);

  const styles = sizeConfig[sanitizedSize];

  // ==================== HELPER FUNCTIONS ====================
  
  /**
   * Format price with thousand separators
   * Handles edge cases: 0, very large numbers
   */
  const formatPrice = (value) => {
    if (value === null || value === undefined || value === 0) return '0';
    
    try {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    } catch (error) {
      console.error('[ProductPriceDisplay] Number formatting error:', error);
      return String(value);
    }
  };

  // ==================== ERROR STATE ====================
  
  // If no valid prices exist, render graceful fallback
  if (pricingState.hasNoPrices) {
    return (
      <div 
        className={`text-sm text-gray-500 italic ${className}`}
        data-testid={testId}
        role="status"
        aria-label="Price information unavailable"
      >
        Price not available
      </div>
    );
  }

  // ==================== RENDER ====================
  
  return (
    <div 
      className={`${styles.spacing} ${className}`}
      data-testid={testId}
      role="region"
      aria-label="Product pricing information"
    >
      {/* DUAL PRICING: Both Retail and Wholesale */}
      {pricingState.hasBothPrices && (
        <>
          {/* Retail Price */}
          <div 
            className={`flex items-baseline ${styles.gap}`}
            role="group"
            aria-label="Retail price"
          >
            <span 
              className={`${styles.label} text-gray-600 font-medium`}
              aria-hidden="true"
            >
              Retail:
            </span>
            <span className={`${styles.price} font-bold text-gray-900`}>
              <span className="sr-only">Retail price: </span>
              {sanitizedCurrency} {formatPrice(pricingState.retailPrice)}
            </span>
          </div>

          {/* Wholesale Price */}
          <div 
            className={`flex items-baseline ${styles.gap}`}
            role="group"
            aria-label="Wholesale price"
          >
            <span 
              className={`${styles.label} text-primary-700 font-medium`}
              aria-hidden="true"
            >
              Wholesale:
            </span>
            <span className={`${styles.price} font-bold text-primary-600`}>
              <span className="sr-only">Wholesale price: </span>
              {sanitizedCurrency} {formatPrice(pricingState.wholesalePrice)}
            </span>
          </div>

          {/* Savings Badge */}
          {showSavings && pricingState.savings && (
            <div 
              className={`inline-flex items-center ${styles.gap} px-2.5 py-1 bg-green-50 rounded-full`}
              role="status"
              aria-label={`You save ${sanitizedCurrency} ${formatPrice(pricingState.savings.amount)} or ${pricingState.savings.percentage} percent`}
            >
              <svg 
                className={`${styles.icon} text-green-600 flex-shrink-0`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className={`${styles.badge} font-semibold text-green-700 whitespace-nowrap`}>
                Save {sanitizedCurrency} {formatPrice(pricingState.savings.amount)} ({pricingState.savings.percentage}%)
              </span>
            </div>
          )}
        </>
      )}

      {/* SINGLE PRICING: Retail Only */}
      {pricingState.hasOnlyRetail && (
        <div 
          className={`flex items-baseline ${styles.gap}`}
          role="group"
          aria-label="Product price"
        >
          <span 
            className={`${styles.label} text-gray-600 font-medium`}
            aria-hidden="true"
          >
            Price:
          </span>
          <span className={`${styles.price} font-bold text-primary-600`}>
            <span className="sr-only">Price: </span>
            {sanitizedCurrency} {formatPrice(pricingState.retailPrice)}
          </span>
        </div>
      )}

      {/* SINGLE PRICING: Wholesale Only */}
      {pricingState.hasOnlyWholesale && (
        <div 
          className={`flex items-baseline ${styles.gap}`}
          role="group"
          aria-label="Wholesale price"
        >
          <span 
            className={`${styles.label} text-primary-700 font-medium`}
            aria-hidden="true"
          >
            Wholesale:
          </span>
          <span className={`${styles.price} font-bold text-primary-600`}>
            <span className="sr-only">Wholesale price: </span>
            {sanitizedCurrency} {formatPrice(pricingState.wholesalePrice)}
          </span>
        </div>
      )}
    </div>
  );
};

// ==================== PROP TYPES VALIDATION ====================

ProductPriceDisplay.propTypes = {
  /** Retail price - can be number, string (will be parsed), null, or undefined */
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  
  /** Wholesale price - can be number, string (will be parsed), null, or undefined */
  wholesalePrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  
  /** Whether to display savings badge when both prices exist */
  showSavings: PropTypes.bool,
  
  /** Currency symbol or code */
  currency: PropTypes.string,
  
  /** Size variant for responsive text scaling */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  
  /** Additional CSS classes for custom styling */
  className: PropTypes.string,
  
  /** Test ID for automated testing */
  testId: PropTypes.string
};

ProductPriceDisplay.defaultProps = {
  showSavings: true,
  currency: 'KSh',
  size: 'medium',
  className: '',
  testId: 'product-price-display'
};

// ==================== PERFORMANCE OPTIMIZATION ====================

// Memoize component to prevent unnecessary re-renders
// Only re-render if props actually change
export default React.memo(ProductPriceDisplay, (prevProps, nextProps) => {
  return (
    prevProps.price === nextProps.price &&
    prevProps.wholesalePrice === nextProps.wholesalePrice &&
    prevProps.showSavings === nextProps.showSavings &&
    prevProps.currency === nextProps.currency &&
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className
  );
});