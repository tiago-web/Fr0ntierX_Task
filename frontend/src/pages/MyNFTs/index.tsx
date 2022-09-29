import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BigNumber } from "ethers";
import { CircularProgress } from "@mui/material";

import { IMetadata } from "../Marketplace";
import ConnectWallet from "../../components/ConnectWallet";
import MintNFTsModal from "../../components/MintNFTsModal";
import NFTCard from "../../components/NFTCard";

import { useAccount } from "../../contexts/AccountContext";
import { toastError, toastSuccess } from "../../utils/errorHandlers";
import { api } from "../../api";

import "./styles.css";

interface FindUserNFTsResponse {
  tokenId: BigNumber;
  tokenURI: string;
  isListed: boolean;
}

type MyNftsProps = IMetadata &
  Omit<FindUserNFTsResponse, "tokenId" | "tokenURI"> & {
    tokenId: string;
  };

const MyNFTs: React.FC = () => {
  const [showMintNFTsModal, setShowMintNFTsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myNfts, setMyNfts] = useState<MyNftsProps[]>([]);
  const { accountAddress } = useAccount();

  const loadMyNFTs = useCallback(async () => {
    if (!accountAddress) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: tokens } = await api.get<FindUserNFTsResponse[]>(
        `market/find-user-nfts/${accountAddress}`
      );
      const myTokens: MyNftsProps[] = [];

      for (const token of tokens) {
        const requestURL = token.tokenURI.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        const tokenURIResponse = await axios.get(requestURL);
        const imageURI = tokenURIResponse.data.image;
        const imageURIURL = imageURI.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );

        myTokens.push({
          ...tokenURIResponse.data,
          tokenId: String(token.tokenId),
          isListed: token.isListed,
          image: imageURIURL,
        });
      }

      setMyNfts(myTokens);
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
        <h1>My NFTs</h1>
        {accountAddress && (
          <button
            type="button"
            onClick={() => {
              setShowMintNFTsModal(true);
            }}
          >
            Mint NFT(s)
          </button>
        )}
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
          {myNfts.length ? (
            <div className="nfts-container">
              {myNfts.map((nft) => (
                <NFTCard
                  key={nft.name}
                  nft={nft}
                  showListBtn
                  loadMyNFTs={loadMyNFTs}
                />
              ))}
            </div>
          ) : (
            <div className="no-nfts-container">
              <p>
                You don't have any NFTs in your wallet yet. Mint your first one
                first one to get started!
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowMintNFTsModal(true);
                }}
              >
                Mint Free NFTs
              </button>
            </div>
          )}
        </>
      )}

      <MintNFTsModal
        open={showMintNFTsModal}
        onClose={() => {
          setShowMintNFTsModal(false);
          loadMyNFTs();
        }}
      />
    </>
  );
};

export default MyNFTs;
