import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { CircularProgress } from "@mui/material";

import NFTCard from "../../components/NFTCard";
import ConnectWallet from "../../components/ConnectWallet";

import { useAccount } from "../../contexts/AccountContext";
import { OrderProps, SignatureProps } from "../../hooks/useMarket";

import { toastError } from "../../utils/errorHandlers";
import { api } from "../../api";

import "./styles.css";

export interface IMetadata {
  image: string;
  description: string;
  name: string;
}

interface FindListingsResponse {
  tokenURI: string;
  price: number;
  tokenId: string;
  orderOne: OrderProps;
  sigOne: SignatureProps;
  sellerAddress: string;
}

type ListedNftsProps = IMetadata & Omit<FindListingsResponse, "tokenURI">;

const Marketplace: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listedNfts, setListedNfts] = useState<ListedNftsProps[]>([]);
  const { accountAddress } = useAccount();
  const navigate = useNavigate();

  const loadListedNFTs = useCallback(async () => {
    if (!accountAddress) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: listings } = await api.get<FindListingsResponse[]>(
        "market/find-listings"
      );

      const availableNfts: ListedNftsProps[] = [];

      for (const listing of listings) {
        const requestURL = listing.tokenURI.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        const tokenURIResponse = await axios.get(requestURL);
        const imageURI = tokenURIResponse.data.image;
        const imageURIURL = imageURI.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        availableNfts.push({
          ...listing,
          ...tokenURIResponse.data,
          image: imageURIURL,
        });
      }

      setListedNfts(availableNfts);
    } catch (err) {
      toastError(err);
    }
    setIsLoading(false);
  }, [accountAddress]);

  useEffect(() => {
    loadListedNFTs();
  }, [loadListedNFTs]);

  return (
    <>
      <div className="mynfts-header">
        <h1>NFT Marketplace</h1>
      </div>

      {!accountAddress ? (
        <div className="connect-wallet-wrapper">
          <ConnectWallet />
        </div>
      ) : isLoading ? (
        <CircularProgress
          size="4rem"
          sx={{
            color: "#005e2a",
            position: "absolute",
            left: "45%",
            top: "50%",
          }}
        />
      ) : (
        <>
          {listedNfts.length ? (
            <div className="nfts-container">
              {listedNfts.map((nft) => (
                <NFTCard
                  key={nft.name}
                  nft={nft}
                  showBuyBtn
                  loadListedNFTs={loadListedNFTs}
                />
              ))}
            </div>
          ) : (
            <div className="no-nfts-container">
              <p>
                There are no NFTs being listed on the market at the moment. Be
                the first to list yours!
              </p>
              <button
                onClick={() => {
                  navigate("/my-nfts");
                }}
              >
                List My NFTs
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Marketplace;
