// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController.js')
const utilities = require("../utilities/index.js")
const validate = require('../utilities/inv-validation')


// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));
// Route to build item by inventory id 
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvId));

router.get('/', utilities.handleErrors(invController.buildManagement));

router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));

router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.calssification)
)

module.exports = router
    