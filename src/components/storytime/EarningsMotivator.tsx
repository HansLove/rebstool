/**
 * EarningsMotivator
 * 
 * StoryTime component focused on motivating through earnings display
 * Creates desire and urgency by showcasing financial success
 */

import { FC, useState, useEffect } from "react";
import { TrendingUp, Zap, Star, Trophy } from "lucide-react";

interface EarningsMotivatorProps {
  availableToWithdraw: number;
  totalEarned: number;
  pendingAmount: number;
  claimedAmount: number;
  weeklyGoal?: number;
  monthlyGoal?: number;
  showAnimations?: boolean;
}

const EarningsMotivator: FC<EarningsMotivatorProps> = ({
  availableToWithdraw,
  totalEarned,
  // pendingAmount,
  claimedAmount,
  weeklyGoal = 1000,
  monthlyGoal = 5000,
  showAnimations = true
}) => {
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('earnings-motivator');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && showAnimations) {
      const animateAmount = () => {
        let current = 0;
        const increment = availableToWithdraw / 60; // 60 steps
        const timer = setInterval(() => {
          current += increment;
          if (current >= availableToWithdraw) {
            setAnimatedAmount(availableToWithdraw);
            clearInterval(timer);
          } else {
            setAnimatedAmount(Math.floor(current * 100) / 100);
          }
        }, 20);
      };

      animateAmount();
    } else {
      setAnimatedAmount(availableToWithdraw);
    }
  }, [isVisible, availableToWithdraw, showAnimations]);

  const currentGoalAmount = currentGoal === 'weekly' ? weeklyGoal : monthlyGoal;
  const goalProgress = Math.min((totalEarned / currentGoalAmount) * 100, 100);
  const isGoalReached = totalEarned >= currentGoalAmount;

  const motivationalMessages = [
    "¡Increíble! Estás generando ingresos reales",
    "Cada día que pasa, tu red crece más",
    "El dinero está llegando, ¡sigue así!",
    "Tu dedicación se está convirtiendo en ganancias",
    "¡Excelente trabajo! Los resultados hablan por sí solos"
  ];

  const [currentMessage, setCurrentMessage] = useState(motivationalMessages[0]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = motivationalMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % motivationalMessages.length;
        return motivationalMessages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(messageInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div 
      id="earnings-motivator"
      className="bg-gradient-to-br from-green-900/90 to-emerald-800/90 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy size={32} className="text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">¡Tus Ganancias Reales!</h2>
            <Trophy size={32} className="text-yellow-400" />
          </div>
          <p className="text-green-200 text-lg animate-pulse">
            {currentMessage}
          </p>
        </div>

        {/* Main Earnings Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-green-400 mb-2 tracking-tight">
            ${animatedAmount.toLocaleString('en-US', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </div>
          <p className="text-green-200 text-xl">
            Disponible para Retirar
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Zap size={20} className="text-yellow-400" />
            <span className="text-yellow-400 font-semibold">¡DINERO REAL!</span>
            <Zap size={20} className="text-yellow-400" />
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              ${totalEarned.toLocaleString()}
            </div>
            <div className="text-sm text-green-200">Total Ganado</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              ${claimedAmount.toLocaleString()}
            </div>
            <div className="text-sm text-green-200">Ya Retirado</div>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="bg-black/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Meta {currentGoal === 'weekly' ? 'Semanal' : 'Mensual'}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentGoal('weekly')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  currentGoal === 'weekly'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setCurrentGoal('monthly')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  currentGoal === 'monthly'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                Mensual
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progreso</span>
              <span className="text-white font-semibold">
                ${totalEarned.toLocaleString()} / ${currentGoalAmount.toLocaleString()}
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                    isGoalReached 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                      : 'bg-gradient-to-r from-green-400 to-green-500'
                  }`}
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <div className="absolute right-0 top-0 text-xs text-gray-300">
                {Math.round(goalProgress)}%
              </div>
            </div>

            {isGoalReached ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold">
                  <Star size={20} className="fill-current" />
                  <span>¡META ALCANZADA!</span>
                  <Star size={20} className="fill-current" />
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  ¡Excelente trabajo! Has superado tu objetivo
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  Faltan <span className="font-semibold text-white">
                    ${(currentGoalAmount - totalEarned).toLocaleString()}
                  </span> para alcanzar tu meta
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Motivational Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">
              {Math.floor(totalEarned / 100)}
            </div>
            <div className="text-xs text-green-200">Cientos Ganados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {Math.floor(totalEarned / 1000)}
            </div>
            <div className="text-xs text-green-200">Miles Ganados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {Math.floor(totalEarned / 10000)}
            </div>
            <div className="text-xs text-green-200">Decenas de Miles</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-green-200 text-sm mb-2">
            ¿Listo para retirar tus ganancias?
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <TrendingUp size={14} />
            <span>El dinero está esperando por ti</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsMotivator;
