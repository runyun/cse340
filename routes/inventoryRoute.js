// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController.js')
const utilities = require("../utilities/index.js")


// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));
// Route to build item by inventory id 
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvId));

module.exports = router
    