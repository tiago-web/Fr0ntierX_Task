import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "../../contexts/AccountContext";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "./styles.css";
import ConnectWallet from "../ConnectWallet";

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
        {/* <Link
          to="/list-nft"
          className={activeRoute === "/list-nft" ? "active" : ""}
        >
          List NFT
        </Link> */}
        {/* <Link
          to="/buy-nft"
          className={activeRoute === "/buy-nft" ? "active" : ""}
        >
          Buy NFT
        </Link> */}
        <Link
          to="/frt-faucet"
          className={activeRoute === "/frt-faucet" ? "active" : ""}
        >
          FRT (ERC20) Faucet
        </Link>
      </div>

      <ConnectWallet />
    </div>
  );
};

export default Header;
