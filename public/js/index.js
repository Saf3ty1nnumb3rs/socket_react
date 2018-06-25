const socket = io()
    // Client Connect
    socket.on('connect', function() {
        console.log('Connected to server.')

    })
    // Client Disconnect
    socket.on('disconnect', function() {
        console.log('Disconnected from server')
    })

    //New message call
    socket.on('newMessage', function(message) {
        console.log('New message', message)
        const li = document.createElement('li')
        li.innerHTML += `${message.from}: ${message.text}`

        document.getElementById('messages').appendChild(li)
    })

    document.getElementById('message-form').addEventListener('submit', function (e) {
        e.preventDefault()
        socket.emit('createMessage', {
            from: 'User',
            text: document.getElementsByName('message')[0].value
        }, function(){

        })
    })