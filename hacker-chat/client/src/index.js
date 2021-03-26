import Events from 'events'
import { TerminalController } from './controllers/index.js'
import { CliConfig } from './cliConfig.js'
import { SocketClient } from './socket.js'

/**
 * @description
 *  node index.js
 *    --username igorbecker
 *    --room sala01
 *    --hostUrl localhost
 */

const [nodePath, filePath, ...commands] = process.argv

const config = CliConfig.parseArguments(commands)

// const componentEmitter = new Events()

const socket = new SocketClient(config)

await socket.initialize()

// const controller = new TerminalController()
// await controller.initializer(componentEmitter)
