const express = require('express')
const bodyParser = require('body-parser')
const generalRouter = require('./routes/general.routes')
const protectedRouter = require('./routes/protected.routes')
const { prisma } = require('./db');
const { generatePassword, generateDemoSubscribtionDate } = require('./utils/utils')
const jwt = require('jsonwebtoken')

const PORT = 3000
const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded())

app.use('/protected', protectedRouter)

app.use('/', generalRouter)

app.listen(PORT, () => {
    console.log('Started server on port:', PORT)
})