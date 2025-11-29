import { useState } from "react";
import { ContractERC20 } from "@/components/blockchain/ContractERC20";
import { ContractVaultERC20 } from "@/components/blockchain/ContractVaultERC20";
import { useBlockchainContext } from "@/context/BlockchainProvider";

export default function useDeposits(setTransactionSuccess) {
  const { vaultAddress, userWalletUSDTBalance } = useBlockchainContext();

  const [depositAmount, setDepositAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"idle" | "approving" | "depositing" | "withdrawing">("idle");

  const sendMoney = async () => {
    if (isSubmitting || !depositAmount || parseFloat(depositAmount) <= 0) return;

    setIsSubmitting(true);
    setTransactionSuccess(false);
    setStep("approving");

    const tokenContract = new ContractERC20();
    const vaultContract = new ContractVaultERC20();

    try {
      await tokenContract.load();
      await vaultContract.load(vaultAddress);

      const vaultAddressApproval = vaultContract.contract?.target?.toString();
      if (!vaultAddressApproval) throw new Error("Vault address not found");

      const approveSuccess = await tokenContract.approve(
        vaultAddress,
        depositAmount
      );
      if (!approveSuccess) throw new Error("Approve failed");

      setStep("depositing");
      const depositRes = await vaultContract.deposit(depositAmount);
      if (!depositRes) throw new Error("Deposit failed");

      setTransactionSuccess(true);
      console.log("✅ Deposit successful:", depositRes);
    } catch (error) {
      console.error("❌ Error during deposit flow:", error);
    } finally {
      setIsSubmitting(false);
      setStep("idle");
    }
  };

  const handleQuickSelect = (percentage: number) => {
    const amount = (parseFloat(userWalletUSDTBalance) * (percentage / 100)).toFixed(4);
    setDepositAmount(amount);
  };

  const withdrawMoney = async () => {
    if (isSubmitting || !depositAmount || parseFloat(depositAmount) <= 0) return;

    setIsSubmitting(true);
    setTransactionSuccess(false);
    setStep("withdrawing");

    const vaultContract = new ContractVaultERC20();

    try {
      await vaultContract.load(vaultAddress);
      const withdrawRes = await vaultContract.withdraw(depositAmount);
      if (!withdrawRes) throw new Error("Withdraw failed");

      setTransactionSuccess(true);
      console.log("✅ Withdraw successful:", withdrawRes);
    } catch (error) {
      console.error("❌ Error during withdraw flow:", error);
    } finally {
      setIsSubmitting(false);
      setStep("idle");
    }
  };

  return {
    withdrawMoney,
    isSubmitting,
    sendMoney,
    step,
    handleQuickSelect,
    depositAmount,
    setDepositAmount,
  };
}
