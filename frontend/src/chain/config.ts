import tierXAbi from "./abis/TierX.json";
import frontAbi from "./abis/Front.json";
import wyvernExchangeAbi from "./abis/WyvernExchange.json";
import staticMarketAbi from "./abis/StaticMarket.json";
import wyvernRegistryAbi from "./abis/WyvernRegistry.json";

export const blockchainAddresses = {
  // ERC20 Tokens
  tierXAddress:
    import.meta.env.REACT_APP_BLOCKCHAIN_ADDRESS_TRXTOKEN ||
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",

  // ERC721 Token
  frontAddress:
    import.meta.env.REACT_APP_BLOCKCHAIN_ADDRESS_FRTTOKEN ||
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",

  // Exchange Contracts
  wyvernExchangeAddress:
    import.meta.env.REACT_APP_BLOCKCHAIN_ADDRESS_WYVERNEXCHANGE ||
    "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  staticMarketAddress:
    import.meta.env.REACT_APP_BLOCKCHAIN_ADDRESS_STATICMARKET ||
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  wyvernRegistryAddress:
    import.meta.env.REACT_APP_BLOCKCHAIN_ADDRESS_WYVERNREGISTRY ||
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
};

export const blockchainAbis = {
  // ERC20 Tokens
  tierXAbi,

  // ERC721 Token
  frontAbi,

  // Exchange Contracts
  wyvernExchangeAbi,
  staticMarketAbi,
  wyvernRegistryAbi,
};

export const blockchainParams = {
  chainId: import.meta.env.REACT_APP_BLOCKCHAIN_ID || "0x539",
  chainName: import.meta.env.REACT_APP_BLOCKCHAIN_NAME,
  nativeCurrency: {
    name: import.meta.env.REACT_APP_BLOCKCHAIN_CURRENCY_NAME,
    symbol: import.meta.env.REACT_APP_BLOCKCHAIN_CURRENCY_SYMBOL,
    decimals: +import.meta.env.REACT_APP_BLOCKCHAIN_DECIMALS!!,
  },
  rpcUrls: [import.meta.env.REACT_APP_BLOCKCHAIN_RPC_URL],
  blockExplorerUrls: [import.meta.env.REACT_APP_BLOCKCHAIN_EXPLORER_URL],
};
