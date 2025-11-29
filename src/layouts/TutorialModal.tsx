import { X, MessageSquare, Mail, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import SubAffiliateTutorial from "@/modules/subAffiliates/pages/SubAffiliateTutorial";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  // Desabilitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full lg:max-w-[60vw] sm:max-w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            Affill Tutorial & Help
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition"
            aria-label="Close tutorial"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            <SubAffiliateTutorial />
          </div>
        </div>

        {/* Footer - Customer Support */}
        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href="mailto:support@affill.com"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300"
            >
              <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Email Support</p>
                <p className="text-xs opacity-75">support@affill.com</p>
              </div>
            </a>
            <a
              href="https://discord.gg/affill"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300"
            >
              <MessageSquare className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Discord Community</p>
                <p className="text-xs opacity-75">Join our server</p>
              </div>
            </a>
            <a
              href="https://docs.affill.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300"
            >
              <ExternalLink className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Documentation</p>
                <p className="text-xs opacity-75">Learn more</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
