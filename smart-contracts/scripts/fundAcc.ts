import { ethers } from "hardhat";
import "dotenv/config";
import { TierX } from "../typechain-types";

// Usage: yarn hardhat run ./scripts/fundAcc.ts --network localhost
async function main() {
  const ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const TRX_AMOUNT = `21600.00`;

  const erc20Contract = (await ethers.getContract("TierX")) as TierX;

  console.info("funding account >>>", ACCOUNT);

  await erc20Contract.transfer(ACCOUNT, ethers.utils.parseEther(TRX_AMOUNT));
  console.log("Account funded with TRX tokens");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
