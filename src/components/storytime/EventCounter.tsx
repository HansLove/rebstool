/**
 * EventCounter
 * 
 * StoryTime component that shows progress towards a goal
 * Creates social proof and urgency with real-time counters
 */

import { Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface EventCounterProps {
  title: string;
  count: number;
  target: number;
  color?: string;
  icon?: "users" | "trending";
  showPercentage?: boolean;
}

const EventCounter: React.FC<EventCounterProps> = ({ 
  title, 
  count, 
  target, 
  color = "#10B981",
  icon = "users",
  showPercentage = true
}) => {
  const [animatedCount, setAnimatedCount] = useState(0);
  const percentage = Math.min((count / target) * 100, 100);

  useEffect(() => {
    const animateCount = () => {
      let current = 0;
      const increment = count / 30; // 30 steps
      const timer = setInterval(() => {
        current += increment;
        if (current >= count) {
          setAnimatedCount(count);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(current));
        }
      }, 50);
    };

    animateCount();
  }, [count]);

  const IconComponent = icon === "users" ? Users : TrendingUp;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <IconComponent size={24} style={{ color }} />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="space-y-4">
        {/* Counter Display */}
        <div className="text-center">
          <div 
            className="text-4xl font-bold"
            style={{ color }}
          >
            {animatedCount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">
            de {target.toLocaleString()} objetivo
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: color
              }}
            />
          </div>
          {showPercentage && (
            <div className="absolute right-0 top-0 text-xs text-gray-400">
              {Math.round(percentage)}%
            </div>
          )}
        </div>

        {/* Urgency Message */}
        {percentage < 100 && (
          <div className="text-center">
            <p className="text-sm text-gray-300">
              ¡Solo faltan <span className="font-semibold text-white">
                {target - count}
              </span> más para completar el objetivo!
            </p>
          </div>
        )}

        {percentage >= 100 && (
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color }}>
              ¡Objetivo completado! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCounter;
