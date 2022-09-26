import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./pages/App";
import Marketplace from "./pages/Marketplace";
import MyNFTs from "./pages/MyNFTs";
import MintNFT from "./pages/MintNFT";
import ListNFT from "./pages/ListNFT";
import BuyNFT from "./pages/BuyNFT";
import FrontFaucet from "./pages/FrontFaucet";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/my-nfts" element={<MyNFTs />} />
          <Route path="/mint-nft" element={<MintNFT />} />
          <Route path="/list-nft" element={<ListNFT />} />
          <Route path="/buy-nft" element={<BuyNFT />} />
          <Route path="/front-faucet" element={<FrontFaucet />} />
        </Routes>
      </App>
    </Router>
  </StrictMode>
);
