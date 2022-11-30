const passport = require('passport')
const express = require('express')
const paymentController = require('../controller/payment.controller')
const securitiesController = require('../controller/securities.controller')

require('../auth')

const protectedRouter = express.Router()

protectedRouter.use(passport.authenticate('jwt', { session: false }))

protectedRouter.post('/initiate-payment', paymentController.initiatePayment)

protectedRouter.get('/securities', securitiesController.getSecurities)

module.exports = protectedRouter