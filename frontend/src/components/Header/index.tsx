import { Link } from "react-router-dom";
import { useAccount } from "../../contexts/AccountContext";
import "./styles.css";

const Header: React.FC = () => {
  const { accountAddress, connectWallet } = useAccount();

  return (
    <div>
      <ul>
        <Link to="/">NFT Marketplace</Link>
        <Link to="/my-nfts">My NFTs</Link>
        <Link to="/mint-nft">Mint NFT</Link>
        <Link to="/list-nft">List NFT</Link>
        <Link to="/buy-nft">Buy NFT</Link>
        <Link to="/front-faucet">FRT Faucet</Link>

        {!accountAddress && (
          <button
            onClick={async () => {
              await connectWallet();
            }}
          >
            Connect Wallet
          </button>
        )}
      </ul>
    </div>
  );
};

export default Header;
