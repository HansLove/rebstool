import { MessageCircle, Building2 } from "lucide-react";
import { getWhatsAppUrl } from "../../utils/phoneFormatter";
import type { RetailClient } from "../../types";

interface UserRowProps {
  user: RetailClient;
  metric: string;
  subMetric?: string;
  onContact?: (user: RetailClient) => void;
  onClick?: (user: RetailClient) => void;
}

export default function UserRow({ user, metric, subMetric, onContact, onClick }: UserRowProps) {
  const whatsappUrl = user.phone ? getWhatsAppUrl(user.phone, user.baseCurrency) : null;

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContact) {
      onContact(user);
    } else if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(user);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {user.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            ID: {user.userId}
          </p>
          {user.ownerName && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300">
              <Building2 className="h-3 w-3" />
              <span className="font-medium truncate max-w-[120px]">{user.ownerName}</span>
            </div>
          )}
        </div>
        {subMetric && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subMetric}</p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-2 shrink-0">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900 dark:text-white">{metric}</p>
        </div>
        {whatsappUrl && (
          <button
            onClick={handleContact}
            className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors opacity-0 group-hover:opacity-100"
            title="Contact via WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

