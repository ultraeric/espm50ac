var fs = require('fs');

let Migrations = artifacts.require("./Migrations.sol");

let ESPM20 = artifacts.require("./tokens/ESPM20.sol");
let ESPM20Reward = artifacts.require("./tokens/ESPM20Reward.sol");
let ESPM721 = artifacts.require("./tokens/ESPM721.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);

  let contractAddresses = {};
  deployer.deploy(ESPM20, {from: accounts[0]})
    .then(() => {
      contractAddresses['ESPM20Address'] = ESPM20.address;
      return deployer.deploy(ESPM20Reward, {from: accounts[0]});
    }).then(() => {
      contractAddresses['ESPM20RewardAddress'] = ESPM20Reward.address;
      return deployer.deploy(ESPM721, {from: accounts[0]})
    }).then(() => {
      contractAddresses['ESPM721Address'] = ESPM721.address;
      contractAddresses['ganacheAccounts'] = accounts;
      console.log(contractAddresses);

      let json = JSON.stringify(contractAddresses);
      fs.writeFile('../src/contractObjects/instanceData.json', json, 'utf8', function(err) {} );
    });
};
