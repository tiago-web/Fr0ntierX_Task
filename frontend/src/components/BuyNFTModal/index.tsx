import React, { useCallback, useState } from "react";

import Modal from "../Modal";
import { useMarket } from "../../hooks/useMarket";

import "./styles.css";
import { NFTProps } from "../NFTCard";

interface BuyNFTModal {
  nft: NFTProps;
  open: boolean;
  onClose: () => void;
}

const BuyNFTModal: React.FC<BuyNFTModal> = ({ nft, open, onClose }) => {
  const { buyErc721ForErc20 } = useMarket();

  const handleBuyNFT = () => {
    buyErc721ForErc20({ tokenId: 1, buyingPrice: 1 });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <button type="button" onClick={handleBuyNFT}>
        Buy NFT ({nft.price} FRT)
      </button>
    </Modal>
  );
};

export default BuyNFTModal;
