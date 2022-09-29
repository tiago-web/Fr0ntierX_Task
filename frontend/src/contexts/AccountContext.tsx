import {
  useCallback,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

import {
  blockchainAbis,
  blockchainAddresses,
  blockchainParams,
} from "../chain/config";
import {
  Front,
  StaticMarket,
  TierX,
  WyvernExchange,
  WyvernRegistry,
} from "../chain/typechain-types";
import { toastError } from "../utils/errorHandlers";

interface AccountContextData {
  provider?: Web3Provider;
  erc20Contract?: TierX;
  erc721Contract?: Front;
  exchangeContract?: WyvernExchange;
  staticMarketContract?: StaticMarket;
  registryContract?: WyvernRegistry;
  accountAddress?: string;
  signer?: ethers.providers.JsonRpcSigner;
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
  const [signer, setSigner] = useState<
    ethers.providers.JsonRpcSigner | undefined
  >();
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

  //   window.ethereum.request({
  //     method: "wallet_addEthereumChain",
  //     params: [
  //       {
  //         chainId: "0x89",
  //         rpcUrls: ["https://rpc-mainnet.matic.network/"],
  //         chainName: "Matic Mainnet",
  //         nativeCurrency: {
  //           name: "MATIC",
  //           symbol: "MATIC",
  //           decimals: 18,
  //         },
  //         blockExplorerUrls: ["https://polygonscan.com/"],
  //       },
  //     ],
  //   });
  // };

  const connectToWallet = useCallback(async () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    await web3Provider.send("eth_requestAccounts", []);

    const signer = web3Provider.getSigner();
    const address = await signer?.getAddress();

    connectAddresses(signer);

    setProvider(web3Provider);
    setSigner(signer);
    setAccountAddress(address);
    localStorage.setItem("isWalletConnected", "true");
  }, [connectAddresses]);

  const requestChangeNetworkAndConnect = useCallback(async () => {
    if (!window?.ethereum) {
      toastError("Metamask is not installed, please install!");
    }
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

    const { chainId } = await web3Provider.getNetwork();

    if (blockchainParams.chainId) {
      console.info(chainId, parseInt(blockchainParams.chainId, 16));

      if (chainId !== parseInt(blockchainParams.chainId, 16)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: blockchainParams.chainId }],
          });

          await connectToWallet();
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError?.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [blockchainParams],
              });
              await connectToWallet();
            } catch (addError) {
              console.log(addError);
              toastError(addError);
              localStorage.setItem("isWalletConnected", "false");
            }
          } else if (switchError?.code === 4001) {
            toastError(
              "To connect your wallet you must switch to the right network!"
            );
            localStorage.setItem("isWalletConnected", "false");
          }
        }
      } else {
        connectToWallet();
      }
    }
  }, [connectToWallet]);

  const connectWallet = useCallback(async () => {
    try {
      await requestChangeNetworkAndConnect();
    } catch (err) {
      console.log(err);
      toastError(err);
    }
  }, [requestChangeNetworkAndConnect]);

  const disconnectWallet = useCallback(() => {
    setAccountAddress(undefined);
    localStorage.setItem("isWalletConnected", "false");
  }, []);
  // requestChangeNetworkAndConnect
  useEffect(() => {
    if (localStorage?.getItem("isWalletConnected") === "true") {
      console.log("here");

      requestChangeNetworkAndConnect();
    }
  }, [requestChangeNetworkAndConnect]);

  const contextValue = useMemo(
    () => ({
      provider,
      erc20Contract,
      erc721Contract,
      exchangeContract,
      staticMarketContract,
      registryContract,
      accountAddress,
      signer,
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
      signer,
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
