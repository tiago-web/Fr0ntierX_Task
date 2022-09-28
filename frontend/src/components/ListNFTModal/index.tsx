import React, { useCallback, useState } from "react";

import Modal from "../Modal";
import { useMarket } from "../../hooks/useMarket";

import "./styles.css";
import { NFTProps } from "../NFTCard";
import { toastError } from "../../utils/errorHandlers";
import { api } from "../../api";
import { useAccount } from "../../contexts/AccountContext";

interface ListNFTModal {
  nft: NFTProps;
  open: boolean;
  onClose: () => void;
}

const ListNFTModal: React.FC<ListNFTModal> = ({ nft, open, onClose }) => {
  const [sellingPrice, setSellingPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const { listErc721ForErc20 } = useMarket();
  const { accountAddress } = useAccount();

  const handleListNFT = useCallback(async () => {
    if (!nft?.tokenId || !accountAddress) return;

    if (!sellingPrice) {
      toastError("Please select a selling price");
      return;
    }

    try {
      setLoading(true);

      const contractResponse = await listErc721ForErc20({
        tokenId: Number(nft.tokenId),
        sellingPrice: Number(sellingPrice),
      });

      if (!contractResponse?.orderOne || !contractResponse?.sigOne) {
        throw new Error("Listing error. Contract didn't respond");
      }

      await api.post("market/create-listing", {
        tokenId: Number(nft.tokenId),
        price: Number(sellingPrice),
        order: contractResponse?.orderOne,
        signature: contractResponse?.sigOne,
        userAddress: accountAddress,
      });

      onClose();
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  }, [listErc721ForErc20, sellingPrice, accountAddress]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="list-nft-modal">
        <label htmlFor="price">Selling price: </label>
        <div className="input-wrapper">
          <input
            id="price"
            type="text"
            value={sellingPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
                setSellingPrice(e.target.value);
              }
            }}
          />
          <strong>FRTs</strong>
        </div>

        <button type="button" disabled={loading} onClick={handleListNFT}>
          {loading ? "Listing NFT..." : "List NFT"}
        </button>
      </div>
    </Modal>
  );
};

export default ListNFTModal;
