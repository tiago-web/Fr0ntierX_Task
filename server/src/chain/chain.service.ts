import { Injectable } from "@nestjs/common";
import { ethers, providers, Wallet } from "ethers";

import {
  Front,
  StaticMarket,
  TierX,
  WyvernExchange,
  WyvernRegistry,
} from "./typechain-types";

import { config, blockchainAbis, blockchainAddresses } from "./config";

@Injectable()
export class ChainService {
  public readonly erc20Contract: TierX;
  public readonly erc721Contract: Front;
  public readonly exchangeContract: WyvernExchange;
  public readonly staticMarketContract: StaticMarket;
  public readonly registryContract: WyvernRegistry;
  private readonly signer: Wallet;
  public readonly ethersProvider: providers.BaseProvider;

  constructor() {
    this.ethersProvider = ethers.providers.getDefaultProvider(config.rpcUrl);

    // let deployerWallet: Wallet;
    // if (config.deployerMnemonic) {
    //   deployerWallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic);
    // } else {
    const deployerWallet = new ethers.Wallet(
      config.deployerPrivateKey,
      this.ethersProvider,
    );
    // }

    this.signer = deployerWallet.connect(this.ethersProvider);

    this.erc20Contract = new ethers.Contract(
      blockchainAddresses.tierXAddress,
      blockchainAbis.tierXAbi,
      this.ethersProvider,
    ) as TierX;
    this.erc721Contract = new ethers.Contract(
      blockchainAddresses.frontAddress,
      blockchainAbis.frontAbi,
      this.ethersProvider,
    ) as Front;
    this.exchangeContract = new ethers.Contract(
      blockchainAddresses.wyvernExchangeAddress,
      blockchainAbis.wyvernExchangeAbi,
      this.ethersProvider,
    ) as WyvernExchange;
    this.staticMarketContract = new ethers.Contract(
      blockchainAddresses.staticMarketAddress,
      blockchainAbis.staticMarketAbi,
      this.ethersProvider,
    ) as StaticMarket;
    this.registryContract = new ethers.Contract(
      blockchainAddresses.wyvernRegistryAddress,
      blockchainAbis.wyvernRegistryAbi,
      this.ethersProvider,
    ) as WyvernRegistry;

    this.signer
      .getAddress()
      .then((address) =>
        console.info("Chain Service provider address:", address),
      );
  }

  async ownerOfFront(tokenId: number) {
    const owner = await this.erc721Contract.ownerOf(tokenId);
    return owner;
  }
}
