/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import useAuth from "@/core/hooks/useAuth";
import { http } from "@/core/utils/http_request";


interface BlockchainContextType {
  currentAddress: any;
  username: string;
  email: string;
  loadingData: boolean;
  setCurrentAddress: (address: string) => void;
  setUsername: (name: string) => void;
  setEmail: (email: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}


const GlobalContext = createContext<BlockchainContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export function useGlobalProvider() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useBlockchainContext debe usarse dentro de un BlockchainProvider"
    );
  }
  return context;
}

interface IGlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<IGlobalProviderProps> = ({
  children,
}) => {

  const { getToken } = useAuth();

  const [currentAddress, setCurrentAddress] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("USD"); // Default currency
  const [loadingData, setLoadingData] = useState(true); // Default currency

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingData(true)
        const token = getToken();
        const res = await http.post("users/me", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.data;
        setUsername(user.name || "");
        setEmail(user.email || "");
        setCurrentAddress(user.SubAccounts?.[0]?.mainAddress || "");
        setLoadingData(false)
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setLoadingData(false)
      }
    };
    fetchUserData();
  }, []);


  return (
    <GlobalContext.Provider
      value={{
        currentAddress,
        setCurrentAddress,
        setUsername,
        username,
        email,
        setEmail,
        currency,
        setCurrency,
        loadingData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
