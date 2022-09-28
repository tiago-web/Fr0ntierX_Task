import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAccount } from "../../contexts/AccountContext";
import MintNFTsModal, { IMetadata } from "../../components/MintNFTsModal";
import "./styles.css";
import { toastError } from "../../utils/errorHandlers";
import { CircularProgress } from "@mui/material";
import NFTCard from "../../components/NFTCard";
import { api } from "../../api";

const MyNFTs: React.FC = () => {
  const [showMintNFTsModal, setShowMintNFTsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myNfts, setMyNfts] = useState<IMetadata[]>([]);
  const { accountAddress } = useAccount();

  const loadMyNFTs = useCallback(async () => {
    if (!accountAddress) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: tokenURIs } = await api.get(
        "market/find-user-nfts/accountAddress"
      );
      const nftsMetadata: IMetadata[] = [];

      // todo: remove mock
      nftsMetadata.push(
        {
          image:
            "https://post.greatist.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
          name: "Dog",
          description: "A cute dog",
        },
        {
          image:
            "https://post.greatist.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
          name: "Dog 2",
          description: "A cute dog 2",
        }
      );
      // for (const tokenURI of tokenURIs) {

      // const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      // const tokenURIResponse = await axios.get(requestURL);
      // const imageURI = tokenURIResponse.data.image;
      // const imageURIURL = imageURI.replace(
      //   "ipfs://",
      //   "https://ipfs.io/ipfs/"
      // );
      // nftsMetadata.push({ ...tokenURIResponse.data, image: imageURIURL });
      // }
      console.log({ nftsMetadata });

      setMyNfts(nftsMetadata);
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
      <div className="mynfts-herader">
        <h1>My NFTs</h1>
        <button
          type="button"
          onClick={() => {
            setShowMintNFTsModal(true);
          }}
        >
          Mint NFTs
        </button>
      </div>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {myNfts.map((nft) => (
            <NFTCard
              key={nft.name}
              name={nft.name}
              image={nft.image}
              description={nft.description}
            />
          ))}
        </>
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
