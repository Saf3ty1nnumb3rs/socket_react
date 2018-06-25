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
        let li = jQuery('<li></li>')
        li.text(`${message.from}: ${message.text}`)

        jQuery('#messages').append(li)
    })

    jQuery('#message-form').on('submit', function (e) {
        e.preventDefault()
        socket.emit('createMessage', {
            from: 'User',
            text: jQuery('[name=message]').val()
        }, function(){

        })
    })