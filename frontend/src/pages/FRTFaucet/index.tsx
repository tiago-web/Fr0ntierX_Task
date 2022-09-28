import { useCallback, useState } from "react";
import { ethers } from "ethers";

import CircularProgress from "@mui/material/CircularProgress";

import ConnectWallet from "../../components/ConnectWallet";
import { useAccount } from "../../contexts/AccountContext";

import "./styles.css";

const FRTFaucet: React.FC = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const { accountAddress, erc20Contract } = useAccount();

  const handleSendERC20 = useCallback(async () => {
    if (!accountAddress || !erc20Contract) return;
    setIsMinting(true);

    const tx = await erc20Contract.mint(ethers.utils.parseEther("200"));
    await tx.wait(1);
    setIsMinting(false);
    setMinted(true);
  }, [erc20Contract, accountAddress]);

  return (
    <div className="faucet-container">
      <h1>FRT Faucet</h1>
      {isMinting ? (
        <CircularProgress
          sx={{
            color: "#005e2a",
            position: "absolute",
            left: "50%",
          }}
        />
      ) : !minted ? (
        accountAddress ? (
          <button onClick={handleSendERC20}>Send me 200 testnet FRT</button>
        ) : (
          <ConnectWallet />
        )
      ) : (
        <p>FRT was minted successfully! Check your wallet balance</p>
      )}
    </div>
  );
};

export default FRTFaucet;
