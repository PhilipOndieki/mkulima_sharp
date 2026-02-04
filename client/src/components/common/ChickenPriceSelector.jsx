import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ChickenPriceSelector = ({ 
  priceByAge,         // Object: { "1 Week": 100, "2 Weeks": 155, ... }
  onAgeSelect,        // Callback: (age, price) => {}
  selectedAge,        // Currently selected age
  currency = 'KSh',
  minOrderQty = 50    // Minimum order quantity for chickens
}) => {
  // Get age brackets from priceByAge object
  const ageBrackets = Object.keys(priceByAge || {});
  
  // Initialize with selected or first age
  const [currentAge, setCurrentAge] = useState(
    selectedAge || ageBrackets[0] || ''
  );

  // If no pricing data, don't render
  if (!priceByAge || ageBrackets.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Price information not available
      </div>
    );
  }

  /**
   * Handle age selection change
   */
  const handleAgeChange = (e) => {
    const newAge = e.target.value;
    setCurrentAge(newAge);
    
    // Notify parent component
    if (onAgeSelect) {
      onAgeSelect(newAge, priceByAge[newAge]);
    }
  };

  const currentPrice = priceByAge[currentAge];

  return (
    <div className="space-y-3">
      {/* Age Bracket Selector */}
      <div>
        <label 
          htmlFor="age-selector" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Age
        </label>
        <select
          id="age-selector"
          value={currentAge}
          onChange={handleAgeChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg 
                     focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 
                     transition-all text-base font-medium text-gray-900
                     min-h-[48px] cursor-pointer bg-white"
        >
          {ageBrackets.map((age) => (
            <option key={age} value={age}>
              {age} - {currency} {priceByAge[age].toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* Current Price Display Card */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm text-primary-700 font-medium">
            Price per chick:
          </span>
          <span className="text-2xl font-bold text-primary-600">
            {currency} {currentPrice?.toLocaleString()}
          </span>
        </div>
        <div className="text-xs text-primary-600">
          {currentAge} old
        </div>
      </div>

      {/* Minimum Order Info */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <p className="text-xs font-semibold text-amber-900">
            Minimum Order: {minOrderQty} chicks
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Total: {currency} {(currentPrice * minOrderQty).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

ChickenPriceSelector.propTypes = {
  priceByAge: PropTypes.object.isRequired,
  onAgeSelect: PropTypes.func,
  selectedAge: PropTypes.string,
  currency: PropTypes.string,
  minOrderQty: PropTypes.number
};

export default ChickenPriceSelector;