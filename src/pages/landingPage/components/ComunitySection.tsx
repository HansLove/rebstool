import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiBarChart,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";

const communityItems = [
  {
    icon: FiTrendingUp,
    title: "Analistas de Rebates",
    description: "Profesionales especializados en análisis y optimización de rebates",
    bg: "bg-sky-100 dark:bg-sky-900/30",
    iconBg: "bg-sky-500",
    textColor: "text-sky-700 dark:text-sky-300",
  },
  {
    icon: FiBarChart,
    title: "Traders Profesionales",
    description: "Traders que utilizan datos de rebates para optimizar estrategias",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconBg: "bg-emerald-500",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    icon: FiDollarSign,
    title: "Gestores de Portfolios",
    description: "Expertos en gestión de portfolios y análisis financiero",
    bg: "bg-violet-100 dark:bg-violet-900/30",
    iconBg: "bg-violet-500",
    textColor: "text-violet-700 dark:text-violet-300",
  },
  {
    icon: FiUsers,
    title: "Equipos de Análisis",
    description: "Equipos que requieren herramientas profesionales de scraping y análisis",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    iconBg: "bg-amber-500",
    textColor: "text-amber-700 dark:text-amber-300",
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
            Para Profesionales del Análisis
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
                className={`flex flex-col justify-start items-start p-6 border rounded-2xl shadow-md transition-transform duration-300 hover:-translate-y-2 ${item.bg} border-gray-200 dark:border-gray-700`}
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
