const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message')
describe('generateMessage', () => {
    it('should generate correct message object', () => {
        const from = 'Jen'
        const text = 'Some message'
        const message = generateMessage(from, text)

        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({from, text})
        
    })
})

describe('generateLocationMesseage', () => {
    it('Should generate correct location object', () => {
        const from = 'Your mom';
        const latitude = 69;
        const longitude = 86;
        const url = 'https://www.google.com/maps?q=69,86';
        const message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({from, url})

    })
})