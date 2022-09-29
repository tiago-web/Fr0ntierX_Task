import { useCallback } from "react";
import { ethers } from "ethers";

import { useAccount } from "../contexts/AccountContext";
import promiseWithTimeout from "../utils/promiseWithTimeout";

interface UseChainProps {
  watchNFTMinting: () => Promise<void>;
  watchPurchase: () => Promise<void>;
}
const TOLERANCE_BLOCK_NUMBER = 10;

export const useChain = (): UseChainProps => {
  const { erc721Contract, accountAddress } = useAccount();

  const watchNFTMinting = useCallback(async () => {
    if (!erc721Contract) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const startBlockNumber =
      (await provider.getBlockNumber()) - TOLERANCE_BLOCK_NUMBER;

    let transactionHash;

    const eventWatcher = new Promise((resolve) => {
      erc721Contract.on(
        "NFTMinted",
        (requester, quantity, lastTokenId, event) => {
          if (event.blockNumber <= startBlockNumber) return;

          transactionHash = event.transactionHash;

          if (requester === accountAddress) {
            resolve(lastTokenId);
          }
        }
      );
    });
    await promiseWithTimeout(
      150000,
      eventWatcher,
      "Mint NFT timeout, please refresh the page to check if your NFT(s) is already there!"
    );

    erc721Contract.off(
      "NFTMinted",
      (requester, quantity, lastTokenId, event) => {
        if (event.blockNumber <= startBlockNumber) return;

        transactionHash = event.transactionHash;
      }
    );

    const transaction = await provider.getTransaction(transactionHash);
    await transaction.wait();
  }, [erc721Contract, accountAddress]);

  const watchPurchase = useCallback(async () => {
    if (!erc721Contract) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const startBlockNumber =
      (await provider.getBlockNumber()) - TOLERANCE_BLOCK_NUMBER;

    let transactionHash;

    const eventWatcher = new Promise((resolve) => {
      erc721Contract.on("Transfer", (from, to, _tokenId, event) => {
        if (event.blockNumber <= startBlockNumber) return;

        transactionHash = event.transactionHash;

        if (to === accountAddress) {
          resolve(_tokenId);
        }
      });
    });
    await promiseWithTimeout(
      150000,
      eventWatcher,
      "Purchase NFT timeout, please go to My NFTs page to check if your NFT is already there!"
    );

    erc721Contract.off("Transfer", (from, to, _tokenId, event) => {
      if (event.blockNumber <= startBlockNumber) return;

      transactionHash = event.transactionHash;
    });

    const transaction = await provider.getTransaction(transactionHash);
    await transaction.wait();
  }, [erc721Contract, accountAddress]);

  return { watchNFTMinting, watchPurchase };
};
