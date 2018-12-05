let assert = require('chai').assert;

let ESPM20 = artifacts.require("ESPM20");
let ESPM20Reward = artifacts.require("ESPM20Reward");
let ESPM721 = artifacts.require("ESPM721");

contract('Tokens', async (accounts) => {
    let espm20;
    let espm20Reward;
    let espm721;
    let escrow;

    let espm = accounts[0];

    let tokenId1 = 12345;
    let tokenURI1 = "token metatdata 1";
    let tokenId2 = 23456;
    let tokenURI2 = "token metatdata 2";
    let tokenId3 = 34567;
    let tokenURI3 = "token metatdata 3";

    before(async () => {
        espm20 = await ESPM20.new({from: espm});
        espm20Reward = await ESPM20Reward.new({from: espm});
        espm721 = await ESPM721.new({from: espm});
    });

    it("Mint ESPM20s and ESPM20Rewards", async () => {
      let initialSupply = 100;

      // Test ESPM20 can mint the correct amount to the correct accounts
      await espm20.mint(espm, initialSupply, {from: espm});
      let balance = (await espm20.balanceOf.call(espm)).toNumber();
      assert.equal(balance, initialSupply, "Didn't mint the correct amount");

      // Test ESPM20Reward can mint the correct amount to the correct accounts
      await espm20Reward.mint(espm, initialSupply, {from: espm});
      balance = (await espm20Reward.balanceOf.call(espm)).toNumber();
      assert.equal(balance, initialSupply, "Didn't mint the correct amount");
    });

    it("Transfer ESPM20s and ESPM20Rewards", async () => {
      let recipient = accounts[1];

      // Test ESPM20 can transfer the correct amount to the correct recipient
      await espm20.transfer(recipient, 50, {from: espm});

      let balance = (await espm20.balanceOf.call(recipient)).toNumber();
      assert.equal(balance, 50, "Didn't transfer 50 ESPM20 successfully.");

      balance = (await espm20.balanceOf.call(espm)).toNumber();
      assert.equal(balance, 50, "Didn't calculate ESPM20 remainder correctly.");

      // Test ESPM20Reward can transfer the correct amount to the correct recipient
      await espm20Reward.transfer(recipient, 50, {from: espm});

      balance = (await espm20Reward.balanceOf.call(recipient)).toNumber();
      assert.equal(balance, 50, "Didn't transfer 50 ESPM20Reward successfully.");

      balance = (await espm20Reward.balanceOf.call(espm)).toNumber();
      assert.equal(balance, 50, "Didn't calculate ESPM20Reward remainder correctly.");
    });

    it("Approve and transfer ESPM20s and ESPM20Rewards", async () => {
      let spender = accounts[1];
      let recipient = accounts[2];

      // Test ESPM20 can approve the correct amount to the spender and transfer the correct amount to the correct recipient
      await espm20.approve(spender, 25, {from: espm});

      let allowance = (await espm20.allowance(espm, spender)).toNumber();
      assert.equal(allowance, 25, "Didn't give the spender the correct allowance amount.");

      await espm20.transferFrom(espm, recipient, 25, {from: spender});

      let balance = (await espm20.balanceOf.call(recipient)).toNumber();
      assert.equal(balance, 25, "Didn't transfer 25 ESPM20 successfully.");

      balance = (await espm20.balanceOf.call(espm)).toNumber();
      assert.equal(balance, 25, "Didn't calculate ESPM20 remainder correctly.");

      // Test ESPM20Reward can approve the correct amount to the spender and transfer the correct amount to the correct recipient
      await espm20Reward.approve(spender, 25, {from: espm});

      allowance = (await espm20Reward.allowance(espm, spender)).toNumber();
      assert.equal(allowance, 25, "Didn't give the spender the correct allowance amount.");

      await espm20Reward.transferFrom(espm, recipient, 25, {from: spender});

      balance = (await espm20Reward.balanceOf.call(recipient)).toNumber();
      assert.equal(balance, 25, "Didn't transfer 25 ESPM20Reward successfully.");

      balance = (await espm20Reward.balanceOf.call(espm)).toNumber();
      assert.equal(balance, 25, "Didn't calculate ESPM20Reward remainder correctly.");
    });

    it("Mint ESPM721s", async () => {

      await espm721.mintWithTokenURI(espm, tokenId1, tokenURI1, {from: espm});
      await espm721.mintWithTokenURI(espm, tokenId2, tokenURI2, {from: espm});
      await espm721.mintWithTokenURI(espm, tokenId3, tokenURI3, {from: espm});

      let numTokens = (await espm721.balanceOf.call(espm)).toNumber();
      assert.equal(numTokens, 3, "Didn't mint all tokens successfully.");

      let owner = (await espm721.ownerOf.call(tokenId1)).toString();
      assert.equal(owner, espm, "Didn't give token1 to the correct owner.");
      owner = (await espm721.ownerOf.call(tokenId2)).toString();
      assert.equal(owner, espm, "Didn't give token2 to the correct owner.");
      owner = (await espm721.ownerOf.call(tokenId3)).toString();
      assert.equal(owner, espm, "Didn't give token3 to the correct owner.");

      let uri = (await espm721.tokenURI.call(tokenId1)).toString();
      assert.equal(uri, tokenURI1, "Didn't give token1 to the correct uri.");
      uri = (await espm721.tokenURI.call(tokenId2)).toString();
      assert.equal(uri, tokenURI2, "Didn't give token2 to the correct uri.");
      uri = (await espm721.tokenURI.call(tokenId3)).toString();
      assert.equal(uri, tokenURI3, "Didn't give token3 to the correct uri.");

      let token = (await espm721.tokenOfOwnerByIndex.call(espm, 0)).toNumber();
      assert.equal(token, tokenId1, "Token1 wasn't successfully added to list");
      token = (await espm721.tokenOfOwnerByIndex.call(espm, 1)).toNumber();
      assert.equal(token, tokenId2, "Token2 wasn't successfully added to list");
      token = (await espm721.tokenOfOwnerByIndex.call(espm, 2)).toNumber();
      assert.equal(token, tokenId3, "Token3 wasn't successfully added to list");
    });

    it("Transfer ESPM721", async () => {
      let recipient = accounts[1];
      await espm721.transferFrom(espm, recipient, tokenId1, {from: espm});

      let numTokens = (await espm721.balanceOf.call(recipient)).toNumber();
      assert.equal(numTokens, 1, "Didn't transfer token1 successfully.");

      let owner = (await espm721.ownerOf.call(tokenId1)).toString();
      assert.equal(owner, recipient, "Didn't transfer token1 to the correct owner.");

      let uri = (await espm721.tokenURI.call(tokenId1)).toString();
      assert.equal(uri, tokenURI1, "Didn't give token1 to the correct uri.");

      let token = (await espm721.tokenOfOwnerByIndex.call(recipient, 0)).toNumber();
      assert.equal(token, tokenId1, "Token1 wasn't successfully added to list");
    });

    it("Approve and transfer ESPM721", async () => {
      let spender = accounts[1];
      let recipient = accounts[2];

      // Approve the escrow contract to transfer token1
      await espm721.approve(spender, tokenId2, {from: espm});

      // Check that the approval was successfull
      let approvedAddress = (await espm721.getApproved.call(tokenId2)).toString();
      assert.equal(approvedAddress, spender, "Didn't approve the spender to transfer token2.");

      await espm721.transferFrom(espm, recipient, tokenId2, {from: spender});

      let numTokens = (await espm721.balanceOf.call(recipient)).toNumber();
      assert.equal(numTokens, 1, "Didn't transfer token2 successfully.");

      let owner = (await espm721.ownerOf.call(tokenId2)).toString();
      assert.equal(owner, recipient, "Didn't transfer token2 to the correct owner.");

      let uri = (await espm721.tokenURI.call(tokenId2)).toString();
      assert.equal(uri, tokenURI2, "Didn't give token2 to the correct uri.");

      let token = (await espm721.tokenOfOwnerByIndex.call(recipient, 0)).toNumber();
      assert.equal(token, tokenId2, "Token2 wasn't successfully added to list");
    });
});
