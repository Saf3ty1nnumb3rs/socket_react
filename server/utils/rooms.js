class Rooms {
    constructor () {
        this.rooms = [
            {
                nmae: 'Lobby Chat',
                password: null,
                users: [],
                messages: []
            }
        ];
    }

    getRooms() {
        console.log('Rooms from getRooms', this.rooms)
        return this.rooms;
    }

    getRoom(roomName) {
        console.log('Room name from getRoom', roomName)
        return this.rooms.find(room => room.name === roomName)
    }

    addRoom(roomName, password) {
        console.log('Room name form addRoom', roomName)
        if(!this.rooms.find(room => room.name === roomName)) {
            this.rooms.push({
                name: roomName,
                password,
                users: [],
                messages: []
            });
        }
    }

    removeRoom(roomName) {
        console.log(`Removing ${roomName} from rooms`)
        this.rooms = this.rooms.filter((room) => {
            if(roomName !== 'Lobby Chat') {
                return room.name !== roomName;
            }

            return room;
        })
    }
    addUserToRoom(userName, roomName) {
        console.log(`Adding ${userName} to ${roomName}`)
        const room = this.rooms.find(room => room.name === roomName);

        if(!room.users.find(user => user === userName)) {
            room.users.push(userName);
        }
    }

    removeUserFromRoom(userName, roomName) {
        console.log(`Removing ${userName} from ${roomName}`)
        const room = this.getRoom(roomName);

        if(room) {
            room.users = room.users.filter(user => user !== userName);

            if (!room.users.length) {
                this.removeRoom(roomName);
            }
        }
    }

    addMessage(message, roomName) {
        console.log(`New message in ${roomName}`)
        const room = this.rooms.find(room => room.name === roomName);

        if(room.messages.length >= 50) {
            room.messages.shift()
        }

        room.messages.push(message);
    }
}

module.exports = { Rooms }