import { useAccount } from "../../contexts/AccountContext";
import "./styles.css";

const ListNFT: React.FC = () => {
  const { accountAddress } = useAccount();

  return (
    <div>
      <h1>ListNFT {accountAddress}</h1>
    </div>
  );
};

export default ListNFT;
