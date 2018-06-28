const path = require('path') //built in to npm
const http = require('http')
const express = require('express')
const logger = require('morgan')
const socketIO = require('socket.io')
const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')


const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath))
app.use(logger('dev'))

io.on('connection', (socket) => {
    console.log('New User Connected')

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Pickle Chat'))
    socket.emit('newMessage', generateMessage('Admin', 'Visit Our German Sister Channel: Gherkin Schnacken'))

    socket.broadcast.emit('newMessage', generateMessage( 'Admin', 'New User has joined'))

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required')
        }
        callback();
    })

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message );
        io.emit('newMessage', generateMessage( message.from, message.text));
        callback('This is from the server');
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})




server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

module.exports = app;