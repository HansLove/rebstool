/**
 * CountdownTimer
 * 
 * StoryTime component that creates urgency with countdown timers
 * Perfect for live events, limited offers, and time-sensitive promotions
 */

import { FC, useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endTime: string; // ISO string
  title: string;
  subtitle?: string;
  onComplete?: () => void;
}

const CountdownTimer: FC<CountdownTimerProps> = ({ 
  endTime, 
  title, 
  subtitle, 
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setIsExpired(true);
        onComplete?.();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  if (isExpired) {
    return (
      <div className="bg-red-600 text-white text-center py-4 px-6 rounded-lg">
        <p className="font-bold">¡El evento ha comenzado!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock size={24} />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      
      {subtitle && (
        <p className="text-red-100 mb-4">{subtitle}</p>
      )}

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-red-200">Días</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-red-200">Horas</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-red-200">Min</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-red-200">Seg</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
