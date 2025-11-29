import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SplashPage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowContent(true);
          controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [controls]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading Progress */}
      {!showContent && (
        <div className="relative z-10 flex flex-col items-center space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.img
              src="/assets/images/logos/min-logo.png"
              alt="Affill Logo"
              className="w-24 h-24 filter brightness-0 invert"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
          </motion.div>

          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
              style={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.p
            className="text-white/80 text-sm font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Initializing your crypto journey...
          </motion.p>
        </div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {showContent && (
          <>
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
              className="mb-8"
            >
              <img
                src="/assets/images/logos/min-logo.png"
                alt="Affill Logo"
                className="w-32 h-32 mx-auto filter brightness-0 invert drop-shadow-2xl"
              />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight"
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Affill
              </span>
            </motion.h1>

            {/* Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="space-y-4 mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-4">
                Your Gateway to Crypto Success
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-white/80">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <p className="font-semibold">Advanced Tools</p>
                  <p className="text-sm text-center">Professional marketing automation & analytics</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                  <p className="font-semibold">Exclusive Access</p>
                  <p className="text-sm text-center">Premium fintech communities & strategies</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <p className="font-semibold">Maximize Earnings</p>
                  <p className="text-sm text-center">Blockchain-powered affiliate networks</p>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-16 text-white/60 text-sm"
            >
              <p>Trusted by 10,000+ crypto professionals worldwide</p>
              <div className="flex justify-center items-center space-x-8 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Blockchain Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Instant Access</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Floating Elements */}
      {showContent && (
        <>
          <motion.div
            className="absolute top-20 left-10 w-4 h-4 bg-purple-400/30 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-6 h-6 bg-blue-400/30 rounded-full"
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-3 h-3 bg-pink-400/30 rounded-full"
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </div>
  );
}
