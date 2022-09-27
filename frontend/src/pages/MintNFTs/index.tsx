import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "../../contexts/AccountContext";
import { toastError } from "../../utils/errorHandlers";
import { pinFileToIPFS, pinJSONToIPFS } from "../../utils/pinata";
import "./styles.css";

export interface IMetadata {
  image: string;
  description: string;
  name: string;
}

const MintNFTs: React.FC = () => {
  const [imgPreview, setImgPreview] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [nfts, setNfts] = useState<IMetadata[]>([] as IMetadata[]);
  const { erc721Contract } = useAccount();

  const validateAndAppendNft = useCallback(async () => {
    console.log({ image, description, name, nfts });

    if (!image || name.trim() === "" || description.trim() === "") {
      throw new Error(
        "Please make sure all fields are completed before minting."
      );
    }

    const imageUrl = await pinFileToIPFS(image);

    const updatedNfts = [...nfts, { image: imageUrl, description, name }];
    setNfts(updatedNfts);

    return updatedNfts;
  }, [image, description, name, nfts]);

  const handleNextNFT = useCallback(() => {
    try {
      validateAndAppendNft();

      setImage(undefined);
      setImgPreview("");
      setDescription("");
      setName("");
      setQuantity((prevValue) => prevValue - 1);
    } catch (err) {
      toastError(err);
    }
  }, [validateAndAppendNft]);

  const mintNFTs = useCallback(
    async (metadataList: IMetadata[]) => {
      console.log({ metadataList });

      if (!erc721Contract || metadataList.length > 5) return;

      const ipfsHashes = await pinJSONToIPFS(metadataList);

      console.log("ipfsHashes", ipfsHashes);

      if (ipfsHashes.length) {
        const tx = await erc721Contract.mint(metadataList.length, ipfsHashes);
        await tx.wait(1);
      }

      setImage(undefined);
      setName("");
      setImgPreview("");
      setDescription("");
      setQuantity(0);
      setNfts([]);
    },
    [erc721Contract, nfts]
  );

  return (
    <div>
      <h1>Mint NFTs</h1>

      {quantity > 0 ? (
        <>
          <p className="img-preview-text">Image Preview: </p>
          <img
            src={imgPreview ? imgPreview : undefined}
            alt=""
            className="nft-image"
          />

          <form className="mint-form-container">
            {/* <label htmlFor="name">Image URL: </label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e: any) => setImage(e.target.value)}
            /> */}

            <label htmlFor="image">Image File: </label>
            <input
              id="image"
              type="file"
              onChange={(e: any) => {
                setImgPreview(URL.createObjectURL(e.target.files[0]));
                setImage(e.target.files[0]);
              }}
            />

            <label htmlFor="name">Name: </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />

            <label htmlFor="description">Description: </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
            />

            {quantity > 1 ? (
              <button type="button" onClick={handleNextNFT}>
                Next NFT
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const updatedNfts = await validateAndAppendNft();

                    await mintNFTs(updatedNfts);
                  } catch (err) {
                    toastError(err);
                  }
                }}
              >
                Create Free NFT(s)
              </button>
            )}
          </form>
        </>
      ) : (
        <form
          className="mint-form-container"
          onSubmit={(e: any) => {
            e.preventDefault();
            setQuantity(Number(e.target.quantity.value));
          }}
        >
          <p>
            How many NFTs would you like to mint at once?{" "}
            <strong>(MAX: 5)</strong>
          </p>
          <input id="quantity" type="text" />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default MintNFTs;
