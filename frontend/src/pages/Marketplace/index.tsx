import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

import { useAccount } from "../../contexts/AccountContext";
import NFTCard from "../../components/NFTCard";
import ConnectWallet from "../../components/ConnectWallet";
import { api } from "../../api";
import { toastError } from "../../utils/errorHandlers";

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
}

type ListedNftsProps = IMetadata & Omit<FindListingsResponse, "tokenURI">;

const Marketplace: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listedNfts, setListedNfts] = useState<ListedNftsProps[]>([]);
  const { accountAddress } = useAccount();

  const loadMyNFTs = useCallback(async () => {
    if (!accountAddress) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: listings } = await api.post<FindListingsResponse[]>(
        "market/find-listings"
      );

      const availableNfts: ListedNftsProps[] = [];

      // todo: remove mock
      // availableNfts.push(
      //   {
      //     image:
      //       "https://post.greatist.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
      //     name: "Dog",
      //     description: "A cute dog",
      //     price: 2,
      //     tokenId: "0",
      //   },
      //   {
      //     image:
      //       "https://post.greatist.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
      //     name: "Dog 2",
      //     description: "A cute dog 2",
      //     price: 20,
      //     tokenId: "1",
      //   }
      // );
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
    loadMyNFTs();
  }, [loadMyNFTs]);

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
        <div className="nfts-container">
          {listedNfts.map((nft) => (
            <NFTCard key={nft.name} nft={nft} showBuyBtn />
          ))}
        </div>
      )}
    </>
  );
};

export default Marketplace;
