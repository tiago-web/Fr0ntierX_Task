import { ethers, network, deployments } from "hardhat";
import {
  TierX,
  Front,
  WyvernExchange,
  StaticMarket,
  WyvernRegistry,
} from "../typechain-types";
import path from "path";
import { readFileSync } from "fs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const frontAbi = JSON.parse(
  readFileSync(path.resolve(__dirname, "./abis/Front.json"), "utf-8"),
);
const tierXAbi = JSON.parse(
  readFileSync(path.resolve(__dirname, "./abis/TierX.json"), "utf-8"),
);

const parseSig = (bytes: any) => {
  bytes = bytes.substr(2);
  const r = "0x" + bytes.slice(0, 64);
  const s = "0x" + bytes.slice(64, 128);
  const v = parseInt("0x" + bytes.slice(128, 130), 16);
  return { v, r, s };
};

const eip712Domain = {
  name: "EIP712Domain",
  fields: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
};

const eip712Order = {
  name: "Order",
  fields: [
    { name: "registry", type: "address" },
    { name: "maker", type: "address" },
    { name: "staticTarget", type: "address" },
    { name: "staticSelector", type: "bytes4" },
    { name: "staticExtradata", type: "bytes" },
    { name: "maximumFill", type: "uint256" },
    { name: "listingTime", type: "uint256" },
    { name: "expirationTime", type: "uint256" },
    { name: "salt", type: "uint256" },
  ],
};

const structToSign = (order: any, exchange: any) => {
  return {
    name: eip712Order.name,
    fields: eip712Order.fields,
    domain: {
      name: "Wyvern Exchange",
      version: "3.1",
      chainId: network.config.chainId,
      verifyingContract: exchange,
    },
    data: order,
  };
};

class TestHelper {
  public erc20Contract: TierX;
  public erc721Contract: Front;
  public exchangeContract: WyvernExchange;
  public staticMarketContract: StaticMarket;
  public registryContract: WyvernRegistry;

  public deployer: SignerWithAddress;
  public emptyAddress: string;
  ZERO_BYTES32 =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  constructor() {
    this.emptyAddress = "0x0000000000000000000000000000000000000000";
  }

  async init() {
    const accounts = await ethers.getSigners();
    this.deployer = accounts[0];

    await deployments.fixture(["all"]);

    this.erc20Contract = await ethers.getContract("TierX");
    this.erc721Contract = await ethers.getContract("Front");
    this.exchangeContract = await ethers.getContract("WyvernExchange");
    this.staticMarketContract = await ethers.getContract("StaticMarket");
    this.registryContract = await ethers.getContract("WyvernRegistry");

    this.erc20Contract = this.erc20Contract.connect(accounts[0]);
    this.erc721Contract = this.erc721Contract.connect(accounts[0]);
    this.exchangeContract = this.exchangeContract.connect(accounts[0]);
    this.staticMarketContract = this.staticMarketContract.connect(accounts[0]);
    this.registryContract = this.registryContract.connect(accounts[0]);
  }

  async list_erc721_for_erc20(options: any) {
    const { tokenId, mintQuantity, sellingPrice, account_a } = options;

    const mockTokenURIs = [];

    for (let i = 0; i < mintQuantity; i++) {
      mockTokenURIs.push("");
    }

    // Mint a NFT to account a
    await this.erc721Contract
      .connect(account_a)
      .mint(mintQuantity, mockTokenURIs);

    // Register proxy for account a
    await this.registryContract.connect(account_a).registerProxy();

    const proxy1 = await this.registryContract.proxies(account_a.address);

    // Approve proxy to use all NFTs from account a
    await this.erc721Contract
      .connect(account_a)
      .setApprovalForAll(proxy1, true);

    // Choose function for account a
    const selectorOne = ethers.utils
      .id("ERC721ForERC20(bytes,address[7],uint8[2],uint256[6],bytes,bytes)")
      .substring(0, 10);

    // Set trading params
    const paramsOne = ethers.utils.defaultAbiCoder.encode(
      ["address[2]", "uint256[2]"],
      [
        [this.erc721Contract.address, this.erc20Contract.address],
        [tokenId, sellingPrice],
      ],
    );

    // Register order
    const orderOne = {
      registry: this.registryContract.address,
      maker: account_a.address,
      staticTarget: this.staticMarketContract.address,
      staticSelector: selectorOne,
      staticExtradata: paramsOne,
      maximumFill: 1,
      listingTime: "0",
      expirationTime: "10000000000",
      salt: "11",
    };

    // Sign order
    const sigOne = await this._sign(orderOne, account_a);

    return { orderOne, sigOne };
  }

  async buy_erc721_for_erc20(options: any) {
    const { tokenId, buyingPrice, erc20MintAmount, account_a, account_b } =
      options;

    // Approve mint tokens to account b
    await this.erc20Contract
      .connect(account_b)
      .mint(account_b, erc20MintAmount);

    // Register proxy for account b
    await this.registryContract.connect(account_b).registerProxy();

    const proxy2 = await this.registryContract.proxies(account_b.address);

    // Approve proxy to spend erc20 tokens
    await this.erc20Contract
      .connect(account_b)
      .approve(proxy2, erc20MintAmount);

    // Choose function for account b
    const selectorTwo = ethers.utils
      .id("ERC20ForERC721(bytes,address[7],uint8[2],uint256[6],bytes,bytes)")
      .substring(0, 10);

    // Set trading params
    const paramsTwo = ethers.utils.defaultAbiCoder.encode(
      ["address[2]", "uint256[2]"],
      [
        [this.erc20Contract.address, this.erc721Contract.address],
        [tokenId, buyingPrice],
      ],
    );

    // Register second order
    const orderTwo = {
      registry: this.registryContract.address,
      maker: account_b.address,
      staticTarget: this.staticMarketContract.address,
      staticSelector: selectorTwo,
      staticExtradata: paramsTwo,
      maximumFill: 1,
      listingTime: "0",
      expirationTime: "10000000000",
      salt: "12",
    };

    // Sign order
    const sigTwo = await this._sign(orderTwo, account_b);

    return { orderTwo, sigTwo };
  }

  async execute_erc721_for_erc20(options: any) {
    const {
      tokenId,
      buyingPrice,
      account_a,
      account_b,
      orderOne,
      sigOne,
      orderTwo,
      sigTwo,
    } = options;

    // transfer tokens (can be done after the list matches)
    let frontInterface = new ethers.utils.Interface(frontAbi);
    let tierXInterface = new ethers.utils.Interface(tierXAbi);

    const firstData = frontInterface.encodeFunctionData("transferFrom", [
      account_a.address,
      account_b.address,
      tokenId,
    ]);

    const secondData = tierXInterface.encodeFunctionData("transferFrom", [
      account_b.address,
      account_a.address,
      buyingPrice,
    ]);

    // assign calls
    const firstCall = {
      target: this.erc721Contract.address,
      howToCall: 0,
      data: firstData,
    };
    const secondCall = {
      target: this.erc20Contract.address,
      howToCall: 0,
      data: secondData,
    };

    // Exchange happening (can be triggered by another account)
    await this._atomicMatchWith(
      orderOne,
      sigOne,
      firstCall,
      orderTwo,
      sigTwo,
      secondCall,
      this.ZERO_BYTES32,
    );
  }

  private _atomicMatchWith(
    order: any,
    sig: any,
    call: any,
    counterorder: any,
    countersig: any,
    countercall: any,
    metadata: any,
  ) {
    return this.exchangeContract.atomicMatch_(
      [
        order.registry,
        order.maker,
        order.staticTarget,
        order.maximumFill,
        order.listingTime,
        order.expirationTime,
        order.salt,
        call.target,
        counterorder.registry,
        counterorder.maker,
        counterorder.staticTarget,
        counterorder.maximumFill,
        counterorder.listingTime,
        counterorder.expirationTime,
        counterorder.salt,
        countercall.target,
      ],
      [order.staticSelector, counterorder.staticSelector],
      order.staticExtradata,
      call.data,
      counterorder.staticExtradata,
      countercall.data,
      [call.howToCall, countercall.howToCall],
      metadata,
      ethers.utils.defaultAbiCoder.encode(
        ["bytes", "bytes"],
        [
          ethers.utils.defaultAbiCoder.encode(
            ["uint8", "bytes32", "bytes32"],
            [sig.v, sig.r, sig.s],
          ) + (sig.suffix || ""),
          ethers.utils.defaultAbiCoder.encode(
            ["uint8", "bytes32", "bytes32"],
            [countersig.v, countersig.r, countersig.s],
          ) + (countersig.suffix || ""),
        ],
      ),
    );
  }

  private async _sign(order: any, account: SignerWithAddress) {
    const str = structToSign(order, this.exchangeContract.address);

    return account
      ._signTypedData(
        str.domain,
        {
          Order: eip712Order.fields,
        },
        order,
      )
      .then((sigBytes: any) => {
        const sig = parseSig(sigBytes);
        return sig;
      });
  }
}

export default TestHelper;
