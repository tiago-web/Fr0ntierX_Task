import { ethers } from "hardhat";
import "dotenv/config";
import { Front } from "../typechain-types";

// Usage: yarn hardhat run ./scripts/mintERC20Token.ts --network localhost
async function main() {
  const ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const erc721aContract = (await ethers.getContract("Front")) as Front;

  console.info("erc721aContractAddress >>>", erc721aContract.address);
  console.info("minting two Front NFTs to >>>", ACCOUNT);

  const tx = await erc721aContract.mint(2);
  await tx.wait(1);

  const nftOwner = await erc721aContract.ownerOf(0);
  const nftOwner2 = await erc721aContract.ownerOf(1);

  console.log({ nftOwner, nftOwner2 });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
