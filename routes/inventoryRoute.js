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

router.get('/', utilities.isAuthorizedAccount, utilities.handleErrors(invController.buildManagement));

router.get('/add-classification', utilities.isAuthorizedAccount, utilities.handleErrors(invController.buildAddClassification));

router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.calssification)
)

router.get('/add-inventory', utilities.isAuthorizedAccount, utilities.handleErrors(invController.buildAddInventory));

router.post(
    "/add-inventory",
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.inventory)
)

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get('/edit/:inv_id', utilities.isAuthorizedAccount, utilities.handleErrors(invController.editInventoryView));

router.post("/update/", 
    validate.inventoryRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

router.get('/delete/:inv_id', utilities.isAuthorizedAccount, utilities.handleErrors(invController.deleteInventoryView));

router.post("/delete/", utilities.handleErrors(invController.deleteInventory));


module.exports = router
    