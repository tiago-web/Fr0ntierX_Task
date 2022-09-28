import React, { useCallback, useState } from "react";
import { useAccount } from "../../contexts/AccountContext";
import { toastError } from "../../utils/errorHandlers";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Modal, Box } from "@mui/material";
import { pinFileToIPFS, pinJSONToIPFS } from "../../utils/pinata";
import "./styles.css";

export interface IMetadata {
  image: string;
  description: string;
  name: string;
}

interface MintNFTsModal {
  open: boolean;
  onClose: () => void;
}

const MintNFTsModal: React.FC<MintNFTsModal> = ({ open, onClose }) => {
  const [imgPreview, setImgPreview] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [showMintForm, setShowMintForm] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [nfts, setNfts] = useState<IMetadata[]>([] as IMetadata[]);
  const [loading, setLoading] = useState(false);
  const { erc721Contract } = useAccount();

  const validateAndAppendNft = useCallback(async () => {
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

  const handleNextNFT = useCallback(async () => {
    try {
      await validateAndAppendNft();

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
      if (!erc721Contract || metadataList.length > 5) return;

      setLoading(true);

      try {
        const ipfsHashes = await pinJSONToIPFS(metadataList);

        if (ipfsHashes.length) {
          const tx = await erc721Contract.mint(metadataList.length, ipfsHashes);
          await tx.wait(3);
        }

        setImage(undefined);
        setName("");
        setImgPreview("");
        setDescription("");
        setQuantity(0);
        setNfts([]);
        onClose();
      } catch (err) {
        toastError(err);
      }

      setLoading(false);
    },
    [erc721Contract, nfts]
  );

  const handleSubmitNFTsAmount = useCallback(() => {
    if (!quantity) {
      toastError("Please enter a quantity number");
      return;
    }
    if (quantity > 5) {
      toastError("Please select a smaller minting amount");
      return;
    }

    setShowMintForm(true);
  }, [quantity]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "relative" as "relative",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "35rem",
          bgcolor: "#fafafa",
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "90vh",
        }}
      >
        <div>
          <AiOutlineCloseCircle
            className="modal-close-icon"
            onClick={onClose}
          />

          <h1>Mint NFTs</h1>

          {showMintForm ? (
            <>
              <p className="img-preview-text">Image Preview: </p>
              {imgPreview ? (
                <img
                  src={imgPreview ? imgPreview : undefined}
                  alt=""
                  className="nft-image"
                />
              ) : (
                <div className="nft-image-box" />
              )}

              <form className="mint-form-container">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />

                <label htmlFor="description">Description: </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDescription(e.target.value)
                  }
                />

                {quantity > 1 ? (
                  <button type="button" onClick={handleNextNFT}>
                    Next NFT
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={async () => {
                      try {
                        const updatedNfts = await validateAndAppendNft();

                        await mintNFTs(updatedNfts);
                      } catch (err) {
                        toastError(err);
                      }
                    }}
                  >
                    {loading ? "Creating NFT(s)..." : "Create Free NFT(s)"}
                  </button>
                )}
              </form>
            </>
          ) : (
            <form className="mint-form-container">
              <p>
                How many NFTs would you like to mint at once?{" "}
                <strong>(MAX: 5)</strong>
              </p>
              <input
                id="quantity"
                type="text"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (
                    e.target.value === "" ||
                    /^[0-9\b]+$/.test(e.target.value)
                  ) {
                    setQuantity(Number(e.target.value));
                  }
                }}
              />
              <button type="button" onClick={handleSubmitNFTsAmount}>
                Submit
              </button>
            </form>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default MintNFTsModal;
