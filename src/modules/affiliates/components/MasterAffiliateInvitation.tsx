import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CgArrowRight } from "react-icons/cg";
import { cn } from "@/lib/utils";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import PartnersNavbar from "./PartnersNavbar";
import WhyConnect from "./WhyConnect";
import MasterAffiliateRegister from "@/modules/affiliates/pages/MasterAffiliateRegister";


type RegisterPhase = 'idle' | 'step1' | 'step2' | 'wallet_info' | 'signature' | 'submitting' | 'email_sent';

export default function MasterAffiliateInvitation() {
  const [registerPhase, setRegisterPhase] = useState<RegisterPhase>('idle');
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="relative w-full bg-white text-slate-800 dark:bg-slate-950 dark:text-white">
      <PartnersNavbar/>

      {/* Floating status bar */}
      <AnimateStatus phase={registerPhase} />
      
      {/* Subtle dark grid background */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 hidden dark:block",
          "[background-size:15px_15px] dark:[background-image:radial-gradient(#1f2937,transparent_1px)]"
        )}
      />

      {/* ========= INTEGRATED HERO + REGISTER ========= */}
      <section id="register" className="relative z-10 px-4 pt-24 md:pt-28 scroll-mt-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 md:grid-cols-2">
          {/* Left: Narrative */}
          <div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/70 bg-purple-500/15 px-4 py-1 text-sm font-medium text-purple-700">
                {registerPhase === 'email_sent' && 'Check your email'}
                {registerPhase === 'submitting' && 'Creating account…'}
                {registerPhase === 'signature' && 'Awaiting signature'}
                {['idle','step1','step2','wallet_info'].includes(registerPhase) && 'Early Access'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: -12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
              className="mt-5 text-4xl font-extrabold leading-tight sm:text-6xl"
            >
              Become a Master Affiliate
            </motion.h1>

            <motion.p
              initial={{ y: 8, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mt-3 max-w-xl text-base md:text-lg text-slate-600 dark:text-slate-300"
            >
              Automate payouts, unlock deeper analytics, and scale your sub‑affiliate network with transparency and control.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="mt-6 space-y-3 text-slate-700 dark:text-slate-200"
            >
              <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /> Real‑time performance and payouts</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-violet-500" /> Custodial or self‑managed wallets</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-cyan-500" /> Invite and manage your network</li>
            </motion.ul>
          </div>

          {/* Right: Register Card */}
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
              "mx-auto w-full max-w-md",
              registerPhase === 'signature' && "drop-shadow-[0_0_24px_rgba(59,130,246,0.35)]",
              registerPhase === 'submitting' && "drop-shadow-[0_0_24px_rgba(99,102,241,0.35)]",
              registerPhase === 'email_sent' && "drop-shadow-[0_0_28px_rgba(16,185,129,0.45)]"
            )}
          >
            <MasterAffiliateRegister onPhaseChange={setRegisterPhase} />
          </motion.div>
        </div>
      </section>


      {/* ========= MASTER DASHBOARD SCROLL DEMO ========= */}
      <section className="relative z-10 mt-8 bg-slate-100 pb-1 dark:bg-slate-900 md:pb-20">
        <div className="relative mx-auto max-w-7xl">
          <ContainerScroll
            titleComponent={
              <div className="mb-10">
                <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                  Experience the power of total control
                </p>
                <h2 className="mt-1 text-4xl font-extrabold md:text-6xl">
                  Master Dashboard
                </h2>
              </div>
            }
          >
            <video
              className="mx-auto h-full rounded-2xl object-cover object-left-top"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="assets/video/video-1.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </ContainerScroll>
        </div>
      </section>

      {/* ========= WHY CONNECT (VALUE PROPS) ========= */}
      <WhyConnect/>

      {/* ========= CTA: INVITE ========= */}
      <section className="relative z-10 px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-purple-800 via-violet-600 to-fuchsia-600 p-10 md:p-16">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
              <div>
                <h2 className="text-3xl font-bold md:whitespace-nowrap">
                  Already registered?
                </h2>
                <p className="mt-2 max-w-xl text-slate-200">
                  Invite sub‑affiliates with your unique code and grow your network on autopilot.
                </p>
              </div>

              <motion.div
                initial={{ x: 60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Link to={"/invite/:email/:code"} aria-label="Check your invitation code">
                  <div className="group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full px-8 py-4 font-semibold text-white transition-all duration-500">
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-600 transition-all duration-500" />
                    <div className="absolute inset-0 h-full w-full opacity-0 transition-all duration-500 group-hover:opacity-100 bg-gradient-to-br from-blue-500 via-blue-400 to-purple-500" />
                    <div className="absolute -inset-6 blur-2xl opacity-0 transition-all duration-500 group-hover:opacity-30 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600" />
                    <span className="relative z-10 flex items-center whitespace-nowrap">
                      Check your invitation code
                      <CgArrowRight className="ml-2 h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating ornaments */}
      <div aria-hidden className="floating-circle opacity-40 md:opacity-80" />
      <div aria-hidden className="floating-circle2 opacity-40 md:opacity-80" />
    </div>
  );
}

function AnimateStatus({ phase }: { phase: RegisterPhase }) {
  if (phase !== 'email_sent' && phase !== 'submitting' && phase !== 'signature') return null;
  const label = phase === 'email_sent' ? 'Verification email sent. It will auto‑resend in 60s if not received.' :
                phase === 'submitting' ? 'Creating your account…' :
                'Awaiting wallet signature…';
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-50 mx-auto mb-[-1rem] flex w-full justify-center"
    >
      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-violet-600/80 via-fuchsia-600/80 to-emerald-600/80 px-4 py-2 text-sm text-white shadow-2xl backdrop-blur">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white/90" />
        {label}
      </div>
    </motion.div>
  );
}
