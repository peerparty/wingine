const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_HTTP_PROVIDER))

async function deploy(abi, bin, args = null) {
  console.log(`DEPLOYING contract w/ args ${args}`)
  try {
    const addr = process.env.GETH_COINBASE
    const pass = process.env.GETH_PASSWORD

    web3.eth.personal.unlockAccount(addr, pass)

    const contract = new web3.eth.Contract(abi, null, { data: bin })
    
    let contractDeploy = args
      ? contract.deploy({ arguments: args })
      : contract.deploy()
    const gasPrice = await web3.eth.getGasPrice()
    const gas = await contractDeploy.estimateGas({ from: addr })
    const instance = await contractDeploy.send({
      from: addr,
      gasPrice: gasPrice, 
      gas: gas
    })

    return instance.options.address
  } catch(e) {
    console.error(e)
  }
}

function getContract(abi, contractAddr) {
  return new web3.eth.Contract(abi, contractAddr)
}

async function exec(addr, pass, contractAddr, call) {
  await web3.eth.personal.unlockAccount(addr, pass)
  let nonce = await web3.eth.getTransactionCount(addr)
  let encodedABI = call.encodeABI()
  let gas = await call.estimateGas({ from: addr })
  let gasPrice = await web3.eth.getGasPrice()
  console.log('GAS', gas, gasPrice)
  let obj = {
    from: addr,
    to: contractAddr,
    gas: gas,
    gasPrice: gasPrice,
    data: encodedABI,
    nonce: nonce,
    value: ""
  }
  let res = await web3.eth.signTransaction(obj, addr)
  let txn = await web3.eth.sendSignedTransaction(res.raw || res.rawTransaction)
  console.log(`Completed txn: ${txn.transactionHash}`)
  return txn.transactionHash
}

module.exports = {
  getContract,
  deploy,
  exec,
  web3,
}

