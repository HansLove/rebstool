import {
  FiSun,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Navbar,
  NavBody,
  NavbarLogo,
  NavItems,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from 'react';
import FooterLandingPage from "./components/FooterLandingPage";
import WhyJoinSection from "./components/WhyJoinSection";
import CommunitySection from "./components/ComunitySection";
import HowItWorks from "./components/HowItWorks";
import CallToAction from "./components/CallToAction";
import { FaMoon } from "react-icons/fa6";
import { useTheme } from '@/hooks/useTheme';

export default function LandingPage() {
  const navItems = [
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Community",
      link: "#community",
    },
    {
      name: "How It Works",
      link: "#how-it-works",
    },
    {
      name: "Join",
      link: "#join",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleDarkMode } = useTheme();

  const handleToggle = () => {
    toggleDarkMode();
  };

  return (
    <div className="relative w-full bg-white dark:bg-slate-900 min-h-screen">
      {/* Navigation */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="flex items-center gap-4">
            <NavbarButton as="button" onClick={handleToggle} variant="secondary">
              {isDark ? <FiSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </NavbarButton>
            <NavbarButton as={Link} to="/login" variant="gradient">
              Login
            </NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}

            <div className="flex w-full flex-col gap-4 mt-4">
              <NavbarButton
                as={Link}
                to="/login"
                variant="primary"
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </NavbarButton>

              <NavbarButton
                as={Link}
                to="/invite"
                variant="primary"
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Hero Section */}
      <section className="relative flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center px-3 py-1 mb-5 text-xs font-medium text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
                AFILL
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
                Access fintech tools. Build virtual networks.
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0">
                Leverage blockchain technology to access premium marketing tools, proven strategies, and exclusive communities in digital markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/invite"
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                >
                  Get started
                </Link>
                <Link
                  to="#how-it-works"
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 text-base font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  How it works
                </Link>
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="relative"
            >
              <img
                src="/assets/images/dash1.webp"
                alt="AFILL dashboard preview"
                className="w-full h-auto rounded-xl shadow-xl"
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        className="py-24 lg:py-32 bg-white dark:bg-slate-800"
        id="about"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-8"
            >
              <div>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full mb-4">
                  About Us
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  What is AFFIL?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  AFFIL is a blockchain-powered platform that provides access to cutting-edge marketing tools, 
                  proven strategies, and exclusive fintech communities to help you build profitable virtual affiliate networks.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Advanced Marketing Tools
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Access professional-grade marketing automation, analytics dashboards, and conversion optimization tools 
                      powered by blockchain technology to maximize your affiliate network performance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Exclusive Fintech Communities
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Join exclusive communities of digital marketers, fintech professionals, and successful affiliates 
                      sharing strategies, insights, and opportunities in the virtual economy.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative"
            >
              <img
                src="/assets/images/dash2.webp"
                alt="AFILL Platform Features"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <WhyJoinSection />
      <section id="community">
        <CommunitySection />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="join">
        <CallToAction />
      </section>
      
      {/* Footer */}
      <FooterLandingPage />
    </div>
  );
}
