const fs = require('fs')
const utils = require('./utils')

const source = fs.readFileSync('./wingine.json')
const contracts = JSON.parse(source)['contracts']
const abi = contracts['wingine.sol:Wingine'].abi
const bin = '0x' + contracts['wingine.sol:Wingine'].bin 

async function stmtCount(addr, contractAddr) {
  const contract = utils.getContract(abi, contractAddr)
  let stmtCount = await contract.methods.stmtCount().call({from: addr})
  return stmtCount
}

async function voteCount(addr, contractAddr) {
  const contract = utils.getContract(abi, contractAddr)
  let voteCount = await contract.methods.voteCount().call({from: addr})
  return voteCount
}

async function getState(addr, contractAddr) {
  const contract = utils.getContract(abi, contractAddr)
  let state = await contract.methods.getState().call({from: addr})
  return state 
}

async function start(addr, pass, contractAddr) {
  const contract = utils.getContract(abi, contractAddr)
  await utils.exec(
    addr,
    pass,
    contractAddr,
    contract.methods.start())
}

async function addVote(stmtId, up, addr, pass, contractAddr) {
  const contract = utils.getContract(abi, contractAddr)
  return await utils.exec(
    addr,
    pass,
    contractAddr,
    contract.methods.addVote(up))
}

async function addStmt(stmtId, stmt, addr, pass, contractAddr) {
  const contract = utils.getContract(abi, contractAddr)
  return await utils.exec(
    addr,
    pass,
    contractAddr,
    contract.methods.addCommentComment(commentId, comment))
}

async function getActiveStmt(addr, pass, contractAddr) {
  const contract = utils.getContract(abi, contractAddr)
  const stmtId = await contract.methods.stmtId().call({from: addr})
  const stmt = await contract.methods.stmts(stmtId).call({from: addr})
  return stmt
}

module.exports = {
  abi,
  bin,
  addStmt,
  addVote,
  getActiveStmt,
  getState,
  start,
  stmtCount,
  voteCount,
}

