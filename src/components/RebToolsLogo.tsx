import React from 'react';
import { useTheme } from '@/hooks/useTheme';

interface RebToolsLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  showText?: boolean;
  variant?: 'full' | 'icon-only';
}

export const RebToolsLogo: React.FC<RebToolsLogoProps> = ({
  width = 200,
  height = 60,
  className = '',
  showText = true,
  variant = 'full',
}) => {
  const { isDark } = useTheme();
  const isIconOnly = variant === 'icon-only' || !showText;
  const viewBox = isIconOnly ? '0 0 60 60' : '0 0 200 60';
  const finalWidth = isIconOnly ? (typeof width === 'number' ? width : 60) : width;
  const finalHeight = isIconOnly ? (typeof height === 'number' ? height : 60) : height;
  
  // Use different gradient IDs based on dark mode
  const gradientId1 = isDark ? 'rebtools-gradient1-dark' : 'rebtools-gradient1';
  const gradientId2 = isDark ? 'rebtools-gradient2-dark' : 'rebtools-gradient2';

  return (
    <svg
      width={finalWidth}
      height={finalHeight}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Icon: Abstract tool/gear with data lines */}
      <g id="icon">
        {/* Outer gear ring */}
        <circle
          cx="30"
          cy="30"
          r="18"
          stroke={`url(#${gradientId1})`}
          strokeWidth="2"
          fill="none"
        />
        {/* Inner circle */}
        <circle
          cx="30"
          cy="30"
          r="10"
          fill={`url(#${gradientId1})`}
        />
        {/* Data lines radiating outward */}
        <line
          x1="30"
          y1="12"
          x2="30"
          y2="8"
          stroke={`url(#${gradientId1})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="30"
          y1="48"
          x2="30"
          y2="52"
          stroke={`url(#${gradientId1})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="30"
          x2="8"
          y2="30"
          stroke={`url(#${gradientId1})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="48"
          y1="30"
          x2="52"
          y2="30"
          stroke={`url(#${gradientId1})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Diagonal lines */}
        <line
          x1="42.43"
          y1="17.57"
          x2="45.66"
          y2="14.34"
          stroke={`url(#${gradientId1})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="17.57"
          y1="42.43"
          x2="14.34"
          y2="45.66"
          stroke={`url(#${gradientId1})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="42.43"
          y1="42.43"
          x2="45.66"
          y2="45.66"
          stroke={`url(#${gradientId1})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="17.57"
          y1="17.57"
          x2="14.34"
          y2="14.34"
          stroke={`url(#${gradientId1})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Small dots on gear */}
        <circle
          cx="30"
          cy="20"
          r="1.5"
          fill={`url(#${gradientId1})`}
        />
        <circle
          cx="30"
          cy="40"
          r="1.5"
          fill={`url(#${gradientId1})`}
        />
        <circle
          cx="20"
          cy="30"
          r="1.5"
          fill={`url(#${gradientId1})`}
        />
        <circle
          cx="40"
          cy="30"
          r="1.5"
          fill={`url(#${gradientId1})`}
        />
      </g>

      {/* Text: RebTools */}
      {!isIconOnly && (
        <g id="text">
          <text
            x="60"
            y="38"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="24"
            fontWeight="700"
            fill={`url(#${gradientId2})`}
          >
            RebTools
          </text>
        </g>
      )}

      {/* Gradients */}
      <defs>
        <linearGradient id="rebtools-gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="rebtools-gradient1-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4ade80', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="rebtools-gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="rebtools-gradient2-dark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4ade80', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default RebToolsLogo;

