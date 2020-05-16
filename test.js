const WebSocket = require('ws');

function addClient() {
  const ws = new WebSocket('ws://localhost:8000')

  ws.on('open', function open() {
    ws.send(JSON.stringify({cmd: 'HELLO'}))
  })

  ws.on('message', function incoming(data) {
    console.log(data)
  })
}

for(let i = 0; i < 5; i++) {
  addClient()
}

