const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8000 })

let users = {
  "0x2cF231b08B8c4c97250066027B122adB0DA15Ab0": {},
  "0x117f35819Be1cfe23A1Fa4f5B0e68043D9A0c667": {},
  "0xAed0062F798BEE3276a94C0b28A7418705885094": {},
  "0xE50F967e730B641971BB328bBE14e5EA8ab0665f": {}
}

function sendJoinFail(ws) {
  ws.send(JSON.stringify({
    cmd: 'ERROR',
    txt: `Sorry, there are already ${users.length} participating users. :(`
  }))
}

function sendUser(ws, id) {
  ws.send(JSON.stringify({
    cmd: 'USER',
    id: id 
  }))
}

function addUser(ws) {
  let join = false
  Object.keys(users).forEach(id => {
    if(!join && !users[id].ws) {
      ws.id = id
      users[id].ws = ws
      join = true
      sendUser(ws, id)
    }
  })
  if(!join) sendJoinFail(ws)
}

function handleMsg(ws, msg) {
  console.log(`WS got ${msg}`)
  const data = JSON.parse(msg)
  if(data.cmd === 'HELLO') addUser(ws)
  //else if(data.cmd === 'ANSWER') answerResponse(data)
  //else if(data.cmd === 'PROMPT') promptResponse(data)
}

function handleDisconnect(ws) {
  console.log(`disconnect: ${ws.id}`)
  if(ws.id) delete users[ws.id].ws
}

wss.on('connection', (ws) => {
  ws.on('message', (msg) => handleMsg(ws, msg))
  ws.on('close', (code, reason) => handleDisconnect(ws))
})

//ws.send('something')
