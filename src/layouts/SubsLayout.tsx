import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useSubsDashboardData } from "@/modules/subAffiliates/hooks/useSubsDashboardData";
import InviteModal from "./InviteModal";
import TutorialModal from "./TutorialModal";
import SubsNavbar from "@/modules/subAffiliates/components/SubsNavbar";
import { SubsLayoutContext } from "./types/subsLayout.types";

export default function SubsLayout() {
  // ============================================================================
  // State Management
  // ============================================================================
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [userSlug, setUserSlug] = useState<string | null>(null);

  // ============================================================================
  // Data Fetching
  // ============================================================================
  const { registrationsReport, deal, isLoading, error } = useSubsDashboardData();

  // ============================================================================
  // Modal Handlers
  // ============================================================================
  const handleOpenInviteModal = () => setIsInviteModalOpen(true);
  const handleCloseInviteModal = () => setIsInviteModalOpen(false);
  const handleOpenTutorialModal = () => setIsTutorialModalOpen(true);
  const handleCloseTutorialModal = () => setIsTutorialModalOpen(false);

  // ============================================================================
  // Error State
  // ============================================================================
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Context Data
  // ============================================================================
  const contextData: SubsLayoutContext = {
    registrationsReport,
    deal,
    userSlug,
    isLoading,
  };

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 text-slate-900 dark:text-white">
      {/* Navigation */}
      <SubsNavbar
        setIsInviteModalOpen={handleOpenInviteModal}
        setIsTutorialModalOpen={handleOpenTutorialModal}
        setUserSlug={setUserSlug}
      />

      {/* Main Content Area */}
      <main className="md:mx-auto md:px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <Outlet context={contextData} />
        )}
      </main>

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        accountId=""
        userSlug={userSlug}
      />

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={handleCloseTutorialModal}
      />
    </div>
  );
}

// Re-export types for convenience
export type { SubsLayoutContext } from "./types/subsLayout.types";
