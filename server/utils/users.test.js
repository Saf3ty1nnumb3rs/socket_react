const expect = require('expect');


const { Users } = require('./users')

describe('Users', () => {
    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: '123',
            name: 'Josh',
            room: 'Pickles'
        }
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user])
    })
})