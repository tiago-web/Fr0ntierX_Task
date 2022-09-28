import { useState } from "react";
import { IMetadata } from "../../pages/Marketplace";
import BuyNFTModal from "../BuyNFTModal";
import ListNFTModal from "../ListNFTModal";
import "./styles.css";

export interface NFTProps extends IMetadata {
  price?: number;
  tokenId?: string;
}

interface NFTCardProps {
  nft: NFTProps;
  showBuyBtn?: boolean;
  showListBtn?: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  showBuyBtn = false,
  showListBtn = false,
}) => {
  const [showBuyNFTModal, setShowBuyNFTModal] = useState(false);
  const [showListNFTModal, setShowListNFTModal] = useState(false);

  return (
    <div className="nft-card">
      <div className="img-hover-zoom">
        <img alt={nft.name} src={nft.image} />
      </div>
      <div className="nft-card-info">
        <p className="nft-name">{nft.name}</p>
        <p className="nft-description">{nft.description}</p>
        {showBuyBtn && (
          <button
            onClick={() => {
              setShowBuyNFTModal(true);
            }}
          >
            Buy NFT ({nft.price} FRT)
          </button>
        )}
        {showListBtn && (
          <button
            onClick={() => {
              setShowListNFTModal(true);
            }}
          >
            List NFT
          </button>
        )}
      </div>

      <BuyNFTModal
        nft={nft}
        open={showBuyNFTModal}
        onClose={() => {
          setShowBuyNFTModal(false);
        }}
      />
      <ListNFTModal
        nft={nft}
        open={showListNFTModal}
        onClose={() => {
          setShowListNFTModal(false);
        }}
      />
    </div>
  );
};

export default NFTCard;
