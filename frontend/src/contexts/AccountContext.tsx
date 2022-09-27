import {
  useCallback,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { toastError } from "../utils/errorHandlers";

import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { blockchainAbis, blockchainAddresses } from "../chain/config";
import {
  Front,
  StaticMarket,
  TierX,
  WyvernExchange,
  WyvernRegistry,
} from "../chain/typechain-types";

interface AccountContextData {
  provider?: Web3Provider;
  erc20Contract?: TierX;
  erc721Contract?: Front;
  exchangeContract?: WyvernExchange;
  staticMarketContract?: StaticMarket;
  registryContract?: WyvernRegistry;
  accountAddress?: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const AccountContext = createContext<AccountContextData>(
  {} as AccountContextData
);

interface AccountProviderProps {
  children: React.ReactNode;
}

const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<Web3Provider | undefined>();
  const [erc20Contract, setErc20Contract] = useState<TierX | undefined>();
  const [erc721Contract, setErc721Contract] = useState<Front | undefined>();
  const [accountAddress, setAccountAddress] = useState<string | undefined>();
  const [exchangeContract, setExchangeContract] = useState<
    WyvernExchange | undefined
  >();
  const [staticMarketContract, setStaticMarketContract] = useState<
    StaticMarket | undefined
  >();
  const [registryContract, setRegistryContract] = useState<
    WyvernRegistry | undefined
  >();

  const connectAddresses = useCallback(
    (signer: ethers.providers.JsonRpcSigner) => {
      const erc20 = new ethers.Contract(
        blockchainAddresses.tierXAddress,
        blockchainAbis.tierXAbi,
        signer
      ) as TierX;
      const erc721 = new ethers.Contract(
        blockchainAddresses.frontAddress,
        blockchainAbis.frontAbi,
        signer
      ) as Front;
      const exchange = new ethers.Contract(
        blockchainAddresses.wyvernExchangeAddress,
        blockchainAbis.wyvernExchangeAbi,
        signer
      ) as WyvernExchange;
      const staticMarket = new ethers.Contract(
        blockchainAddresses.staticMarketAddress,
        blockchainAbis.staticMarketAbi,
        signer
      ) as StaticMarket;
      const registry = new ethers.Contract(
        blockchainAddresses.wyvernRegistryAddress,
        blockchainAbis.wyvernRegistryAbi,
        signer
      ) as WyvernRegistry;

      setErc20Contract(erc20);
      setErc721Contract(erc721);
      setExchangeContract(exchange);
      setStaticMarketContract(staticMarket);
      setRegistryContract(registry);
    },
    []
  );

  const connectWallet = useCallback(async () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    await web3Provider.send("eth_requestAccounts", []);

    const signer = web3Provider.getSigner();
    const address = await signer?.getAddress();

    connectAddresses(signer);

    setProvider(web3Provider);
    setAccountAddress(address);
    localStorage.setItem("isWalletConnected", "true");
  }, [connectAddresses]);

  const disconnectWallet = useCallback(() => {
    setAccountAddress(undefined);
    localStorage.setItem("isWalletConnected", "false");
  }, []);

  useEffect(() => {
    if (localStorage?.getItem("isWalletConnected") === "true") {
      connectWallet();
    }
  }, [connectWallet]);

  const contextValue = useMemo(
    () => ({
      provider,
      erc20Contract,
      erc721Contract,
      exchangeContract,
      staticMarketContract,
      registryContract,
      accountAddress,
      connectWallet,
      disconnectWallet,
    }),
    [
      provider,
      erc20Contract,
      erc721Contract,
      exchangeContract,
      staticMarketContract,
      registryContract,
      connectWallet,
      accountAddress,
      disconnectWallet,
    ]
  );

  return (
    <AccountContext.Provider value={contextValue}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextData => {
  const context = useContext(AccountContext);

  return context;
};

export default AccountProvider;
