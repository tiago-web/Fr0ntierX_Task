import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

import { IMetadata } from "../../pages/Marketplace";

import Modal from "../Modal";

import { useAccount } from "../../contexts/AccountContext";
import { useChain } from "../../hooks/useChain";

import { toastError, toastSuccess } from "../../utils/errorHandlers";
import { pinFileToIPFS, pinJSONToIPFS } from "../../utils/pinata";

import "./styles.css";

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
  const [pinNftToIpfsLoading, setPinNftToIpfsLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [nfts, setNfts] = useState<IMetadata[]>([] as IMetadata[]);
  const [loading, setLoading] = useState(false);
  const { erc721Contract } = useAccount();
  const { watchNFTMinting } = useChain();

  const clearState = useCallback(() => {
    setImage(undefined);
    setName("");
    setImgPreview("");
    setDescription("");
    setQuantity(0);
    setNfts([]);
  }, []);

  useEffect(() => {
    if (open) {
      setShowMintForm(false);
    }

    clearState();
  }, [open, clearState]);

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
    setPinNftToIpfsLoading(true);
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
    setPinNftToIpfsLoading(false);
  }, [validateAndAppendNft]);

  const mintNFTs = useCallback(
    async (metadataList: IMetadata[]) => {
      if (!erc721Contract || metadataList.length > 5) return;

      try {
        const ipfsHashes = await pinJSONToIPFS(metadataList);

        if (ipfsHashes.length) {
          await erc721Contract.mint(metadataList.length, ipfsHashes);
          await watchNFTMinting();
        }

        toastSuccess("NFT(s) minted successfully");

        /* Sets a timeout before closing in order to give time for the server 
        to compute the newly minted NFT(s) */
        setTimeout(() => {
          onClose();
          clearState();
        }, 2000);
      } catch (err) {
        toastError(err);
      }
    },
    [erc721Contract, nfts, clearState, watchNFTMinting]
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
    <Modal
      open={open}
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      {loading ? (
        <>
          <h2>Creating NFT(s)...</h2>
          <CircularProgress
            size="3rem"
            sx={{
              color: "#005e2a",
              marginTop: "1.5rem",
            }}
          />
        </>
      ) : (
        <>
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
                  <button
                    type="button"
                    disabled={pinNftToIpfsLoading}
                    onClick={handleNextNFT}
                  >
                    {pinNftToIpfsLoading ? "Saving NFT..." : "Next NFT"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setLoading(true);

                        const updatedNfts = await validateAndAppendNft();

                        await mintNFTs(updatedNfts);
                      } catch (err) {
                        toastError(err);
                        setLoading(false);
                      }
                    }}
                  >
                    Create Free NFT(s)
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
        </>
      )}
    </Modal>
  );
};

export default MintNFTsModal;
