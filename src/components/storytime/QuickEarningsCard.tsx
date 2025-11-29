/**
 * QuickEarningsCard
 * 
 * Compact earnings display for dashboard overview
 * Shows key financial metrics in an attractive, motivational way
 */

import { FC, useState, useEffect } from "react";
import { DollarSign,  Target, Zap } from "lucide-react";

interface QuickEarningsCardProps {
  availableToWithdraw: number;
  totalEarned: number;
  pendingAmount: number;
  claimedAmount: number;
  weeklyGoal?: number;
  showAnimations?: boolean;
}

const QuickEarningsCard: FC<QuickEarningsCardProps> = ({
  availableToWithdraw,
  totalEarned,
  pendingAmount,
  claimedAmount,
  weeklyGoal = 1000,
  showAnimations = true
}) => {
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('quick-earnings');
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
        const increment = availableToWithdraw / 30; // 30 steps
        const timer = setInterval(() => {
          current += increment;
          if (current >= availableToWithdraw) {
            setAnimatedAmount(availableToWithdraw);
            clearInterval(timer);
          } else {
            setAnimatedAmount(Math.floor(current * 100) / 100);
          }
        }, 30);
      };

      animateAmount();
    } else {
      setAnimatedAmount(availableToWithdraw);
    }
  }, [isVisible, availableToWithdraw, showAnimations]);

  const weeklyProgress = Math.min((totalEarned / weeklyGoal) * 100, 100);
  const isWeeklyGoalReached = totalEarned >= weeklyGoal;

  return (
    <div 
      id="quick-earnings"
      className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign size={24} className="text-yellow-300" />
            <h3 className="text-lg font-bold">Tus Ganancias</h3>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={16} className="text-yellow-300" />
            <span className="text-xs font-semibold text-yellow-300">EN VIVO</span>
          </div>
        </div>

        {/* Main Amount */}
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-white mb-1">
            ${animatedAmount.toLocaleString('en-US', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </div>
          <p className="text-green-200 text-sm">Disponible para Retirar</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              ${totalEarned.toLocaleString()}
            </div>
            <div className="text-xs text-green-200">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              ${claimedAmount.toLocaleString()}
            </div>
            <div className="text-xs text-green-200">Retirado</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              ${pendingAmount.toLocaleString()}
            </div>
            <div className="text-xs text-green-200">Pendiente</div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-yellow-300" />
              <span className="text-sm font-semibold">Meta Semanal</span>
            </div>
            <span className="text-sm font-bold">
              ${totalEarned.toLocaleString()} / ${weeklyGoal.toLocaleString()}
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                  isWeeklyGoalReached 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                    : 'bg-gradient-to-r from-green-400 to-green-500'
                }`}
                style={{ width: `${weeklyProgress}%` }}
              />
            </div>
            <div className="absolute right-0 top-0 text-xs text-gray-300">
              {Math.round(weeklyProgress)}%
            </div>
          </div>

          {isWeeklyGoalReached ? (
            <div className="text-center mt-2">
              <span className="text-xs font-bold text-yellow-300">
                ¡META ALCANZADA! 🎉
              </span>
            </div>
          ) : (
            <div className="text-center mt-2">
              <span className="text-xs text-gray-300">
                Faltan ${(weeklyGoal - totalEarned).toLocaleString()} para la meta
              </span>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-4">
          <p className="text-xs text-green-200">
            {availableToWithdraw > 0 
              ? "¡El dinero está esperando por ti!" 
              : "Sigue invitando para generar más ganancias"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickEarningsCard;
