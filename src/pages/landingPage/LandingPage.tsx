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
import { FaMoon } from "react-icons/fa6";
import { useTheme } from '@/hooks/useTheme';
import { RebToolsLogo } from "@/components/RebToolsLogo";
import { Database, TrendingUp, Calendar, Zap } from "lucide-react";

export default function LandingPage() {
  const navItems = [
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Get Started",
      link: "#cta",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleDarkMode } = useTheme();

  const handleToggle = () => {
    toggleDarkMode();
  };

  return (
    <div className="relative w-full bg-white dark:bg-slate-900 min-h-screen overflow-hidden">
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
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Hero Section - Asymmetric Layout */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-10 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 left-10 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content - Takes 7 columns */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 space-y-8"
            >
              {/* Logo Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
              >
                <RebToolsLogo width={200} height={60} />
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]"
              >
                Professional{" "}
                <span className="bg-gradient-to-r from-sky-600 to-emerald-600 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Rebates Analysis
                </span>{" "}
                Platform
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
              >
                Automate scraping, track changes, and optimize rebates strategies with real-time analytics and second-level calculations.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Access Dashboard
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="#about"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200"
                >
                  Learn More
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monitoring</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Real-time</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Updates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Advanced</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Analytics</div>
              </div>
              </motion.div>
            </motion.div>

            {/* Right Visual - Takes 5 columns, offset */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 lg:col-start-8 relative"
            >
              <div className="relative">
                {/* Minimalistic Animation */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800 p-8 overflow-hidden"
                >
                  {/* Animated Background Grid */}
                  <div className="absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>

                  {/* Animated Data Points */}
                  <div className="relative h-64 flex items-center justify-center">
                    {/* Central Gear Icon */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute"
                    >
                      <RebToolsLogo variant="icon-only" width={80} height={80} />
                    </motion.div>

                    {/* Orbiting Data Points */}
                    {[...Array(6)].map((_, i) => {
                      const angle = (i * 60) * (Math.PI / 180);
                      const radius = 100;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scale: [0.8, 1.2, 0.8],
                            x: Math.cos(angle) * radius,
                            y: Math.sin(angle) * radius,
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                          className="absolute w-3 h-3 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                        />
                      );
                    })}

                    {/* Floating Data Lines */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={`line-${i}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.3 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeInOut"
                        }}
                        className="absolute"
                        style={{
                          width: '200px',
                          height: '2px',
                          background: `linear-gradient(to right, transparent, rgb(14 165 233), transparent)`,
                          transform: `rotate(${i * 45}deg)`,
                          transformOrigin: 'center',
                        }}
                      />
                    ))}

                    {/* Pulsing Center Dot */}
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute w-4 h-4 bg-emerald-500 rounded-full"
                    />
                  </div>

                  {/* Bottom Stats Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-slate-700 dark:to-slate-700 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 bg-emerald-500 rounded-full"
                        />
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Live Data</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-500 font-mono text-xs">
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          Syncing...
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Live Data</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Syncing...</div>
                    </div>
                  </div>
                </motion.div>

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-emerald-500/20 rounded-3xl blur-3xl -z-10 transform rotate-3"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section - Unique Card Layout */}
      <section
        className="relative py-32 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        id="about"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-sky-600 to-emerald-600 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent">
                master rebates
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A comprehensive platform designed for professionals who need precision, automation, and deep insights into rebates data.
            </p>
          </motion.div>

          {/* Feature Cards - Asymmetric Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Database,
                title: "Automated Scraping",
                description: "Scheduled snapshots capture data automatically, ensuring you never miss a change.",
                color: "sky",
                delay: 0.1
              },
              {
                icon: TrendingUp,
                title: "Advanced Analysis",
                description: "Second-level calculations reveal trends and patterns hidden in your data.",
                color: "emerald",
                delay: 0.2
              },
              {
                icon: Calendar,
                title: "Activity Journal",
                description: "Complete historical tracking of daily activity, deposits, and user changes.",
                color: "violet",
                delay: 0.3
              },
              {
                icon: Zap,
                title: "Real-Time Updates",
                description: "Instant notifications and live synchronization keep you informed immediately.",
                color: "amber",
                delay: 0.4
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative group bg-white dark:bg-slate-800 p-8 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-${feature.color}-300 dark:hover:border-${feature.color}-600 transition-all duration-300 shadow-lg hover:shadow-2xl`}
                >
                  {/* Icon */}
                  <div className={`mb-6 w-14 h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
                </motion.div>
              );
            })}
          </div>

          {/* Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-sky-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Unique Split Design */}
      <section id="cta" className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-500 to-emerald-600 dark:from-sky-800 dark:via-sky-700 dark:to-emerald-800">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Ready to transform your rebates strategy?
                </h2>
              <p className="text-xl text-sky-50 mb-8 leading-relaxed">
                Join professionals who trust RebTools for accurate, real-time rebates analysis and optimization.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sky-50">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                  <span>Automated data collection</span>
              </div>
                <div className="flex items-center gap-3 text-sky-50">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                  <span>Real-time change detection</span>
                </div>
                <div className="flex items-center gap-3 text-sky-50">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                  <span>Advanced analytics & insights</span>
                </div>
              </div>
            </motion.div>
            
            {/* Right CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border-4 border-white/20">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Get Started Today
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Access your dashboard and start analyzing rebates data in minutes.
                </p>
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Access Dashboard
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <FooterLandingPage />
    </div>
  );
}
