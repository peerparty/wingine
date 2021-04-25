const fs = require('fs')
//const utils = require('./utils')

const source = fs.readFileSync('./wingine.json')
const contracts = JSON.parse(source)['contracts']
const abi = contracts['wingine.sol:Wingine'].abi
const bin = '0x' + contracts['wingine.sol:Wingine'].bin 
//const web3 = web3.utils

async function stmtCount(contract) {
  let stmtCount = await contract.methods.stmtCount().call()
  return stmtCount
}

module.exports = {
  abi,
  bin,
  stmtCount,
}

