import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAccount } from "../../contexts/AccountContext";
import MintNFTsModal from "../../components/MintNFTsModal";
import "./styles.css";
import { toastError } from "../../utils/errorHandlers";
import { CircularProgress } from "@mui/material";
import NFTCard from "../../components/NFTCard";
import { api } from "../../api";
import { IMetadata } from "../Marketplace";
import ConnectWallet from "../../components/ConnectWallet";
import { BigNumber } from "ethers";

interface FindUserNFTsResponse {
  tokenId: BigNumber;
  tokenURI: string;
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

      // todo: remove mock
      // myTokens.push(
      //   {
      //     image:
      //       "https://post.greatist.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
      //     name: "Dog",
      //     description: "A cute dog",
      //     tokenId: "0",
      //   },
      //   {
      //     image:
      //       "https://post.greatist.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
      //     name: "Dog 2",
      //     description: "A cute dog 2",
      //     tokenId: "1",
      //   }
      // );
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
            Mint NFTs
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
        <div className="nfts-container">
          {myNfts.map((nft) => (
            <NFTCard key={nft.name} nft={nft} showListBtn />
          ))}
        </div>
      )}

      <MintNFTsModal
        open={showMintNFTsModal}
        onClose={async () => {
          setShowMintNFTsModal(false);
          await loadMyNFTs();
        }}
      />
    </>
  );
};

export default MyNFTs;
