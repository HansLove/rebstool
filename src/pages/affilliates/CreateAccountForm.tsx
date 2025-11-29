/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, FormEvent } from "react";
import { http } from "../../core/utils/http_request";
import { FiArrowRight, FiLock, FiMail, FiUser } from "react-icons/fi";
import { motion } from "motion/react";

interface CreateAccountFormProps {
  onSuccess: () => void;
}

const CreateAccountForm: FC<CreateAccountFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await http.post('auth/register', { name, email, password, rol: 1 });
      console.log(res);
      setMessageType('success');
      setMessage(res.data.message || 'Account created successfully');
      onSuccess();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'An error occurred';
      setMessageType('error');
      setMessage(msg);
    }
  };

  const fieldWrapper = "flex items-center rounded-xl border border-slate-300 bg-white/70 pl-3 shadow-sm focus-within:border-slate-400 dark:border-slate-700 dark:bg-slate-900/60";
  const iconStyle = "mr-2 text-slate-400";
  const inputStyle = "flex-1 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 md:p-8"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create your Affill account</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Start as a Master Affiliate. You can invite sub‑affiliates after onboarding.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {message && (
          <div className={`mb-2 text-sm ${messageType === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
            {message}
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-1 block text-slate-700 dark:text-slate-300">Full name</label>
          <div className={fieldWrapper}>
            <FiUser className={iconStyle} />
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              className={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-slate-700 dark:text-slate-300">Work email</label>
          <div className={fieldWrapper}>
            <FiMail className={iconStyle} />
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              className={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-slate-700 dark:text-slate-300">Password</label>
          <div className={fieldWrapper}>
            <FiLock className={iconStyle} />
            <input
              id="password"
              type="password"
              placeholder="Choose a strong password"
              className={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Create account
          <FiArrowRight className="ml-2" />
        </button>
      </form>
    </motion.div>
  );
};

export default CreateAccountForm;
