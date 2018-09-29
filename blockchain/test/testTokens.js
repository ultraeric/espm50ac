let assert = require('chai').assert;

let SIA20 = artifacts.require("SIA20");
let SIA20Reward = artifacts.require("SIA20Reward");
let SIA721 = artifacts.require("SIA721");

contract('Tokens', async (accounts) => {
    let sia20;
    let sia20Reward;
    let sia721;
    let escrow;

    let sia = accounts[0];

    let tokenId1 = 12345;
    let tokenURI1 = "token metatdata 1";
    let tokenId2 = 23456;
    let tokenURI2 = "token metatdata 2";
    let tokenId3 = 34567;
    let tokenURI3 = "token metatdata 3";

    before(async () => {
        sia20 = await SIA20.new({from: sia});
        sia20Reward = await SIA20Reward.new({from: sia});
        sia721 = await SIA721.new({from: sia});
    });

    it("Mint SIA20s and SIA20Rewards", async () => {
      let initialSupply = 100;

      // Test SIA20 can mint the correct amount to the correct accounts
      await sia20.mint(sia, initialSupply, {from: sia});
      let balance = (await sia20.balanceOf.call(sia)).toNumber();
      assert.equal(balance, initialSupply, "Didn't mint the correct amount");

      // Test SIA20Reward can mint the correct amount to the correct accounts
      await sia20Reward.mint(sia, initialSupply, {from: sia});
      balance = (await sia20Reward.balanceOf.call(sia)).toNumber();
      assert.equal(balance, initialSupply, "Didn't mint the correct amount");
    });

    it("Transfer SIA20s and SIA20Rewards", async () => {
      let recipient = accounts[1];

      // Test SIA20 can transfer the correct amount to the correct recipient
      await sia20.transfer(recipient, 50, {from: sia});

      let balance = (await sia20.balanceOf.call(recipient)).toNumber();
      assert.equal(balance, 50, "Didn't transfer 50 SIA20 successfully.");

      balance = (await sia20.balanceOf.call(sia)).toNumber();
      assert.equal(balance, 50, "Didn't calculate SIA20 remainder correctly.");

      // Test SIA20Reward can transfer the correct amount to the correct recipient
      await sia20Reward.transfer(recipient, 50, {from: sia});

      balance = (await sia20Reward.balanceOf.call(recipient)).toNumber();
      assert.equal(balance, 50, "Didn't transfer 50 SIA20Reward successfully.");

      balance = (await sia20Reward.balanceOf.call(sia)).toNumber();
      assert.equal(balance, 50, "Didn't calculate SIA20Reward remainder correctly.");
    });

    it("Approve and transfer SIA20s and SIA20Rewards", async () => {
      let spender = accounts[1];
      let recipient = accounts[2];

      // Test SIA20 can approve the correct amount to the spender and transfer the correct amount to the correct recipient
      await sia20.approve(spender, 25, {from: sia});

      let allowance = (await sia20.allowance(sia, spender)).toNumber();
      assert.equal(allowance, 25, "Didn't give the spender the correct allowance amount.");

      await sia20.transferFrom(sia, recipient, 25, {from: spender});

      let balance = (await sia20.balanceOf.call(recipient)).toNumber();
      assert.equal(balance, 25, "Didn't transfer 25 SIA20 successfully.");

      balance = (await sia20.balanceOf.call(sia)).toNumber();
      assert.equal(balance, 25, "Didn't calculate SIA20 remainder correctly.");

      // Test SIA20Reward can approve the correct amount to the spender and transfer the correct amount to the correct recipient
      await sia20Reward.approve(spender, 25, {from: sia});

      allowance = (await sia20Reward.allowance(sia, spender)).toNumber();
      assert.equal(allowance, 25, "Didn't give the spender the correct allowance amount.");

      await sia20Reward.transferFrom(sia, recipient, 25, {from: spender});

      balance = (await sia20Reward.balanceOf.call(recipient)).toNumber();
      assert.equal(balance, 25, "Didn't transfer 25 SIA20Reward successfully.");

      balance = (await sia20Reward.balanceOf.call(sia)).toNumber();
      assert.equal(balance, 25, "Didn't calculate SIA20Reward remainder correctly.");
    });

    it("Mint SIA721s", async () => {

      await sia721.mintWithTokenURI(sia, tokenId1, tokenURI1, {from: sia});
      await sia721.mintWithTokenURI(sia, tokenId2, tokenURI2, {from: sia});
      await sia721.mintWithTokenURI(sia, tokenId3, tokenURI3, {from: sia});

      let numTokens = (await sia721.balanceOf.call(sia)).toNumber();
      assert.equal(numTokens, 3, "Didn't mint all tokens successfully.");

      let owner = (await sia721.ownerOf.call(tokenId1)).toString();
      assert.equal(owner, sia, "Didn't give token1 to the correct owner.");
      owner = (await sia721.ownerOf.call(tokenId2)).toString();
      assert.equal(owner, sia, "Didn't give token2 to the correct owner.");
      owner = (await sia721.ownerOf.call(tokenId3)).toString();
      assert.equal(owner, sia, "Didn't give token3 to the correct owner.");

      let uri = (await sia721.tokenURI.call(tokenId1)).toString();
      assert.equal(uri, tokenURI1, "Didn't give token1 to the correct uri.");
      uri = (await sia721.tokenURI.call(tokenId2)).toString();
      assert.equal(uri, tokenURI2, "Didn't give token2 to the correct uri.");
      uri = (await sia721.tokenURI.call(tokenId3)).toString();
      assert.equal(uri, tokenURI3, "Didn't give token3 to the correct uri.");

      let token = (await sia721.tokenOfOwnerByIndex.call(sia, 0)).toNumber();
      assert.equal(token, tokenId1, "Token1 wasn't successfully added to list");
      token = (await sia721.tokenOfOwnerByIndex.call(sia, 1)).toNumber();
      assert.equal(token, tokenId2, "Token2 wasn't successfully added to list");
      token = (await sia721.tokenOfOwnerByIndex.call(sia, 2)).toNumber();
      assert.equal(token, tokenId3, "Token3 wasn't successfully added to list");
    });

    it("Transfer SIA721", async () => {
      let recipient = accounts[1];
      await sia721.transferFrom(sia, recipient, tokenId1, {from: sia});

      let numTokens = (await sia721.balanceOf.call(recipient)).toNumber();
      assert.equal(numTokens, 1, "Didn't transfer token1 successfully.");

      let owner = (await sia721.ownerOf.call(tokenId1)).toString();
      assert.equal(owner, recipient, "Didn't transfer token1 to the correct owner.");

      let uri = (await sia721.tokenURI.call(tokenId1)).toString();
      assert.equal(uri, tokenURI1, "Didn't give token1 to the correct uri.");

      let token = (await sia721.tokenOfOwnerByIndex.call(recipient, 0)).toNumber();
      assert.equal(token, tokenId1, "Token1 wasn't successfully added to list");
    });

    it("Approve and transfer SIA721", async () => {
      let spender = accounts[1];
      let recipient = accounts[2];

      // Approve the escrow contract to transfer token1
      await sia721.approve(spender, tokenId2, {from: sia});

      // Check that the approval was successfull
      let approvedAddress = (await sia721.getApproved.call(tokenId2)).toString();
      assert.equal(approvedAddress, spender, "Didn't approve the spender to transfer token2.");

      await sia721.transferFrom(sia, recipient, tokenId2, {from: spender});

      let numTokens = (await sia721.balanceOf.call(recipient)).toNumber();
      assert.equal(numTokens, 1, "Didn't transfer token2 successfully.");

      let owner = (await sia721.ownerOf.call(tokenId2)).toString();
      assert.equal(owner, recipient, "Didn't transfer token2 to the correct owner.");

      let uri = (await sia721.tokenURI.call(tokenId2)).toString();
      assert.equal(uri, tokenURI2, "Didn't give token2 to the correct uri.");

      let token = (await sia721.tokenOfOwnerByIndex.call(recipient, 0)).toNumber();
      assert.equal(token, tokenId2, "Token2 wasn't successfully added to list");
    });
});
