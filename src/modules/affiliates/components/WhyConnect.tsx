import { motion } from "framer-motion";
import { WobbleCard } from "@/components/ui/wobble-card";
import { cn } from "@/lib/utils";

const valueProps = [
    {
      kpi: "↑ 47%",
      title: "Maximize Revenue",
      desc: "Predictable payouts and compounding incentives with smart contracts and automated triggers.",
      bg: "bg-green-800",
      image: "/assets/images/earnings.jpg",
    },
    {
      kpi: "100%",
      title: "Own Your Data",
      desc: "Real-time performance and cohort insights beyond the broker’s default dashboards.",
      bg: "bg-neutral-900",
      image: "/assets/images/analytics.jpg",
    },
    {
      kpi: "24/7",
      title: "Autopilot Monitoring",
      desc: "Commission alerts, risk guards, and threshold-based payouts—no spreadsheets, no guesswork.",
      bg: "bg-blue-900",
      image: "/assets/images/commissions.jpg",
    },
];
  

export default function WhyConnect() {
  return (
<section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <h3 className="text-4xl font-bold md:text-5xl">Why Connect Your Account?</h3>
          <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-300">
            Built for <span className="font-semibold">Master Affiliates</span>: maximize earnings, centralize control, and motivate your network with live, verifiable metrics.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Card 1 & 2 combo */}
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <WobbleCard
              containerClassName={cn(
                "h-full min-h-[360px] md:min-h-[420px] lg:min-h-[320px]",
                valueProps[0].bg
              )}
            >
              <div className="max-w-sm">
                <p className="text-left text-6xl font-semibold tracking-tight text-white">
                  {valueProps[0].kpi}
                </p>
                <p className="mt-2 text-left text-xl font-semibold text-white/95">
                  {valueProps[0].title}
                </p>
                <p className="mt-2 text-left text-sm leading-6 text-white/80">
                  {valueProps[0].desc}
                </p>
              </div>
              <img
                src={valueProps[0].image}
                width={520}
                height={420}
                alt="Earnings growth"
                className="absolute -right-6 -bottom-8 rounded-2xl object-contain grayscale"
              />
            </WobbleCard>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <WobbleCard containerClassName="min-h-[320px]">
              <div className="max-w-sm">
                <p className="text-left text-6xl font-semibold tracking-tight text-white">
                  {valueProps[1].kpi}
                </p>
                <p className="mt-2 text-left text-xl font-semibold text-white/95">
                  {valueProps[1].title}
                </p>
                <p className="mt-2 text-left text-sm leading-6 text-white/80">
                  {valueProps[1].desc}
                </p>
              </div>
            </WobbleCard>
          </motion.div>

          {/* Card 3 full-width */}
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            <WobbleCard
              containerClassName={cn(
                "min-h-[380px] md:min-h-[460px] xl:min-h-[320px]",
                valueProps[2].bg
              )}
            >
              <div className="max-w-sm">
                <p className="text-left text-6xl font-semibold tracking-tight text-white">
                  {valueProps[2].kpi}
                </p>
                <p className="mt-2 text-left text-xl font-semibold text-white/95">
                  {valueProps[2].title}
                </p>
                <p className="mt-2 text-left text-sm leading-6 text-white/80">
                  {valueProps[2].desc}
                </p>
              </div>
              <img
                src={valueProps[2].image}
                width={520}
                height={420}
                alt="Monitoring"
                className="absolute -right-8 -bottom-2 rounded-2xl object-contain"
              />
            </WobbleCard>
          </motion.div>
        </div>
      </section>
  )
}
