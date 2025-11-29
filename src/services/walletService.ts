import { ethers } from 'ethers';
import { encrypt } from './cryptoService';

export interface CustodialWallet {
  publicKey: string;
  encryptedPrivateKey: string;
  mnemonic?: string;
}

export class WalletService {
  static generateCustodialWallet(temporaryPassword: string): CustodialWallet {
    const wallet = ethers.Wallet.createRandom();
    
    const encryptedPrivateKey = encrypt(wallet.privateKey, temporaryPassword);
    
    return {
      publicKey: wallet.address,
      encryptedPrivateKey,
      mnemonic: wallet.mnemonic?.phrase
    };
  }
  
  static async exportPrivateKey(encryptedPrivateKey: string, password: string): Promise<string> {
    const { decrypt } = await import('./cryptoService');
    return decrypt(encryptedPrivateKey, password);
  }
}