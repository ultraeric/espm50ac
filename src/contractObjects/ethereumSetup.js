const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const instanceData = require('./instanceData.json');

const SIA20JSON = JSON.parse(JSON.stringify(require('./abi/SIA20.json')));
const SIA20RewardJSON = JSON.parse(JSON.stringify(require('./abi/SIA20Reward.json')));
const SIA721JSON = JSON.parse(JSON.stringify(require('./abi/SIA721.json')));
const SIAEscrowJSON = JSON.parse(JSON.stringify(require('./abi/SIAEscrow.json')));

let SIA20Contract = new web3.eth.Contract(SIA20JSON.abi, instanceData.SIA20Address);
let SIA20RewardContract = new web3.eth.Contract(SIA20RewardJSON.abi, instanceData.SIA20RewardAddress);
let SIA721Contract = new web3.eth.Contract(SIA721JSON.abi, instanceData.SIA721Address);

let SIAEscrowContract = new web3.eth.Contract(SIAEscrowJSON.abi);

let accounts = instanceData.ganacheAccounts;

let sia = accounts[0];

// console.log(sia);
//
// SIA721Contract.methods.mintWithTokenURI(sia, 1, "data").send({from: sia, gas: 5000000})
// .then(function(receipt) {
//   return SIA721Contract.methods.ownerOf(1).call({from: sia});
// }).then(function(owner) {
//   console.log(owner);
// });


module.exports = {
  web3,
  SIA20JSON,
  SIA20RewardJSON,
  SIA721JSON,
  SIAEscrowJSON,
  SIA20Contract,
  SIA20RewardContract,
  SIA721Contract,
  SIAEscrowContract,
  accounts,
  sia,
};
