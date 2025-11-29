/* eslint-disable @typescript-eslint/no-explicit-any */
import { SiEthereum } from "react-icons/si";


interface BlockchainInterface {
    name: string;
    id: string;
    image: any;
    warning?: boolean;
    icon?: boolean;
  }

  
  export const arrayChains: BlockchainInterface[] = [
    {
      name: "Ethereum",
      id: "0x1",
      icon: true,
      image: <SiEthereum color="skyblue" size={22} />,
    },
    {
      name: "Ethereum",
      id: "0x539",
      image: <SiEthereum color="lightgreen" size="22" />,
      warning: true,
      icon: true,
    },
    { name: "Arbitrum", id: "0xa4b1", image: "ethereum_1.png", warning: true },
    { name: "BNB", id: "0x38", image: "binance_1.png" },
    { name: "Polygon", id: "0x89", image: "polygon_1.png" },
    {
      name: "Polygon Mumbai",
      id: "0x13881",
      image: "polygon_1.png",
      warning: true,
    },
    { name: "Ropsten", id: "0x3", image: "ethereum_1.png", warning: true },
    { name: "Kovan", id: "0x2a", image: "ethereum_1.png", warning: true },
    { name: "BNB", id: "0x61", image: "binance_1.png", warning: true },
  ];