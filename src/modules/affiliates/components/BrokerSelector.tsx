import { FC } from "react";
import t4Logo from "/assets/images/logos/t4.png";
import PuPrimeLogo from "/assets/images/logos/pu-prime.png";
import FxGiantLogo from "/assets/images/logos/fxgiants.webp";

interface BrokerConfig {
  id: number;
  affiliate: string;
  origin: string;
}

interface Props {
  configs: BrokerConfig[];
  selectedConfig: string;
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const getLogo = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("puprime")) return PuPrimeLogo;
  if (lower.includes("pacificunion")) return PuPrimeLogo;
  if (lower.includes("t4")) return t4Logo;
  if (lower.includes("fxgiants")) return FxGiantLogo;
  return null;
};

const BrokerSelector: FC<Props> = ({ configs, selectedConfig, onSelect }) => {
  const selected = configs.find((c) => c.id.toString() === selectedConfig);
  const logo = selected ? getLogo(selected.affiliate) : null;

  return (
    <div className="space-y-2">
      <label
        htmlFor="configSelect"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Choose your broker
      </label>

      <div className="relative">
        <select
          id="configSelect"
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-4 pr-14 text-sm font-medium text-gray-800 dark:text-white appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={onSelect}
          value={selectedConfig}
        >
          <option value="">— Select —</option>
          {configs.map((c) => (
            <option key={c.id} value={c.id.toString()}>
              {c.affiliate}
            </option>
          ))}
          <option value="custom">Custom configuration…</option>
        </select>

        {/* Floating logo */}
        {logo && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <img
              src={logo}
              alt="Broker logo"
              className="h-7 w-7 rounded-full object-contain border border-gray-300 dark:border-gray-700 shadow-sm bg-white p-0.5"
            />
          </div>
        )}
      </div>

      {selected && logo && (
        <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-3 shadow-inner">
          <img
            src={logo}
            alt={`${selected.affiliate} logo`}
            className="h-8 w-8 rounded-full object-contain border border-gray-300 bg-white"
          />
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {selected.affiliate}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-300">
              {selected.origin}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerSelector;
