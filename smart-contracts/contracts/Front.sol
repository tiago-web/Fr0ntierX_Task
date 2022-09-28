// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error Front__InvalidQuantity();

contract Front is ERC721A, Ownable {
  string private _customBaseURI;

  mapping(uint256 => string) private _tokenURIs;

  event NFTMinted(address requester, uint256 quantity, uint256 lastTokenId);

  constructor(string memory customBaseURI_) ERC721A("Front", "FRT") {
    _customBaseURI = customBaseURI_;
  }

  function mint(uint256 quantity, string[] memory ipfsHashes) external payable {
    if (ipfsHashes.length > 5) {
      revert Front__InvalidQuantity();
    }

    if (ipfsHashes.length != quantity) {
      revert Front__InvalidQuantity();
    }
    uint256 currentIndex = _nextTokenId();

    for (uint256 i = 0; i < ipfsHashes.length; i++) {
      _tokenURIs[currentIndex] = ipfsHashes[i];
    }

    // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
    _mint(msg.sender, quantity);

    emit NFTMinted(msg.sender, quantity, _nextTokenId() - 1);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

    string memory baseURI = _baseURI();
    return
      bytes(baseURI).length != 0
        ? string(abi.encodePacked(baseURI, _tokenURIs[tokenId]))
        : "";
  }

  function setBaseURI(string memory newBaseURI) public onlyOwner {
    _customBaseURI = newBaseURI;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _customBaseURI;
  }
}
