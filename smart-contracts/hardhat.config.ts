import "dotenv/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "@typechain/hardhat";
import "solidity-coverage";

import "./tasks";

const MUMBAI_RPC_URL =
  process.env.ALCHEMY_MUMBAI || "https://rpc-mumbai.maticvigil.com";

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
    },
  },

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
  },
};
