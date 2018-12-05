pragma solidity ^0.4.24;

import '../../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import '../../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import '../../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Burnable.sol';

contract ESPM721 is ERC721Full, ERC721Mintable, ERC721Burnable {
  constructor() ERC721Full("ESPM NFT", "ESPMNFT") public {
  }
}
