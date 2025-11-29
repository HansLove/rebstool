/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { SiBinance, SiEthereum } from 'react-icons/si';
import { LuWallet } from 'react-icons/lu';
import { checkWeb3Connection, getCurrentChain, requestWeb3Conexion } from '@/components/blockchain/utils/BlockchainTools';

// Definir la interfaz para el estado BLOCKCHAIN
interface BlockchainState {
  name: string;
  id: string;
  image: any;
  warning?: boolean;
  icon?: boolean;
}

// Definir la interfaz de respuesta de CheckConexion
interface CheckConexionResponse {
  connect: boolean;
  install: boolean;
}

const ButtonConnectChain: React.FC = () => {
  // State del sistema
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [web3Installed, setWeb3Install] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number | undefined>();

  const [BLOCKCHAIN, setBLOCKCHAIN] = useState<BlockchainState>({
    name: 'Go Chain',
    id: '0x539',
    image: <SiEthereum color='darkblue' size={20} />,
    warning: true,
    icon: true,
  });

  const array: BlockchainState[] = [
    { 
      name: 'Ethereum', 
      id: '0x1', 
      icon: true,
      image: <SiEthereum color='skyblue' size={22}/> 
    },
    {
      name: 'Testnet 2',
      id: '0x539',
      image: <SiEthereum color='navy' size={22} />,
      warning: true,
      icon: true,
    },
    { name: 'Arbitrum', id: '0xa4b1', image: <img src={'ethereum_1.png'} alt="Eth"/> },
    { name: 'Go Chain', id: '0x7a69', image: <SiEthereum color='peru' size={20}/>, icon: true },
    { name: 'BNB', id: '0x38', image: <SiBinance color='goldenrod' size={20}/>,icon: true },
    // { name: 'ETH', id: '0x38', image: <SiBinance size={40}/> },
    { name: 'Polygon', id: '0x89', image: <img src={'binance_1.png'} alt="Polygon"/> },
    { name: 'Polygon Mumbai', id: '0x13881', image: <img src={'binance_1.png'} alt="Polygon Mumbai" />, warning: true },
    { name: 'Ropsten', id: '0x3', image: <img src={'ethereum_1.png'} alt="Eth"/>, warning: true },
    { name: 'Kovan', id: '0x2a', image: <img src={'ethereum_1.png'} alt="Eth"/>, warning: true },
    // { name: 'BNB', id: '0x61', image: <SiBinance size={40}/>, warning: true,icon:true },
    { name: 'BNB', id: '0x61', image: <SiBinance size={40}/>, warning: true,icon:true },
  ];

  useEffect(() => {
    async function Init() {
      const _chainId = await getCurrentChain();
      const respuesta: CheckConexionResponse = await checkWeb3Connection();
      const widhtScreen = window.screen.width;

      array.forEach((blockchain_object) => {
        if (blockchain_object.id === _chainId) {
          setBLOCKCHAIN(blockchain_object);
        }
      });

      setWindowWidth(widhtScreen);
      setIsConnected(respuesta.connect);
      setWeb3Install(respuesta.install);
    }
    Init();

    return () => {};
  }, []);

  return isConnected ? (
    <div
      className="relative w-[52px]"
    >

      {BLOCKCHAIN.icon ? (
        <div className='d-block m-auto align-middle w-fit'>
          {BLOCKCHAIN.image}
        </div>
      ) : (
        <img className='w-6 align-middle d-block m-auto mt-1 bg-white bg-opacity-80 rounded' src={typeof BLOCKCHAIN.image === 'string' ? BLOCKCHAIN.image : 'ethereum_1.png'} alt="Blockchain Icon" />
      )}
      <p 
        style={{fontSize:'0.5rem',textAlign:'center',paddingTop:'1%'}}
        className='text-black dark:text-slate-200'>
        {BLOCKCHAIN.name}
      </p>

    </div>
  ) : (
    // Cellphone
    windowWidth && windowWidth < 821 ? (
      <button
        className="button_chains text-sm"
        onClick={() =>
          windowWidth < 821 && !isConnected
            ? requestWeb3Conexion(setIsConnected, web3Installed)
            : !web3Installed
            ? window.open('https://metamask.io/download/')
            : requestWeb3Conexion(setIsConnected, web3Installed)
        }
      >
        {web3Installed ? 'Connect Wallet' : windowWidth < 821 && !isConnected ? 'Connect' : 'Download Wallet'}
      </button>
    ) : (
      // Computer
      <button
        onClick={() => !web3Installed ? window.open('https://metamask.io/download/') : requestWeb3Conexion(setIsConnected, web3Installed)}
        className="bg-transparent border-none focus:outline-0"
      >
        <LuWallet className='text-black  w-10 rounded-xl h-auto bg-gradient-to-r from-[#5d55f7] to-[#0084ff] hover:bg-blue-600 hover:opacity-90 transition-opacity p-2'/>
      </button>
    )
  );
};

export default ButtonConnectChain;
