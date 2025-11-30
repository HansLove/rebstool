import {
  Database,
  Activity,
  BarChart3,
  Search,
  Calendar,
  CheckCircle,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Captura de Snapshot",
    description: "Ejecuta el scraper para capturar datos actuales de rebates y usuarios",
    icon: <Database className="w-6 h-6 text-sky-500" />,
    color: "from-sky-500 to-sky-600",
    bgColor: "from-sky-100 to-sky-200",
    darkBgColor: "from-sky-900/30 to-sky-800/30"
  },
  {
    title: "Análisis de Cambios",
    description: "Compara snapshots para detectar nuevos usuarios y cambios en equity",
    icon: <Activity className="w-6 h-6 text-emerald-500" />,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "from-emerald-100 to-emerald-200",
    darkBgColor: "from-emerald-900/30 to-emerald-800/30"
  },
  {
    title: "Visualización de Métricas",
    description: "Revisa métricas financieras, depósitos y actividad de trading",
    icon: <BarChart3 className="w-6 h-6 text-violet-500" />,
    color: "from-violet-500 to-violet-600",
    bgColor: "from-violet-100 to-violet-200",
    darkBgColor: "from-violet-900/30 to-violet-800/30"
  },
  {
    title: "Búsqueda y Filtrado",
    description: "Encuentra usuarios específicos usando búsqueda avanzada y filtros",
    icon: <Search className="w-6 h-6 text-amber-500" />,
    color: "from-amber-500 to-amber-600",
    bgColor: "from-amber-100 to-amber-200",
    darkBgColor: "from-amber-900/30 to-amber-800/30"
  },
  {
    title: "Journal y Reportes",
    description: "Accede al journal histórico y genera reportes de actividad diaria",
    icon: <Calendar className="w-6 h-6 text-indigo-500" />,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-100 to-indigo-200",
    darkBgColor: "from-indigo-900/30 to-indigo-800/30",
    final: true
  },
];

export default function HowItWorks() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
      id="how-it-works"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-sky-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold text-sky-700 bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300 rounded-full">
            <Activity className="w-4 h-4 mr-2" />
            Proceso Simple
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ¿Cómo Funciona?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Monitorea y analiza rebates en 5 pasos simples con RebTools
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
                    <ArrowDown className="w-5 h-5 text-sky-400" />
                  </motion.div>
                )}

                {/* Final success indicator */}
                {step.final && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="ml-7 mt-4 flex items-center gap-2 text-emerald-500"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Proceso Completado
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
                to="/login"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 border-2 border-sky-200 dark:border-sky-700 hover:border-sky-300 dark:hover:border-sky-600 rounded-full transition-all duration-200 group"
              >
                Comenzar Ahora
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
                alt="RebTools Dashboard Overview"
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
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activo</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 -left-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white p-3 rounded-2xl shadow-lg"
            >
              <div className="text-center">
                <div className="text-lg font-bold">Tiempo Real</div>
                <div className="text-xs opacity-90">Análisis Continuo</div>
              </div>
            </motion.div>
            
            {/* Background glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-sky-500/20 to-emerald-500/20 rounded-3xl blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
