pragma solidity ^0.4.24;

import "../../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

/*
 * Based on https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Burnable.sol
 */

contract ERC721Burnable is ERC721 {
  function burn(uint256 tokenId)
    public
  {
    require(_isApprovedOrOwner(msg.sender, tokenId));
    _burn(ownerOf(tokenId), tokenId);
  }
}
