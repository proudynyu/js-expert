import { ComponentsBuilder } from './components.js'
import { constants } from '../constants/index.js'

const {
  events: {
    app: {
      STATUS_UPDATED,
      ACTIVITY_UPDATED,
      MESSAGE_RECEIVED,
      MESSAGE_SEND
    }
  }
} = constants

export class TerminalController {
  #usersColor = new Map()
  constructor(){}

  pickColor() {
    return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
  }

  getUserColor(userName) {
    if (this.#usersColor.has(userName)) return this.#usersColor.get(userName)

    const collor = this.pickColor()
    this.#usersColor.set(userName, collor)

    return collor
  }

  onInputReceived(eventEmitter) {
    return function() {
      const message = this.getValue()
      console.log(message)
      this.clearValue()
    }
  }

  onMessageReceived({ screen, chat }) {
    return msg => {
      const { userName, message } = msg
      const collor = this.getUserColor(userName)
      chat.addItem(`{${collor}}{bold}${userName}{/}{/}: ${message}`)
      screen.render()
    }
  }

  onLogChanged({ screen, activity }) {
    return msg => {
      const [ userName ] = msg.split(/\s/)
      const collor = this.getUserColor(userName)
      activity.addItem(`{${collor}}{bold}${msg.toString()}{/}{/}`)
      screen.render()
    }
  }

  onStatusChanged({ screen, status }) {
    return users => {
      const { content } = status.items.shift()
      status.clearItems()
      status.addItem(content)

      users.forEach(userName => {
        const collor = this.getUserColor(userName)
        status.addItem(`{${collor}}{bold}${userName}{/}`)
      })

      screen.render()
    }
  }

  registerEvents(eventEmitter, components) {
    eventEmitter.on(MESSAGE_RECEIVED, this.onMessageReceived(components))
    eventEmitter.on(ACTIVITY_UPDATED, this.onLogChanged(components))
    eventEmitter.on(STATUS_UPDATED, this.onStatusChanged(components))
  }

  async initializer(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: 'HackerChat - Igor Becker' })
      .setLayoutComponent()
      .setInputComponent(this.onInputReceived(eventEmitter))
      .setChatComponent()
      .setActivityLogComponent()
      .setStatusComponent()
      .build()

    this.registerEvents(eventEmitter, components)
    components.input.focus()
    components.screen.render()


    // setInterval(() => {
    //   const users = ['igorbecker']
    //   eventEmitter.emit(STATUS_UPDATED, users)
    //   users.push('ana')
    //   eventEmitter.emit(STATUS_UPDATED, users)
    //   users.push('hackerMan')
    //   eventEmitter.emit(STATUS_UPDATED, users)
    // }, 1000)
  }

}