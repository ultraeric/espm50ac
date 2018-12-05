pragma solidity ^0.4.24;

import "./tokens/ESPM20.sol";
import "./tokens/ESPM20Reward.sol";
import "./tokens/espm721.sol";

contract ESPMEscrow {

  ESPM20 espm20;
  ESPM20Reward espm20Reward;
  ESPM721 espm721;

  uint256 tokenId;
  uint256 tokenPrice;
  address seller;
  bool sellerSettle = false;

  uint256 tokenAmount;
  uint256 rewardAmount;
  address buyer;
  bool buyerSettle = false;

  enum EscrowState { Init, Approved721, Ready, Finalized, Canceled }
  EscrowState state;

  /*
  * The constructor that initializes the escrow contract. The seller sells a
  * ESPM721 token in exchange for ESPM20 and/or ESPM20 Reward tokens. The contract
  * creator must be the owner of the ESPM721 token.
  * @param ESPM20Addr The address of the ESPM20 token contract
  * @param ESPM20RewardAddr The address of the ESPM20Reward token contract
  * @param ESPM721Addr The address of the ESPM721 token contract
  * @param _tokenId The token id of the ESPM721 token being sold
  * @param _tokenPrice The price at which the ESPM721 token would be sold
  */
  constructor(address ESPM20Addr, address ESPM20RewardAddr, address ESPM721Addr, uint256 _tokenId, uint256 _tokenPrice) public {
    espm20 = ESPM20(ESPM20Addr); // Ideally this value will be hardcoded.
    espm20Reward = ESPM20Reward(ESPM20RewardAddr); // Ideally this value will be hardcoded.
    espm721 = ESPM721(ESPM721Addr); // Ideally this value will be hardcoded.

    tokenId = _tokenId; // The ESPM721 token that's being sold

    seller = espm721.ownerOf(_tokenId); // Get the ESPM721 token seller
    require(seller == msg.sender, "The seller is not the contract creator.");

    tokenPrice = _tokenPrice; // The price of the ESPM721 token

    state = EscrowState.Init; // Set the state of the Escrow to init
  }

  /*
  * Checks that the seller has approved the escrow contract to transfer its ESPM721 token.
  * Sends the tokens to the contract.
  */
  function check721Approved() public {
    require(seller == msg.sender, "Only the seller can call this function.");
    require(state == EscrowState.Init, "The contract is not in the Init state.");
    require(espm721.getApproved(tokenId) == address(this), "The contract has not been approved to transfer the ESPM721 token.");

    espm721.transferFrom(seller, address(this), tokenId);

    state = EscrowState.Approved721; // Set the state of the Escrow to init
  }

  /*
  * Checks that the buyer has approved the escrow contract to transfer its ESPM20/ESPM20Reward token.
  * Sends the tokens to the contract.
  */
  function check20Approved() public {
    require(state == EscrowState.Approved721, "The contract is not in the Approved721 state.");

    tokenAmount = espm20.allowance(msg.sender, address(this));
    rewardAmount = espm20Reward.allowance(msg.sender, address(this));

    require(tokenAmount + rewardAmount >= tokenPrice, "The buyer is not paying enough.");

    espm20.transferFrom(msg.sender, address(this), tokenAmount); // Transfers ESPM20 tokens from the buyer to the seller
    espm20Reward.transferFrom(msg.sender, address(this), rewardAmount); // Transfers ESPM20Reward tokens from the buyer to the seller

    buyer = msg.sender;
    state = EscrowState.Ready; // Set the state of the Escrow to init
  }

  /*
  * Settles the escrow.
  * Both the seller and the buyer need to agree to settle before the tokens can be sent.
  */
  function settle() public {
    require(state == EscrowState.Ready, "The contract is not in the Ready state.");

    if (msg.sender == seller && sellerSettle == false) {
      sellerSettle = true;
    }
    if (msg.sender == buyer && buyerSettle == false) {
      buyerSettle = true;
    }
    if (sellerSettle && buyerSettle) {

      espm20.transfer(seller, tokenAmount); // Transfers ESPM20 tokens from the escrow to the seller
      espm20Reward.transfer(seller, rewardAmount); // Transfers ESPM20Reward tokens from the escrow to the seller
      espm721.transferFrom(address(this), buyer, tokenId); // Transfers the ESPM721 token from the escrow to the buyer

      state = EscrowState.Finalized;
    }
  }

  /*
  * Either the seller or buyer can unilatierally cancel the escrow.
  * Both the seller and the buyer are refunded their tokens
  */
  function cancel() public {
    require(state != EscrowState.Finalized, "A finalized contract cannot be canceled");
    require(msg.sender == seller || msg.sender == buyer, "Only the buyer or seller can cancel");

    if (state == EscrowState.Ready) {
      espm20.transfer(buyer, tokenAmount); // Transfers ESPM20 tokens from the escrow to the buyer
      espm20Reward.transfer(buyer, rewardAmount); // Transfers ESPM20Reward tokens from the escrow to the buyer
      espm721.transferFrom(address(this), seller, tokenId); // Transfers the ESPM721 token from the escrow to the seller
    }
    else if (state == EscrowState.Approved721) {
      espm721.transferFrom(address(this), seller, tokenId); // Transfers the ESPM721 token from the escrow to the seller
    }

    state = EscrowState.Canceled;
  }

  function getState() public view returns (uint256){
    return uint256(state);
  }

}
