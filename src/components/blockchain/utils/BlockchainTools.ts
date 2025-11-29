/* eslint-disable @typescript-eslint/no-explicit-any */
import Web3 from "web3"


let currentAccount:string;

const deepLink=import.meta.env.VITE_DEEP_LINK


const web3=new Web3(window.ethereum)

export const requestAccountConnection=async()=>{
  try {
    
    await window.ethereum
    .request({ method: 'eth_accounts' })
    .then((accounts:string)=>{
      if (accounts.length === 0) {
        console.log('No accounts deteced!')
        window.ethereum.request({ method: 'eth_requestAccounts' })
      }
    })
    .catch((err:Error) => {
      console.error("Error in requestAccountConnection, BlockchainTools",err);
      
    })

    } catch (error) {
      console.log('Error in getCurrentAccount(): ',error)
      return 0
      
    }

    if(currentAccount==null) return 0
    return web3.utils.toChecksumAddress(currentAccount)
    
}


export const getCurrentAccount=async()=>{
  try {
    
    await window.ethereum
    .request({ method: 'eth_accounts' })
    .then((accounts:string)=>{
      if (accounts.length === 0) {
        console.log('No accounts deteced!')
        // MetaMask is locked or the user has not connected any accounts
        // console.log('Please connect to MetaMask. Called from:', new Error().stack);
        // window.ethereum.request({ method: 'eth_requestAccounts' })

      } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        // console.log("accounts: ",accounts)
      }
  
    })
    .catch((err:Error) => {
      console.error("Error en actualizarCuenta: Blockchain.js",err);
      
    })

    } catch (error) {
      console.log('Error in getCurrentAccount(): ',error)
      return 0
      
    }

    if(currentAccount==null) return 0
    return web3.utils.toChecksumAddress(currentAccount)
    
}


export const getCurrentChain=async()=>{
  try {
    const chainId = await window?.ethereum?.request({ method: 'eth_chainId' });
    return chainId  
  } catch (error) {
    console.log('error getting chain id: ',error)
    return 0
  }


}


export const requestWeb3Conexion=async(setIsConnected:any,web3Installed=false)=>{

  const widhtScreen=window.screen.width
  //Si la ventana es menor a 820, el usuario esta en un dispositivo movil

  if(widhtScreen<821){
    //Es menor a la dimension de un Ipad air, debe ser portatil
    if(web3Installed){
      const res=await window.ethereum.request({ method: 'eth_requestAccounts' })
      if(res.length>0)setIsConnected(true)
      
    }else{
      window.open(deepLink)
    }

  }else{
    if(web3Installed){
      const res=await window.ethereum.request({ method: 'eth_requestAccounts' })
      if(res.length>0)setIsConnected(true)
    }else{
      console.log('not connected to blockchain 2')
    }
  }
  
}


export const getWalletBalance = async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
      return;
    }
    const currentAccount = accounts[0];
    const balance = await web3.eth.getBalance(currentAccount);
    return balance
  } catch (error) {
    console.error('Error:', error);
  }
};


export const turnOnAccountChange=()=>{
  try {

    window.ethereum.on('accountsChanged',(acc:string)=>{
      console.log("cuenta cambiada: ",acc[0])
      window.location.reload();
    });
  } catch (error) {
    console.log('prenderCambioCuenta: ',error)
  }
  
}


export const turnOnChainChange=()=>{
    let chain=''
    try {
      window.ethereum.on('chainChanged', (_chainId:string) =>{
          console.log('New chain changed: ',_chainId)
          chain= _chainId
          window.location.reload()
      });
    } catch (error) {
        console.log('prenderCambioCadena: ',error)
    }
  return chain
}


export const checkWeb3Connection=async()=>{
  let isConnected=false
  let isInstall=true

  if (window.ethereum !== undefined) {
    // console.log('window.ethereum: ',window.ethereum)

    try {
      await window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts:any)=>{
        if (accounts.length != 0) {
          // MetaMask is locked or the user has not connected any accounts
          isConnected=true           
          
        }
      })

    } catch (error) {
      console.log('error CheckConexion: ',error)
    }

  }else{
      //The user doesnt have install a web3Wallet
      isInstall=false
      
  }
  return {connect:isConnected,install:isInstall}
}


export const TransformWei=(_num:string)=>{
  try {
  return web3.utils.fromWei(_num,'ether')
} catch (error) {
    console.log('error TransformWei=>',error)
    return 0
}
}

export const TransformarToWei=(_num:any)=>{
  try {
    return web3.utils.toWei(_num,'ether')
    
  } catch (error) {
    console.log('error transforming to wei',error)
  }
}
export const ChangeChain = async () => {
  const _id = import.meta.env.VITE_CHAIN;

  try {
    await window.ethereum.request({ 
      method: 'wallet_switchEthereumChain', 
      params: [{ chainId: _id }]
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        // Agregar la cadena si no está reconocida
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: _id,
              chainName: "Binance Smart Chain",
              rpcUrls: ["https://bsc-dataseed.binance.org/"],
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              blockExplorerUrls: ["https://bscscan.com"],
            },
          ],
        });
      } catch (addError) {
        console.error('Error adding the chain:', addError);
      }
    } else {
      console.error('Error switching chain:', error);
    }
  }
};


export const AddChain = async () => {
  const _id = import.meta.env.VITE_CHAIN;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: _id }],
    });
  } catch (addError:any) {
    console.log('Error adding chain: ', addError);

    if (addError.code === 4902) { // Error específico de MetaMask cuando la cadena no se encuentra
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: _id,
              chainName: import.meta.env.VITE_CHAIN_NAME,
              rpcUrls: [import.meta.env.VITE_CHAIN_RPC],
              nativeCurrency: {
                name: "BNB Testnet",
                symbol: "tBNB",
                decimals: 18,
              },
            },
          ],
        });
      } catch (error) {
        console.error('Failed to add the chain: ', error);
      }
    }
  }
};

