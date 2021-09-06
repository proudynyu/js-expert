import { constants } from "./constants.js";

export default class SockerBuilder {
  constructor({ socketUrl, namespace }) {
    this.socketUrl = `${socketUrl}/${namespace}`;
    this.OnUserConnected = () => {};
    this.OnUserDisconnected = () => {};
  }

  setOnUserConnected(fn) {
    this.OnUserConnected = fn;
    return this;
  }
  setOnUserDisconnected(fn) {
    this.OnUserDisconnected = fn;
    return this;
  }

  build() {
    const socket = globalThis.io.connect(this.socketUrl, {
      withCredentials: false,
    });

    socket.on("connection", () => console.log());
    socket.on(constants.events.USER_CONNECTED, this.OnUserConnected);
    socket.on(constants.events.USER_DISCONECTED, this.OnUserDisconnected);

    return socket;
  }
}
