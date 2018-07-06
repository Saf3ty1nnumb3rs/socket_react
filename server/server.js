const path = require("path"); //built in to npm
const express = require("express");
const moment = require('moment');
const logger = require("morgan");
const multer = require("multer");

const { generateLocationMessage } = require("./utils/message");
const { Users } = require("./utils/users")
const { Rooms } = require("./utils/rooms")

const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http, {
  pingInterval: 5000,
  pingTimeout: 10000
});
const publicPath = `${__dirname}/client/build`
const PORT = process.env.PORT || 3001;

const users = new Users();
const rooms = new Rooms();

app.use(express.static(path.join(__dirname, "/client/build")));
app.use(logger("dev"));

app.get('/rooms', (req,res) => {
  let availableRooms = [];
  const rooms = io.sockets.adapter.rooms;
  console.log(rooms)
  if(rooms) {
    for( var room in rooms){
      if(!rooms[room].sockets.hasOwnProperty(room)){
        availableRooms.push(room)
      }
    }
  }
  res.send(availableRooms)
})

io.on("connection", socket => {
  console.log("New User Connected");

  socket.on('joinUser', (userName, callback) => {
    
      const err = users.addUser(socket.id, userName);   
      
      if(err) {
        return callback(err)
      }
      rooms.addUser(userName, 'Local Chat');

      socket.join('Local Chat');
      socket.room = 'Local Chat';
      
      io.emit('updateUsers', users.getUsers());
      socket.emit('updateUser', users.getUser(socket.id));
      io.emit('updateRooms', rooms.getRooms());
      socket.emit('updateRoom', roms.getRoom(socket.room));
    
  })
  socket.on('joinRoom', ({ roomName, password = null }, callback) => {
    const room = rooms.getRoom(roomName);

    if(room && room.password !== password) {
      callback('Wrong password');
    }else{
      users.addRoom(socket.id, roomName);
      rooms.addRoom(roomName, password);
      rooms.addUser(users.getUser(socket.id).name, roomName);

      socket.join(roomName);
      socket.room = roomName;

      io.emit('updateUsers', users.getUsers());
      socket.emit('updateUser', users.getUser(socket.id));
      io.emit('updateRooms', rooms.getRooms());
      socket.emit('updateRoom', rooms.getRoom(socket.room));

      callback(null)
    } 
  })
  
  socket.on('leaveRoom', (roomName) => {
    rooms.removeUser(users.getUser(socket.id).name, roomName);
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
      time: moment().format('HH:mm'),
    };
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
        rooms.removeUser(users.getUser(socket.id).name, room);
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
});

app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/client/build/index.html`);
});

http.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});

module.exports = app;
