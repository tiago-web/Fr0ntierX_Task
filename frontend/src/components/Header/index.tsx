import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import ConnectWallet from "../ConnectWallet";

import "./styles.css";

const Header: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState("");
  const location = useLocation();

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

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
