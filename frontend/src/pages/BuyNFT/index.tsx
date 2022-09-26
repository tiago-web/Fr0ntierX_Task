import { useAccount } from "../../contexts/AccountContext";
import "./styles.css";

const BuyNFT: React.FC = () => {
  const { accountAddress } = useAccount();

  return (
    <div>
      <h1>BuyNFT {accountAddress}</h1>
    </div>
  );
};

export default BuyNFT;
