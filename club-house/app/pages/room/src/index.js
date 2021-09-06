import SocketBuilder from "../../shared/socket.js";
import { constants } from "../../shared/constants.js";

const socketBuilder = new SocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
});

const socket = socketBuilder
  .setOnUserConnected((user) => console.log("user connected", user))
  .setOnUserDisconnected((user) => console.log("user disconnected", user))
  .build();

const room = {
  id: Date.now(),
  topic: "Js expert",
};

const user = {
  img: "https://cdn0.iconfinder.com/data/icons/eon-social-media-contact-info-2/32/user_people_person_users_man-256.png",
  username: "igor becker",
};

socket.emit(constants.events.JOIN_ROOM, {
  user,
  room,
});