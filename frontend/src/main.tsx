import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./pages/App";
import Marketplace from "./pages/Marketplace";
import MyNFTs from "./pages/MyNFTs";
import FRTFaucet from "./pages/FRTFaucet";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/my-nfts" element={<MyNFTs />} />
          <Route path="/frt-faucet" element={<FRTFaucet />} />
        </Routes>
      </App>
    </Router>
  </StrictMode>
);
