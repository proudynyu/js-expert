export class RoomsController {
  constructor() {}

  onNewConnection(socket) {
    const { id } = socket;
    socket.on("connection", (socket) => {
      socket.emit("userConnection", "socket id" + socket.id);

      socket.on("joinRoom", (data) => {
        console.log("dados recebidos", data);
      });
    });
  }

  joinRoom(socket, data) {
    console.log('dados recebidos', data)
  }

  getEvents() {
    const functions = Reflect.ownKeys(RoomsController.prototype)
      .filter((fn) => fn !== "constructor")
      .map((name) => [name, this[name].bind(this)]);

    return new Map(functions);
  }
}
