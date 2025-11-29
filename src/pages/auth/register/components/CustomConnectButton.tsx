import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaWallet } from 'react-icons/fa6';
import { useAccount } from 'wagmi';

function CustomConnectButton() {
  const { connector } = useAccount();
  
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex w-full items-center justify-center space-x-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-orange-500">
                      <FaWallet className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex w-full items-center justify-center space-x-3 rounded-lg border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-red-700 dark:text-red-400 shadow-sm transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <span className="font-medium">Wrong network</span>
                  </button>
                );
              }

              return (
                <div className="space-y-3">
                  {/* Wallet Provider Info */}
                  {connector && (
                    <div className="flex items-center justify-center space-x-2 rounded-lg bg-green-50 dark:bg-green-900/30 px-3 py-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-orange-500">
                        <FaWallet className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Connected via {connector.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Network and Account Info */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center' }}
                      type="button"
                      className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {account.displayName}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default CustomConnectButton;