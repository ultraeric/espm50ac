let assert = require('chai').assert;
let { catchError } = require('./utilities.js');

let ESPM20 = artifacts.require("ESPM20");
let ESPM20Reward = artifacts.require("ESPM20Reward");
let ESPM721 = artifacts.require("ESPM721");
let ESPMEscrow = artifacts.require("ESPMEscrow");

contract('ESPMEscrow', async (accounts) => {
    let espm20;
    let espm20Reward;
    let espm721;
    let escrow;
    let bad_escrow;

    let espm = accounts[0];
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
        espm20 = await ESPM20.new({from: espm});
        espm20Reward = await ESPM20Reward.new({from: espm});
        espm721 = await ESPM721.new({from: espm});

        await espm721.mintWithTokenURI(espm, tokenId1, tokenURI1, {form: espm});
        await espm721.mintWithTokenURI(espm, tokenId2, tokenURI2, {form: espm});
        await espm721.mintWithTokenURI(espm, tokenId3, tokenURI3, {form: espm});

        await espm20.mint(buyer, mintAmount, {form: espm});
        await espm20Reward.mint(buyer, mintAmount, {form: espm});

        // Create an escrow contract to sell token2
        bad_escrow = await ESPMEscrow.new(espm20.address, espm20Reward.address, espm721.address, tokenId2, tokenPrice2, {from: espm});
    });

    it("Test simple escrow flow", async () => {

      // Create an escrow contract to sell token1
      escrow = await ESPMEscrow.new(espm20.address, espm20Reward.address, espm721.address, tokenId1, tokenPrice1, {from: espm});
      /*==========INIT STATE==========*/
      // Check escrow is in the init state
      let escrowState = await escrow.getState.call();
      assert.equal(escrowState, 0, "Escrow is not in init state.");

      // Approve the escrow contract to transfer token1
      await espm721.approve(escrow.address, tokenId1, {from: espm});

      // Check that the approval was successfull
      let approvedAddress = (await espm721.getApproved.call(tokenId1)).toString();
      assert.equal(approvedAddress, escrow.address, "Didn't approve the escrow contract to transfer token1.");

      // The escrow checks that it has the right to transfer token1 and transfers the token to itself
      await escrow.check721Approved({from: espm});
      /*==========Approved721 STATE==========*/
      // Check escrow is in the approved state
      escrowState = await escrow.getState.call();
      assert.equal(escrowState, 1, "Escrow is not in the approved state.");

      // Check escrow received the token
      assert.equal((await espm721.ownerOf.call(tokenId1)).toString(), escrow.address, "Escrow didn't receive token1.");

      let approvedAmount = 8;
      let approvedRewardAmount = 2;

      // Approve the escrow contract to transfer 8 ESPM20s
      await espm20.approve(escrow.address, approvedAmount, {from: buyer});
      let allowance = (await espm20.allowance(buyer, escrow.address)).toNumber();
      assert.equal(allowance, approvedAmount, "Didn't give the escrow contract the correct ESPM20 allowance amount.");
      // Approve the escrow contract to transfer 2 ESPM20Rewardss
      await espm20Reward.approve(escrow.address, approvedRewardAmount, {from: buyer});
      let rewardAllowance = (await espm20Reward.allowance(buyer, escrow.address)).toNumber();
      assert.equal(rewardAllowance, approvedRewardAmount, "Didn't give the escrow contract the correct ESPM20Reward allowance amount.");

      // The escrow checks that it has the right to transfer the ESPM20/ESPMReward Tokens and transfers them to itself
      await escrow.check20Approved({from: buyer});
      // /*==========READY STATE==========*/
      // Check escrow is in the ready state
      escrowState = await escrow.getState.call();
      assert.equal(escrowState, 2, "Escrow is not in the ready state.");

      // Check escrow received the correct ESPM20/ESPMReward amounts
      assert.equal((await espm20.balanceOf.call(escrow.address)).toNumber(), approvedAmount, "Escrow didn't receive the correct amount of ESPM20.");
      assert.equal((await espm20Reward.balanceOf.call(escrow.address)).toNumber(), approvedRewardAmount, "Escrow didn't receive the correct amount of ESPM20Reward.");

      // The buyer and seller settle the escrow
      await escrow.settle({from: espm});

      // Check escrow is not in the finalized state
      escrowState = await escrow.getState.call();
      assert.equal(escrowState, 2, "Escrow is not in the ready state.");

      await escrow.settle({from: buyer});
      // /*==========FINALIZED STATE==========*/
      // Check escrow is in the finalized state
      escrowState = await escrow.getState.call();
      assert.equal(escrowState, 3, "Escrow is not in the approved state.");

      /*==========Check that the buyer got the ESPM721 token==========*/
      let numTokens = (await espm721.balanceOf.call(buyer)).toNumber();
      assert.equal(numTokens, 1, "Didn't transfer token1 successfully.");

      let owner = (await espm721.ownerOf.call(tokenId1)).toString();
      assert.equal(owner, buyer, "Didn't transfer token1 to the buyer.");

      let token = (await espm721.tokenOfOwnerByIndex.call(buyer, 0)).toNumber();
      assert.equal(token, tokenId1, "Token1 wasn't successfully added to list");

      /*==========Check that the seller got the ESPM20 and ESPM20Reward tokens==========*/
      let espmBalance = (await espm20.balanceOf.call(espm)).toNumber();
      assert.equal(espmBalance, approvedAmount, "Didn't transfer the ESPM20 successfully.");

      let buyerBalance = (await espm20.balanceOf.call(buyer)).toNumber();
      assert.equal(buyerBalance, mintAmount - approvedAmount, "Didn't calculate ESPM20 remainder correctly.");

      let espmRewardBalance = (await espm20Reward.balanceOf.call(espm)).toNumber();
      assert.equal(espmRewardBalance, approvedRewardAmount, "Didn't transfer the ESPM20Reward successfully.");

      let buyerRewardBalance = (await espm20Reward.balanceOf.call(buyer)).toNumber();
      assert.equal(buyerRewardBalance, mintAmount - approvedRewardAmount, "Didn't calculate ESPM20Reward remainder correctly.");
    });

    it("Test case when escrow can't be created", async () => {

      // Can't create an escrow to sell a ESPM721 token if the contract creator isn't the token owner
      let err;
      [err] = await catchError(ESPMEscrow.new(espm20.address, espm20Reward.address, espm721.address, tokenId1, tokenPrice1, {from: espm}));
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
      await espm721.approve(bad_escrow.address, tokenId2, {from: espm});

      // Check that the approval was successfull
      let approvedAddress = (await espm721.getApproved.call(tokenId2)).toString();
      assert.equal(approvedAddress, bad_escrow.address, "Didn't approve the escrow contract to transfer token1.");

      // The escrow checks that it has the right to transfer token1
      await bad_escrow.check721Approved({from: espm});
      /*==========APPROVED STATE==========*/
      // Check escrow is in the approved state
      escrowState = await bad_escrow.getState.call();
      assert.equal(escrowState, 1, "Escrow is not in the approved state.");

      // Check escrow received the token
      assert.equal((await espm721.ownerOf.call(tokenId2)).toString(), bad_escrow.address, "Escrow didn't receive token1.");

      let approvedAmount = 8;
      let approvedRewardAmount = 2;

      // Approve the escrow contract to transfer 8 ESPM20s
      await espm20.approve(bad_escrow.address, approvedAmount, {from: buyer});
      let allowance = (await espm20.allowance(buyer, bad_escrow.address)).toNumber();
      assert.equal(allowance, approvedAmount, "Didn't give the escrow contract the correct ESPM20 allowance amount.");
      // Approve the escrow contract to transfer 2 ESPM20Rewardss
      await espm20Reward.approve(bad_escrow.address, approvedRewardAmount, {from: buyer});
      let rewardAllowance = (await espm20Reward.allowance(buyer, bad_escrow.address)).toNumber();
      assert.equal(rewardAllowance, approvedRewardAmount, "Didn't give the escrow contract the correct ESPM20Reward allowance amount.");

      // The escrow checks that it has the right to transfer the ESPM20/ESPMReward Tokens and transfers them to itself
      let err;
      [err] = await catchError(bad_escrow.check20Approved({from: buyer}));
      if (!err)
            assert.fail("The escrow moved to the ready state without receiving enough funds from the buyer.");
    });

    it("Test escrow cancel", async () => {

      let approvedAmount = 12;
      let approvedRewardAmount = 8;

      // Approve the escrow contract to transfer 8 ESPM20s
      await espm20.approve(bad_escrow.address, approvedAmount, {from: buyer});
      let allowance = (await espm20.allowance(buyer, bad_escrow.address)).toNumber();
      assert.equal(allowance, approvedAmount, "Didn't give the escrow contract the correct ESPM20 allowance amount.");
      // Approve the escrow contract to transfer 2 ESPM20Rewardss
      await espm20Reward.approve(bad_escrow.address, approvedRewardAmount, {from: buyer});
      let rewardAllowance = (await espm20Reward.allowance(buyer, bad_escrow.address)).toNumber();
      assert.equal(rewardAllowance, approvedRewardAmount, "Didn't give the escrow contract the correct ESPM20Reward allowance amount.");

      // The escrow checks that it has the right to transfer the ESPM20/ESPMReward Tokens and transfers them to itself
      await bad_escrow.check20Approved({from: buyer});
      // /*==========READY STATE==========*/
      // Check escrow is in the ready state
      escrowState = await bad_escrow.getState.call();
      assert.equal(escrowState, 2, "Escrow is not in the ready state.");

      // Check escrow received the correct ESPM20/ESPMReward amounts
      assert.equal((await espm20.balanceOf.call(bad_escrow.address)).toNumber(), approvedAmount, "Escrow didn't receive the correct amount of ESPM20.");
      assert.equal((await espm20Reward.balanceOf.call(bad_escrow.address)).toNumber(), approvedRewardAmount, "Escrow didn't receive the correct amount of ESPM20Reward.");


      let espm20Balance = (await espm20.balanceOf.call(buyer)).toNumber();
      let espm20RewardBalance = (await espm20Reward.balanceOf.call(buyer)).toNumber();

      // The escrow checks that it has the right to transfer the ESPM20/ESPMReward Tokens and transfers them to itself
      let err;
      [err] = await catchError(bad_escrow.cancel({from: accounts[2]}));
      if (!err)
            assert.fail("The escrow can't be canceled by a non-participant");

      // ESPM cancels the escrow
      await bad_escrow.cancel({from: espm});

      assert.equal((await espm20.balanceOf.call(buyer)).toNumber(), espm20Balance + approvedAmount, "Didn't refund the correct amount of ESPM20 tokens.");
      assert.equal((await espm20Reward.balanceOf.call(buyer)).toNumber(), espm20RewardBalance + approvedRewardAmount, "Didn't refund the correct amount of ESPM20Reward tokens.");
      assert.equal((await espm721.ownerOf.call(tokenId2)).toString(), espm, "Didn't refund the ESPM721 token.");
    });
});
