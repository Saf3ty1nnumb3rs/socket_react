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
        const formattedTime = moment(message.createdAt).format('h:mm a');
        const li = document.createElement('li')
        li.innerHTML += `${message.from} ${formattedTime}: ${message.text}`

        document.getElementById('messages').appendChild(li)
    })

    socket.on('newLocationMessage', (message) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('target', '_blank');
        a.innerHTML += 'My Current Location'

        const formattedTime = moment(message.createdAt).format('h:mm a');
        let name = document.createTextNode(`${message.from} ${formattedTime} : `);
        li.appendChild(name);
        a.setAttribute('href', `${message.url}`)
        li.appendChild(a)
        document.getElementById('messages').appendChild(li);
    })

//Form Submit Listener
    const messageTextbox = document.getElementById('message-form');
    messageTextbox.addEventListener('submit', function (e) {
        e.preventDefault()
        socket.emit('createMessage', {
            from: 'User',
            text: document.getElementsByName('message')[0].value
        }, function(){
            messageTextbox.reset()

        })
    })

    // On-click Listener
    const locationButton = document.getElementById('send-location');
    locationButton.addEventListener('click', () => {
        if(!navigator.geolocation) {
            return alert('Geolocation not supported by your browser.')
        }
        //disable button until process completes
        locationButton.setAttribute('disabled', 'true');
        locationButton.innerText = 'Sending...';
        navigator.geolocation.getCurrentPosition( (position) => {
            //re-enable button once complete
            locationButton.removeAttribute('disabled');
            locationButton.innerText = 'Send Location'
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
            console.log(position)
        }, () => {
            locationButton.removeAttribute('disabled');
            locationButton.innerText = 'Send Location'
            alert('Unable to fetch location');
        })
    })