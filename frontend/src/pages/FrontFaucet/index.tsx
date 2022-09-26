import { useAccount } from "../../contexts/AccountContext";
import "./styles.css";

const FrontFaucet: React.FC = () => {
  const { accountAddress } = useAccount();

  return (
    <div>
      <h1>FrontFaucet {accountAddress}</h1>
    </div>
  );
};

export default FrontFaucet;
