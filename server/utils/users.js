[
  {
    id: "1",
    name: "Josh",
    room: "Pickles"
  }
];

//Modify users to include images or avatars, rooms to be array(or object?) including 'Lobby Chat'

// getUsers, getUser, addUser, updateUserImage, removeUser

class Users {
  constructor() {
      this.users = [];
  }
  addUser (id, name, room) {
      let user = {id, name, room};
      this.users.push(user);
      return user;
  }
  removeUser (id) {
      //return user that was removed
      const user = this.getUser(id)

      if(user) {
          this.users = this.users.filter((user) => user.id !== id)
            //filter sets array equal to the objects not having the argument id
          return user
      }
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0]
  }
  getUserList (room) {
      let users = this.users.filter((user) => user.room === room)
      let namesArray = users.map((user) => user.name)

      return namesArray;
  }

  uniqueNamesOnly(name, room){
    const user = this.users.filter(user => (name === user.name && room===user.room))[0];
    return user?true:false;
  }
}
module.exports = { Users }
// class Person {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   getUserDescription() {
//     return `${this.name} is ${this.age} year(s) old.`;
//   }
// }
// var me = new Person("Rick", 58);
// const description = me.getUserDescription();
// console.log(description);
