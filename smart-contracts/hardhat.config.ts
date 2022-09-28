import "dotenv/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "@typechain/hardhat";
import "solidity-coverage";

import "./tasks";

const BSC_TESTNET_RPC_URL =
  process.env.BSC_TESTNET_RPC ||
  "https://data-seed-prebsc-2-s3.binance.org:8545";
const MUMBAI_RPC_URL =
  process.env.ALCHEMY_MUMBAI || "https://rpc-mumbai.maticvigil.com";
const MNEMONIC = process.env.MNEMONIC || "your mnemonic";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "your private key";
const REPORT_GAS = process.env.REPORT_GAS || false;
const COINMARKETCAP_API_KEY =
  process.env.COINMARKETCAP_API_KEY || "your api key";

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      gasPrice: 130000000000,
      gas: 6700000,
      chainId: 1337,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      chainId: 80001,
      saveDeployments: true,
      blockConfirmations: 2,
      accounts: [process.env.PRIVATE_KEY],
      // accounts: { mnemonic: MNEMONIC },
    },
    // bscTestnet: {
    //   url: BSC_TESTNET_RPC_URL,
    //   chainId: 97,
    //   saveDeployments: true,
    //   blockConfirmations: 10,
    //   accounts: { mnemonic: MNEMONIC },
    // },
    // bscTestnet_Staging: {
    //   url: BSC_TESTNET_RPC_URL,
    //   chainId: 97,
    //   saveDeployments: true,
    //   blockConfirmations: 10,
    //   accounts: { mnemonic: MNEMONIC },
    // },
  },
  // gasReporter: {
  //   enabled: REPORT_GAS,
  //   outputFile: "gas-report.txt",
  //   noColors: true,
  //   currency: "USD",
  //   // coinmarketcap: COINMARKETCAP_API_KEY,
  //   // token: "BNB"
  // },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    alice: {
      default: 1,
    },
    bob: {
      default: 2,
    },
    charlie: {
      default: 3,
    },
    david: {
      default: 4,
    },
  },
  // contractSizer: {
  //   runOnCompile: true,
  //   only: [""],
  // },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000, // 100 seconds max for running tests
  },
};
