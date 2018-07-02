const path = require("path"); //built in to npm
const http = require("http");
const express = require("express");
const logger = require("morgan");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users")

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));
app.use(logger("dev"));

io.on("connection", socket => {
  console.log("New User Connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required");
    }

    socket.join(params.room);
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room)

    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    //socket.leave('Pickles')

    //io.emit -> io.to('Pickles').emit

    //socket.broadcast.emit -> socket.broadcast.to('Pickles').emit

    //socket.emit
    socket.emit(
      "newMessage",
      generateMessage("Admin", `Welcome to ${params.room} Chat`)
    );
    socket.emit(
      "newMessage",
      generateMessage(
        "Admin",
        "Visit Our Other favorite Channel: Gherkin Schnacken"
      )
    );

    socket.broadcast.to(params.room).emit(
      "newMessage",
      generateMessage("Admin", `${params.name} has joined`)
    );
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    const user = users.getUser(socket.id)
    if(user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage' , generateMessage(user.name, message.text));
    }
   
    callback("This is from the server");
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
    const user = users.removeUser(socket.id)

    if(user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room))
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`))
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = app;
