import { ethers } from "hardhat";
import { assert } from "chai";

import TestHelper from "./TestHelper";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const helper = new TestHelper();

describe("ERC721Trade", () => {
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;
  let accounts: SignerWithAddress[];

  before(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    alice = accounts[1];
    await helper.init();
  });

  describe("ERC721 and ERC20 trade", () => {
    it("StaticMarket: matches erc721 <> erc20 order", async () => {
      const data = {
        tokenId: 0,
        mintQuantity: 1,
        sellingPrice: 15000,
        account_a: deployer,
        buyingPrice: 15000,
        erc20MintAmount: 15000,
        account_b: alice,
      };

      // todo: separate logic from list_erc20
      const { orderOne, sigOne } = await helper.list_erc721_for_erc20({
        tokenId: data.tokenId,
        mintQuantity: data.mintQuantity,
        sellingPrice: data.sellingPrice,
        account_a: data.account_a,
      });

      let tokenOwner = await helper.erc721Contract.ownerOf(data.tokenId);
      let sellerBalance = await helper.erc20Contract.balanceOf(
        data.account_a.address,
      );
      let buyerBalance = await helper.erc20Contract.balanceOf(
        data.account_b.address,
      );

      assert.equal(tokenOwner, data.account_a.address, "Incorrect token owner");
      assert.equal(sellerBalance.toString(), "100", "Incorrect token owner");
      assert.equal(buyerBalance.toString(), "1000", "Incorrect token owner");

      // todo: separate logic from buy_erc721_for_erc20
      const { orderTwo, sigTwo } = await helper.buy_erc721_for_erc20({
        tokenId: data.tokenId,
        buyingPrice: data.buyingPrice,
        erc20MintAmount: data.erc20MintAmount,
        account_a: data.account_a,
        account_b: data.account_b,
      });

      // todo: separate logic from execute_erc721_for_erc20
      await helper.execute_erc721_for_erc20({
        tokenId: data.tokenId,
        buyingPrice: data.buyingPrice,
        account_a: data.account_a,
        account_b: data.account_b,
        orderOne,
        sigOne,
        orderTwo,
        sigTwo,
        sellingPrice: data.sellingPrice,
      });

      tokenOwner = await helper.erc721Contract.ownerOf(data.tokenId);
      sellerBalance = await helper.erc20Contract.balanceOf(
        data.account_a.address,
      );
      buyerBalance = await helper.erc20Contract.balanceOf(
        data.account_b.address,
      );
      assert.equal(tokenOwner, data.account_b.address, "Incorrect token owner");
      assert.equal(sellerBalance.toString(), "100", "Incorrect token owner");
      assert.equal(buyerBalance.toString(), "1000", "Incorrect token owner");
    });

    // todo: test Front
    // mint(quantity, ipfsHashes)
    // tokenURI(tokenId)
    // setBaseURI(newBaseURI)

    // todo: test TierX
    // mint(quantity)
  });
});
