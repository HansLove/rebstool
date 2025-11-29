import { ethers, BrowserProvider } from 'ethers';
import contractJSON from "./deployments/localhost/VaultFactory.json";
import { saveVaultAddress } from '@/services/api';

export class ContractVaultFactory {
  contract: ethers.Contract | null = null;
  account: string = '';
  provider: BrowserProvider | null = null;
  signer: ethers.Signer | null = null;

  constructor() {
    // No inicializar el provider ni signer aquí
  }

  async load() {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      this.provider = new BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = await this.signer.getAddress();

      const contractAddress = import.meta.env.VITE_PROD_MODE === '0'
        ? contractJSON.address
        : "0x5E3E93fE9eB644C32E9D6f7C1455644b8aa8ee07";

      console.log("Contract address: ", contractAddress);

      this.contract = new ethers.Contract(
        contractAddress,
        contractJSON.abi,
        this.signer
      );

    } catch (error) {
      console.error("❌ Error loading contract:", error);
      this.contract = null;
    }
  }

  async getVaultAddress(): Promise<string | null> {
    try {
      if (!this.contract) throw new Error("Contract not loaded");
      const vaultAddress = await this.contract?.getVault(this.account);
      console.log("Vault address for account:", this.account, "->", vaultAddress);
      return vaultAddress !== ethers.ZeroAddress ? vaultAddress : null;
    } catch (error) {
      console.error("❌ Error fetching vault address:", error);
      return null;
    }
  }

  async createVaultIfNotExists(): Promise<string | null> {
    try {
      if (!this.contract) throw new Error("Contract not loaded");

      const existingVault = await this?.getVaultAddress();
      if (existingVault) {
        console.log("⚠️ Vault already exists:", existingVault);
        return existingVault;
      }

      console.log("🔨 Creating new vault for account:", this.account);
      const tx = await this.contract.createVault();
      console.log("📤 Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("✅ Vault creation transaction mined:", receipt);

      const newVault = await this?.getVaultAddress();
      console.log("✅ New Vault created at:", newVault);

      // Save in database
      if (newVault) {
        try {
          await saveVaultAddress({
            contract_address: newVault,
            network: import.meta.env.VITE_PROD_MODE === '0' ? "localhost" : "mainnet",
            currency: "USDT",
            payment_interval: "MANUAL",
            metadata: {
              txHash: receipt.hash,
              blockNumber: receipt.blockNumber,
              createdAt: new Date().toISOString(),
            },
          });
          console.log("💾 Vault address saved to database");
        } catch (dbError) {
          console.error("⚠️ Failed to save vault to database:", dbError);
          // Don't fail the entire operation if DB save fails
        }
      }

      return newVault;
    } catch (error) {
      console.error("❌ Error creating vault:", error);
      throw error; // Re-throw to let the hook handle it
    }
  }
}
