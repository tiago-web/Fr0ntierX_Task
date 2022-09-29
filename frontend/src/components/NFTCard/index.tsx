import { useCallback, useEffect, useState } from "react";

import { IMetadata } from "../../pages/Marketplace";

import BuyNFTModal from "../BuyNFTModal";
import ListNFTModal from "../ListNFTModal";

import { useAccount } from "../../contexts/AccountContext";
import { useChain } from "../../hooks/useChain";
import { OrderProps, SignatureProps } from "../../hooks/useMarket";

import "./styles.css";

export interface NFTProps extends IMetadata {
  tokenId: string;
  price?: number;
  orderOne?: OrderProps;
  sigOne?: SignatureProps;
  sellerAddress?: string;
  isListed?: boolean;
}

interface NFTCardProps {
  nft: NFTProps;
  showBuyBtn?: boolean;
  showListBtn?: boolean;
  loadListedNFTs?: () => Promise<void>;
  loadMyNFTs?: () => Promise<void>;
}

const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  showBuyBtn = false,
  showListBtn = false,
  loadListedNFTs,
  loadMyNFTs,
}) => {
  const [nftOwner, setNftOwner] = useState("");
  const [showBuyNFTModal, setShowBuyNFTModal] = useState(false);
  const [showListNFTModal, setShowListNFTModal] = useState(false);
  const { erc721Contract, accountAddress } = useAccount();
  const { watchPurchase } = useChain();

  const loadOwner = useCallback(async () => {
    if (!erc721Contract || nft.tokenId === undefined) return;

    const owner = await erc721Contract?.ownerOf(nft.tokenId);

    setNftOwner(owner);
  }, [erc721Contract, nft]);

  useEffect(() => {
    loadOwner();
  }, [loadOwner]);

  return (
    <div className="nft-card">
      <div className="img-hover-zoom">
        <img alt={nft.name} src={nft.image} />
      </div>
      <div className="nft-card-info">
        <p className="nft-name">{nft.name}</p>
        <p className="nft-description">{nft.description}</p>

        {showBuyBtn &&
          (nftOwner === accountAddress ? (
            <p className="nft-owner">
              <strong>Owner:</strong> You
            </p>
          ) : (
            <>
              <p className="nft-owner">
                <strong>Owner:</strong>{" "}
                {nftOwner.slice(0, 5) +
                  "..." +
                  nftOwner.slice(nftOwner.length - 4, nftOwner.length)}
              </p>
              <button
                onClick={() => {
                  setShowBuyNFTModal(true);
                }}
              >
                Buy NFT ({nft?.price} FRT)
              </button>
            </>
          ))}

        {showListBtn &&
          (!nft?.isListed ? (
            <button
              onClick={() => {
                setShowListNFTModal(true);
              }}
            >
              List NFT
            </button>
          ) : (
            <p className="alert-nft-on-mrk">
              This NFT is being listed on the Marketplace!
            </p>
          ))}
      </div>

      <BuyNFTModal
        nft={nft}
        open={showBuyNFTModal}
        onRefreshAndClose={async () => {
          if (loadListedNFTs) {
            await watchPurchase();
            loadListedNFTs();
          }
          setShowBuyNFTModal(false);
        }}
        onClose={async () => {
          setShowBuyNFTModal(false);
        }}
      />
      <ListNFTModal
        nft={nft}
        open={showListNFTModal}
        onClose={() => {
          if (loadMyNFTs) {
            loadMyNFTs();
          }
          setShowListNFTModal(false);
        }}
      />
    </div>
  );
};

export default NFTCard;
