import React, { useCallback, useState } from "react";

import { NFTProps } from "../NFTCard";
import Modal from "../Modal";

import { useMarket } from "../../hooks/useMarket";
import { useAccount } from "../../contexts/AccountContext";

import { toastError, toastSuccess } from "../../utils/errorHandlers";

import "./styles.css";

interface BuyNFTModal {
  nft: NFTProps;
  open: boolean;
  onRefreshAndClose: () => Promise<void>;
  onClose: () => void;
}

const BuyNFTModal: React.FC<BuyNFTModal> = ({
  nft,
  open,
  onClose,
  onRefreshAndClose,
}) => {
  const [loading, setLoading] = useState(false);
  const { buyErc721ForErc20, executeErc721ForErc20 } = useMarket();
  const { accountAddress } = useAccount();

  const handleBuyNFT = useCallback(async () => {
    if (
      !accountAddress ||
      !nft.price ||
      !nft.sellerAddress ||
      !nft.orderOne ||
      !nft.sigOne
    )
      return;

    setLoading(true);
    try {
      const contractResponse = await buyErc721ForErc20({
        tokenId: Number(nft.tokenId),
        buyingPrice: nft.price,
      });
      if (!contractResponse?.orderTwo || !contractResponse?.sigTwo) {
        throw new Error("Buying error. Contract didn't respond");
      }

      await executeErc721ForErc20({
        tokenId: Number(nft.tokenId),
        buyingPrice: nft.price,
        sellerAddress: nft.sellerAddress,
        buyerAddress: accountAddress,
        orderOne: nft.orderOne,
        sigOne: nft.sigOne,
        orderTwo: contractResponse?.orderTwo,
        sigTwo: contractResponse?.sigTwo,
      });

      await onRefreshAndClose();

      toastSuccess("NFT purchased successfully");
    } catch (err) {
      toastError(err);
      onClose();
    }
    setLoading(false);
  }, [buyErc721ForErc20, executeErc721ForErc20, accountAddress]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="buy-nft-container">
        <img src={nft.image} alt={nft.name} />
        <p>
          <strong>NFT Name:</strong> {nft.name}
        </p>
        <button type="button" disabled={loading} onClick={handleBuyNFT}>
          {loading ? "Buying NFT..." : `Buy NFT (${nft.price} FRT)`}
        </button>
      </div>
    </Modal>
  );
};

export default BuyNFTModal;
