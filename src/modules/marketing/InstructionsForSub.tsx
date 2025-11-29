import {
    // Bell,
    CheckCircle,
    Lock,
    Zap,
    // DollarSign,
  } from "lucide-react";
import ReferralForm from "./forms/ReferralForm";

export default function InstructionsForSub() {
  return (
    <>
    {/* === Fill Form Section === */}
    <section className="py-8 px-6 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-[30px_30px_0px_0px] border-b border-indigo-500/10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
          Next: Complete the Form
        </h2>
        <p className="text-indigo-100 max-w-2xl mx-auto">
          Fill this out to verify and get paid in USDT
        </p>
      </div>
    </section>

    {/* === Form Section === */}
    <section className="py-8 px-6 bg-gray-900 relative">
      <ReferralForm/>
    </section>

    {/* === What They Get Section === */}
    <section className="py-8 px-6 bg-gradient-to-r from-gray-900 to-indigo-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            They Get Premium Access
          </h2>
          <p className="text-indigo-200 text-sm">Worth $99/month — completely free through you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gold Trades */}
          <div className="p-6 bg-indigo-950/50 backdrop-blur-md rounded-xl border border-indigo-500/30 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-3 rounded-lg flex-shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Gold Trades Telegram</h3>
                <p className="text-indigo-200 text-xs">Exclusive trading signals</p>
              </div>
            </div>
          </div>

          {/* Exclusive Access */}
          <div className="p-6 bg-indigo-950/50 backdrop-blur-md rounded-xl border border-indigo-500/30 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-700 text-white p-3 rounded-lg flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Exclusive Access</h3>
                <p className="text-indigo-200 text-xs">Only through your link</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* === What Happens Section === */}
    <section className="py-8 px-6 bg-gray-900 rounded-b-[30px] relative">
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            How You Get Paid
          </h2>
          <p className="text-indigo-200 text-sm">Instant, automated verification & payout</p>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-slate-800/50 backdrop-blur-md rounded-lg border border-indigo-500/20 flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg flex-shrink-0">
              <CheckCircle className="text-green-400" size={18} />
            </div>
            <p className="text-indigo-100 text-sm">Form submitted → instant notification</p>
          </div>

          <div className="p-4 bg-slate-800/50 backdrop-blur-md rounded-lg border border-indigo-500/20 flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg flex-shrink-0">
              <CheckCircle className="text-green-400" size={18} />
            </div>
            <p className="text-indigo-100 text-sm">We verify & onboard their access</p>
          </div>

          <div className="p-4 bg-slate-800/50 backdrop-blur-md rounded-lg border border-indigo-500/20 flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg flex-shrink-0">
              <CheckCircle className="text-green-400" size={18} />
            </div>
            <p className="text-indigo-100 text-sm">You get paid in USDT instantly</p>
          </div>
        </div>
      </div>
    </section>

  </>
  )
}
