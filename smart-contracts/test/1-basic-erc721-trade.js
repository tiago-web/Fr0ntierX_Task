/* global artifacts:false, it:false, contract:false, assert:false */

const WyvernExchange = artifacts.require("WyvernExchange");
const StaticMarket = artifacts.require("StaticMarket");
const WyvernRegistry = artifacts.require("WyvernRegistry");
const TierX = artifacts.require("TierX");
const Front = artifacts.require("Front");

const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(provider);

const { wrap, ZERO_BYTES32, CHAIN_ID } = require("./util");

contract("WyvernExchange", (accounts) => {
  let registry;
  let wrappedExchange;
  let statici;
  let erc721;
  let erc20;

  const deploy_core_contracts = async () => {
    registry = await WyvernRegistry.new();

    const exchange = await WyvernExchange.new(
      CHAIN_ID,
      [registry.address],
      "0x"
    );
    statici = await StaticMarket.new();

    await registry.grantInitialAuthentication(exchange.address);

    wrappedExchange = wrap(exchange);
  };

  const deploy = async () => {
    erc721 = await Front.new();
    erc20 = await TierX.new();
  };

  const list_erc721_for_erc20 = async (options) => {
    const { tokenId, mintQuantity, sellingPrice, account_a } = options;

    // Mint a NFT to account a
    await erc721.mint(mintQuantity, { from: account_a });

    // register proxy for account a
    await registry.registerProxy({ from: account_a });

    const proxy1 = await registry.proxies(account_a);

    // Approve proxy to use all NFTs from account a
    await erc721.setApprovalForAll(proxy1, true, { from: account_a });

    // choose function for account a
    const selectorOne = web3.eth.abi.encodeFunctionSignature(
      "ERC721ForERC20(bytes,address[7],uint8[2],uint256[6],bytes,bytes)"
    );

    // set trading params
    const paramsOne = web3.eth.abi.encodeParameters(
      ["address[2]", "uint256[2]"],
      [
        [erc721.address, erc20.address],
        [tokenId, sellingPrice],
      ]
    );

    // Register order
    const orderOne = {
      registry: registry.address,
      maker: account_a,
      staticTarget: statici.address,
      staticSelector: selectorOne,
      staticExtradata: paramsOne,
      maximumFill: 1,
      listingTime: "0",
      expirationTime: "10000000000",
      salt: "11",
    };

    // Sign order
    const sigOne = await wrappedExchange.sign(orderOne, account_a);

    return { orderOne, sigOne };
  };

  const buy_erc721_for_erc20 = async (options) => {
    const { tokenId, buyingPrice, erc20MintAmount, account_a, account_b } =
      options;

    // Approve mint tokens to account b
    // await erc20.mint(account_b, erc20MintAmount);

    await erc20.transfer(account_b, erc20MintAmount, { from: account_a });

    // register proxy for account b
    await registry.registerProxy({ from: account_b });

    const proxy2 = await registry.proxies(account_b);

    // Approve proxy to spend erc20 tokens
    await erc20.approve(proxy2, erc20MintAmount, { from: account_b });

    // choose function for account b
    const selectorTwo = web3.eth.abi.encodeFunctionSignature(
      "ERC20ForERC721(bytes,address[7],uint8[2],uint256[6],bytes,bytes)"
    );

    // set trading params
    const paramsTwo = web3.eth.abi.encodeParameters(
      ["address[2]", "uint256[2]"],
      [
        [erc20.address, erc721.address],
        [tokenId, buyingPrice],
      ]
    );

    // Register second order
    const orderTwo = {
      registry: registry.address,
      maker: account_b,
      staticTarget: statici.address,
      staticSelector: selectorTwo,
      staticExtradata: paramsTwo,
      maximumFill: 1,
      listingTime: "0",
      expirationTime: "10000000000",
      salt: "12",
    };

    // Sign order
    const sigTwo = await wrappedExchange.sign(orderTwo, account_b);

    return { orderTwo, sigTwo };
  };

  const execute_erc721_for_erc20 = async (options) => {
    const {
      tokenId,
      buyingPrice,
      account_a,
      account_b,
      sender,
      orderOne,
      sigOne,
      orderTwo,
      sigTwo,
    } = options;

    const erc721c = new web3.eth.Contract(erc721.abi, erc721.address);
    const erc20c = new web3.eth.Contract(erc20.abi, erc20.address);

    // transfer tokens (can be done after the list matches)
    const firstData = erc721c.methods
      .transferFrom(account_a, account_b, tokenId)
      .encodeABI();
    const secondData = erc20c.methods
      .transferFrom(account_b, account_a, buyingPrice)
      .encodeABI();

    // assign calls
    const firstCall = { target: erc721.address, howToCall: 0, data: firstData };
    const secondCall = {
      target: erc20.address,
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
      { from: sender || account_a }
    );
  };

  it("StaticMarket: matches erc721 <> erc20 order", async () => {
    const data = {
      tokenId: 0,
      mintQuantity: 1,
      sellingPrice: 15000,
      account_a: accounts[0],
      buyingPrice: 15000,
      erc20MintAmount: 15000,
      account_b: accounts[6],
      sender: accounts[1],
    };

    await deploy_core_contracts();
    await deploy();

    const { orderOne, sigOne } = await list_erc721_for_erc20({
      tokenId: data.tokenId,
      mintQuantity: data.mintQuantity,
      sellingPrice: data.sellingPrice,
      account_a: data.account_a,
    });

    const { orderTwo, sigTwo } = await buy_erc721_for_erc20({
      tokenId: data.tokenId,
      buyingPrice: data.buyingPrice,
      erc20MintAmount: data.erc20MintAmount,
      account_a: data.account_a,
      account_b: data.account_b,
    });

    await execute_erc721_for_erc20({
      tokenId: data.tokenId,
      buyingPrice: data.buyingPrice,
      account_a: data.account_a,
      account_b: data.account_b,
      orderOne,
      sigOne,
      orderTwo,
      sigTwo,
      sellingPrice: data.sellingPrice,
      sender: data.sender,
    });

    // Assertions
    // const [account_a_erc20_balance, token_owner] = await Promise.all([
    //   erc20.balanceOf(data.account_a),
    //   erc721.ownerOf(data.tokenId),
    // ]);
    // assert.equal(
    //   account_a_erc20_balance.toString(),
    //   String(data.sellingPrice),
    //   "Incorrect ERC20 balance"
    // );
    // assert.equal(token_owner, data.account_b, "Incorrect token owner");
  });
});
