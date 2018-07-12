import socketIOClient from "socket.io-client";

const socket = socketIOClient("/");

const socketOn = {
  updateUser: callback => {
    console.log('Update user')
    socket.on("updateUser", user => {
      callback(user);
    });
  },
  updateUsers: callback => {
    console.log('Update users')
    socket.on("updateUsers", users => {
      callback(users);
    });
  },
  updateRoom: callback => {
    console.log('Update room')
    socket.on("updateRoom", room => {
      callback(room);
    });
  },
  updateRooms: callback => {
    console.log('Update rooms')
    socket.on("updateRooms", rooms => {
      callback(rooms);
    });
  }
};

const socketEmit = {
  joinUser: (userName, callback) => {
    console.log('User joining')
    socket.emit("joinUser", userName, err => callback(err));
  },
  joinRoom: (roomName, password) => {
    console.log('socketEvent joinRoom Fired')
    socket.emit("joinRoom", { roomName, password });
  },
  leaveRoom: roomName => {
    socket.emit("leaveRoom", roomName);
  },
  clientMessage: (text, roomName) => {
    socket.emit("clientMessage", { text, roomName });
  },
  getUserPic: () => {
    socket.emit("getUserPic");
  }
};

export { socketOn, socketEmit };
