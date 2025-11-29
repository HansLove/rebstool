import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Share2,
  BadgeDollarSign,
  TrendingUp,
  Gift,
  ArrowRight,
  CheckCircle,
  Users,
  Shield,
  Zap,
  BarChart3,
  Target,
  Star,
  Award,
  Globe,
  // Lock,
  // RefreshCw,
  // DollarSign,
  // PieChart,
  Rocket
} from "lucide-react";

const detailedSteps = [
  {
    title: "1. Sign Up & Connect Wallet",
    description: "Create your AFILL account in minutes and connect your preferred cryptocurrency wallet. We support all major wallets including MetaMask, WalletConnect, and more.",
    icon: <Wallet className="w-8 h-8 text-purple-500" />,
    features: ["Quick registration", "Multiple wallet support", "Secure authentication", "KYC verification"]
  },
  {
    title: "2. Choose Your Niche & Products",
    description: "Browse our extensive catalog of high-converting products and services. From crypto tools to digital products, find what resonates with your audience.",
    icon: <Target className="w-8 h-8 text-blue-500" />,
    features: ["Product research tools", "Performance analytics", "Commission rates", "Conversion tracking"]
  },
  {
    title: "3. Share & Promote",
    description: "Use your unique affiliate links, banners, and marketing materials to promote products. Share across social media, blogs, YouTube, or any platform you prefer.",
    icon: <Share2 className="w-8 h-8 text-green-500" />,
    features: ["Unique tracking links", "Marketing materials", "Social media integration", "Content creation tools"]
  },
  {
    title: "4. Earn Instant Crypto Rewards",
    description: "Get paid automatically through smart contracts. No waiting for monthly payouts - receive your earnings instantly in your preferred cryptocurrency.",
    icon: <BadgeDollarSign className="w-8 h-8 text-yellow-500" />,
    features: ["Instant payments", "Multiple crypto options", "Smart contract security", "Transparent tracking"]
  },
  {
    title: "5. Level Up & Scale",
    description: "Unlock higher commission rates, exclusive products, and advanced tools as you grow. Build your network and create multiple income streams.",
    icon: <TrendingUp className="w-8 h-8 text-red-500" />,
    features: ["Tier system", "Exclusive products", "Advanced analytics", "Priority support"]
  },
  {
    title: "6. Build Sustainable Income",
    description: "Create a long-term, passive income stream. Our loyalty program rewards consistent performance and helps you build wealth in the crypto economy.",
    icon: <Gift className="w-8 h-8 text-pink-500" />,
    features: ["Loyalty rewards", "Passive income", "Community benefits", "Long-term growth"]
  }
];

const platformFeatures = [
  {
    title: "Blockchain Security",
    description: "All transactions are secured by smart contracts on the blockchain, ensuring transparency and eliminating fraud.",
    icon: <Shield className="w-6 h-6 text-green-500" />
  },
  {
    title: "Instant Payments",
    description: "No more waiting for monthly payouts. Get paid instantly in your preferred cryptocurrency.",
    icon: <Zap className="w-6 h-6 text-yellow-500" />
  },
  {
    title: "Advanced Analytics",
    description: "Track your performance with detailed analytics, conversion rates, and earnings insights.",
    icon: <BarChart3 className="w-6 h-6 text-blue-500" />
  },
  {
    title: "Global Reach",
    description: "Access customers worldwide with our international payment system and multi-language support.",
    icon: <Globe className="w-6 h-6 text-purple-500" />
  },
  {
    title: "Multi-Level Marketing",
    description: "Build your network with sub-affiliates and earn from their success too.",
    icon: <Users className="w-6 h-6 text-indigo-500" />
  },
  {
    title: "24/7 Support",
    description: "Get help whenever you need it with our round-the-clock customer support team.",
    icon: <Star className="w-6 h-6 text-orange-500" />
  }
];

const earningExamples = [
  {
    level: "Beginner",
    monthlyEarnings: "$500 - $2,000",
    requirements: "Basic promotion, social media presence",
    icon: <Rocket className="w-5 h-5" />
  },
  {
    level: "Intermediate",
    monthlyEarnings: "$2,000 - $5,000",
    requirements: "Content creation, email marketing",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    level: "Advanced",
    monthlyEarnings: "$5,000 - $10,000+",
    requirements: "Large audience, strategic partnerships",
    icon: <Award className="w-5 h-5" />
  }
];

export default function HowItWorksDetailed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              AFILL
            </Link>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              How <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AFILL</span> Works
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Discover the simple 6-step process to start earning crypto rewards through our revolutionary affiliate platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16">
            {detailedSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center mr-4">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-lg mb-4">
                          {step.icon}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          Step {index + 1}
                        </p>
                      </div>
                    </div>
                    {index < detailedSteps.length - 1 && (
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <ArrowRight className="w-8 h-8 text-purple-400 rotate-90" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose AFILL?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly features to maximize your earning potential.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Earning Examples */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Realistic Earning Potential
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your earnings depend on your effort, strategy, and audience size. Here's what you can expect at different levels.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {earningExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className={`bg-gradient-to-br rounded-2xl p-8 text-center ${
                  index === 1 
                    ? 'from-purple-500 to-blue-600 text-white shadow-2xl transform scale-105' 
                    : 'from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-900 dark:text-white'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  index === 1 
                    ? 'bg-white/20' 
                    : 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30'
                }`}>
                  {example.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{example.level}</h3>
                <div className="text-3xl font-bold mb-4">{example.monthlyEarnings}</div>
                <p className="text-sm opacity-90">{example.requirements}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful affiliates who are already earning crypto rewards with AFILL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-purple-600 bg-white hover:bg-gray-100 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 hover:border-white/50 rounded-full transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
