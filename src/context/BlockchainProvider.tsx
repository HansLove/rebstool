/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  checkWeb3Connection,
  getCurrentChain,
  getCurrentAccount,
  turnOnChainChange,
  turnOnAccountChange,
} from "@/components/blockchain/utils/BlockchainTools";
import { SiEthereum } from "react-icons/si";
// import { ContractPayment } from "../components/blockchain/ContractPayment";
import { ethers } from "ethers";
import { arrayChains } from "./arrayChains";
// import { ContractVaultFactory } from "../components/blockchain/ContractVaultFactory";
import { ContractVaultERC20 } from "@/components/blockchain/ContractVaultERC20";

interface BlockchainContextType {
  currentAccount: string;
  chainId: string;
  vaultAddress: string;
  isConnected: boolean;
  checkingVault: boolean;
  web3Installed: boolean;
  hasVault: boolean;
  windowWidth: number | undefined;
  walletBalance: string;
  factory: any;
  BLOCKAIN: BlockchainInterface;
  incorrectChain: boolean;
  handleCreateVault: any;
  vaultUSDTBalance: any;
  transactionSuccess: any;
  setTransactionSuccess: any;
  userWalletUSDTBalance: any;
}

interface BlockchainInterface {
  name: string;
  id: string;
  image: any;
  warning?: boolean;
  icon?: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(
  undefined
);

export function useBlockchainContext() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error(
      "useBlockchainContext debe usarse dentro de un BlockchainProvider"
    );
  }
  return context;
}

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({
  children,
}) => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [chainId, setCurrentChainId] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string>("0");

  const [isConnected, setIsConnected] = useState(false);
  const [web3Installed, setWeb3Installed] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number | undefined>();
  const [incorrectChain, setIncorrectChain] = useState(false);

  const [BLOCKAIN, setBLOCKCHAIN] = useState<BlockchainInterface>({
    name: "Ethereum",
    id: "0x539",
    image: <SiEthereum color="lightgreen" size="20" />,
    warning: true,
    icon: true,
  });

  
  const [hasVault] = useState<boolean>(false);
  const [checkingVault] = useState<boolean>(true);
  const [vaultAddress] = useState<string>("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
  const [vaultUSDTBalance, setVaultUSDTBalance] = useState("");
  const [userWalletUSDTBalance, setUserWalletVaultUSDTBalance] = useState("");
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  
  const factory = null; // Placeholder for factory

  // useEffect(() => {
  //   const checkVault = async () => {
  //     await factory.load();
  //     const vault = await factory.getVaultAddress();
  //     console.log("Factory address: ",vault)
  //     setHasVault(!!vault);
  //     setVaultAddress(vault || "");
  //     setCheckingVault(false);
  //   };
  //   checkVault();
  // }, []);


  useEffect(() => {
    const Init = async () => {
      const ethereum = window.ethereum;
      if (!ethereum) {
        setWeb3Installed(false);
        setIsConnected(false);
        return;
      }

      setWeb3Installed(true);
      const _chainId = await getCurrentChain();
      const web3_connection_response = await checkWeb3Connection();
      const widthScreen = window.screen.width;

      const matchedChain = arrayChains.find((b) => b.id === _chainId);
      if (matchedChain) setBLOCKCHAIN(matchedChain);

      setWindowWidth(widthScreen);
      setIsConnected(web3_connection_response.connect);
    };

    Init();
  }, []);

  useEffect(() => {
    const targetChain = import.meta.env.VITE_CHAIN;
    if (chainId && chainId !== targetChain) {
      setIncorrectChain(true);
    }
    if (import.meta.env.VITE_PROD_MODE === "0") {
      setIncorrectChain(false);
    }
  }, [chainId]);

  useEffect(() => {
    if (!web3Installed) return;

    const fetchWalletBalance = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const balance = await provider.getBalance(await signer.getAddress());
        setWalletBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchWalletBalance();
  }, [web3Installed]);

  useEffect(() => {
    if (!web3Installed) return;

    turnOnAccountChange();
    turnOnChainChange();

    const fetchBlockchainData = async () => {
      try {
        const account: any = await getCurrentAccount();
        setCurrentAccount(account);

        const chain = await getCurrentChain();
        setCurrentChainId(chain);
      } catch (error) {
        console.error("Error obteniendo cuenta o cadena:", error);
      }
    };

    fetchBlockchainData();
  }, [web3Installed]);


  const handleCreateVault = async () => {
    // const vault = await factory.createVaultIfNotExists();
    // setHasVault(!!vault);
    // setVaultAddress(vault || "");
    // window.location.reload();

  };



  /**
   * @deprecated This smart contract-based balance fetching is obsolete.
   *
   * Use the new UserBalanceProvider and useUserBalance hook instead:
   * - Provider: @/context/UserBalanceProvider
   * - Hook: @/core/hooks/useUserBalance
   *
   * The new implementation fetches balance from the API endpoint: GET users/activity
   * This is more reliable and doesn't depend on blockchain connection.
   *
   * This code is kept temporarily for backward compatibility.
   * It will be removed in a future version once all components migrate to the new provider.
   */
  useEffect(() => {
    const fetchVaultBalance = async () => {
      const vault = new ContractVaultERC20();
      await vault.load(vaultAddress);
      console.log("Vault address in fetchVaultBalance:", vaultAddress);
      const balance = await vault.getUSDTBalance();
      console.log("-------USDT Balance: ",balance)
      // const usdt_wallet_balance = await vault.getWalletUSDTBalance("0x5FbDB2315678afecb367f032d93F642f64180aa3");
      const usdt_wallet_balance = await vault.getWalletUSDTBalance("");

      if(balance)setVaultUSDTBalance(balance);
      if(usdt_wallet_balance)setUserWalletVaultUSDTBalance(usdt_wallet_balance);
    };

    // if(vaultAddress)fetchVaultBalance();
    if(vaultAddress)fetchVaultBalance();
  }, [vaultAddress,transactionSuccess]); // Refresca después de un depósito exitoso


  return (
    <BlockchainContext.Provider
      value={{
        currentAccount,
        chainId,
        factory,
        isConnected,
        web3Installed,
        windowWidth,
        BLOCKAIN,
        walletBalance,
        incorrectChain,
        hasVault,
        vaultAddress,
        handleCreateVault,
        checkingVault,
        vaultUSDTBalance,
        transactionSuccess,
        setTransactionSuccess,
        userWalletUSDTBalance
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
