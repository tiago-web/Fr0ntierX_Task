// SPDX-License-Identifier: Unlicense
pragma solidity 0.7.5;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TierX is ERC20 {
  constructor() ERC20("TierX", "TRX") {
    _mint(msg.sender, 1_000 * (10**18)); // Mint 1k to owner
  }

  function mint(uint256 quantity) external payable {
    _mint(msg.sender, quantity);
  }
}
