import { useCallback } from "react";
import { ethers } from "ethers";

import { useAccount } from "../contexts/AccountContext";
import {
  parseSig,
  eip712Order,
  structToSign,
  ZERO_BYTES32,
  ZERO_ADDRESS,
} from "../utils/wyvern";

import { blockchainAbis } from "../chain/config";
import { OrderApprovedEventObject } from "../chain/typechain-types/abis/WyvernExchange";

interface ListERC721ForERC20Options {
  tokenId: number;
  sellingPrice: number;
}

interface BuyErc721ForErc20Options {
  tokenId: number;
  buyingPrice: number;
}

interface ExecuteErc721ForErc20Options {
  tokenId: number;
  buyingPrice: number;
  sellerAddress: string;
  buyerAddress: string;
  orderOne: OrderProps;
  sigOne: SignatureProps;
  orderTwo: OrderProps;
  sigTwo: SignatureProps;
}

export interface SignatureProps {
  r: string;
  s: string;
  v: number;
  suffix?: string;
}

export interface OrderProps
  extends Omit<
    OrderApprovedEventObject,
    | "maximumFill"
    | "listingTime"
    | "expirationTime"
    | "salt"
    | "orderbookInclusionDesired"
    | "hash"
  > {
  maximumFill: number;
  listingTime: string;
  expirationTime: string;
  salt: string;
}

interface CallProps {
  target: string;
  howToCall: number;
  data: string;
}

interface UseMarketProps {
  listErc721ForErc20: (
    options: ListERC721ForERC20Options
  ) => Promise<
    { orderOne: OrderProps; sigOne: SignatureProps | undefined } | undefined
  >;

  buyErc721ForErc20: (
    options: BuyErc721ForErc20Options
  ) => Promise<
    { orderTwo: OrderProps; sigTwo: SignatureProps | undefined } | undefined
  >;
  executeErc721ForErc20: (
    options: ExecuteErc721ForErc20Options
  ) => Promise<void>;
}

export const useMarket = (): UseMarketProps => {
  const {
    erc20Contract,
    erc721Contract,
    registryContract,
    staticMarketContract,
    exchangeContract,
    accountAddress,
    signer,
  } = useAccount();

  const listErc721ForErc20 = useCallback(
    async (options: ListERC721ForERC20Options) => {
      if (
        !erc721Contract ||
        !erc20Contract ||
        !registryContract ||
        !staticMarketContract ||
        !exchangeContract ||
        !accountAddress
      )
        return;
      const { tokenId, sellingPrice } = options;

      const hasProxy =
        (await registryContract.proxies(accountAddress)) !== ZERO_ADDRESS;

      // Validate if there is a proxy already registered
      if (!hasProxy) {
        // Register proxy for the listing account
        const tx = await registryContract.registerProxy();

        await tx.wait();
      }

      const proxy = await registryContract.proxies(accountAddress);

      const isApprovedForAll = await erc721Contract.isApprovedForAll(
        accountAddress,
        proxy
      );

      // Validate if the user already approved for all
      if (!isApprovedForAll) {
        // Approve proxy to use all NFTs from the listing account
        const tx = await erc721Contract.setApprovalForAll(proxy, true);

        await tx.wait();
      }

      // Choose function for account a
      const selectorOne = ethers.utils
        .id("ERC721ForERC20(bytes,address[7],uint8[2],uint256[6],bytes,bytes)")
        .substring(0, 10);

      // Set trading params
      const paramsOne = ethers.utils.defaultAbiCoder.encode(
        ["address[2]", "uint256[2]"],
        [
          [erc721Contract.address, erc20Contract.address],
          [tokenId, ethers.utils.parseEther(String(sellingPrice))],
        ]
      );

      // Register order
      const orderOne: OrderProps = {
        registry: registryContract.address,
        maker: accountAddress,
        staticTarget: staticMarketContract.address,
        staticSelector: selectorOne,
        staticExtradata: paramsOne,
        maximumFill: 1,
        listingTime: "0",
        expirationTime: "10000000000",
        salt: String(Math.floor(Math.random() * 99999999999999)), // Generate a random salt
      };

      // Sign order
      const sigOne = await sign(orderOne);

      return { orderOne, sigOne };
    },
    [
      erc721Contract,
      erc20Contract,
      registryContract,
      staticMarketContract,
      exchangeContract,
      accountAddress,
    ]
  );

  const buyErc721ForErc20 = useCallback(
    async (options: BuyErc721ForErc20Options) => {
      if (
        !erc721Contract ||
        !erc20Contract ||
        !registryContract ||
        !staticMarketContract ||
        !exchangeContract ||
        !accountAddress
      )
        return;

      const { tokenId, buyingPrice } = options;

      const userBalance = (
        await erc20Contract.balanceOf(accountAddress)
      ).toString();

      const parsedPrice = ethers.utils
        .parseEther(String(buyingPrice))
        .toString();

      if (Number(userBalance) < Number(parsedPrice)) {
        throw new Error("Insuficient FRT balance");
      }

      const hasProxy =
        (await registryContract.proxies(accountAddress)) !== ZERO_ADDRESS;

      // Validate if there is a proxy already registered
      if (!hasProxy) {
        // Register proxy for the buying account
        const tx = await registryContract.registerProxy();
        await tx.wait();
      }

      const proxy = await registryContract.proxies(accountAddress);

      // Approve proxy to spend erc20 tokens buyingPrice amount of erc20 tokens
      const tx = await erc20Contract.approve(
        proxy,
        ethers.utils.parseEther(String(buyingPrice))
      );
      await tx.wait();

      // Choose function for account b
      const selectorTwo = ethers.utils
        .id("ERC20ForERC721(bytes,address[7],uint8[2],uint256[6],bytes,bytes)")
        .substring(0, 10);

      // Set trading params
      const paramsTwo = ethers.utils.defaultAbiCoder.encode(
        ["address[2]", "uint256[2]"],
        [
          [erc20Contract.address, erc721Contract.address],
          [tokenId, ethers.utils.parseEther(String(buyingPrice))],
        ]
      );

      // Register second order
      const orderTwo = {
        registry: registryContract.address,
        maker: accountAddress,
        staticTarget: staticMarketContract.address,
        staticSelector: selectorTwo,
        staticExtradata: paramsTwo,
        maximumFill: 1,
        listingTime: "0",
        expirationTime: "10000000000",
        salt: String(Math.floor(Math.random() * 99999999999999)), // Generate a random salt
      };

      // Sign order
      const sigTwo = await sign(orderTwo);

      return { orderTwo, sigTwo };
    },
    [
      erc721Contract,
      erc20Contract,
      registryContract,
      staticMarketContract,
      exchangeContract,
      accountAddress,
    ]
  );

  const executeErc721ForErc20 = useCallback(
    async (options: ExecuteErc721ForErc20Options) => {
      if (!erc721Contract || !erc20Contract) return;

      const {
        tokenId,
        buyingPrice,
        sellerAddress,
        buyerAddress,
        orderOne,
        sigOne,
        orderTwo,
        sigTwo,
      } = options;

      const frontInterface = new ethers.utils.Interface(
        blockchainAbis.frontAbi
      );
      const tierXInterface = new ethers.utils.Interface(
        blockchainAbis.tierXAbi
      );

      const firstData = frontInterface.encodeFunctionData("transferFrom", [
        sellerAddress,
        buyerAddress,
        tokenId,
      ]);

      const secondData = tierXInterface.encodeFunctionData("transferFrom", [
        buyerAddress,
        sellerAddress,
        ethers.utils.parseEther(String(buyingPrice)),
      ]);

      // Assign calls
      const firstCall = {
        target: erc721Contract.address,
        howToCall: 0,
        data: firstData,
      };
      const secondCall = {
        target: erc20Contract.address,
        howToCall: 0,
        data: secondData,
      };

      // Trigger exchange
      await atomicMatchWith(
        orderOne,
        sigOne,
        firstCall,
        orderTwo,
        sigTwo,
        secondCall,
        ZERO_BYTES32
      );
    },
    [erc721Contract, erc20Contract]
  );

  const atomicMatchWith = useCallback(
    async (
      order: OrderProps,
      sig: SignatureProps,
      call: CallProps,
      counterorder: OrderProps,
      countersig: SignatureProps,
      countercall: CallProps,
      metadata: string
    ) => {
      if (!exchangeContract) return;

      const tx = await exchangeContract.atomicMatch_(
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
              [sig.v, sig.r, sig.s]
            ) + (sig?.suffix || ""),
            ethers.utils.defaultAbiCoder.encode(
              ["uint8", "bytes32", "bytes32"],
              [countersig.v, countersig.r, countersig.s]
            ) + (countersig?.suffix || ""),
          ]
        )
      );

      await tx.wait();
    },
    [exchangeContract]
  );

  const sign = useCallback(
    async (order: OrderProps): Promise<SignatureProps | undefined> => {
      if (!exchangeContract || !signer) return;

      const str = structToSign(order, exchangeContract.address);

      const parsedSignature = parseSig(
        await signer._signTypedData(
          str.domain,
          {
            Order: eip712Order.fields,
          },
          order
        )
      );

      return parsedSignature;
    },
    [exchangeContract, signer]
  );

  return {
    listErc721ForErc20,
    buyErc721ForErc20,
    executeErc721ForErc20,
  };
};
