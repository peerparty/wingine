const assert = require('assert')
const utils = require('./utils')
const ident = require('./ident')
const wingine = require('./wingine')

require('dotenv').config()

async function testIdent() {
  let parts = []
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
  parts.push(part)

  // Get group, again - JBG
  group = await ident.getGroup(contractAddr, addr, groupIndex)
  assert.equal(group.parts.length, 1)

  // new second participant - JBG
  partName = `Participant ${new Date().getTime()}`
  part = await ident.createParticipant(contractAddr, groupIndex, partName)
  parts.push(part)

  // Get group, again - JBG
  group = await ident.getGroup(contractAddr, addr, groupIndex)
  assert.equal(group.parts.length, 2)

  // add an existing participant - JBG
  part = {
    name: `Participant ${new Date().getTime()}`,
    password: process.env.GETH_PASSWORD, 
    addr: process.env.GETH_COINBASE 
  }
  await ident.addParticipant(contractAddr, groupIndex, part)
  parts.push(part)

  // Get group, again - JBG
  group = await ident.getGroup(contractAddr, addr, groupIndex)
  assert.equal(group.parts.length, 3)

  return parts
}

// arg is an array of participants to test w/ - JBG
async function testWingine(parts) {
  const stmt = "Statement 0"
  const addr = process.env.GETH_COINBASE
  const pass = process.env.GETH_PASSWORD
  const args = [ stmt, 30, 30 ]
  let contractAddr = process.env.WINGINE_CONTRACT
  if(!contractAddr)
    contractAddr = await utils.deploy(wingine.abi, wingine.bin, args)
  console.log(`Wingine contract: ${contractAddr}`)

  const contract = utils.getContract(wingine.abi, contractAddr) 

  // Should be 1 stmt the starting one - JBG
  let stmtCount = await wingine.stmtCount(addr, contractAddr)
  //console.log(`Stmt count: ${stmtCount}`)
  assert.equal(stmtCount, 1)

  // Should be REG state - JBG
  let state = await wingine.getState(addr, contractAddr)
  //console.log(`STATE: ${state}`)
  assert.equal(state, 0)

  // Start the wingine - JBG
  await wingine.start(addr, pass, contractAddr)

  // Should be VOTE state - JBG
  state = await wingine.getState(addr, contractAddr)
  //console.log(`STATE: ${state}`)
  assert.equal(state, 1)

  // get current stmt - JBG
  let activeStmt = await wingine.getActiveStmt(
    addr,
    pass,
    contractAddr)

  assert(activeStmt)
  assert.equal(activeStmt.stmt, stmt)

  // Vote for starting statement - JBG
  for(let i = 0; i < parts.length; i++) {
    await wingine.addVote(
      activeStmt.id,
      true,
      parts[i].addr,
      parts[i].password,
      contractAddr)
  }

  // Sleep for 30 seconds - JBG
  await utils.sleep(30000)

  // Should be 3 votes - JBG
  let voteCount = await wingine.voteCount(addr, contractAddr)
  assert.equal(voteCount, 3) 
 
  // Should be STMT state - JBG
  state = await wingine.getState(addr, contractAddr)
  //console.log(`STATE: ${state}`)
  assert.equal(state, 2)
 
}

async function main() {
  // Returns an arry of 3 participants - JBG
  //let parts = await testIdent()
  let parts = [
    {
      name: 'Participant 1620034565786',
      password: '9e5193802f22c5118591ac2e4161d511',
      addr: '0x9381b4fe28079B2B1e415C0D0556798De098F99E'
    },
    {
      name: 'Participant 1620034595426',
      password: '44e697f3a8f95f974eef4f2b3b934640',
      addr: '0x3Eb0a647454f8A84FbE8b018cf667fC055fE47E8'
    },
    {
      name: 'Participant 1620034625060',
      password: 'password',
      addr: '0x77DA2DBFc8f2c406dd6ca3F50701AA2ba6C567d1'
    }
  ]
  testWingine(parts)
}

main()

