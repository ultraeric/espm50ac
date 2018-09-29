let assert = require('chai').assert;
let { catchError } = require('./utilities.js');

let SIA20 = artifacts.require("SIA20");
let SIA20Reward = artifacts.require("SIA20Reward");
let SIA721 = artifacts.require("SIA721");
let SIAEscrow = artifacts.require("SIAEscrow");

contract('SIAEscrow', async (accounts) => {
    let sia20;
    let sia20Reward;
    let sia721;
    let escrow;
    let bad_escrow;

    let sia = accounts[0];
    let buyer = accounts[1];

    let tokenId1 = 12345;
    let tokenURI1 = "token metatdata 1";
    let tokenPrice1 = 10;

    let tokenId2 = 23456;
    let tokenURI2 = "token metatdata 2";
    let tokenPrice2 = 20;

    let tokenId3 = 34567;
    let tokenURI3 = "token metatdata 3";
    let tokenPrice3 = 30;

    let mintAmount = 100;

    before(async () => {
        sia20 = await SIA20.new({from: sia});
        sia20Reward = await SIA20Reward.new({from: sia});
        sia721 = await SIA721.new({from: sia});

        await sia721.mintWithTokenURI(sia, tokenId1, tokenURI1, {form: sia});
        await sia721.mintWithTokenURI(sia, tokenId2, tokenURI2, {form: sia});
        await sia721.mintWithTokenURI(sia, tokenId3, tokenURI3, {form: sia});

        await sia20.mint(buyer, mintAmount, {form: sia});
        await sia20Reward.mint(buyer, mintAmount, {form: sia});

        // Create an escrow contract to sell token2
        bad_escrow = await SIAEscrow.new(sia20.address, sia20Reward.address, sia721.address, tokenId2, tokenPrice2, {from: sia});
    });

    it("Test simple escrow flow", async () => {

      // Create an escrow contract to sell token1
      escrow = await SIAEscrow.new(sia20.address, sia20Reward.address, sia721.address, tokenId1, tokenPrice1, {from: sia});
      /*==========INIT STATE==========*/
      // Check escrow is in the init state
      let escrowState = await escrow.getState.call();
      assert.equal(escrowState, 0, "Escrow is not in init state.");

      // Approve the escrow contract to transfer token1
      await sia721.approve(escrow.address, tokenId1, {from: sia});

      // Check that the approval was successfull
      let approvedAddress = (await sia721.getApproved.call(tokenId1)).toString();
      assert.equal(approvedAddress, escrow.address, "Didn't approve the escrow contract to transfer token1.");

      // The escrow checks that it has the right to transfer token1 and transfers the token to itself
      await escrow.check721Approved({from: sia});
      /*==========Approved721 STATE==========*/
      // Check escrow is in the approved state
      escrowState = await escrow.getState.call();
      assert.equal(escrowState, 1, "Escrow is not in the approved state.");

      // Check escrow received the token
      assert.equal((await sia721.ownerOf.call(tokenId1)).toString(), escrow.address, "Escrow didn't receive token1.");

      let approvedAmount = 8;
      let approvedRewardAmount = 2;

      // Approve the escrow contract to transfer 8 SIA20s
      await sia20.approve(escrow.address, approvedAmount, {from: buyer});
      let allowance = (await sia20.allowance(buyer, escrow.address)).toNumber();
      assert.equal(allowance, approvedAmount, "Didn't give the escrow contract the correct SIA20 allowance amount.");
      // Approve the escrow contract to transfer 2 SIA20Rewardss
      await sia20Reward.approve(escrow.address, approvedRewardAmount, {from: buyer});
      let rewardAllowance = (await sia20Reward.allowance(buyer, escrow.address)).toNumber();
      assert.equal(rewardAllowance, approvedRewardAmount, "Didn't give the escrow contract the correct SIA20Reward allowance amount.");

      // The escrow checks that it has the right to transfer the SIA20/SIAReward Tokens and transfers them to itself
      await escrow.check20Approved({from: buyer});
      // /*==========READY STATE==========*/
      // Check escrow is in the ready state
      escrowState = await escrow.getState.call();
      assert.equal(escrowState, 2, "Escrow is not in the ready state.");

      // Check escrow received the correct SIA20/SIAReward amounts
      assert.equal((await sia20.balanceOf.call(escrow.address)).toNumber(), approvedAmount, "Escrow didn't receive the correct amount of SIA20.");
      assert.equal((await sia20Reward.balanceOf.call(escrow.address)).toNumber(), approvedRewardAmount, "Escrow didn't receive the correct amount of SIA20Reward.");

      // The buyer and seller settle the escrow
      await escrow.settle({from: sia});

      // Check escrow is not in the finalized state
      escrowState = await escrow.getState.call();
      assert.equal(escrowState, 2, "Escrow is not in the ready state.");

      await escrow.settle({from: buyer});
      // /*==========FINALIZED STATE==========*/
      // Check escrow is in the finalized state
      escrowState = await escrow.getState.call();
      assert.equal(escrowState, 3, "Escrow is not in the approved state.");

      /*==========Check that the buyer got the SIA721 token==========*/
      let numTokens = (await sia721.balanceOf.call(buyer)).toNumber();
      assert.equal(numTokens, 1, "Didn't transfer token1 successfully.");

      let owner = (await sia721.ownerOf.call(tokenId1)).toString();
      assert.equal(owner, buyer, "Didn't transfer token1 to the buyer.");

      let token = (await sia721.tokenOfOwnerByIndex.call(buyer, 0)).toNumber();
      assert.equal(token, tokenId1, "Token1 wasn't successfully added to list");

      /*==========Check that the seller got the SIA20 and SIA20Reward tokens==========*/
      let siaBalance = (await sia20.balanceOf.call(sia)).toNumber();
      assert.equal(siaBalance, approvedAmount, "Didn't transfer the SIA20 successfully.");

      let buyerBalance = (await sia20.balanceOf.call(buyer)).toNumber();
      assert.equal(buyerBalance, mintAmount - approvedAmount, "Didn't calculate SIA20 remainder correctly.");

      let siaRewardBalance = (await sia20Reward.balanceOf.call(sia)).toNumber();
      assert.equal(siaRewardBalance, approvedRewardAmount, "Didn't transfer the SIA20Reward successfully.");

      let buyerRewardBalance = (await sia20Reward.balanceOf.call(buyer)).toNumber();
      assert.equal(buyerRewardBalance, mintAmount - approvedRewardAmount, "Didn't calculate SIA20Reward remainder correctly.");
    });

    it("Test case when escrow can't be created", async () => {

      // Can't create an escrow to sell a SIA721 token if the contract creator isn't the token owner
      let err;
      [err] = await catchError(SIAEscrow.new(sia20.address, sia20Reward.address, sia721.address, tokenId1, tokenPrice1, {from: sia}));
      if (!err)
            assert.fail("An escrow for token1 was created by non-owner");
    });
    //
    it("Test that an unapproved escrow can't be finalized", async () => {

      /*==========INIT STATE==========*/
      // Check escrow is in the init state
      let escrowState = await bad_escrow.getState.call();
      assert.equal(escrowState, 0, "Escrow is not in init state.");

      // The escrow checks that it has the right to transfer token1
      let err;
      [err] = await catchError(bad_escrow.settle());
      if (!err)
            assert.fail("The escrow was finalized without being in the correct state");

      // Check escrow is not in the approved state
      escrowState = await bad_escrow.getState.call();
      assert.equal(escrowState, 0, "Escrow has moved into the finalized state.");
    });

    it("Test case when escrow can't be moved to the approved state", async () => {

      /*==========INIT STATE==========*/
      // Check escrow is in the init state
      let escrowState = await bad_escrow.getState.call();
      assert.equal(escrowState, 0, "Escrow is not in init state.");

      // The escrow checks that it has the right to transfer token1
      let err;
      [err] = await catchError(bad_escrow.check721Approved());
      if (!err)
            assert.fail("The escrow approved a 721 without being its spender.");

      // Check escrow is not in the approved state
      escrowState = await bad_escrow.getState.call();
      assert.equal(escrowState, 0, "Escrow has moved into the approved state.");
    });

    it("Test case when escrow can't be moved to the ready state", async () => {

      // Approve the escrow contract to transfer token1
      await sia721.approve(bad_escrow.address, tokenId2, {from: sia});

      // Check that the approval was successfull
      let approvedAddress = (await sia721.getApproved.call(tokenId2)).toString();
      assert.equal(approvedAddress, bad_escrow.address, "Didn't approve the escrow contract to transfer token1.");

      // The escrow checks that it has the right to transfer token1
      await bad_escrow.check721Approved({from: sia});
      /*==========APPROVED STATE==========*/
      // Check escrow is in the approved state
      escrowState = await bad_escrow.getState.call();
      assert.equal(escrowState, 1, "Escrow is not in the approved state.");

      // Check escrow received the token
      assert.equal((await sia721.ownerOf.call(tokenId2)).toString(), bad_escrow.address, "Escrow didn't receive token1.");

      let approvedAmount = 8;
      let approvedRewardAmount = 2;

      // Approve the escrow contract to transfer 8 SIA20s
      await sia20.approve(bad_escrow.address, approvedAmount, {from: buyer});
      let allowance = (await sia20.allowance(buyer, bad_escrow.address)).toNumber();
      assert.equal(allowance, approvedAmount, "Didn't give the escrow contract the correct SIA20 allowance amount.");
      // Approve the escrow contract to transfer 2 SIA20Rewardss
      await sia20Reward.approve(bad_escrow.address, approvedRewardAmount, {from: buyer});
      let rewardAllowance = (await sia20Reward.allowance(buyer, bad_escrow.address)).toNumber();
      assert.equal(rewardAllowance, approvedRewardAmount, "Didn't give the escrow contract the correct SIA20Reward allowance amount.");

      // The escrow checks that it has the right to transfer the SIA20/SIAReward Tokens and transfers them to itself
      let err;
      [err] = await catchError(bad_escrow.check20Approved({from: buyer}));
      if (!err)
            assert.fail("The escrow moved to the ready state without receiving enough funds from the buyer.");
    });

    it("Test escrow cancel", async () => {

      let approvedAmount = 12;
      let approvedRewardAmount = 8;

      // Approve the escrow contract to transfer 8 SIA20s
      await sia20.approve(bad_escrow.address, approvedAmount, {from: buyer});
      let allowance = (await sia20.allowance(buyer, bad_escrow.address)).toNumber();
      assert.equal(allowance, approvedAmount, "Didn't give the escrow contract the correct SIA20 allowance amount.");
      // Approve the escrow contract to transfer 2 SIA20Rewardss
      await sia20Reward.approve(bad_escrow.address, approvedRewardAmount, {from: buyer});
      let rewardAllowance = (await sia20Reward.allowance(buyer, bad_escrow.address)).toNumber();
      assert.equal(rewardAllowance, approvedRewardAmount, "Didn't give the escrow contract the correct SIA20Reward allowance amount.");

      // The escrow checks that it has the right to transfer the SIA20/SIAReward Tokens and transfers them to itself
      await bad_escrow.check20Approved({from: buyer});
      // /*==========READY STATE==========*/
      // Check escrow is in the ready state
      escrowState = await bad_escrow.getState.call();
      assert.equal(escrowState, 2, "Escrow is not in the ready state.");

      // Check escrow received the correct SIA20/SIAReward amounts
      assert.equal((await sia20.balanceOf.call(bad_escrow.address)).toNumber(), approvedAmount, "Escrow didn't receive the correct amount of SIA20.");
      assert.equal((await sia20Reward.balanceOf.call(bad_escrow.address)).toNumber(), approvedRewardAmount, "Escrow didn't receive the correct amount of SIA20Reward.");


      let sia20Balance = (await sia20.balanceOf.call(buyer)).toNumber();
      let sia20RewardBalance = (await sia20Reward.balanceOf.call(buyer)).toNumber();

      // The escrow checks that it has the right to transfer the SIA20/SIAReward Tokens and transfers them to itself
      let err;
      [err] = await catchError(bad_escrow.cancel({from: accounts[2]}));
      if (!err)
            assert.fail("The escrow can't be canceled by a non-participant");

      // SIA cancels the escrow
      await bad_escrow.cancel({from: sia});

      assert.equal((await sia20.balanceOf.call(buyer)).toNumber(), sia20Balance + approvedAmount, "Didn't refund the correct amount of SIA20 tokens.");
      assert.equal((await sia20Reward.balanceOf.call(buyer)).toNumber(), sia20RewardBalance + approvedRewardAmount, "Didn't refund the correct amount of SIA20Reward tokens.");
      assert.equal((await sia721.ownerOf.call(tokenId2)).toString(), sia, "Didn't refund the SIA721 token.");
    });
});
