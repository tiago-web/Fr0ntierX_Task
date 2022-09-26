import { useAccount } from "../../contexts/AccountContext";
import "./styles.css";

const MyNFTs: React.FC = () => {
  const { accountAddress } = useAccount();

  return (
    <div>
      <h1>MyNFTs {accountAddress}</h1>
    </div>
  );
};

export default MyNFTs;
