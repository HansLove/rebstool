import { motion } from "motion/react";
import { 
  TrendingUp, 
  Shield, 
  Users,
  Zap,
  Target,
  Rocket,
  Star,
  Sparkles,
} from "lucide-react";

const WhyJoinSection = () => {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Professional marketing analytics and conversion tracking",
      colorFrom: "#3b82f6",   // blue-500
      colorTo: "#06b6d4",     // cyan-500
      bgColor: "#eff6ff",     // blue-50
      bgColorDark: "rgba(59, 130, 246, 0.125)", // blue-900/20 equivalent
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Blockchain Security", 
      description: "Secure, transparent transactions powered by smart contracts",
      colorFrom: "#10b981",   // emerald-500
      colorTo: "#22c55e",     // green-500
      bgColor: "#d1fae5",     // emerald-50
      bgColorDark: "rgba(5, 150, 105, 0.125)", // emerald-900/20
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Marketing Automation",
      description: "Automated campaigns and lead generation tools",
      colorFrom: "#eab308",   // yellow-500
      colorTo: "#f97316",     // orange-500
      bgColor: "#fef3c7",     // yellow-50
      bgColorDark: "rgba(202, 138, 4, 0.125)", // yellow-900/20
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Scale Your Network",
      description: "Build and manage virtual affiliate networks efficiently",
      colorFrom: "#8b5cf6",   // purple-500
      colorTo: "#ec4899",     // pink-500
      bgColor: "#ede9fe",     // purple-50
      bgColorDark: "rgba(109, 40, 217, 0.125)", // purple-900/20
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Premium Tools",
      description: "Access to exclusive fintech marketing strategies",
      colorFrom: "#6366f1",   // indigo-500
      colorTo: "#8b5cf6",     // purple-500
      bgColor: "#e0e7ff",     // indigo-50
      bgColorDark: "rgba(67, 56, 202, 0.125)", // indigo-900/20
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Communities", 
      description: "Connect with fintech professionals and digital marketers",
      colorFrom: "#f43f5e",   // rose-500
      colorTo: "#ec4899",     // pink-500
      bgColor: "#fef2f2",     // rose-50
      bgColorDark: "rgba(190, 18, 60, 0.125)", // rose-900/20
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Targeting",
      description: "AI-powered audience targeting and optimization",
      colorFrom: "#14b8a6",   // teal-500
      colorTo: "#06b6d4",     // cyan-500
      bgColor: "#ccfbf1",     // teal-50
      bgColorDark: "rgba(13, 148, 136, 0.125)", // teal-900/20
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Proven Strategies",
      description: "Access to battle-tested digital marketing frameworks",
      colorFrom: "#f59e0b",   // amber-500
      colorTo: "#eab308",     // yellow-500
      bgColor: "#fef3c7",     // amber-50
      bgColorDark: "rgba(202, 138, 4, 0.125)", // amber-900/20
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div
      className="relative min-h-screen py-24 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, #f8fafc, #ffffff, #dbeafe)`, // from-slate-50 via-white to-blue-50 hex approx
        color: "#0f172a" // dark slate color for text
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, rgba(191,219,254,0.3), rgba(219,214,254,0.3))`
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1), transparent 50%)`
          }}
        ></div>
      </div>

      {/* Floating Elements */}
    
      <div
        className="absolute bottom-20 right-10 rounded-full blur-3xl animate-pulse"
        style={{
          width: "24rem",
          height: "24rem",
          background: `linear-gradient(to right, rgba(236,72,153,0.125), rgba(253,224,71,0.125))`,
          animationDelay: "1s"
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
            style={{
              background: "linear-gradient(to right, #3b82f6, #8b5cf6)"
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 style={{ fontSize: "3.75rem", marginBottom: "1.5rem", color: "#0f172a" }}>
            Why Join AFFIL?
          </h2>

          <p
            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: "#475569" }} // slate-600
          >
            Access professional marketing tools and strategies through our blockchain-powered platform. Each tier unlocks{" "}
            <span style={{ fontWeight: "600", color: "#2563eb" }}>
              advanced analytics
            </span>
            , automation tools, and exclusive fintech communities.{" "}
            <span style={{ fontWeight: "600", color: "#7c3aed" }}>
              Build networks. Scale profits.
            </span>
          </p>

          <div className="flex justify-center mt-8">
            <div
              className="flex items-center space-x-2 rounded-full px-6 py-3 shadow-lg border"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                color: "#334155"
              }}
            >
              <TrendingUp
                className="w-5 h-5"
                style={{ color: "#22c55e" }} // green-500
              />
              <span style={{ fontWeight: 500 }}>
                10,000+ Digital Marketers
              </span>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="group relative">
              <div
                className="relative overflow-hidden rounded-3xl border backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{
                  backgroundColor: feature.bgColor,
                  borderColor: "rgba(148,163,184,0.3)", // slate-200/50
                  boxShadow: "0 10px 15px -3px rgba(59,130,246,0.1)",
                }}
              >
                {/* Gradient overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(to bottom right, ${feature.colorFrom}, ${feature.colorTo})`,
                  }}
                ></div>

                {/* Content */}
                <div className="relative p-8 space-y-6">
                  {/* Icon */}
                  <div className="relative">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                      style={{
                        background: `linear-gradient(to right, ${feature.colorFrom}, ${feature.colorTo})`,
                        color: "#fff",
                      }}
                    >
                      {feature.icon}
                    </div>
                    {/* Glow effect */}
                    <div
                      className="absolute inset-0 w-16 h-16 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(to right, ${feature.colorFrom}, ${feature.colorTo})`,
                        filter: "blur(20px)",
                      }}
                    ></div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <h5
                      className="text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${feature.colorFrom}, ${feature.colorTo})`,
                        color: feature.colorFrom,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      {feature.title}
                    </h5>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WhyJoinSection;
