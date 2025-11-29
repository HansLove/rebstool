import { useState } from "react";
import { Menu, Copy, UserPlus, Wallet, Gift, RefreshCw, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import useAuth from "@/core/hooks/useAuth";
import { templates } from "@/modules/subAffiliates/constants";

interface MobileActionsMenuProps {
  runScraper: () => void;
  isScrapping: boolean;
  openDepositModal: () => void;
  openWithdrawModal: () => void;
}

export function MobileActionsMenu({
  runScraper,
  isScrapping,
  openDepositModal,
  openWithdrawModal,
}: MobileActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate] = useState(0);
  const { getUser } = useAuth();

  const getCurrentInviteUrl = () => {
    const baseUrl = window.location.origin;
    const template = templates[selectedTemplate];
    return `${baseUrl}/${template.keyword}/${getUser().slug}`;
  };

  const handleCopyInviteLink = async () => {
    const inviteUrl = getCurrentInviteUrl();
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("❌ Failed to copy invite link:", err);
    }
  };

  const handleMenuItemClick = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  const menuItems = [
    // Quick Actions section
    {
      section: "📊 Quick Actions",
      items: [
        {
          id: "copy-invite",
          icon: copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />,
          label: copied ? "Link Copied!" : "Copy Invite Link",
          color: "text-green-400",
          bgColor: "hover:bg-green-500/20",
          onClick: handleCopyInviteLink,
        },
        {
          id: "new-sub",
          icon: <UserPlus className="w-4 h-4" />,
          label: "New Sub Affiliate",
          color: "text-green-400",
          bgColor: "hover:bg-green-500/20",
          onClick: () => handleMenuItemClick(openDepositModal),
        },
      ],
    },
    // Financial section
    {
      section: "💰 Financial",
      items: [
        {
          id: "withdraw",
          icon: <Wallet className="w-4 h-4" />,
          label: "Withdraw Funds",
          color: "text-blue-400",
          bgColor: "hover:bg-blue-500/20",
          onClick: () => handleMenuItemClick(openWithdrawModal),
        },
        {
          id: "rebates",
          icon: <Gift className="w-4 h-4" />,
          label: "View Rebates",
          color: "text-orange-400",
          bgColor: "hover:bg-orange-500/20",
          onClick: () => handleMenuItemClick(() => {}), // TODO: connect to rebates modal
        },
      ],
    },
    // Tools section
    {
      section: "🔄 Tools",
      items: [
        {
          id: "re-sync",
          icon: <RefreshCw className="w-4 h-4" />,
          label: "Re-sync Data",
          color: "text-blue-400",
          bgColor: "hover:bg-blue-600/20",
          onClick: () => handleMenuItemClick(runScraper),
          disabled: isScrapping,
        },
      ],
    },
  ];

  return (
    <div className="md:hidden relative">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-md text-xs text-slate-300 transition-colors"
        aria-label="Actions menu"
      >
        <Menu className="w-4 h-4" />
        <span>Actions</span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-full right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50"
            >
              <div className="p-2 space-y-3">
                {menuItems.map((section) => (
                  <div key={section.section}>
                    {/* Section Header */}
                    <div className="px-2 py-1.5">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {section.section}
                      </span>
                    </div>

                    {/* Section Items */}
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <motion.button
                          key={item.id}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={item.onClick}
                          disabled={item.disabled}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-200 transition-colors ${
                            item.bgColor
                          } ${
                            item.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className={item.color}>{item.icon}</div>
                          <span className="text-sm font-medium text-slate-200">
                            {item.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
