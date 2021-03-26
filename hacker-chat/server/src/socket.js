import http from 'http'
import { v4 } from 'uuid'

import { constants } from './constants.js'

export class SocketServer {
  constructor( port ) {
    this.port = port
  }

  async initialize(eventEmiiter) {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('hey there')
    })

    server.on('upgrade', (req, socket) => {
      socket.id = v4()
      
      const headers = [
        'HTTP/1.1 101 Web Socket Protocol Handshake',
        'Upgrade: WebSocket',
        'Connection: Upgrade',
        ''
      ].map(line => line.concat('\r\n')).join('')


      socket.write(headers)

      eventEmiiter.emit(constants.event.NEW_USER_CONNECT, socket)
    })
    
    return new Promise((resolve, reject) => {
      server.on('error', reject)
      server.listen(this.port, resolve(server))
    })
  }
}