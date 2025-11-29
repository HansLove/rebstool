import { ethers } from "ethers";
import contractJSON from "./deployments/localhost/FakeUSDT.json";
import { getCurrentAccount } from "./utils/BlockchainTools";

export class ContractERC20 {
  
  contract: ethers.Contract | null = null;
  account: string | number = "";
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

      const contractAddress = `${import.meta.env.VITE_PROD_MODE === '0' ? contractJSON.address : '0x55d398326f99059fF775485246999027B3197955'}`;
      // const contractAddress = '0x55d398326f99059fF775485246999027B3197955';

      if (!contractAddress) {
        throw new Error("No se encontró la dirección del contrato para la red actual");
      }

      this.contract = new ethers.Contract(
        contractAddress,
        contractJSON.abi,
        this.signer
      );

      console.log("✅ Contract loaded");
      return this.contract;
    } catch (error) {
      console.error("❌ Error loading the contract:", error);
      return null;
    }
  }

  async approve(spender: string, amount: string): Promise<boolean> {
    try {
      if (!this.contract) throw new Error("Contrato no cargado");
      const tx = await this.contract.approve(spender, ethers.parseUnits(amount, 18));
      await tx.wait();
      console.log(`✅ Aprobado ${amount} tokens para: ${spender}`);
      return true;
    } catch (err) {
      console.error("❌ Error al aprobar:", err);
      return false;
    }
  }

  async balanceOf(address: string){
    try {
      if (!this.contract) throw new Error("Contrato no cargado");
      const rawBalance = await this.contract.balanceOf(address);
      const formatted = ethers.formatUnits(rawBalance, 18);
      console.log(`🔍 Balance de ${address}: ${formatted}`);
      return formatted;
    } catch (err){
      console.error("❌ Error al obtener el balance:", err);
      return "0";
    }
  }
  
}