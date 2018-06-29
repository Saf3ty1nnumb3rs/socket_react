const expect = require('expect');


const { Users } = require('./users')

describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Groupies'
        },{
            id: '2',
            name: 'Jen',
            room: 'React Groupies'
        },{
            id: '3',
            name: 'Jeff',
            room: 'Node Groupies'
        }]
    })
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
    it('should remove a user', () => {
        const userId = '1';
        const user = users.removeUser(userId)

        expect(user.id).toBe(userId)
        expect(users.users.length).toBe(2)

    })
    it('should not remove user', () => {
        const userId = '99';
        const user = users.removeUser(userId)
        expect(user).toNotExist()
        expect(users.users.length).toBe(3)
    })
    it('should find user', () => {
        const userId = '2';
        const user = users.getUser(userId);

        expect(user.id).toBe(userId)
    })
    it('should not find user', () => {
        const userId = '99';
        const user = users.getUser(userId)

        expect(user).toNotExist()
    })
    it('should return users from Node Groupies', () => {
        const userList = users.getUserList('Node Groupies')

        expect(userList).toEqual(['Mike', 'Jeff'])
    })
    it('should return users from React Groupies', () => {
        const userList = users.getUserList('React Groupies')

        expect(userList).toEqual(['Jen'])
    })
})