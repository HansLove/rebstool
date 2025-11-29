import {
  Wallet,
  Share2,
  BadgeDollarSign,
  TrendingUp,
  Gift,
  ArrowDown,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Access Marketing Tools",
    description: "Get instant access to professional marketing automation and analytics",
    icon: <Wallet className="w-6 h-6 text-purple-500" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-100 to-purple-200",
    darkBgColor: "from-purple-900/30 to-purple-800/30"
  },
  {
    title: "Join Fintech Communities",
    description: "Connect with digital marketing and fintech professionals",
    icon: <Share2 className="w-6 h-6 text-blue-500" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-100 to-blue-200",
    darkBgColor: "from-blue-900/30 to-blue-800/30"
  },
  {
    title: "Build Virtual Networks",
    description: "Scale your affiliate network with blockchain-powered tools",
    icon: <BadgeDollarSign className="w-6 h-6 text-green-500" />,
    color: "from-green-500 to-green-600",
    bgColor: "from-green-100 to-green-200",
    darkBgColor: "from-green-900/30 to-green-800/30"
  },
  {
    title: "Implement Proven Strategies",
    description: "Access battle-tested marketing frameworks and tactics",
    icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-100 to-orange-200",
    darkBgColor: "from-orange-900/30 to-orange-800/30"
  },
  {
    title: "Scale Your Profits",
    description: "Grow your digital marketing income with advanced tools",
    icon: <Gift className="w-6 h-6 text-pink-500" />,
    color: "from-pink-500 to-pink-600",
    bgColor: "from-pink-100 to-pink-200",
    darkBgColor: "from-pink-900/30 to-pink-800/30",
    final: true
  },
];

export default function HowItWorks() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      id="how-it-works"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Access professional marketing tools and fintech communities in 5 simple steps
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative"
              >
                <div className="flex items-start space-x-4">
                  {/* Step number and icon */}
                  <div className="flex-shrink-0 relative">
                    <div className={`w-14 h-14 bg-gradient-to-br ${step.bgColor} dark:${step.darkBgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${step.color} text-white text-xs font-bold rounded-full flex items-center justify-center`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow between steps */}
                {index !== steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="ml-7 mt-4"
                  >
                    <ArrowDown className="w-5 h-5 text-purple-400" />
                  </motion.div>
                )}

                {/* Final success indicator */}
                {step.final && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="ml-7 mt-4 flex items-center gap-2 text-green-500"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      All Steps Completed
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <Link
                to="/how-it-works"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 rounded-full transition-all duration-200 group"
              >
                Learn More Details
                <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                className="w-full h-auto rounded-3xl shadow-2xl"
                src="/assets/images/afilliate.webp"
                alt="AFILL Platform Overview"
              />
            </div>
            
            {/* Floating elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -top-4 -right-4 bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-2xl shadow-lg"
            >
              <div className="text-center">
                <div className="text-lg font-bold">$2K+</div>
                <div className="text-xs opacity-90">Monthly</div>
              </div>
            </motion.div>
            
            {/* Background glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
