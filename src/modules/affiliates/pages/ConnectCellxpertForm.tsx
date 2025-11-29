import { FC } from "react";
import { FiUser, FiLock, FiLink, FiArrowRight } from "react-icons/fi";
import useCellExperForm from "@/modules/affiliates/hooks/useCellExperForm";
import SuccessAnimation from "@/components/animations/success/SuccessAnimation";
import BrokerSelector from "@/modules/affiliates/components/BrokerSelector";

interface Props {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const ConnectCellxpertForm: FC<Props> = ({ onSuccess, onError }) => {
  const {
    configs,
    selectedConfig,
    urlBase,
    setUrlBase,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    success,
    handleSelect,
    handleSubmit
  } = useCellExperForm(onSuccess, onError);

  return (
    <div className="w-full max-w-xl mx-auto dark:bg-gray-800 p-10 relative rounded-xl shadow-xl bg-white">
      {success && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/90 dark:bg-black/80 flex items-center justify-center z-50 rounded-xl">
          <SuccessAnimation />
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Connect Your Cell Expert Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <BrokerSelector
          configs={configs}
          selectedConfig={selectedConfig}
          onSelect={handleSelect}
        />

        <div className={`${selectedConfig !== "custom"? "hidden" : ""}`}>
          <label
            htmlFor="urlBase"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            API Base URL
          </label>
          <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2">
            <FiLink className="text-gray-400 dark:text-gray-400 mr-2" />
            <input
              id="urlBase"
              type="url"
              required
              disabled={selectedConfig !== "custom"}
              placeholder="https://api.cellxpert.com"
              className="flex-1 bg-transparent outline-none text-black dark:text-white placeholder-gray-400"
              value={urlBase}
              onChange={(e) => setUrlBase(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Username
          </label>
          <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2">
            <FiUser className="text-gray-400 mr-2" />
            <input
              id="username"
              type="text"
              required
              placeholder="e.g. your@email.com"
              className="flex-1 bg-transparent outline-none text-black dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2">
            <FiLock className="text-gray-400 mr-2" />
            <input
              id="password"
              type="password"
              required
              placeholder="Your secure password"
              className="flex-1 bg-transparent outline-none text-black dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Connecting…" : "Connect Account"}
          <FiArrowRight className="ml-2 h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default ConnectCellxpertForm;
