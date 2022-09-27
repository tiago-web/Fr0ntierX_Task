import tierXAbi from "./abis/TierX.json";
import frontAbi from "./abis/Front.json";
import wyvernExchangeAbi from "./abis/WyvernExchange.json";
import staticMarketAbi from "./abis/StaticMarket.json";
import wyvernRegistryAbi from "./abis/WyvernRegistry.json";

// import.meta.env.VITE_BLOCKCHAIN_ADDRESS_TRXTOKEN ||
// import.meta.env.VITE_BLOCKCHAIN_ADDRESS_FRTTOKEN ||
// import.meta.env.VITE_BLOCKCHAIN_ADDRESS_WYVERNEXCHANGE ||
// import.meta.env.VITE_BLOCKCHAIN_ADDRESS_STATICMARKET ||
// import.meta.env.VITE_BLOCKCHAIN_ADDRESS_WYVERNREGISTRY ||

export const blockchainAddresses = {
  // ERC20 Tokens
  tierXAddress: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",

  // ERC721 Token
  frontAddress: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",

  // Exchange Contracts
  wyvernExchangeAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  staticMarketAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  wyvernRegistryAddress: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
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
  chainId: import.meta.env.VITE_BLOCKCHAIN_ID || "0x539",
  chainName: import.meta.env.VITE_BLOCKCHAIN_NAME,
  nativeCurrency: {
    name: import.meta.env.VITE_BLOCKCHAIN_CURRENCY_NAME,
    symbol: import.meta.env.VITE_BLOCKCHAIN_CURRENCY_SYMBOL,
    decimals: +import.meta.env.VITE_BLOCKCHAIN_DECIMALS!!,
  },
  rpcUrls: [import.meta.env.VITE_BLOCKCHAIN_RPC_URL],
  blockExplorerUrls: [import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL],
};
