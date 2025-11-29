import { ClassValue, clsx } from "clsx";
import { SiBnbchain, SiEthereum } from "react-icons/si";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


  // // Available blockchains for the dropdown
  export const availableBlockchains = [
    { name: "Ethereum Mainnet", icon: <SiEthereum className="w-5 h-5 text-blue-500" />, status: "Mainnet", id: "0x1" },
    { name: "Ethereum Sepolia", icon: <SiEthereum className="w-5 h-5 text-green-500" />, status: "Testnet", id: "0x539" },
    { name: "BNB Smart Chain", icon: <SiBnbchain className="w-5 h-5 text-yellow-500" />, status: "Mainnet", id: "0x38" },
    { name: "Polygon", icon: <div className="w-5 h-5 bg-purple-500 rounded-full" />, status: "Mainnet", id: "0x89" },
    { name: "Arbitrum", icon: <div className="w-5 h-5 bg-blue-600 rounded-full" />, status: "Mainnet", id: "0xa4b1" }
  ];
