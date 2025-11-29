/**
 * PayoutShowcase
 * 
 * StoryTime component focused on showcasing earnings and payouts
 * Creates desire and social proof through financial success stories
 */

import { FC, useState, useEffect } from "react";
import { DollarSign, Users, Star } from "lucide-react";

interface PayoutShowcaseProps {
  amount: number;
  totalEarnings: number;
  successStories: number;
  currency?: string;
  showAnimation?: boolean;
}

const PayoutShowcase: FC<PayoutShowcaseProps> = ({
  amount,
  totalEarnings,
  successStories,
  currency = "USD",
  showAnimation = true
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

    const element = document.getElementById('payout-showcase');
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
    if (isVisible && showAnimation) {
      const animateAmount = () => {
        let current = 0;
        const increment = amount / 50; // 50 steps
        const timer = setInterval(() => {
          current += increment;
          if (current >= amount) {
            setAnimatedAmount(amount);
            clearInterval(timer);
          } else {
            setAnimatedAmount(Math.floor(current * 100) / 100);
          }
        }, 30);
      };

      animateAmount();
    } else {
      setAnimatedAmount(amount);
    }
  }, [isVisible, amount, showAnimation]);

  return (
    <div 
      id="payout-showcase"
      className="bg-gradient-to-br from-green-900/80 to-green-800/80 backdrop-blur-sm rounded-xl p-6 border border-green-500/20"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <DollarSign size={32} className="text-green-400" />
          <h3 className="text-2xl font-bold text-white">Ganancias Reales</h3>
        </div>
        <p className="text-green-200 text-sm">
          Último retiro de {new Date().toLocaleDateString('es-ES')}
        </p>
      </div>

      {/* Main Payout Display */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-green-400 mb-2">
          ${animatedAmount.toLocaleString('en-US', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
        </div>
        <p className="text-green-200 text-lg">
          Retirado en {currency}
        </p>
      </div>

      {/* Success Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            ${totalEarnings.toLocaleString()}
          </div>
          <div className="text-xs text-green-200">Ganancias Totales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {successStories.toLocaleString()}
          </div>
          <div className="text-xs text-green-200">Estudiantes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">9+</div>
          <div className="text-xs text-green-200">Años Exp.</div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-black/20 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Star size={16} className="text-yellow-400 fill-current" />
          <span className="text-sm font-semibold text-white">Testimonio Real</span>
        </div>
        <p className="text-sm text-green-200 italic">
          "Con la metodología de David, logré generar ingresos adicionales de $2,000 a $30,000 USD mensuales. 
          Es la mejor inversión que he hecho en mi vida financiera."
        </p>
        <p className="text-xs text-gray-400 mt-2">- María González, Estudiante</p>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <p className="text-sm text-green-200 mb-2">
          ¿Listo para transformar tu vida financiera?
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Users size={14} />
          <span>+{successStories.toLocaleString()} personas ya lo lograron</span>
        </div>
      </div>
    </div>
  );
};

export default PayoutShowcase;
