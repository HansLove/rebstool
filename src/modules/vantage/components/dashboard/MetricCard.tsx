import { ChevronDown, ChevronUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: "red" | "orange" | "purple" | "blue";
  isExpanded: boolean;
  onToggle: () => void;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function MetricCard({
  title,
  count,
  icon,
  color,
  isExpanded,
  onToggle,
  onClick,
  children,
}: MetricCardProps) {
  const colorClasses = {
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-600 dark:text-red-400",
      number: "text-red-600 dark:text-red-400",
      hover: "hover:bg-red-100 dark:hover:bg-red-900/30",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-600 dark:text-orange-400",
      number: "text-orange-600 dark:text-orange-400",
      hover: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
      number: "text-purple-600 dark:text-purple-400",
      hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
      number: "text-blue-600 dark:text-blue-400",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-xl transition-all duration-300 cursor-pointer ${colors.hover} hover:shadow-xl active:scale-[0.98] relative ${
        isExpanded ? "shadow-2xl" : ""
      }`}
      onClick={onClick || onToggle}
    >
      {/* Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className={`${colors.text} p-2 rounded-lg bg-white/50 dark:bg-gray-800/50`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className={`text-4xl font-bold mt-1 ${colors.number}`}>{count}</p>
          </div>
        </div>
        <button
          className={`p-2 rounded-lg hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all ${colors.text} ${
            isExpanded ? "rotate-180" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <ChevronDown className="h-5 w-5 transition-transform" />
        </button>
      </div>

      {/* Expandable Content - Fixed Layout */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700 pt-4 animate-in slide-in-from-top-2 duration-300">
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

