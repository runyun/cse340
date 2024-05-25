// Needed Resources
const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController.js')
const utilities = require("../utilities/index.js")
const regValidate = require('../utilities/account-validation')


router.get('/login', utilities.handleErrors(accountController.buildLogin));

router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get(
    "/", 
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildLoginManagement)
)

module.exports = router
    