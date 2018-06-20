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


    socket.emit('newMessage', {
        from: 'John',
        text: "See you then",
        createdAt: 123343421

    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message )
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})




server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

module.exports = app;