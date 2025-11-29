import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";

export default function CallToAction() {
  return (
    <section
      id="join"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-[url('/assets/images/calltoaction.webp')] bg-cover bg-center bg-fixed opacity-20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
      
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
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold text-purple-200 bg-purple-500/20 rounded-full border border-purple-400/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Limited Time Offer
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Access
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Professional Tools?
              </span>
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of digital marketers and fintech professionals who are already scaling their virtual networks. 
              Access advanced tools. Build profitable communities.
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
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-purple-200">Marketing Tools</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-purple-200">Expert Community</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-purple-200">Community Access</div>
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
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-purple-900 bg-white hover:bg-gray-100 rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-200"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 hover:border-white/50 rounded-full transition-all duration-200 hover:bg-white/10"
            >
              Learn More
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
            <p className="text-purple-200 text-sm mb-4">Trusted by leading fintech and digital marketing companies worldwide</p>
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
