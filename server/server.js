const path = require('path') //built in to npm
const express = require('express')
const logger = require('morgan')


const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
console.log(__dirname + '/../public')

const app = express();

app.use(express.static(publicPath))
app.use(logger('dev'))

const PORT =

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

module.exports = app;