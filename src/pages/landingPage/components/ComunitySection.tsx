import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";

const communityItems = [
  {
    icon: FiDollarSign,
    title: "Fintech Professionals",
    description: "Banking and financial services experts seeking growth",
    bg: "bg-orange-100",
    iconBg: "bg-orange-500",
    textColor: "text-orange-700",
  },
  {
    icon: FiUsers,
    title: "Digital Marketers",
    description: "Marketing professionals building virtual networks",
    bg: "bg-green-100",
    iconBg: "bg-green-500",
    textColor: "text-green-700",
  },
  {
    icon: FiTrendingUp,
    title: "Affiliate Networkers",
    description: "Experienced affiliates scaling their operations",
    bg: "bg-purple-100",
    iconBg: "bg-purple-500",
    textColor: "text-purple-700",
  },
  {
    icon: FiAward,
    title: "Blockchain Entrepreneurs",
    description: "Innovators building the future of digital markets",
    bg: "bg-blue-100",
    iconBg: "bg-blue-500",
    textColor: "text-blue-700",
  },
];

const CommunitySection = () => {
  return (
    <section
      id="community"
      className="px-4 py-16 bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-100 md:px-24 lg:px-8 lg:py-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="text-center lg:text-left lg:pr-16 mb-10 lg:mb-0 flex items-center justify-center lg:justify-start">
          <h2 className="text-5xl sm:text-3xl font-bold leading-tight">
            Join Our Expert Community
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {communityItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 + index * 0.1, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.5 }}
                className={`flex flex-col justify-start items-start p-6 border rounded-2xl shadow-md transition-transform duration-300 hover:-translate-y-2 ${item.bg}`}
              >
                <div
                  className={`flex items-center justify-center w-14 h-14 mb-4 rounded-full text-white ${item.iconBg}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`mb-2 text-lg font-bold ${item.textColor}`}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
