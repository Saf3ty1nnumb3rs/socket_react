const path = require("path"); //built in to npm
const express = require("express");
const logger = require("morgan");
const multer = require("multer");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
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

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required");
    }
    if(users.uniqueNamesOnly(params.name, params.room)){
      return callback('Name is taken.')
    }

    socket.join(params.room);
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room)

    io.to(params.room).emit('updateUserList', users.getUserList(params.room))


//WELCOME MESSAGE
    socket.emit(
      "newMessage",
      generateMessage("Admin", `Welcome to ${params.room} Chat`)
    );

//VISIT REC
    socket.emit(
      "newMessage",
      generateMessage(
        "Admin",
        "Visit Our Other favorite Channel: Gherkin Schnacken"
      )
    );

//ENTRANCE ANNOUNCEMENT
    socket.broadcast.to(params.room).emit(
      "newMessage",
      generateMessage("Admin", `${params.name} has joined`)
    );
    callback();
  });

//CREATE MESSAGE
  socket.on("createMessage", (message, callback) => {
    const user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage' , generateMessage(user.name, message.text));
    }
   
    callback();
  });

//CREATE LOCATION MESSAGE
  socket.on("createLocationMessage", coords => {
    const user = users.getUser(socket.id)

    if(user){
    io.to(user.room).emit(
      "newLocationMessage",
      generateLocationMessage(user.name, coords.latitude, coords.longitude)
    );
  }
  });

//DISCONNECT from socket
  socket.on("disconnect", () => {
    console.log("User was disconnected");

    const user = users.removeUser(socket.id)

    if(user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room))
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`))
    }
  });
});

app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/client/build/index.html`);
});

http.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});

module.exports = app;
