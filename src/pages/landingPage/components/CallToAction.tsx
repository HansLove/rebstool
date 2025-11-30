import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, TrendingUp, Database, BarChart3 } from "lucide-react";

export default function CallToAction() {
  return (
    <section
      id="join"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-blue-900 to-emerald-900"></div>
      <div className="absolute inset-0 bg-[url('/assets/images/calltoaction.webp')] bg-cover bg-center bg-fixed opacity-20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold text-sky-200 bg-sky-500/20 rounded-full border border-sky-400/30">
              <Activity className="w-4 h-4 mr-2" />
              Dashboard Profesional
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              ¿Listo para optimizar tus
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                Rebates?
              </span>
            </h2>
            <p className="text-xl text-sky-100 max-w-3xl mx-auto leading-relaxed">
              Únete a profesionales que ya están utilizando RebTools para monitorear, analizar y optimizar 
              sus estrategias de rebates con datos precisos y análisis en tiempo real.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-sky-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">Snapshots</div>
              <div className="text-sky-200">Captura Automática</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">Análisis</div>
              <div className="text-sky-200">Tiempo Real</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-sky-200">Monitoreo Continuo</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-sky-900 bg-white hover:bg-gray-100 rounded-full shadow-2xl hover:shadow-sky-500/25 transform hover:-translate-y-1 transition-all duration-200"
            >
              Acceder Ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="#how-it-works"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 hover:border-white/50 rounded-full transition-all duration-200 hover:bg-white/10"
            >
              Saber Más
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-white/20"
          >
            <p className="text-sky-200 text-sm mb-4">Herramienta profesional para análisis de rebates y scraping automatizado</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="w-20 h-8 bg-white/20 rounded"></div>
              <div className="w-20 h-8 bg-white/20 rounded"></div>
              <div className="w-20 h-8 bg-white/20 rounded"></div>
              <div className="w-20 h-8 bg-white/20 rounded"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
