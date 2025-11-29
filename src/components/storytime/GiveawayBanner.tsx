/**
 * GiveawayBanner
 * 
 * StoryTime component for promoting giveaways and special offers
 * Creates excitement and urgency for limited-time promotions
 */

import { FC, useState, useEffect } from "react";
import { Gift, Clock, Users, Star } from "lucide-react";

interface GiveawayBannerProps {
  title: string;
  description: string;
  prize: string;
  endTime: string; // ISO string
  participants?: number;
  maxParticipants?: number;
}

const GiveawayBanner: FC<GiveawayBannerProps> = ({
  title,
  description,
  prize,
  endTime,
  participants = 0,
  maxParticipants = 1000
}) => {
  const [timeLeft, setTimeLeft] = useState({
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
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (isExpired) {
    return (
      <div className="bg-gray-600 text-white text-center py-4 px-6 rounded-lg">
        <p className="font-bold">¡El sorteo ha terminado!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Gift size={24} className="text-yellow-300" />
          <h3 className="text-xl font-bold">{title}</h3>
          <div className="ml-auto flex items-center gap-1 text-yellow-300">
            <Star size={16} className="fill-current" />
            <span className="text-sm font-semibold">EXCLUSIVO</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-purple-100 mb-4 text-sm leading-relaxed">
          {description}
        </p>

        {/* Prize Display */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300 mb-1">
              {prize}
            </div>
            <p className="text-sm text-purple-200">Premio Principal</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Clock size={20} className="text-purple-200" />
          <div className="flex gap-2">
            <div className="bg-black/30 rounded-lg px-3 py-2 text-center min-w-[50px]">
              <div className="text-lg font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-xs text-purple-200">Hrs</div>
            </div>
            <div className="bg-black/30 rounded-lg px-3 py-2 text-center min-w-[50px]">
              <div className="text-lg font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-xs text-purple-200">Min</div>
            </div>
            <div className="bg-black/30 rounded-lg px-3 py-2 text-center min-w-[50px]">
              <div className="text-lg font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-xs text-purple-200">Seg</div>
            </div>
          </div>
        </div>

        {/* Participants Counter */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-purple-200" />
            <span className="text-purple-200">
              {participants.toLocaleString()} participantes
            </span>
          </div>
          <div className="text-purple-200">
            Máximo: {maxParticipants.toLocaleString()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="h-2 bg-yellow-300 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((participants / maxParticipants) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Urgency Message */}
        <div className="mt-4 text-center">
          <p className="text-sm font-semibold text-yellow-300">
            ¡No te quedes fuera! Los cupos se agotan rápido
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiveawayBanner;
