import { FC } from "react";

interface CircularProgressProps {
  value: number;
  percentage: number;
  label?: string;
  subLabel?: string;
  size?: "sm" | "md" | "lg";
}

const CircularProgress: FC<CircularProgressProps> = ({
  value,
  percentage,
  label = "USDT",
  subLabel = "Available to claim",
  size = "lg",
}) => {
  const sizeClasses = {
    sm: { svg: "w-32 h-32", text: "text-2xl", label: "text-xs", subLabel: "text-xs" },
    md: { svg: "w-48 h-48", text: "text-4xl", label: "text-sm", subLabel: "text-sm" },
    lg: { svg: "w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72", text: "text-3xl sm:text-4xl lg:text-5xl", label: "text-base sm:text-lg", subLabel: "text-sm" },
  };

  const classes = sizeClasses[size];
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className={classes.svg} viewBox="0 0 256 256">
        {/* Background circle */}
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
          className="text-slate-300 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className={`${classes.text} font-bold text-slate-800 dark:text-white leading-none`}>
            ${value.toFixed(2)}
          </div>
          <div className={`${classes.label} font-semibold text-lime-600 dark:text-lime-400 mt-1`}>
            {label}
          </div>
          <div className={`${classes.subLabel} text-slate-600 dark:text-slate-400 mt-2`}>
            {subLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
