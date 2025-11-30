import { motion } from "motion/react";
import { 
  Database, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  Clock,
  Zap,
  Search,
  Activity,
} from "lucide-react";

const WhyJoinSection = () => {
  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Scraping Automatizado",
      description: "Captura automática de datos con snapshots programados y almacenamiento seguro",
      colorFrom: "#0ea5e9",   // sky-500
      colorTo: "#06b6d4",     // cyan-500
      bgColor: "#f0f9ff",     // sky-50
      bgColorDark: "rgba(14, 165, 233, 0.125)", // sky-900/20 equivalent
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Análisis Temporal", 
      description: "Compara snapshots y detecta cambios en equity, depósitos y usuarios",
      colorFrom: "#22c55e",   // green-500
      colorTo: "#16a34a",     // green-600
      bgColor: "#f0fdf4",     // green-50
      bgColorDark: "rgba(34, 197, 94, 0.125)", // green-900/20
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Detección de Cambios",
      description: "Alertas automáticas cuando se detectan nuevos usuarios o cambios significativos",
      colorFrom: "#f59e0b",   // amber-500
      colorTo: "#f97316",     // orange-500
      bgColor: "#fffbeb",     // amber-50
      bgColorDark: "rgba(245, 158, 11, 0.125)", // amber-900/20
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Métricas Financieras",
      description: "Visualiza equity total, depósitos, volumen de trading y más",
      colorFrom: "#8b5cf6",   // violet-500
      colorTo: "#7c3aed",     // violet-600
      bgColor: "#f5f3ff",     // violet-50
      bgColorDark: "rgba(139, 92, 246, 0.125)", // violet-900/20
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Journal de Actividad",
      description: "Registro histórico diario de actividad, depósitos y cambios",
      colorFrom: "#6366f1",   // indigo-500
      colorTo: "#4f46e5",     // indigo-600
      bgColor: "#eef2ff",     // indigo-50
      bgColorDark: "rgba(99, 102, 241, 0.125)", // indigo-900/20
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Búsqueda Avanzada", 
      description: "Encuentra usuarios específicos por nombre, ID o filtros personalizados",
      colorFrom: "#ec4899",   // pink-500
      colorTo: "#db2777",     // pink-600
      bgColor: "#fdf2f8",     // pink-50
      bgColorDark: "rgba(236, 72, 153, 0.125)", // pink-900/20
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Tiempo Real",
      description: "Actualizaciones instantáneas y notificaciones de cambios importantes",
      colorFrom: "#14b8a6",   // teal-500
      colorTo: "#0d9488",     // teal-600
      bgColor: "#f0fdfa",     // teal-50
      bgColorDark: "rgba(20, 184, 166, 0.125)", // teal-900/20
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Cálculos de Segundo Nivel",
      description: "Análisis profundo de rebates con métricas avanzadas y comparaciones",
      colorFrom: "#06b6d4",   // cyan-500
      colorTo: "#0891b2",     // cyan-600
      bgColor: "#ecfeff",     // cyan-50
      bgColorDark: "rgba(6, 182, 212, 0.125)", // cyan-900/20
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
      className="relative min-h-screen py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, rgba(14,165,233,0.1), rgba(34,197,94,0.1))`
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(14,165,233,0.1), transparent 50%)`
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div
        className="absolute bottom-20 right-10 rounded-full blur-3xl animate-pulse"
        style={{
          width: "24rem",
          height: "24rem",
          background: `linear-gradient(to right, rgba(14,165,233,0.125), rgba(34,197,94,0.125))`,
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
              background: "linear-gradient(to right, #0ea5e9, #22c55e)"
            }}
          >
            <Activity className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            ¿Por qué usar RebTools?
          </h2>

          <p
            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300"
          >
            Herramienta profesional para{" "}
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              scraping automatizado
            </span>
            {" "}y{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              análisis de rebates
            </span>
            . Monitorea cambios, detecta tendencias y optimiza tus estrategias con datos en tiempo real.
          </p>

          <div className="flex justify-center mt-8">
            <div
              className="flex items-center space-x-2 rounded-full px-6 py-3 shadow-lg border bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
            >
              <TrendingUp
                className="w-5 h-5 text-emerald-500"
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Análisis en Tiempo Real
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
                  borderColor: "rgba(148,163,184,0.3)",
                  boxShadow: "0 10px 15px -3px rgba(14,165,233,0.1)",
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
                      className="text-xl font-bold"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${feature.colorFrom}, ${feature.colorTo})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: feature.colorFrom,
                      }}
                    >
                      {feature.title}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
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
