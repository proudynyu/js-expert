export default class Controller {
  constructor({

  }) {

  }

  async init() { }

  static async initialize(deps) {
    const controller = new Controller(deps)
    return controller.init()
  }
}