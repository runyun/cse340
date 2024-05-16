// Needed Resources
const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController.js')
const utilities = require("../utilities/index.js")


router.get('/login', utilities.handleErrors(accountController.buildLogin));

router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router
    