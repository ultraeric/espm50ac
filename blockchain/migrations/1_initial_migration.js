var fs = require('fs');

let Migrations = artifacts.require("./Migrations.sol");

let SIA20 = artifacts.require("./tokens/SIA20.sol");
let SIA20Reward = artifacts.require("./tokens/SIA20Reward.sol");
let SIA721 = artifacts.require("./tokens/SIA721.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);

  let contractAddresses = {};
  deployer.deploy(SIA20, {from: accounts[0]})
    .then(() => {
      contractAddresses['SIA20Address'] = SIA20.address;
      return deployer.deploy(SIA20Reward, {from: accounts[0]});
    }).then(() => {
      contractAddresses['SIA20RewardAddress'] = SIA20Reward.address;
      return deployer.deploy(SIA721, {from: accounts[0]})
    }).then(() => {
      contractAddresses['SIA721Address'] = SIA721.address;
      contractAddresses['ganacheAccounts'] = accounts;
      console.log(contractAddresses);

      let json = JSON.stringify(contractAddresses);
      fs.writeFile('../src/contractObjects/instanceData.json', json, 'utf8', function(err) {} );
    });
};
