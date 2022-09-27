import fs from "fs";
import { task } from "hardhat/config";

/**
 * Usage: yarn hardhat files-writer --network localhost
 */
task("files-writer", "Writes abis and contract addresses to a file").setAction(
  async (taskArgs, hre) => {
    const networkId = hre.network.config.chainId;

    console.info("Getting contract addresses");
    const wyvernExchangeContract = await hre.ethers.getContract(
      "WyvernExchange",
    );
    console.info(`wyvernExchangeAddress:${wyvernExchangeContract.address}`);
    const staticMarketContract = await hre.ethers.getContract("StaticMarket");
    console.info(`staticMarketAddress:${staticMarketContract.address}`);
    const wyvernRegistryContract = await hre.ethers.getContract(
      "WyvernRegistry",
    );
    console.info(`wyvernRegistryAddress:${wyvernRegistryContract.address}`);
    const tierXContract = await hre.ethers.getContract("TierX");
    console.info(`tierXAddress:${tierXContract.address}`);
    const frontContract = await hre.ethers.getContract("Front");
    console.info(`frontAddress:${frontContract.address}`);

    // Writes all the deployed addresses to addresses.ts
    console.info(`Addresses file...`);
    const configPath = `/../artifacts/config-${networkId}.ts`;

    fs.writeFileSync(
      __dirname + configPath,
      `
      import { readFileSync } from "fs";
      import * as path from "path";
      
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
              readFileSync(path.resolve(__dirname, "./abis/WyvernExchange.json"), "utf-8"),
            ),
          staticMarketAbi: JSON.parse(
              readFileSync(path.resolve(__dirname, "./abis/StaticMarket.json"), "utf-8"),
            ),
          wyvernRegistryAbi: JSON.parse(
              readFileSync(path.resolve(__dirname, "./abis/WyvernRegistry.json"), "utf-8"),
            ),
        };
      
        export const blockchainAddresses = {
          // ERC20 Tokens
          tierXAddress: "${tierXContract.address}",
      
          // ERC721 Token
          frontAddress: "${frontContract.address}",
      
          // Exchange Contracts
          wyvernExchangeAddress: "${wyvernExchangeContract.address}",
          staticMarketAddress: "${staticMarketContract.address}",
          wyvernRegistryAddress: "${wyvernRegistryContract.address}",
        };
`,
    );

    // Optimizes all the required abis
    const abiDir = `${__dirname}/../artifacts/abis`;
    if (!fs.existsSync(abiDir)) {
      fs.mkdirSync(abiDir);
    }

    const writeAbi = (abiName: string) => {
      console.info(`Writing ${abiName}`);
      let sourcePath = `${__dirname}/../artifacts/contracts/${abiName}.sol/${abiName}.json`;
      let sourceFile: any;
      try {
        sourceFile = fs.readFileSync(sourcePath, "utf8");
      } catch (err: any) {
        if (err.message.includes("no such file or directory")) {
          try {
            sourcePath = `${__dirname}/../artifacts/contracts/test/${abiName}.sol/${abiName}.json`;
            sourceFile = fs.readFileSync(sourcePath, "utf8");
          } catch (err) {
            console.error(err);
          }
        }
      }
      const abi = JSON.parse(sourceFile).abi;

      const optimizedPath = `${__dirname}/../artifacts/abis/${abiName}.json`;
      fs.writeFileSync(optimizedPath, JSON.stringify(abi));
    };

    // ERC20 Token
    writeAbi("TierX");

    // ERC721 Token
    writeAbi("Front");

    // Exchange Contracts
    writeAbi("WyvernExchange");
    writeAbi("StaticMarket");
    writeAbi("WyvernRegistry");
  },
);

export {};
