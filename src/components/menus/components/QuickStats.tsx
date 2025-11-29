import { Wallet, Users, Clock, ChevronDown } from "lucide-react";
import { useState } from "react";


interface QuickStatsProps {
    totalBalance: number;
    totalSubAffiliates: number;
    activeSubAffiliates: number;
    lastUpdated: string;
    isLoadingBalance: boolean;
    onClickBalance: () => void;
  }


export const QuickStats = ({ totalBalance, totalSubAffiliates, activeSubAffiliates, lastUpdated, isLoadingBalance, onClickBalance }: QuickStatsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const stats = [
      {
        icon: <Wallet className="w-3 h-3" />,
        label: "Balance",
        value: isLoadingBalance ? "..." : `$${totalBalance.toFixed(2)}`,
        color: "text-green-400",
        onClick: onClickBalance
      },
      {
        icon: <Users className="w-3 h-3" />,
        label: "Subs",
        value: `${activeSubAffiliates}/${totalSubAffiliates}`,
        color: "text-blue-400"
      },
      {
        icon: <Clock className="w-3 h-3" />,
        label: "Updated",
        value: lastUpdated,
        color: "text-slate-400"
      }
    ];
  
    return (
      <div className="relative">
        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-4">
          {stats.map((stat, index) => (
            <div
            onClick={stat.onClick ? stat.onClick : undefined}
            key={index} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50">
                <div className={stat.color}>{stat.icon}</div>
                <span className="text-xs text-slate-300">{stat.label}:</span>
                <span className="text-xs font-medium text-white">{stat.value}</span>
            </div>
          ))}
        </div>
  
        {/* Mobile Dropdown */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            <span>Quick</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
  
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
              <div className="p-2 space-y-1">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-700/50">
                    <div className={stat.color}>{stat.icon}</div>
                    <span className="text-xs text-slate-300">{stat.label}:</span>
                    <span className="text-xs font-medium text-white ml-auto">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };