import { readFileSync } from "fs";
import * as path from "path";

import * as dotenv from "dotenv";

dotenv.config();

// Backend abis
export const blockchainAbis = {
  // ERC20 Tokens
  tierXAbi: JSON.parse(
    readFileSync(path.resolve(__dirname, "./abis/TierX.json"), "utf-8"),
  ),

  // ERC721 Token
  frontAbi: JSON.parse(
    readFileSync(path.resolve(__dirname, "./abis/Front.json"), "utf-8"),
  ),

  // Exchange Contracts
  wyvernExchangeAbi: JSON.parse(
    readFileSync(
      path.resolve(__dirname, "./abis/WyvernExchange.json"),
      "utf-8",
    ),
  ),
  staticMarketAbi: JSON.parse(
    readFileSync(path.resolve(__dirname, "./abis/StaticMarket.json"), "utf-8"),
  ),
  wyvernRegistryAbi: JSON.parse(
    readFileSync(
      path.resolve(__dirname, "./abis/WyvernRegistry.json"),
      "utf-8",
    ),
  ),
};

export const blockchainAddresses = {
  // ERC20 Tokens
  tierXAddress:
    process.env.BLOCKCHAIN_ADDRESS_TRXTOKEN ||
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",

  // ERC721 Token
  frontAddress:
    process.env.BLOCKCHAIN_ADDRESS_FRTTOKEN ||
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",

  // Exchange Contracts
  wyvernExchangeAddress:
    process.env.BLOCKCHAIN_ADDRESS_WYVERNEXCHANGE ||
    "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  staticMarketAddress:
    process.env.BLOCKCHAIN_ADDRESS_STATICMARKET ||
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  wyvernRegistryAddress:
    process.env.BLOCKCHAIN_ADDRESS_WYVERNREGISTRY ||
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
};

export const config = {
  deployerMnemonic: process.env.DEPLOYER_MNEMONIC,
  deployerPrivateKey: process.env.DEPLOYER_PRIVATE_KEY,
  rpcUrl: process.env.RPC_URL,
};
