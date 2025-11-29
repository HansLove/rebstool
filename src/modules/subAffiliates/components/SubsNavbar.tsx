/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import {
  FiLogOut,
  FiMoon,
  FiSun,
  FiUserPlus,
  FiMenu,
  FiX,
  FiHelpCircle,
  FiHome,
  FiUsers,
  FiDollarSign,
  FiShare2,
  FiSettings,
} from "react-icons/fi";
import { Link } from 'react-router-dom';
import useAuth from '@/core/hooks/useAuth';
import { subsNavigateOptions } from '@/layouts/subsNavigationOptions';


// Icon mapping helper
const getIcon = (iconName: string) => {
  const iconMap = {
    FiHome: FiHome,
    FiUsers: FiUsers,
    FiDollarSign: FiDollarSign,
    FiShare2: FiShare2,
    FiSettings: FiSettings,
    FiHelpCircle: FiHelpCircle,
  };
  return iconMap[iconName as keyof typeof iconMap] || FiHome;
};

export default function SubsNavbar({
  setUserSlug,
  setIsInviteModalOpen,
  setIsTutorialModalOpen,
}: {
  setUserSlug: (slug: string | null) => void;
  setIsInviteModalOpen: (isOpen: boolean) => void;
  setIsTutorialModalOpen: (isOpen: boolean) => void;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { getUser, logout } = useAuth();

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setIsDarkMode(isDark);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }

    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserSlug(parsed.slug || null);
      }
    } catch {
      setUserSlug(null);
    }
  }, []);

  return (
    <>
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="container mx-auto flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between">
            <img className="w-14" src="/assets/images/logos/min-logo.png" alt="logo" />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 md:hidden">
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Links */}
          <nav className="hidden space-x-1 md:flex">
            {subsNavigateOptions.map(opt => {
              const IconComponent = getIcon(opt.icon);
              return (
                <Link
                  key={opt.href}
                  to={opt.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 group"
                  title={opt.description}
                >
                  <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{opt.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-gray-700 sm:block dark:text-white">{getUser()?.name}</span>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="hidden items-center rounded-full bg-indigo-100 px-4 py-2 text-indigo-700 transition hover:bg-indigo-200 sm:flex dark:bg-indigo-600 dark:text-indigo-100 dark:hover:bg-indigo-700"
            >
              <FiUserPlus className="mr-2" /> Invite
            </button>

            <button
              onClick={() => setIsTutorialModalOpen(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              title="Help & Tutorial"
              aria-label="Open help and tutorial"
            >
              <FiHelpCircle className="text-blue-500 w-5 h-5" />
            </button>

            {/* <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <FaWallet className="text-green-500" />
              {currentAddress && (
                <>
                  <span className="max-w-[150px] truncate">
                    {currentAddress.slice(0, 6)}...{currentAddress.slice(-4)}
                  </span>
                  <span className="text-xs opacity-50">({blockchainInfo})</span>
                </>
              )}
            </div> */}

            <button onClick={toggleDarkMode} className="p-2">
              {isDarkMode ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-indigo-500" />}
            </button>

            <button onClick={logout} className="p-2">
              <FiLogOut className="text-red-500" />
            </button>
          </div>
        </div>

        {/* {loadingData&&<Loader message="adjhbswqa"/>} */}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="bg-white shadow-lg md:hidden dark:bg-gray-800">
            <div className="flex flex-col space-y-1 px-6 py-4">
              {subsNavigateOptions.map(opt => {
                const IconComponent = getIcon(opt.icon);
                return (
                  <Link
                    key={opt.href}
                    to={opt.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 group"
                  >
                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div>{opt.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{opt.description}</div>
                    </div>
                  </Link>
                );
              })}
              
              {/* Action Buttons */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <button
                  onClick={() => {
                    setIsInviteModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                >
                  <FiUserPlus className="w-5 h-5" />
                  <span className="font-medium">Invite New Referral</span>
                </button>
                <button
                  onClick={() => {
                    setIsTutorialModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <FiHelpCircle className="w-5 h-5" />
                  <span className="font-medium">Help & Tutorial</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
