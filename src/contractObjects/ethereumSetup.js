const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const instanceData = require('./instanceData.json');

const ESPM20JSON = JSON.parse(JSON.stringify(require('./abi/ESPM20.json')));
const ESPM20RewardJSON = JSON.parse(JSON.stringify(require('./abi/ESPM20Reward.json')));
const ESPM721JSON = JSON.parse(JSON.stringify(require('./abi/ESPM721.json')));
const ESPMEscrowJSON = JSON.parse(JSON.stringify(require('./abi/ESPMEscrow.json')));

let ESPM20Contract = new web3.eth.Contract(ESPM20JSON.abi, instanceData.ESPM20Address);
let ESPM20RewardContract = new web3.eth.Contract(ESPM20RewardJSON.abi, instanceData.ESPM20RewardAddress);
let ESPM721Contract = new web3.eth.Contract(ESPM721JSON.abi, instanceData.ESPM721Address);

let ESPMEscrowContract = new web3.eth.Contract(ESPMEscrowJSON.abi);

let accounts = instanceData.ganacheAccounts;

let espm = accounts[0];

// console.log(espm);
//
// ESPM721Contract.methods.mintWithTokenURI(espm, 1, "data").send({from: espm, gas: 5000000})
// .then(function(receipt) {
//   return ESPM721Contract.methods.ownerOf(1).call({from: espm});
// }).then(function(owner) {
//   console.log(owner);
// });


module.exports = {
  web3,
  ESPM20JSON,
  ESPM20RewardJSON,
  ESPM721JSON,
  ESPMEscrowJSON,
  ESPM20Contract,
  ESPM20RewardContract,
  ESPM721Contract,
  ESPMEscrowContract,
  accounts,
  espm,
};
