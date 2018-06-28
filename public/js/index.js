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

    socket.on('newLocationMessage', (message) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('target', '_blank');
        a.innerHTML += 'My Current Location'

        let name = document.createTextNode(`${message.from}: `);
        li.appendChild(name);
        a.setAttribute('href', `${message.url}`)
        li.appendChild(a)
        document.getElementById('messages').appendChild(li);
    })


    document.getElementById('message-form').addEventListener('submit', function (e) {
        e.preventDefault()
        socket.emit('createMessage', {
            from: 'User',
            text: document.getElementsByName('message')[0].value
        }, function(){
            document.getElementById('message-form').reset()

        })
    })
    const locationButton = document.getElementById('send-location');
    locationButton.addEventListener('click', () => {
        if(!navigator.geolocation) {
            return alert('Geolocation not supported by your browser.')
        }
        navigator.geolocation.getCurrentPosition( (position) => {
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
            console.log(position)
        }, () => {
            alert('Unable to fetch location');
        })
    })