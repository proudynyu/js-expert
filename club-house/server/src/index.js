import SocketServer from "./utils/socket.js";
import { RoomsController } from "./controllers/roomsController.js";
import Event from "events";
import { constants } from "./utils/constants";

const port = process.env.PORT || 3000;
const socketServer = new SocketServer({ port });
const server = await socketServer.start();

const roomsController = new RoomsController();

const namespaces = {
  rooms: {
    controller: roomsController,
    eventEmitter: new Event(),
  },
};

const routeConfig = Object.entries(namespaces).map(
  ([namespace, { controller, eventEmitter }]) => {
    const controllerEvents = controller.getEvents();

    eventEmitter.on(
      constants.events.USER_CONNECTED,
      controller.onNewConnection.bind(controller)
    );

    return {
      [namespace]: { events: controllerEvents, eventEmitter },
    };
  }
);

console.log("socket server is running at", server.address().port);
