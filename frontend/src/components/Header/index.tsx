import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "../../contexts/AccountContext";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "./styles.css";

const Header: React.FC = () => {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const { accountAddress, connectWallet, disconnectWallet } = useAccount();
  const [activeRoute, setActiveRoute] = useState("");
  const location = useLocation();

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    console.log("activeRoute", activeRoute);
  }, [activeRoute]);

  return (
    <div className="header-container">
      <div className="logo">
        <Link to="/">NFT Marketplace</Link>
      </div>
      <div className="links">
        <Link
          to="/my-nfts"
          className={activeRoute === "/my-nfts" ? "active" : ""}
        >
          My NFTs
        </Link>
        <Link
          to="/mint-nft"
          className={activeRoute === "/mint-nft" ? "active" : ""}
        >
          Mint NFT
        </Link>
        <Link
          to="/list-nft"
          className={activeRoute === "/list-nft" ? "active" : ""}
        >
          List NFT
        </Link>
        <Link
          to="/buy-nft"
          className={activeRoute === "/buy-nft" ? "active" : ""}
        >
          Buy NFT
        </Link>
        <Link
          to="/front-faucet"
          className={activeRoute === "/front-faucet" ? "active" : ""}
        >
          FRT Faucet
        </Link>
      </div>

      {!accountAddress ? (
        <button
          className="connect-wallet"
          onClick={async () => {
            await connectWallet();
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <button
          className="connect-wallet"
          onClick={() => {
            setShowDisconnectModal(true);
          }}
        >
          {accountAddress.slice(0, 5) +
            "..." +
            accountAddress.slice(
              accountAddress.length - 4,
              accountAddress.length
            )}
        </button>
      )}

      <Modal
        open={showDisconnectModal}
        onClose={() => {
          setShowDisconnectModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "#000",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: 10,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>
            <strong>Connected Wallet:</strong> {accountAddress}
          </p>
          <button
            className="disconnect-wallet"
            onClick={() => {
              disconnectWallet();
              setShowDisconnectModal(false);
            }}
          >
            Disconnect Wallet
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default Header;
