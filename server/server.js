const path = require('path') //built in to npm
const http = require('http')
const express = require('express')
const logger = require('morgan')
const socketIO = require('socket.io')


const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath))
app.use(logger('dev'))

io.on('connection', (socket) => {
    console.log('New User Connected')
    socket.emit('newMessage', { from: 'Admin', text: 'Welcome to the chat App'})
    socket.broadcast.emit('newMessage', { 
        from: 'Admin', 
        text: 'New User has joined',
        createdAt: new Date().getTime()
    })

    socket.on('createMessage', (message) => {
        console.log('createMessage', message );
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        } )
        socket.broadcast.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})




server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

module.exports = app;