import { ethers } from "hardhat";
import { assert, expect } from "chai";

import TestHelper from "./TestHelper";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const helper = new TestHelper();

describe("ERC721Trade", () => {
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let baseURI: string;

  before(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    alice = accounts[1];
    bob = accounts[2];
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

      // todo: separate logic from list_erc721_for_erc20
      const { orderOne, sigOne } = await helper.list_erc721_for_erc20({
        tokenId: data.tokenId,
        mintQuantity: data.mintQuantity,
        sellingPrice: data.sellingPrice,
        account_a: data.account_a,
      });

      // todo: separate logic from buy_erc721_for_erc20
      const { orderTwo, sigTwo } = await helper.buy_erc721_for_erc20({
        tokenId: data.tokenId,
        buyingPrice: data.buyingPrice,
        erc20MintAmount: data.erc20MintAmount,
        account_a: data.account_a,
        account_b: data.account_b,
      });

      let tokenOwner = await helper.erc721Contract.ownerOf(data.tokenId);
      let sellerBalance = await helper.erc20Contract.balanceOf(
        data.account_a.address,
      );
      let buyerBalance = await helper.erc20Contract.balanceOf(
        data.account_b.address,
      );

      assert.equal(buyerBalance.toString(), "15000");
      assert.equal(sellerBalance.toString(), "1000000000000000000000");

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
      assert.equal(tokenOwner, data.account_b.address);
      assert.equal(sellerBalance.toString(), "1000000000000000015000");
      assert.equal(buyerBalance.toString(), "0");
    });

    it("only owner should be able to update the baseURI", async () => {
      baseURI = "http://test.com/";

      await expect(
        helper.erc721Contract.connect(alice).setBaseURI(baseURI),
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await helper.erc721Contract.connect(deployer).setBaseURI(baseURI);

      await helper.erc721Contract.mint(1, ["hash1"]);
      const tokenURI1 = await helper.erc721Contract.tokenURI(1);
      assert.equal(tokenURI1, "http://test.com/hash1");
    });

    it("should be able to mint FRT (ERC721A) tokens successfully", async () => {
      let aliceBalance = await helper.erc721Contract
        .connect(alice)
        .balanceOf(alice.address);
      assert.equal(aliceBalance.toString(), "1");

      await helper.erc721Contract.connect(alice).mint(2, ["hash2", "hash3"]);

      aliceBalance = await helper.erc721Contract
        .connect(alice)
        .balanceOf(alice.address);
      assert.equal(aliceBalance.toString(), "3");

      const tokenURI2 = await helper.erc721Contract.tokenURI(2);
      const tokenURI3 = await helper.erc721Contract.tokenURI(3);

      assert.equal(tokenURI2, "http://test.com/hash2");
      assert.equal(tokenURI3, "http://test.com/hash3");

      const ownerOf2 = await helper.erc721Contract.ownerOf(2);
      const ownerOf3 = await helper.erc721Contract.ownerOf(3);

      assert.equal(ownerOf2, alice.address);
      assert.equal(ownerOf3, alice.address);
    });

    it("should be able to mint TRX (ERC20) tokens successfully", async () => {
      let aliceBalance = await helper.erc20Contract.balanceOf(alice.address);
      assert.equal(aliceBalance.toString(), "0");

      await helper.erc20Contract
        .connect(alice)
        .mint(ethers.utils.parseEther("200"));

      aliceBalance = await helper.erc20Contract.balanceOf(alice.address);
      assert.equal(
        aliceBalance.toString(),
        ethers.utils.parseEther("200").toString(),
      );
    });

    it("should fail if an invalid quantity is minted", async () => {
      await expect(
        helper.erc721Contract.mint(1, ["hash5", "hash6"]),
      ).to.be.revertedWith("Front__InvalidQuantity()");
      await expect(helper.erc721Contract.mint(4, ["hash5"])).to.be.revertedWith(
        "Front__InvalidQuantity()",
      );
    });

    it("should fail if the minting amount exceeds 5", async () => {
      await expect(
        helper.erc721Contract.mint(6, [
          "hash5",
          "hash6",
          "hash7",
          "hash8",
          "hash9",
          "hash10",
        ]),
      ).to.be.revertedWith("Front__InvalidQuantity()");
    });
  });
});
