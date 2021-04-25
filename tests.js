const assert = require('assert')
const utils = require('./utils')
const ident = require('./ident')
const wingine = require('./wingine')

require('dotenv').config()

async function testIdent() {
  let contractAddr = process.env.IDENT_CONTRACT

  if(!contractAddr)
    contractAddr = await utils.deploy(ident.abi, ident.bin)
  console.log(`Ident contract: ${contractAddr}`)

  const addr = process.env.GETH_COINBASE

  // Get number of groups (consequentially the group index) - JBG
  const groupIndex = await ident.getGroupCount(contractAddr, addr) 
  assert.equal(groupIndex, 0)

  // Create group - JBG
  const groupName = `Group ${new Date().getTime()}`
  await ident.addGroup(contractAddr, groupName)

  // Get group - JBG
  let group = await ident.getGroup(contractAddr, addr, groupIndex)
  assert.equal(group.name, groupName)
  assert.equal(group.parts.length, 0)

  // New participant - JBG
  let partName = `Participant ${new Date().getTime()}`
  let part = await ident.createParticipant(contractAddr, groupIndex, partName)

  // Get group, again - JBG
  group = await ident.getGroup(contractAddr, addr, groupIndex)
  assert.equal(group.parts.length, 1)

  // new second participant - JBG
  partName = `Participant ${new Date().getTime()}`
  part = await ident.createParticipant(contractAddr, groupIndex, partName)

  // Get group, again - JBG
  group = await ident.getGroup(contractAddr, addr, groupIndex)
  assert.equal(group.parts.length, 2)

}

async function testWingine() {
  const stmt = "Statement 0"
  let contractAddr = process.env.WINGINE_CONTRACT

  if(!contractAddr)
    contractAddr = await utils.deploy(wingine.abi, wingine.bin, [stmt])
  console.log(`Wingine contract: ${contractAddr}`)

  const contract = utils.getContract(wingine.abi, contractAddr) 

  // Should be 1 stmt the starting one - JBG
  let stmtCount = await wingine.stmtCount(contract)
  //console.log(`Stmt count: ${stmtCount}`)
  assert.equal(stmtCount, 1)
}

async function main() {
  testIdent()
  //testWingine()
}

main()

