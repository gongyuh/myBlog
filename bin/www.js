const http = require('http')
const serverHandle = require('../app')

const PORT = 8000

const server = http.createServer(serverHandle)

server.listen(PORT)

console.log('listen 8000...')