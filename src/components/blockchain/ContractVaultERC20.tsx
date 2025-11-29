/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, BrowserProvider,parseUnits } from 'ethers';
import contractJSON from "./deployments/localhost/AffiliateVault.json";
import contractUSDTJson from "./deployments/localhost/FakeUSDT.json";
// import { getCurrentAccount } from './utils/BlockchainTools';

export class ContractVaultERC20 {

  contract: ethers.Contract | null = null;
  account: any = '';
  provider: BrowserProvider | null = null;
  signer: ethers.Signer | null = null;
  usdtAddress: any = '';

  constructor() {
    // this.provider = new BrowserProvider(window.ethereum);
    // this.signer = {} as ethers.Signer;
  }
  
  async load(vault_address=contractJSON.address ) {
    
    try {
      // Verifica si MetaMask está disponible
      if (!window.ethereum) {
        throw new Error("MetaMask no está instalado");
      }
      
      this.provider = new BrowserProvider(window.ethereum);
      this.signer = {} as ethers.Signer;
      // this.signer = await this.provider.getSigner();
      // this.account = await this.signer.getAddress();
      
      // const contractAddress = `${import.meta.env.VITE_PROD_MODE === '0' ? vault_address : "0x24B0448853F44a0103D2f6A08cf9BD8C4196ccE6"}`;
      // const contractAddress = `${import.meta.env.VITE_PROD_MODE === '0' ? contractJSON.address : vault_address}`;
      const contractAddress = vault_address;

      
      // this.account = await getCurrentAccount();
      this.signer = await this.provider.getSigner();

      this.contract = new ethers.Contract(contractAddress, contractJSON.abi, this.signer);
    } catch (error) {
      console.error('❌ Error loading contract:', error);
      this.contract = null;
    }
  }

  async getPrice() {
    try {
      return await this.contract?.getPrice();
    } catch (error) {
      console.error('getPrice error:', error);
      return false;
    }
  }


  // ✅ Método deposit actualizado para ERC-20
  async deposit(amount = "10.0") {
    try {
      const amountInWei = parseUnits(amount, 18); // "10.0" USDT → 10000000000000000000
      const tx = await this.contract?.deposit(amountInWei);
      const receipt = await tx.wait();
      console.log('✅ Deposit successful:', receipt);
      return receipt;
    } catch (error) {
      console.error('❌ Error on deposit:', error);
      return false;
    }
  }

  async withdraw(amount: string) {
    console.log("withdraw amount", amount);
    try {
      const amountInWei = parseUnits(amount, 18); 
      const tx = await this.contract?.withdraw(amountInWei);
      const receipt = await tx.wait();
      console.log('✅ Withdraw successful:', receipt);
      return receipt.status;
    } catch (error) {
      console.error('❌ Withdraw error:', error);
      return false;
    }
  }
  

  async getWalletUSDTBalance(usdtAddress: string): Promise<string> {

    try {
      if (!this.signer) throw new Error("Signer not initialized");
      const account = await this.signer.getAddress();
  
      const usdt = new ethers.Contract(usdtAddress, contractUSDTJson.abi, this.provider);
      const raw = await usdt.balanceOf(account);
      const decimals = await usdt.decimals();
  
      return ethers.formatUnits(raw, decimals);
    } catch (error) {
      console.error("getWalletUSDTBalance error:", error);
      return "0";
    }
  }
  


  async getUSDTBalance(): Promise<string> {
    try {
      const raw = await this.contract?.getContractBalance();
      if(raw)return ethers?.formatUnits(raw, 18);
      return ""
    } catch (error) {
      console.error("getUSDTBalance error:", error);
      return "0";
    }
  }
  

  async getOwners() {
    try {
      return await this.contract?.getOwners();
    } catch (error) {
      console.error('getOwners error:', error);
      return [];
    }
  }

  async getContractBalance() {
    try {
      return await this.contract?.getContractBalance();
    } catch (error) {
      console.error('getContractBalance error:', error);
      return 0;
    }
  }

  async getCheckPointAmount() {
    try {
      return await this.contract?.getCheckPointAmount();
    } catch (error) {
      console.error('getCheckPointAmount error:', error);
      return 0;
    }
  }

  async getLastWithdrawBlock() {
    try {
      return await this.contract?.getLastWithdrawBlock();
    } catch (error) {
      console.error('getLastWithdrawBlock error:', error);
      return null;
    }
  }

  async getInternalFeeCounter() {
    try {
      return await this.contract?.getInternalFeeCounter();
    } catch (error) {
      console.error('getInternalFeeCounter error:', error);
      return 0;
    }
  }

  async getFeeCount() {
    try {
      return await this.contract?.getFeeCount();
    } catch (error) {
      console.error('getFeeCount error:', error);
      return 0;
    }
  }

  async getFeeTransaction(tx_id: number) {
    try {
      return await this.contract?.getFeeTransaction(tx_id);
    } catch (error) {
      console.error('getFeeTransaction error:', error);
      return null;
    }
  }

  async getFeeIsConfirmed(tx_id: number) {
    try {
      return await this.contract?.getFeeIsConfirmed(tx_id);
    } catch (error) {
      console.error('getFeeIsConfirmed error:', error);
      return false;
    }
  }

  async getIsConfirmed(tx_id: number) {
    try {
      return await this.contract?.getIsConfirmed(tx_id);
    } catch (error) {
      console.error('getIsConfirmed error:', error);
      return false;
    }
  }

  async getTransaction(tx_id: number) {
    try {
      return await this.contract?.getTransaction(tx_id);
    } catch (error) {
      console.error('getTransaction error:', error);
      return null;
    }
  }

  async getTransactionCount() {
    try {
      return await this.contract?.getTransactionCount();
    } catch (error) {
      console.error('getTransactionCount error:', error);
      return 0;
    }
  }

  async submitFeeWithdraw(_receiver: string, _amount: bigint) {
    try {
      const tx = await this.contract?.submitFeeWithdraw(_receiver, _amount);
      return (await tx.wait()).status;
    } catch (error) {
      console.error('submitFeeWithdraw error:', error);
      return false;
    }
  }

  async confirmFeeTransaction(tx_id: number) {
    try {
      const tx = await this.contract?.confirmFeeTransaction(tx_id);
      return await tx.wait();
    } catch (error) {
      console.error('confirmFeeTransaction error:', error);
      return false;
    }
  }

  async executeFeeWithdraw(tx_id: number) {
    try {
      const tx = await this.contract?.executeFeeWithdraw(tx_id);
      return await tx.wait();
    } catch (error) {
      console.error('executeFeeWithdraw error:', error);
      return false;
    }
  }

  async submitTransaction(_receiver: string, _amount: bigint) {
    try {
      const tx = await this.contract?.submitTransaction(_receiver, _amount);
      return (await tx.wait()).status;
    } catch (error) {
      console.error('submitTransaction error:', error);
      return false;
    }
  }

  async confirmTransaction(tx_id: number) {
    try {
      const tx = await this.contract?.confirmTransaction(tx_id);
      return await tx.wait();
    } catch (error) {
      console.error('confirmTransaction error:', error);
      return false;
    }
  }

  async executeTransaction(tx_id: number) {
    try {
      const tx = await this.contract?.executeTransaction(tx_id);
      return await tx.wait();
    } catch (error) {
      console.error('executeTransaction error:', error);
      return false;
    }
  }
}
