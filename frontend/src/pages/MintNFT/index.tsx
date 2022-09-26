import { useAccount } from "../../contexts/AccountContext";
import "./styles.css";

const MintNFT: React.FC = () => {
  const { accountAddress } = useAccount();

  return (
    <div>
      <h1>MintNFT {accountAddress}</h1>
    </div>
  );
};

export default MintNFT;
