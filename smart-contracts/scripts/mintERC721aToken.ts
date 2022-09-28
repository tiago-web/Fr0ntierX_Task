import { ethers } from "hardhat";
import { Front } from "../typechain-types";
import "dotenv/config";

// Usage: yarn hardhat run ./scripts/mintERC721aToken.ts --network localhost
async function main() {
  const ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const erc721aContract = (await ethers.getContract("Front")) as Front;

  console.info("erc721aContractAddress >>>", erc721aContract.address);
  console.info("minting two Front NFTs to >>>", ACCOUNT);

  const tx = await erc721aContract.mint(2, [
    "QmZwBKNbMKsYRqY443Kuxoim7oUruvd4Aqqx6DwZeQWFKX",
    "QmZwBKNbMKsYRqY443Kuxoim7oUruvd4Aqqx6DwZeQWFKX",
  ]);
  await tx.wait(1);

  const uri = await erc721aContract.tokenURI(0);

  const nftOwner = await erc721aContract.ownerOf(0);
  const nftOwner2 = await erc721aContract.ownerOf(1);

  console.log({ nftOwner, nftOwner2, uri });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
