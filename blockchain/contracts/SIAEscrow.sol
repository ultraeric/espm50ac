pragma solidity ^0.4.24;

import "./tokens/SIA20.sol";
import "./tokens/SIA20Reward.sol";
import "./tokens/sia721.sol";

contract SIAEscrow {

  SIA20 sia20;
  SIA20Reward sia20Reward;
  SIA721 sia721;

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
  * SIA721 token in exchange for SIA20 and/or SIA20 Reward tokens. The contract
  * creator must be the owner of the SIA721 token.
  * @param SIA20Addr The address of the SIA20 token contract
  * @param SIA20RewardAddr The address of the SIA20Reward token contract
  * @param SIA721Addr The address of the SIA721 token contract
  * @param _tokenId The token id of the SIA721 token being sold
  * @param _tokenPrice The price at which the SIA721 token would be sold
  */
  constructor(address SIA20Addr, address SIA20RewardAddr, address SIA721Addr, uint256 _tokenId, uint256 _tokenPrice) public {
    sia20 = SIA20(SIA20Addr); // Ideally this value will be hardcoded.
    sia20Reward = SIA20Reward(SIA20RewardAddr); // Ideally this value will be hardcoded.
    sia721 = SIA721(SIA721Addr); // Ideally this value will be hardcoded.

    tokenId = _tokenId; // The SIA721 token that's being sold

    seller = sia721.ownerOf(_tokenId); // Get the SIA721 token seller
    require(seller == msg.sender, "The seller is not the contract creator.");

    tokenPrice = _tokenPrice; // The price of the SIA721 token

    state = EscrowState.Init; // Set the state of the Escrow to init
  }

  /*
  * Checks that the seller has approved the escrow contract to transfer its SIA721 token.
  * Sends the tokens to the contract.
  */
  function check721Approved() public {
    require(seller == msg.sender, "Only the seller can call this function.");
    require(state == EscrowState.Init, "The contract is not in the Init state.");
    require(sia721.getApproved(tokenId) == address(this), "The contract has not been approved to transfer the SIA721 token.");

    sia721.transferFrom(seller, address(this), tokenId);

    state = EscrowState.Approved721; // Set the state of the Escrow to init
  }

  /*
  * Checks that the buyer has approved the escrow contract to transfer its SIA20/SIA20Reward token.
  * Sends the tokens to the contract.
  */
  function check20Approved() public {
    require(state == EscrowState.Approved721, "The contract is not in the Approved721 state.");

    tokenAmount = sia20.allowance(msg.sender, address(this));
    rewardAmount = sia20Reward.allowance(msg.sender, address(this));

    require(tokenAmount + rewardAmount >= tokenPrice, "The buyer is not paying enough.");

    sia20.transferFrom(msg.sender, address(this), tokenAmount); // Transfers SIA20 tokens from the buyer to the seller
    sia20Reward.transferFrom(msg.sender, address(this), rewardAmount); // Transfers SIA20Reward tokens from the buyer to the seller

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

      sia20.transfer(seller, tokenAmount); // Transfers SIA20 tokens from the escrow to the seller
      sia20Reward.transfer(seller, rewardAmount); // Transfers SIA20Reward tokens from the escrow to the seller
      sia721.transferFrom(address(this), buyer, tokenId); // Transfers the SIA721 token from the escrow to the buyer

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
      sia20.transfer(buyer, tokenAmount); // Transfers SIA20 tokens from the escrow to the buyer
      sia20Reward.transfer(buyer, rewardAmount); // Transfers SIA20Reward tokens from the escrow to the buyer
      sia721.transferFrom(address(this), seller, tokenId); // Transfers the SIA721 token from the escrow to the seller
    }
    else if (state == EscrowState.Approved721) {
      sia721.transferFrom(address(this), seller, tokenId); // Transfers the SIA721 token from the escrow to the seller
    }

    state = EscrowState.Canceled;
  }

  function getState() public view returns (uint256){
    return uint256(state);
  }

}
