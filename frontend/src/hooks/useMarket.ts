import { useEffect, useState } from "react";
import Web3 from "web3";
import { blockchainAbis } from "../chain/config";
import { OrderApprovedEventObject } from "../chain/typechain-types/abis/WyvernExchange";
import { useAccount } from "../contexts/AccountContext";
// @ts-ignore
import { wrap, ZERO_BYTES32 } from "../utils/wyvern";

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
  account_a: string;
  account_b: string;
  orderOne: Order;
  sigOne: string;
  orderTwo: Order;
  sigTwo: string;
}

interface Order
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

interface UseMarketProps {
  listErc721ForErc20: (
    options: ListERC721ForERC20Options
  ) => Promise<{ orderOne: Order; sigOne: string } | undefined>;

  buyErc721ForErc20: (
    options: BuyErc721ForErc20Options
  ) => Promise<{ orderTwo: Order; sigTwo: string } | undefined>;
  executeErc721ForErc20: (
    options: ExecuteErc721ForErc20Options
  ) => Promise<void>;
}

export const useMarket = (): UseMarketProps => {
  const [wrappedExchange, setWrappedExchange] = useState<any>();
  const {
    erc20Contract,
    erc721Contract,
    registryContract,
    staticMarketContract,
    exchangeContract,
    accountAddress,
  } = useAccount();

  useEffect(() => {
    if (exchangeContract) {
      setWrappedExchange(wrap(exchangeContract));
    }
  }, [exchangeContract]);

  const listErc721ForErc20 = async (options: ListERC721ForERC20Options) => {
    if (
      !erc721Contract ||
      !erc20Contract ||
      !registryContract ||
      !staticMarketContract ||
      !wrappedExchange ||
      !accountAddress
    )
      return;
    const { tokenId, sellingPrice } = options;

    // register proxy for account a
    await registryContract.registerProxy({ from: accountAddress });

    const proxy1 = await registryContract.proxies(accountAddress);

    // Approve proxy to use all NFTs from account a
    await erc721Contract.setApprovalForAll(proxy1, true, {
      from: accountAddress,
    });

    const web3 = new Web3(window.web3.currentProvider);

    // choose function for account a
    const selectorOne = web3.eth.abi.encodeFunctionSignature(
      "ERC721ForERC20(bytes,address[7],uint8[2],uint256[6],bytes,bytes)"
    );

    // set trading params
    const paramsOne = web3.eth.abi.encodeParameters(
      ["address[2]", "uint256[2]"],
      [
        [erc721Contract.address, erc20Contract.address],
        [tokenId, sellingPrice],
      ]
    );

    // Register order
    const orderOne: Order = {
      registry: registryContract.address,
      maker: accountAddress,
      staticTarget: staticMarketContract.address,
      staticSelector: selectorOne,
      staticExtradata: paramsOne,
      maximumFill: 1,
      listingTime: "0",
      expirationTime: "10000000000",
      salt: "11",
    };

    // Sign order
    const sigOne = await wrappedExchange.sign(orderOne, accountAddress);

    return { orderOne, sigOne };
  };

  const buyErc721ForErc20 = async (options: BuyErc721ForErc20Options) => {
    if (
      !erc721Contract ||
      !erc20Contract ||
      !registryContract ||
      !staticMarketContract ||
      !wrappedExchange ||
      !accountAddress
    )
      return;

    const { tokenId, buyingPrice } = options;

    // register proxy for account b
    await registryContract.registerProxy({ from: accountAddress });

    const proxy2 = await registryContract.proxies(accountAddress);

    // Approve proxy to spend erc20 tokens
    await erc20Contract.approve(proxy2, buyingPrice, {
      from: accountAddress,
    });

    const web3 = new Web3(window.web3.currentProvider);

    // choose function for account b
    const selectorTwo = web3.eth.abi.encodeFunctionSignature(
      "ERC20ForERC721(bytes,address[7],uint8[2],uint256[6],bytes,bytes)"
    );

    // set trading params
    const paramsTwo = web3.eth.abi.encodeParameters(
      ["address[2]", "uint256[2]"],
      [
        [erc20Contract.address, erc721Contract.address],
        [tokenId, buyingPrice],
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
      salt: "12",
    };

    // Sign order
    const sigTwo = await wrappedExchange.sign(orderTwo, accountAddress);

    return { orderTwo, sigTwo };
  };

  const executeErc721ForErc20 = async (
    options: ExecuteErc721ForErc20Options
  ) => {
    if (
      !erc721Contract ||
      !erc20Contract ||
      !registryContract ||
      !staticMarketContract ||
      !wrappedExchange
    )
      return;

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

    const web3 = new Web3(window.web3.currentProvider);

    const erc721c = new web3.eth.Contract(
      blockchainAbis.frontAbi as any,
      erc721Contract.address
    );
    const erc20c = new web3.eth.Contract(
      blockchainAbis.tierXAbi as any,
      erc20Contract.address
    );

    // transfer tokens (can be done after the list matches)
    const firstData = erc721c.methods
      .transferFrom(account_a, account_b, tokenId)
      .encodeABI();
    const secondData = erc20c.methods
      .transferFrom(account_b, account_a, buyingPrice)
      .encodeABI();

    // assign calls
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

    // exchange happening (can be triggered by another account)
    await wrappedExchange.atomicMatchWith(
      orderOne,
      sigOne,
      firstCall,
      orderTwo,
      sigTwo,
      secondCall,
      ZERO_BYTES32,
      { from: accountAddress }
    );
  };

  return {
    listErc721ForErc20,
    buyErc721ForErc20,
    executeErc721ForErc20,
  };
};
