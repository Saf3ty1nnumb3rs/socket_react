const path = require("path"); //built in to npm
const express = require("express");
const moment = require('moment');
const logger = require("morgan");
const multer = require("multer");
const bodyParser = require('body-parser')
const { Users } = require("./utils/users")
const { Rooms } = require("./utils/rooms")

const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http);
const publicPath = path.join(__dirname,'../client/build');
const PORT = process.env.PORT || 3001;

const users = new Users();
const rooms = new Rooms();


console.log('Path', publicPath)
console.log('Path2', publicPath + '/index.html')
app.use(logger("dev"));
app.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './client/public/img/userPics');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

app.post('/api/userPic', upload.single('userPic'), (req, res) => {
  users.updatePic(req.body.id, req.file.filename);

  res.send(req.file);
});


io.on("connection", (socket) => {
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
});
app.use(express.static(publicPath));
app.get('/*', (req, res) => {
  res.sendFile(publicPath + '/index.html');
});
http.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});

module.exports = app