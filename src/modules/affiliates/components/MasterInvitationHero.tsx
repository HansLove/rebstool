import { motion } from "framer-motion";
import { SlEnergy } from "react-icons/sl";

export default function MasterInvitationHero() {
  return (
    <section className="relative z-10 flex items-center justify-center px-4 pt-24 pb-12 md:pt-28">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/70 bg-purple-500/15 px-4 py-1 text-sm font-medium text-purple-200">
              <SlEnergy className="h-4 w-4" /> EARLY ACCESS
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl"
          >
            Take Control of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Affiliate Empire</span>
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-base/7 md:text-lg text-slate-600 dark:text-slate-300"
          >
            Affill is your second layer over the broker: automate payouts, unlock deeper analytics, and scale your sub‑affiliate network with transparency.
          </motion.p>

          {/* Hero visual */}
          <motion.img
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            alt="Connection preview"
            src="/assets/images/connection.png"
            className="mx-auto mt-10 w-full max-w-5xl rounded-2xl shadow-2xl ring-1 ring-white/10"
          />
        </div>
      </section>
  )
}
