const crypto = require('crypto')
const fs = require('fs')
const Web3 = require('web3')
const utils = require('./utils')

const source = fs.readFileSync('./ident.json')
const contracts = JSON.parse(source)['contracts']
const abi = contracts['ident.sol:Identity'].abi
const bin = '0x' + contracts['ident.sol:Identity'].bin 
const web3 = utils.web3

async function _sendFunds(account) {
  const coinbase = await web3.eth.getCoinbase()
  return await web3.eth.sendTransaction({
    from: coinbase,
    to: account,
    value: web3.utils.toWei("1.0", "ether")
  })
}

async function createAccount(password) {
  const a = await web3.eth.personal.newAccount(password)
  await _sendFunds(a)
  return a
}

async function addGroup(contractAddr, name) {
  const contract = await utils.getContract(abi, contractAddr)
  const addr = process.env.GETH_COINBASE
  const pass = process.env.GETH_PASSWORD

  return await utils.exec(
    addr,
    pass,
    contractAddr,
    contract.methods.addGroup(name))
}

async function getGroupCount(contractAddr, addr) {
  const contract = await utils.getContract(abi, contractAddr)
  const c = await contract.methods.groupCount().call({ from: addr })
  return c
}

async function getGroup(contractAddr, addr, groupId) {
  const contract = await utils.getContract(abi, contractAddr)

  let group = await contract.methods.groups(groupId).call({ from: addr })
  let parts = await contract.methods.getGroupParts(groupId).call({ from: addr })

  group.parts = []
  for(let i = 0; i < parts.length; i++) {
    const partIndex = parts[i]
    const part = await contract.methods.parts(partIndex).call({ from: addr })
    group.parts.push(part)
  }

  return group
}

async function addParticipant(contractAddr, groupId, part) {
  const contract = await utils.getContract(abi, contractAddr)

  const txtHash = await utils.exec(
    part.addr,
    part.password,
    contractAddr,
    contract.methods.addPart(groupId, part.name))
}

async function createParticipant(contractAddr, groupId, name) {
  const password = crypto.randomBytes(16).toString('hex')
  const addr = await createAccount(password)

  console.log(`create account ${addr}, ${password}`)

  const part = {
    name: name,
    password: password,
    addr: addr
  }

  await addParticipant(contractAddr, groupId, part)

  return part 
}

module.exports = {
  abi,
  addGroup,
  bin,
  createParticipant,
  getGroup,
  getGroupCount,
}
