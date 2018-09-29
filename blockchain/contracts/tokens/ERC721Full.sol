pragma solidity ^0.4.24;

import "../../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import '../../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol';
import '../../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol';

/**
 * @title Full ERC721 Token
 * This implementation includes all the required and some optional functionality of the ERC721 standard
 * Moreover, it includes approve all functionality using operator terminology
 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 * Based on https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Full.sol
 */
contract ERC721Full is ERC721, ERC721Enumerable, ERC721Metadata {
  constructor(string name, string symbol) ERC721Metadata(name, symbol)
    public
  {
  }
}
