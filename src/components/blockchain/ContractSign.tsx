import { ethers } from "ethers";
import contractSignJSON from "@/components/blockchain/deployments/localhost/Signing.json";
import { getCurrentAccount } from "./utils/BlockchainTools";

export class ContractSign {
  contract: ethers.Contract | null = null;
  account: string|number = '';
  provider: ethers.BrowserProvider | null = null;
  signer: ethers.JsonRpcSigner | null = null;

  async load(): Promise<ethers.Contract | null> {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask no está instalado");
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      this.account = await getCurrentAccount();

      const contractAddress = contractSignJSON.address;

      if (!contractAddress) {
        throw new Error("No se encontró la dirección del contrato para la red actual");
      }

      console.log('Contract Address:', contractAddress);

      this.contract = new ethers.Contract(contractAddress, contractSignJSON.abi, this.signer);
      console.log('Contract loaded successfully:', this.contract);

      return this.contract;
    } catch (error) {
      console.error("Error loading the contract:", error);
      return null;
    }
  }

  async firmar(account: string, hash: string) {
    const signature = await this.provider?.send("personal_sign", [hash, account]);
    return signature;
  }

  async getMessageHash(message: string): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not loaded");
    }
    try {
      const messageHash = await this.contract.getMessageHash(message);
      return messageHash;
    } catch (error) {
      console.error("Error in getMessageHash():", error);
      return "";
    }
  }

  async getEthSignedMessageHash(message: string): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not loaded");
    }
    try {
      const signedMessageHash = await this.contract.getEthSignedMessageHash(message);
      return signedMessageHash;
    } catch (error) {
      console.error("Error in getEthSignedMessageHash():", error);
      return "";
    }
  }

  async verify(signer: string, message: string, signature: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error("Contract not loaded");
    }
    try {
      const verified = await this.contract.verify(signer, message, signature);
      return verified;
    } catch (error) {
      console.error("Error in verify():", error);
      return false;
    }
  }

  async get(index: number): Promise<
  {
    property1: string;
    property2: number;
  }
  > {
    if (!this.contract) {
      throw new Error("Contract not loaded");
    }
    try {
      const result = await this.contract.get(index);
      return result;
    } catch (error) {
      console.error("Error in get():", error);
      return {property1:"",property2:0};
    }
  }
}