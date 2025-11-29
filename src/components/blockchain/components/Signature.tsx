// import { ContractSign } from "../../blockchain/ContractSign";
// import { http } from "../../../core/utils/http_request";
// import { RUTE_USER_LOGIN_SIGNATURE } from "../../../routes/routes";
import { MdVerified } from "react-icons/md";
import { useBlockchainContext } from "@/context/BlockchainProvider";
import { ChangeChain } from "@/components/blockchain/utils/BlockchainTools";
import ButtonConnectChain from "./buttonConnectChain/ButtonConnectChain";


export default function Signature() {

  // Smart contract
  // const contract = new ContractSign();

  const {
    // chainId,currentAccount,
    incorrectChain}=useBlockchainContext()

  // const handleSign = async () => {

  //   await contract.load();

  //   const hash = await contract.getMessageHash(currentAccount.toString());
    
  //   const digitalSignature = await contract.firmar(currentAccount, hash);


  //   http.post(RUTE_USER_LOGIN_SIGNATURE, 
  //     {
  //       address: currentAccount,
  //       firma: digitalSignature,
  //       chainID: chainId,
  //     }
  //   ).then((resp) => {
  //       if (resp.data && resp.data.status) {
  //         sessionStorage.setItem("token", resp.data.token);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log("catch_________________:", error);
  //     });
  // };

  return (
      <div className="flex items-center justify-center text-white">

        <ButtonConnectChain/>
        <button 
        className="flex items-center gap-1 justify-center rounded-4xl text-black dark:text-slate-300"
        onClick={ChangeChain}>
          {incorrectChain ? "Change to real Blockchain"
          :
          <>
          <MdVerified color="limegreen" />
          <span>
          Web3 Connected
          </span>
          </>
          }
        </button>

      </div>
  );
}
