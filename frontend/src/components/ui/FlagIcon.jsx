import React from 'react';

/**
 * Renders a country flag image using flagcdn.com CDN.
 * Provides consistent rendering across all browsers and platforms,
 * including Windows desktop where emoji flags may not render correctly.
 *
 * @param {string} code - ISO 3166-1 alpha-2 country code (e.g. "US", "IN")
 * @param {number} size - Width in pixels (height is proportional). Default: 20
 * @param {string} className - Additional CSS classes
 */
export function FlagIcon({ code, width = 16, height = 12, className = '' }) {
  if (!code) return null;
  const lowerCode = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/${width}x${height}/${lowerCode}.png`}
      srcSet={`https://flagcdn.com/${width * 2}x${height * 2}/${lowerCode}.png 2x,
               https://flagcdn.com/${width * 3}x${height * 3}/${lowerCode}.png 3x`}
      width={width}
      height={height}
      alt={code}
      className={`inline-block align-middle flex-shrink-0 ${className}`}
      loading="lazy"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
  );
}

export default FlagIcon;
