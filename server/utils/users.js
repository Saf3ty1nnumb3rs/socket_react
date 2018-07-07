
class Users {
  constructor() {
    this.users = [];
  }

  getUser(id) {
    console.log('Get User', id)
    return this.users.filter(user => user.id === id)[0];
  }

  getUsers() {
    console.log('Getting users', this.users)
    return this.users;
  }

  addUser(id, name) {
    console.log(`Adding ${name} to users`)
    if (this.users.find(user => user.name === name)) {
      return "Username taken";
    }
    this.users.push({
      id,
      name,
      userPic: "/img/userPics/default_avatar.png",
      rooms: ["Local Chat"]
    });
  }

  updatePic(id, pic) {
    console.log(`Updating ${pic}`)
    this.users.find(user => user.id === id).pic = `/img/userPics/${pic}`;
  }

  removeUser(id) {
    console.log(`Removing ${id}`)
    //return user that was removed
    const user = this.getUser(id);

    if (user) {
      this.users = this.users.filter(user => user.id !== id);
      //filter sets array equal to the objects not having the argument id
    }
  }

  addRoom(id, roomName) {
    console.log(`Adding room: ${roomName}`)
    this.users.find(user => user.id === id).rooms.push(roomName);
  }

  removeRoom(id, roomName) {
    console.log(`Removing room: ${roomName}`)
    const user = this.getUser(id);
    user.rooms = user.rooms.filter(room => room !== roomName)
  }
}

module.exports = { Users };
