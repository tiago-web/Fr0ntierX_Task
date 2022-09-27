import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "../../contexts/AccountContext";
import "./styles.css";

const Marketplace: React.FC = () => {
  const [minted, setMinted] = useState(false);
  const { provider, accountAddress, erc721Contract } = useAccount();

  useEffect(() => {
    if (minted && erc721Contract) {
      const getBalance = async () => {
        if (accountAddress) {
          console.log("accountAddress", accountAddress);

          const ownerOf = await erc721Contract.ownerOf(0);
          console.log(ownerOf);
        }

        // const [account_a_erc20_balance, token_owner] = await Promise.all([
        //   erc721.ownerOf(data.tokenId),
        // ]);
        // assert.equal(
        //   account_a_erc20_balance.toNumber(),
        //   data.sellingPrice,
        //   "Incorrect ERC20 balance"
        // );
      };

      getBalance();
    }
  }, [minted, accountAddress]);

  // const getToken = useCallback(async () => {
  //   const tokenName = await erc721Contract?.totalSupply();
  //   alert(tokenName);
  // }, [provider, erc721Contract]);

  return (
    <div>
      <h1>Marketplace</h1>
      <p>User: {accountAddress}</p>

      {/* <button
        onClick={async () => {
          await getToken();
        }}
      >
        Token Name
      </button> */}
    </div>
  );
};

export default Marketplace;
