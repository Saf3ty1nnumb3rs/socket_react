[
  {
    id: "1",
    name: "Josh",
    room: "Pickles"
  }
];

//addUser(id, name, room)
//removeUser(id)
//getUser(id)
//getUserList(room)

class Users {
  constructor() {
      this.users = [];
  }
  addUser (id, name, room) {
      let user = {id, name, room};
      this.users.push(user);
      return user;
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
