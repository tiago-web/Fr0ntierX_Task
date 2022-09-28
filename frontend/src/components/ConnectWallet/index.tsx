import { useState } from "react";

import { AiOutlineCloseCircle } from "react-icons/ai";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useAccount } from "../../contexts/AccountContext";

import "./styles.css";

const ConnectWallet: React.FC = () => {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const { accountAddress, connectWallet, disconnectWallet } = useAccount();

  return (
    <>
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
            position: "relative" as "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30rem",
            bgcolor: "#fafafa",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AiOutlineCloseCircle
            className="modal-close-icon"
            onClick={() => {
              setShowDisconnectModal(false);
            }}
          />

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
    </>
  );
};

export default ConnectWallet;
