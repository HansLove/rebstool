import { useEffect, useState } from "react";
import { PlayCircle, Info, X } from "lucide-react";
import { ScrollMotionDiv } from "./divs/ScrollMotionDiv";

const TUTORIAL_STORAGE_KEY = "Rebtools::tutorial_hidden";

export default function MiniTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const alreadyDismissed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!alreadyDismissed) {
      setIsVisible(true);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const dismissTutorial = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
  };

  if (isDismissed && !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-2 flex items-center gap-1 text-sm text-black dark:text-white px-4 py-2 rounded-lg hover:text-blue-500 transition"
      >
        <Info size={18} />
        Show Tutorial
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-8 relative overflow-hidden">
      <button
        onClick={dismissTutorial}
        className="absolute top-3 right-3 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
        title="Dismiss tutorial forever"
      >
        <X size={18} />
      </button>

      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
        🎓 How to Get Started
      </h2>

      <ol className="list-decimal pl-6 space-y-3 text-slate-600 dark:text-slate-300 text-sm">
        <li>🎥 Watch the tutorial video below for full instructions.</li>
        <li>🔐 Go to <strong>Settings</strong> and enter your crypto wallet address.</li>
        <li>🚀 Use <strong>Marketing Tools</strong> to grow your network efficiently.</li>
        <li>🔗 Click <strong>Invite</strong> to generate your personal link (we track who you invite).</li>
        <li>📝 After someone signs up, send them the <strong>Typeform</strong> link to qualify.</li>
        <li>💸 Our team grants access and releases <strong>your payment</strong> automatically.</li>
      </ol>

      <ScrollMotionDiv
        delay={400}
        className="flex items-center justify-center bg-slate-100 dark:bg-gray-800 h-48 rounded-lg mt-6"
      >
        <PlayCircle className="text-slate-600 dark:text-white" size={48} />
      </ScrollMotionDiv>
    </div>
  );
}
