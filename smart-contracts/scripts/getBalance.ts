import { ethers } from "hardhat";
import { TierX } from "../typechain-types";
import "dotenv/config";

// Usage: yarn hardhat run ./scripts/getBalance.ts --network localhost
async function main() {
  const ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const erc20Contract = (await ethers.getContract("TierX")) as TierX;

  const tokenBalance = await erc20Contract.balanceOf(ACCOUNT);
  console.log(`Acc balance: ${tokenBalance.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
