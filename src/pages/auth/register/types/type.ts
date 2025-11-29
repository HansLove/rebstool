export interface IRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  useOwnWallet: boolean;
  walletType: 'custodial' | 'self_managed';
  publicKey: string;
  encryptedPrivateKey?: string;
  temporaryPassword?: string;
  mnemonic?: string;
  signature?: string;
  signedMessage?: string;
}