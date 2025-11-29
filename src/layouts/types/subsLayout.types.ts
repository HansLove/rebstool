/**
 * Type definitions for SubsLayout and related components
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Context data passed to child routes via Outlet
 */
export interface SubsLayoutContext {
  registrationsReport: any[];
  deal: number;
  userSlug: string | null;
  isLoading: boolean;
}

/**
 * Dashboard data structure returned from API
 */
export interface SubsDashboardResponse {
  deal: number;
  data: any[];
}

/**
 * Props for SubsNavbar component
 */
export interface SubsNavbarProps {
  setIsInviteModalOpen: (isOpen: boolean) => void;
  setUserSlug: (slug: string | null) => void;
}

/**
 * Props for InviteModal component
 */
export interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  userSlug: string | null;
}

