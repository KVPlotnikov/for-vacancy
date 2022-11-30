const Router = require('express')
const router = new Router()
const accountController = require('../controller/account.controller')
const paymentController = require('../controller/payment.controller')

router.post('/login', accountController.login)

router.post('/signup', accountController.signup)

router.post('/restore-password', accountController.restorePassword)

router.post('/payments/webhook', paymentController.confirmTransaction)

module.exports = router