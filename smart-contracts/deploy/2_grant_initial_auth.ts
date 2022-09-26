import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({ ethers }: HardhatRuntimeEnvironment) {
  const wyvernExchange = await ethers.getContract("WyvernExchange");
  const registry = await ethers.getContract("WyvernRegistry");

  await registry.grantInitialAuthentication(wyvernExchange.address);
};

module.exports.tags = ["all", "grant_initial_auth"];
