import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "../../contexts/AccountContext";

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
