import { useState } from "react";
import { CheckCircle, ClipboardCopy } from "lucide-react";
import { motion } from "framer-motion";

export default function ReferralForm() {
  const [telegram, setTelegram] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    if (!telegram || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTelegram("");
      setMessage("");
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("https://typeform.com/to/your-form-id");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4 py-10 overflow-hidden">
      {/* Visual Grid Lines */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-indigo-500/20"></div>
      <div className="absolute right-10 top-0 bottom-0 w-px bg-indigo-500/20"></div>
      <div className="absolute left-0 right-0 top-2/3 h-px bg-indigo-500/20"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-900/70 text-blue-300 mb-2 backdrop-blur-sm border border-indigo-500/50 shadow-lg">
            <span className="text-xl font-bold">2</span>
          </div>

          <h2 className="text-3xl font-bold text-white bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            Submit a Referral
          </h2>
          <p className="text-indigo-300 max-w-xl mx-auto">
            Help your invitee get the most out of their trading experience by connecting them with our support team.
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-2xl border border-indigo-500/30 shadow-xl overflow-hidden transition">
          {/* Step 1: Welcome Message */}
          <StepBlock step="1" title="Personal Welcome Message" desc="This is what your invitee will read first. Keep it simple and valuable.">
            <input
              type="text"
              className="input-styled"
              placeholder="e.g. Hey! I think this is perfect for you — let's earn together."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </StepBlock>

          {/* Step 2: Telegram Username */}
          <StepBlock step="2" title="Telegram Username" desc="We’ll use this to reach out and guide them into the private VIP group.">
            <input
              type="text"
              className="input-styled"
              placeholder="@theirusername"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </StepBlock>

          {/* Step 3: Confirm and Submit */}
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <div className="step-badge">3</div>

              <div className="flex-1 text-center space-y-3">
                <h3 className="text-lg font-semibold text-blue-100">Confirm and Submit</h3>
                <p className="text-sm text-indigo-300">
                  Our team will review and contact your referral directly. Make sure the info is correct.
                </p>

                <button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className={`group relative overflow-hidden mx-auto px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-3 transition-all duration-300 text-sm md:text-base shadow-lg ${
                    submitted
                      ? "bg-green-700 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 shadow-green-700/30"
                  }`}
                >
                  <CheckCircle className="text-white" size={16} />
                  <span className="text-white">{submitted ? "Submitted!" : "Submit Referral Form"}</span>
                </button>

                <p className="text-xs text-indigo-300 italic mt-2">
                  You’ll be notified once they’ve been reviewed and contacted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Form Link */}
        <div className="text-center pt-6">
          <p className="text-indigo-300 mb-2">Want to share the form directly?</p>
          <div className="inline-flex items-center bg-gray-900/70 px-4 py-2 rounded-lg border border-indigo-500/30">
            <span className="text-white text-sm mr-2">https://typeform.com/to/your-form-id</span>
            <button
              onClick={handleCopy}
              className="text-indigo-400 hover:text-white transition"
              title="Copy to clipboard"
            >
              <ClipboardCopy size={18} />
            </button>
          </div>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-400 text-xs mt-1"
            >
              Copied!
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        .input-styled {
          width: 100%;
          margin-top: 12px;
          padding: 12px 16px;
          border-radius: 0.75rem;
          background-color: rgba(17,24,39,0.6);
          border: 1px solid rgba(99,102,241,0.2);
          color: white;
          outline: none;
          transition: border 0.2s ease;
        }
        .input-styled::placeholder {
          color: rgba(129,140,248,0.4);
        }
        .input-styled:focus {
          border-color: #3B82F6;
        }

        .step-badge {
          background-color: rgba(49, 46, 129, 0.7);
          color: #93C5FD;
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
}

const StepBlock = ({
  step,
  title,
  desc,
  children,
}: {
  step: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 border-b border-indigo-500/20">
    <div className="flex items-start space-x-6">
      <div className="step-badge">{step}</div>
      <div className="flex-1 space-y-3">
        <h3 className="font-medium text-blue-100">{title}</h3>
        <p className="text-sm text-indigo-300">{desc}</p>
        {children}
      </div>
    </div>
  </div>
);
