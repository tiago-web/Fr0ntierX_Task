import axios from "axios";
import { IMetadata } from "../pages/Marketplace";
import { toastError } from "./errorHandlers";

export const pinJSONToIPFS = async (nfts: IMetadata[]): Promise<string[]> => {
  const ipfsHashes = [];

  const pinataApiKey = import.meta.env.VITE_PINATA_KEY;
  const pinataApiSecret = import.meta.env.VITE_PINATA_SECRET;

  try {
    for (const nft of nfts) {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        nft,
        {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataApiSecret,
          },
        }
      );

      ipfsHashes.push(response.data.IpfsHash);
    }
  } catch (err) {
    toastError(err);
  }

  return ipfsHashes;
};

export const pinFileToIPFS = async (fileImg: File): Promise<string> => {
  let imageUrl = "";

  const pinataApiKey = import.meta.env.VITE_PINATA_KEY;
  const pinataApiSecret = import.meta.env.VITE_PINATA_SECRET;

  try {
    const formData = new FormData();
    formData.append("file", fileImg);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataApiSecret,
        "Content-Type": "multipart/form-data",
      },
    });

    imageUrl = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
  } catch (err) {
    toastError(err);
  }

  return imageUrl;
};
