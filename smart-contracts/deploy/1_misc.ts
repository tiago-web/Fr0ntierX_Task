import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying WyvernAtomicizer contract...");
  let args: any[] = [];

  const wyvernAtomicizerContract = await deploy("WyvernAtomicizer", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: (network.config as any)?.blockConfirmations || 1,
  });

  log("WyvernAtomicizer deployed to address", wyvernAtomicizerContract.address);

  log("--------------------------------------------------");

  log("Deploying WyvernStatic contract...");
  args = [wyvernAtomicizerContract.address];
  const wyvernStaticContract = await deploy("WyvernStatic", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: (network.config as any)?.blockConfirmations || 1,
  });

  log("WyvernStatic deployed to address", wyvernStaticContract.address);

  log("--------------------------------------------------");

  log("Deploying StaticMarket contract...");
  args = [];

  const staticMarketContract = await deploy("StaticMarket", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: (network.config as any)?.blockConfirmations || 1,
  });

  log("StaticMarket deployed to address", staticMarketContract.address);

  log("--------------------------------------------------");

  log("Deploying Front token contract...");
  args = ["ipfs://"];

  const frontContract = await deploy("Front", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: (network.config as any)?.blockConfirmations || 1,
  });

  log("Front deployed to address", frontContract.address);

  log("--------------------------------------------------");

  log("Deploying TierX token contract...");
  args = [];

  const tierXContract = await deploy("TierX", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: (network.config as any)?.blockConfirmations || 1,
  });

  log("TierX deployed to address", tierXContract.address);

  log("--------------------------------------------------");

  log("Deploying WyvernRegistry contract...");

  const wyvernRegistryContract = await deploy("WyvernRegistry", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: (network.config as any)?.blockConfirmations || 1,
  });

  log("TierX deployed to address", tierXContract.address);

  log("--------------------------------------------------");

  log("Deploying WyvernExchange contract...");

  args = [
    network.config.chainId,
    [
      wyvernRegistryContract.address,
      "0xa5409ec958C83C3f309868babACA7c86DCB077c1",
    ],
    Buffer.from("\x19Ethereum Signed Message:\n", "binary"),
  ];
  const wyvernExchangeContract = await deploy("WyvernExchange", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: (network.config as any)?.blockConfirmations || 1,
  });

  log("WyvernExchange deployed to address", wyvernExchangeContract.address);

  log("--------------------------------------------------");
};

module.exports.tags = ["all", "deploy"];
