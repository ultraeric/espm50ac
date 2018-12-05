let {
  ESPMEscrowJSON,
  ESPM20Contract,
  ESPM20RewardContract,
  ESPM721Contract,
  ESPMEscrowContract,
  accounts,
  espm
} = require('./ethereumSetup.js');

import {Guac} from 'guac-hoc/lib/Guac';


class ESPM20 {

  // Pass in the ESPM20 or ESPM20Reward contract Object into the constructor.
  // Their APIs are the same.
  constructor(ESPM20Contract) {
    this.instance = ESPM20Contract;
    this.bindAllMethods();
  }

  /**
  * Mints a given amount of ESPM20 tokens for a given owner
  *
  * @param sender String address of the function caller
  * @param to String address of the owner account
  * @param amount Amount of ESPM20 tokens to mint
  * @return Promise
  */
  mint(sender, to, amount) {
    return this.instance.methods.mint(to, amount).send({from: sender, gas: 5000000});
  }

  /**
  * Burns a specific amount of tokens from the target address and decrements allowance
  *
  * @param sender String address of the function caller (should be owner or approved spender)
  * @param from String address which you want to send tokens from
  * @param amount Amount of token to be burned
  * @return Promise
  */
  burnFrom(sender, from, amount) {
    return this.instance.methods.burnFrom(from, amount).send({from: sender, gas: 5000000});
  }

  /**
  * Approve the passed address to spend the specified amount of tokens on behalf of sender.
  *
  * @param sender String address of the function caller
  * @param spender String address of the spender account
  * @param amount Amount of token to be spent
  * @return Promise
  */
  approve(sender, spender, amount) {
    return this.instance.methods.approve(spender, amount).send({from: sender, gas: 5000000});
  }

  /**
  * Transfers the ownership of a given token ID to another address
  *
  * @param sender String address of the function caller
  * @param from String address of the token owner
  * @param to String address of the recipient account
  * @param amount Amount of token to be spent
  * @return Promise
  */
  transferFrom(sender, from, to, amount) {
    return this.instance.methods.transferFrom(from, to, amount).send({from: sender, gas: 5000000});
  }

  /**
  * Increase the amount of tokens that an owner allowed to a spender by a given amount.
  *
  * @param sender String address of the function caller
  * @param spender String address of the address which will spend the funds
  * @param addedValue The amount of tokens to increase the allowance by
  * @return Promise
  */
  increaseAllowance(sender, spender, addedValue) {
    return this.instance.methods.increaseAllowance(spender, addedValue).send({from: sender, gas: 5000000});
  }

  /**
  * Decrease the amount of tokens that an owner allowed to a spender by a given amount.
  *
  * @param sender String address of the function caller
  * @param spender String address of the address which will spend the funds
  * @param subtractedValue The amount of tokens to decrease the allowance by
  * @return Promise
  */

  decreaseAllowance(sender, spender, subtractedValue) {
    return this.instance.methods.decreaseAllowance(spender, subtractedValue).send({from: sender, gas: 5000000});
  }

  /**
  * Returns the balance of the specified address
  *
  * @param sender String address of the function caller
  * @param owner String address of the token owner
  * @return Promise of the integer balance of owner
  */
  balanceOf(sender, owner) {
    return this.instance.methods.balanceOf(owner).call({from: sender});
  }

  /**
  * Returns the amount of tokens that an owner allowed to a spender.
  *
  * @param sender String address of the function caller
  * @param owner String address which owns the funds.
  * @param spender String address which will spend the funds.
  * @return Promise of the interger allowance of the owner
  */
  allowance(sender, owner, spender) {
    return this.instance.methods.allowance(owner, spender).call({from: sender});
  }

  /**
  * Returns the token ID at a given index of the tokens list of the requested owner
  *
  * @param sender String address of the function caller
  * @param owner String address of the tokens' owner
  * @return Promise of the token ID at the given index
  */
  tokenOfOwnerByIndex(sender, owner, index) {
    return this.instance.methods.tokenOfOwnerByIndex(owner, index).call({from: sender});
  }
}

class ESPM721 {
  constructor() {
    this.instance = ESPM721Contract;
    this.bindAllMethods();
  }

  /**
  * Mints a ESPM721 token with a given id and URI for a given owner
  *
  * @param sender String address of the function caller
  * @param to String address of the owner account
  * @param tokenId Integer ID of the new token
  * @param tokenURI String URI that'll be associated with the token
  * @return Promise
  */
  mint(sender, to, tokenId, tokenURI) {
    return this.instance.methods.mintWithTokenURI(to, tokenId, tokenURI).send({from: sender, gas: 5000000});
  }

  /**
  * Burns the ESPM721 token with a given id
  *
  * @param sender String address of the function caller (should be owner or approved spender)
  * @param tokenId Integer ID of the token to be burned
  * @return Promise
  */
  burn(sender, tokenId) {
    return this.instance.methods.burn(tokenId).send({from: sender, gas: 5000000});
  }

  /**
  * Approves another address to transfer the given token ID on behalf of sender
  *
  * @param sender String address of the function caller
  * @param to String address of the spender account
  * @param tokenId Integer ID
  * @return Promise
  */
  approve(sender, to, tokenId) {
    return this.instance.methods.approve(to, tokenId).send({from: sender, gas: 5000000});
  }

  /**
  * Transfers the ownership of a given token ID to another address
  *
  * @param sender String address of the function caller
  * @param from String address of the token owner
  * @param to String address of the recipient account
  * @param tokenId Integer ID
  * @return Promise
  */
  transferFrom(sender, from, to, tokenId) {
    return this.instance.methods.transferFrom(from, to, tokenId).send({from: sender, gas: 5000000});
  }

  /**
  * Returns address of the owner of a given token
  *
  * @param sender String address of the function caller
  * @param tokenId Integer ID
  * @return Promise of the string address of the token's owner
  */
  ownerOf(sender, tokenId) {
    return this.instance.methods.ownerOf(tokenId).call({from: sender});
  }

  /**
  * Returns an String URI for a given token ID
  *
  * @param sender String address of the function caller
  * @param tokenId Integer ID
  * @return Promise of the String an URI for a given token ID
  */
  tokenURI(sender, tokenId) {
    return this.instance.methods.tokenURI(tokenId).call({from: sender});
  }

  /**
  * Returns address of the approved spender of a given token
  *
  * @param sender String address of the function caller
  * @param tokenId Integer ID
  * @return Promise of the string address of the token's approved spender
  */
  getApproved(sender, tokenId) {
    return this.instance.methods.getApproved(tokenId).call({from: sender});
  }

  /**
  * Returns the number of NFT tokens an owner owns
  *
  * @param sender String address of the function caller
  * @param owner String address of the tokens' owner
  * @return Promise of the number of tokens owner owns
  */
  balanceOf(sender, owner) {
    return this.instance.methods.balanceOf(owner).call({from: sender});
  }

  /**
  * Returns the token ID at a given index of the tokens list of the requested owner
  *
  * @param sender String address of the function caller
  * @param owner String address of the tokens' owner
  * @return Promise of the token ID at the given index
  */
  tokenOfOwnerByIndex(sender, owner, index) {
    return this.instance.methods.tokenOfOwnerByIndex(owner, index).call({from: sender});
  }

  totalSupply(sender) {
    return this.instance.methods.totalSupply().call({from:sender});
  }
}

class ESPMEscrow {

  /**
  * Class constructor. Deploys an ESPMEscrow
  *
  * @param owner String address of the escrow and ESPM721 owner
  * @param tokenId Integer ID
  * @param tokenPrice Integer price of token
  */
  constructor(owner, tokenId, tokenPrice) {
    this.bindAllMethods();
    this.instancePromise
    = this._deployESPMEscrow(
      owner,
      ESPM20Contract.options.address,
      ESPM20RewardContract.options.address,
      ESPM721Contract.options.address,
      tokenId,
      tokenPrice
    );

    this.tokenId = tokenId;
    this.trackingTokenId = tokenId;
    this.tokenPrice = tokenPrice;
  }

  /**
  * Deploys an ESPMEscrow. Won't deploy again.
  *
  * @param owner String address of the escrow and ESPM721 owner
  * @param tokenId Integer ID
  * @param tokenPrice Integer price of token
  * @return Promise of the ESPMEscrow instance
  */
  _deployESPMEscrow(owner, ESPM20Addr, ESPM20RewardAddr, ESPM721Addr, tokenId, tokenPrice) {
    if (typeof this.instance !== 'undefined') {
      return this.instance;
    }

    return ESPMEscrowContract
    .deploy({
      data: ESPMEscrowJSON.bytecode,
      arguments: [ESPM20Addr, ESPM20RewardAddr, ESPM721Addr, tokenId, tokenPrice]
    })
    .send({
      from: owner,
      gas: 5000000
    });
  }

  /**
  * Checks that the Escrow can spend the seller's ESPM721 token and transfers
  * the token to itself
  *
  * @param sender String address of the function caller
  * @return Promise
  */
  check721Approved(sender) {
    let promise = this.instancePromise.then((instance) => {
      return instance.methods.check721Approved().send({from: sender, gas: 5000000});
    });

    return promise;
  }

  /**
  * Checks that the Escrow can spend the buyer's ESPM20/ESPM20Reward tokens and
  * transfers the tokens to itself.
  * The sum of the ESPM20 and ESPM20Reward tokens spent must be greater than the
  * ESPM721 token price.
  * The buyer must give the contract enough ESPM20 or ESPM20Reward allowances so
  * they're greater than or equal to tokenAmount and rewardAmount respectively.
  *
  * @param sender String address of the function caller
  * @return Promise
  */
  check20Approved(sender) {
    let promise = this.instancePromise.then((instance) => {
      return instance.methods.check20Approved().send({from: sender, gas: 5000000});
    });

    return promise;
  }

  /**
  * Settles the escrow.
  * Both the seller and the buyer need to agree to settle before the tokens can be sent.
  *
  * @param sender String address of the function caller
  * @return Promise
  */
  settle(sender) {
    let promise = this.instancePromise.then((instance) => {
      return instance.methods.settle().send({from: sender, gas: 5000000});
    });

    return promise;
  }

  /**
  * Either the seller or buyer can unilatierally cancel the escrow.
  * Both the seller and the buyer are refunded their tokens
  *
  * @param sender String address of the function caller
  * @return Promise
  */
  cancel(sender) {
    let promise = this.instancePromise.then((instance) => {
      return instance.methods.cancel().send({from: sender, gas: 5000000});
    });

    return promise;
  }

  /**
  * Returns the state of the Escrow
  *
  * @param sender String address of the function caller
  * @return Promise of the state of the Escrow
  */
  getState(sender) {
    return this.instancePromise.then((instance) => {
      return instance.methods.getState().call({from: sender});
    });
  }

  /**
   *
   * @param sender
   * @returns {Promise} Promise that returns the token URI.
   */
  getTokenURI(sender) {
    return ESPM721Contract.methods.tokenURI(this.tokenId).call({from: sender});
  }

  /**
   *
   * @param sender
   * @return {*}
   */
  getTrackingTokenURI(sender) {
    return ESPM721Contract.methods.tokenURI(this.trackingTokenId).call({from: sender});
  }

  /**
   *
   * @returns {Promise<T>} Promise that returns the address of this escrow.
   */
  address() {
    return this.instancePromise.then((instance) => instance.options.address);
  }
}

ESPM20 = Guac(ESPM20);
ESPM721 = Guac(ESPM721);
ESPMEscrow = Guac(ESPMEscrow);

let espm20 = new ESPM20(ESPM20Contract);
let espm20reward = new ESPM20(ESPM20RewardContract)
let espm721 = new ESPM721();

class Accounts {
  constructor () {
    this.accounts = {};
    this.newAccounts = accounts.slice(1);
    this.bindAllMethods();
  }

  register(userId) {
    let acct = this.newAccounts.pop();
    this.accounts[userId] = acct;
    return espm20.mint(espm, acct, Math.floor(Math.random() * (200000)) + 1000)
      .then(() => {
        return acct;
      });
  }

  getAccount(userId) {
    return this.accounts[userId];
  }

  bootstrap(userId) {
    let acct = this.register(userId);
    return espm20.mint(espm, acct, Math.floor(Math.random() * (20000)) + 1000)
      .then(() => console.log('boostrapping ' + userId));
  }
}
Accounts = Guac(Accounts);
let globalAccounts = new Accounts();

class ESPMNFT {
  constructor() {
    this.bindAllMethods();
    this.gtc = 0;
    this.existingTokens = {};
    this.newTokens = {};
    this.userTokens = {};
    this.escrows = {};
    // espm721.totalSupply(espm).then((supply) => {console.log(supply); this.gtc = supply;});
  }

  /**
   * @return Promise that returns the token ID of the created token.
   * **/
  mint(key, uniqueData) {
    this.gtc += 1;
    if (typeof(key) === 'string' && typeof(uniqueData) === 'string') {
      if (!Object.keys(this.existingTokens).includes(key)) {
        this.existingTokens[key] = [this.gtc];
        this.newTokens[key] = [this.gtc];
      } else {
        this.existingTokens[key].push(this.gtc);
        this.newTokens[key].push(this.gtc);
      }
      let callback = ((tokenId) => (() => tokenId)) (this.gtc);
      return espm721.mint(espm, espm, this.gtc, uniqueData).then(callback);
    } else {
      throw(new Error('Couldn\'t mint ERC721 token.'));
    }
  }

  /**
   *
   * @param key
   * @param purchase
   * @param userId
   */
  initEscrow(key, purchase, userId) {
    let userAddr = globalAccounts.getAccount(userId);

    return this.mint(key, 'N/A')
      .then((rootTokenId) => {
        purchase.prevTokens = [rootTokenId];
        return [rootTokenId];
      }).then((rootTokenIds) => {
        return Promise.all(rootTokenIds.map((tokenId) => espm721.burn(espm, tokenId)));
      }).then(() => {
        return this.mint('purchase', JSON.stringify(purchase));
      }).then((tokenId) => {
        let newEscrow = new ESPMEscrow(espm, tokenId, purchase.price);
        if (Object.keys(this.escrows).includes(userAddr)) {
          this.escrows[userAddr].push(newEscrow);
        } else {
          this.escrows[userAddr] = [newEscrow];
        }
        return Promise.all([newEscrow.address(), tokenId, newEscrow]);
        }).then((arr) => {
          // Approve the escrow to send the ERC721 token, then send them to contract
          let escrow = arr[2];
          return espm721.approve(espm, arr[0], arr[1]).then(() => Promise.all([arr[0], escrow.check721Approved(espm), escrow]));
        }).then((arr) => {
          // Approve the escrow to send the ERC20 tokens, then send them to contract
          let escrow = arr[2];
          let newEscrowAddress = arr[0];
          return espm20.approve(userAddr, newEscrowAddress, purchase.price)
            .then(() => Promise.all([escrow.check20Approved(userAddr), escrow]));
        });
  }

  /**
   *
   * @param purchase
   * @param userId
   * @return {Promise<[any]>}
   */
  getEscrow(purchase, userId) {
    return this.getEscrows(userId)
      .then((escrows) => {
        return Promise.all([Promise.all(escrows.map((escrow) => escrow.getTokenURI(espm))), escrows]);
      }).then((arr) => {
        let tokenURIs = arr[0];
        let escrows = arr[1];
        let escrow = null;
        for (let i=0; i<escrows.length; i++) {
          if (JSON.parse(tokenURIs[i]).tracking[0].date === purchase.tracking[0].date) {
            return escrows[i];
          }
        }
        if (!escrow) throw(new Error('Purchase not found on the blockchain.'));
      });
  }

  /**
   *
   * @param purchase
   * @param userId
   * @return {Promise} Returns a promise that resolves to nothing
   */
  changeEscrow(purchase, userId) {
    return this.getEscrow(purchase, userId)
      .then((escrow) => {
        return Promise.all([this.mint('tracking', JSON.stringify(purchase)), escrow])
      }).then((arr) => {
        let tokenId = arr[0];
        let escrow = arr[1];
        escrow.trackingTokenId = tokenId;
      });
  }

  commitEscrow(purchase, userId) {
    return this.changeEscrow(purchase, userId)
      .then(() => this.getEscrow(purchase, userId))
      .then((escrow) => {
        return escrow.settle(espm).then(() => escrow.settle(globalAccounts.getAccount(userId)));
      });
  }

  /**
   * @param userId: number
   * @return Promise: A Promise that resolves to the escrows of this user.
   * **/
  getEscrows(userId) {
    let userAddr = globalAccounts.getAccount(userId);
    return Promise.all(this.escrows[userAddr] || [])
      .then((escrows) => {
        return escrows;
      });
  }

  getTokens(userId) {
    let userAddr = globalAccounts.getAccount(userId);
    return this.userTokens[userAddr];
  }

  /**
   *
   * @param userId: number for the flyer
   * @return Promise: A Promise that resolves to the tracking of this user
   */
  getTracking(userId) {
    return this.getEscrows(userId)
      .then((escrows) => {
        // Get Token URI Promises for all escrow tokens and finished tokens.
        let uriPromises = escrows.map((escrow) => escrow.getTrackingTokenURI(espm));
        let currentTokens = this.getTokens(userId) || [];
        for (let token of currentTokens) {
          uriPromises.push(espm721.tokenURI(espm, token));
        }
        return Promise.all(uriPromises);
      }).then((uris) => {
        return uris.length > 0 ? uris.map((uri) => JSON.parse(uri)) : [];
    });
  }
}

ESPMNFT = Guac(ESPMNFT);
let espmnft = new ESPMNFT();

class ESPMToken {
  constructor() {
    this.bindAllMethods();
  }

  mint(userId, numTokens) {
    let userAddr = globalAccounts.getAccount(userId);
    return espm20reward.mint(espm, userAddr, numTokens);
  }

  /**
   *
   * @param userId
   * @return {Promise} Promise that gives the reward balance of a user.
   */
  numRewardTokens(userId) {
    let userAddr = globalAccounts.getAccount(userId);
    return espm20reward.balanceOf(userAddr, userAddr);
  }

  /**
   *
   * @param userId
   * @return {Promise} Promise that gives the token balance of a user.
   */
  numTokens(userId) {
    let userAddr = globalAccounts.getAccount(userId);
    return espm20.balanceOf(userAddr, userAddr);
  }
}
ESPMToken = Guac(ESPMToken);
let espmtoken = new ESPMToken();


export default espmtoken;
export {
  ESPM20,
  ESPM721,
  ESPMEscrow,
  espmtoken,
  espmnft,
  globalAccounts
};
