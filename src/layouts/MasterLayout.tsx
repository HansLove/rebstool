/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from "react-router-dom";
import useAuth from "@/core/hooks/useAuth";
import { Sidebar} from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { menu_links, menu_links_subs } from "./menu";
import AddNewSubAffilliate from "@/modules/subAffiliates/components/AddNewSubAffilliate";
import { NewAffiliateModal } from "@/modules/affiliates/components/NewAffiliateModal";
import MasterAffiliateHeader from "@/modules/affiliates/components/MasterAffiliateHeader";
import useAffilliateDashboard from "@/modules/affiliates/hooks/useAffilliateDashboard";
import { useIsMobile } from "./hooks/useIsMobile";
import { BlockchainProvider } from "@/context/BlockchainProvider";
import { useEffect, useState } from 'react';
import { http } from '@/core/utils/http_request';
import MastersNavbar from "@/modules/affiliates/components/MastersNavbar";
import useDepositModal from "@/modules/subAffiliates/hooks/useDepositModal";
// import { useLayout } from "./hooks/useLayout";
// import { set } from "date-fns";
import { DepositModal } from '@taloon/nowpayments-components';
import '@taloon/nowpayments-components/styles';
// import useDepositModal from './hooks/useDepositModal';

export default function MasterLayout() {
  const { logout, getUser } = useAuth();
  const userData = getUser();
  const isMobile = useIsMobile();

  const {
    runScraper,
    isScrapping,
    scraperError,
    subAffiliates,
    selectedSubId,
    setSelectedSubId,
    registrationsReport,
    paymentsRegister,
    accounts,
    loading,
    loadAccounts,
    selectedAccountId,
    setSelectedAccountId,
    open,
    setOpen,
    modal,
    setModal,
  } = useAffilliateDashboard();

  // const [vaultContracts, setVaultContracts] = useState([])

  useEffect(() => {
    http
      .get(`users/${userData.id}/public-key`)
      .then(response => {
        console.log('Public Key:', response.data);
      })
      .catch(error => {
        console.error('Error fetching public key:', error);
      });

    // http
    //   .get('contracts')
    //   .then(response => {
    //     console.log('Contracts:', response.data);
    //     setVaultContracts(response.data.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching contracts:', error);
    //   });
  }, []);

  const baseMenu = userData.rol < 3 ? menu_links : menu_links_subs;
  // Filter admin-only menu items (only show for rol === 1)
  const menu = baseMenu.filter((item: any) => {
    if (item.adminOnly) {
      return userData?.rol === 1;
    }
    return true;
  });
  const hasAccounts = Array.isArray(accounts) && accounts.length > 0;

  const filteredRegistrations = selectedSubId
    ? subAffiliates.find(s => s.user.id.toString() === selectedSubId)?.userData || []
    : registrationsReport;

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const { handleDepositSubmit, handleDepositSuccess, handleDepositError } = useDepositModal();

  return (
    <BlockchainProvider>
      <div
        className={cn(
          'relative mx-auto flex h-screen w-full flex-1 flex-col overflow-auto md:flex-row',
          'bg-slate-100 text-slate-500 dark:bg-gray-900 dark:text-white'
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <DepositModal
            isOpen={isDepositModalOpen}
            onClose={() => setIsDepositModalOpen(false)}
            customerEmail={() => {
              const user = getUser();
              return user?.email || '';
            }}
            shouldNotifyByEmail={false}
            showPoweredByNowpayments={false}
            onSubmit={handleDepositSubmit}
            onSuccess={response => {
              const mappedResponse = handleDepositSuccess(response);
              return {
                address: mappedResponse.payAddress,
                paymentId: mappedResponse.paymentId,
              };
            }}
            onError={error => {
              const errorMessage = handleDepositError(error);
              console.error('Deposit failed:', errorMessage);
              return error.message || 'Deposit failed';
            }}
          />

          <motion.div
            animate={{ paddingLeft: isMobile ? 0 : open ? 200 : 55 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* {hasAccounts &&vaultContracts.length>0? ( */}
            {hasAccounts ? (
              <MasterAffiliateHeader
                openWithdrawModal={() => {}}
                runScraper={runScraper}
                isScrapping={isScrapping}
                scraperError={scraperError}
                subAffiliates={subAffiliates}
                selectedSubId={selectedSubId}
                onSelectSubAffiliate={setSelectedSubId}
                openDepositModal={() => setIsDepositModalOpen(true)}
                registrationsReport={registrationsReport}
              />
            ) : (
              <div className="flex items-center justify-between p-4">
                <h1 className="text-lg font-semibold">Connect your Affilliate Account</h1>

                <button onClick={() => runScraper()}>
                  <span className="cursor-pointer rounded-4xl text-sm text-blue-500 hover:text-blue-300">
                    Connect Account
                  </span>
                </button>
              </div>
            )}
            <Outlet
              context={{
                // registrationsReport,
                registrationsReport: filteredRegistrations,
                paymentsRegister,
                accounts,
                subAffiliates,
                loading,
                loadAccounts,
                setSelectedAccountId,
                hasAccounts,
              }}
            />
          </motion.div>

          <MastersNavbar
            menu={menu}
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
            logout={logout}
            getUser={getUser}
            open={open}
          />
        </Sidebar>

        <AddNewSubAffilliate show={modal === 'user'} onClose={() => setModal(null)} onSuccess={() => {}} />
        <NewAffiliateModal show={modal === 'account'} onClose={() => setModal(null)} onSuccess={() => {}} />
      </div>
    </BlockchainProvider>
  );
}
