const moment = require('moment');

const aTimeStamp = moment().valueOf()
console.log(aTimeStamp)

const createdAt = 123456
const date = moment(createdAt);
date.add(1, 'years').subtract(9, 'months')
console.log(date.format('MMMM Do, YYYY h:mm a'))

