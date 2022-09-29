import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({ ethers }: HardhatRuntimeEnvironment) {
  const wyvernExchange = await ethers.getContract("WyvernExchange");
  const registry = await ethers.getContract("WyvernRegistry");

  try {
    await registry.grantInitialAuthentication(wyvernExchange.address);
  } catch (err) {
    console.log(err);
  }
};

module.exports.tags = ["all", "grant_initial_auth"];
