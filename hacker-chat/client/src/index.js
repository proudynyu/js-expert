import { TerminalController } from './controllers/index.js'

import Events from 'events'

const componentEmitter = new Events()
const controller = new TerminalController()

await controller.initializer(componentEmitter)