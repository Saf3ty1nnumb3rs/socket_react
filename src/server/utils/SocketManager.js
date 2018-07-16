const moment = require('moment');
const io = require('../server.js').io;
const { Rooms } = require("./rooms")
const { Users } = require("./users")
const rooms = new Rooms();
const users = new Users();

module.exports = (socket) => {
    console.log("Socket Connected");

  socket.on('joinUser', (userName, callback) => {
    
      const err = users.addUser(socket.id, userName);   
      
      if(err) {
        return callback(err)
      }
      rooms.addUserToRoom(userName, 'Local Chat');

      socket.join('Local Chat');
      socket.room = 'Local Chat';
      
      io.emit('updateUsers', users.getUsers());
      socket.emit('updateUser', users.getUser(socket.id));
      io.emit('updateRooms', rooms.getRooms());
      socket.emit('updateRoom', rooms.getRoom(socket.room));
  });

  socket.on('joinRoom', ( {roomName, password = null} ) => {
    console.log('joinRoom server' )
    console.log('Password entered for join room:', password)
    const room = rooms.getRoom(roomName);
    if(password === ''){
      password = null
    }
    if(room && room.password !== password) {
      console.log('Password not a match on joinRoom')
      return
    }else{
      users.addRoom(socket.id, roomName);
      rooms.addRoom(roomName, password);
      rooms.addUserToRoom(users.getUser(socket.id).name, roomName);

      socket.join(roomName);
      socket.room = roomName;

      io.emit('updateUsers', users.getUsers());
      socket.emit('updateUser', users.getUser(socket.id));
      io.emit('updateRooms', rooms.getRooms());
      socket.emit('updateRoom', rooms.getRoom(socket.room));
      
    } 
  });
  
  socket.on('leaveRoom', (roomName) => {
    rooms.removeUserFromRoom(users.getUser(socket.id).name, roomName);
    users.removeRoom(socket.id, roomName);

    socket.leave(roomName);
    const user = users.getUser(socket.id);
    socket.room = user.rooms[user.rooms.length - 1];

    socket.emit('updateRoom', rooms.getRoom(socket.room));
    io.emit('updateUsers', users.getUsers());
    socket.emit('updateUser', users.getUser(socket.id));
    io.emit('updateRooms', rooms.getRooms());
  })

  socket.on('clientMessage', (data) => {
    const room = rooms.getRoom(data.roomName);
    const message = {
      sender: users.getUser(socket.id),
      text: data.text,
      time: moment().format('hh:mm a'),
    };
    console.log(message.sender)
    if (room.messages.length && message.sender === room.messages[room.messages.length - 1].sender) {
      message.consecutive = true;
    }

    rooms.addMessage(message, data.roomName);

    io.emit('updateRooms', rooms.getRooms());
  })

  socket.on('getUserPic', () => {
    io.emit('updateUsers', users.getUsers());
    socket.emit('updateUser', users.getUser(socket.id));
    io.emit('updateRooms', rooms.getRooms());
  });

  socket.on('disconnect', () => {
    const user = users.getUser(socket.id);

    if (user) {
      user.rooms.forEach((room) => {
        rooms.removeUserFromRoom(users.getUser(socket.id).name, room);
      });
    }
    users.removeUser(socket.id);

    socket.leave(socket.room);

    io.emit('updateRooms', rooms.getRooms());
    io.emit('updateUsers', users.getUsers());
  });

  // socket.on("createLocationMessage", coords => {
  //   const user = users.getUser(socket.id)

  //   if(user){
  //   io.to(user.room).emit(
  //     "newLocationMessage",
  //     generateLocationMessage(user.name, coords.latitude, coords.longitude)
  //   );
  // }
};
