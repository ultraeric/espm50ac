pragma solidity ^0.4.24;

import "../tokens/ESPM20.sol";

contract ESPMEscrow {

  address owner;

  uint256 weiPerCent;
  uint256 totalWei;

  ESPM20 espm20;

  /* Makes sure only the contract owner can call a function with this modifier. */
  modifier onlyOwner() {
    require(msg.sender == owner, "Non-owner cannot call this function.");
    _;
  }

  /* Constructor that sets the owner to the contract deployer and deploys a
   * Espm20 contract.
   */
  constructor() public {
    owner = msg.sender;
    espm20 = new ESPM20();
  }

  /*
   * Allows the owner to mint a given amount of Sia20 tokens for a given address.
   *
   * @param to The address that will receive the minted tokens
   * @param amount The amount of tokens to mint
   */
  function mint(address to, uint256 amount) public onlyOwner {
    require(to != owner);
    espm20.mint(to, amount);
  }

  /* Buy ESPM20 tokens in exchange for Ether. */
  function buyTokens() public payable {
    uint256 amount = msg.value / weiPerCent;
    espm20.mint(msg.sender, amount);
    totalWei += msg.value;
  }

  /* Sell ESPM20 tokens in exchange for Ether. */
  function sellTokens() public {

    uint256 amount = espm20.allowance(msg.sender, address(this));
    require(amount > 0, "Nothing to burn");

    uint256 amountToTransfer = amount * weiPerCent;
    espm20.burnFrom(msg.sender, amount);
    msg.sender.transfer(amountToTransfer);

    totalWei -= amountToTransfer;
  }

  /*
   * Allows the owner to set the exchange rate of the wei per cent.
   *
   * @param _weiPerCent The exchange rate
   */
  function setWeiPerCent(uint256 _weiPerCent) public onlyOwner {
    weiPerCent = _weiPerCent;
  }

  /*
   * Allows the owner to remove funds that were used to back the ESPM20 tokens.
   * The owner cannot remove more than it put in.
   *
   * @param _weiPerCent The exchange rate
   */
  function removeFunds(uint256 amount) public onlyOwner{
    require(address(this).balance - amount > totalWei, "Owner cannnot remove more funds than it put in");
    owner.transfer(amount);
  }

  /*
   * Returns the address of the ESPM20 token contract.
   *
   * @return The address of the ESPM20 token contract
   */
  function getTokenAddress() public view returns(address){
    return address(espm20);
  }

  function() public payable { }

}
