import Events from 'events'
import { constants } from './constants.js'
import { Controller } from './controller.js'
import { SocketServer } from './socket.js'

const port = process.env.PORT || 9898

const eventEmiiter = new Events()
const socketServer = new SocketServer(port)
const server = await socketServer.initialize(eventEmiiter)

const controller = new Controller({ socketServer })

console.log('Server is running on port: ', server.address().port)

eventEmiiter.emit(constants.event.NEW_USER_CONNECT, controller.onNewConnection.bind(controller))