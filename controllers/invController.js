const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const calssificationModel = require('../models/classification-model')
const inventoryModel = require('../models/inventory-model')
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function(req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getItemByInvId(inv_id);
  const grid = await utilities.buildItemGrid(data);
  let nav = await utilities.getNav();
  const carName = data.rows[0].inv_make + ' ' + data.rows[0].inv_model;

  res.render("./inventory/itemDetail", {
    title: carName,
    nav,
    grid
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.calssification = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await calssificationModel.insertClassification(classification_name)

  if (regResult) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you\'re successfullly added a new class.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })

  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add classification",
      nav,
      errors: null,
    })
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationDropdownlist = await utilities.buildClassificationList()
  const inv_image = '/images/vehicles/no-image.png'
  const inv_thumbnail = '/images/vehicles/no-image-tn.png'

  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    classificationDropdownlist,
    inv_image,
    inv_thumbnail
  })
}


invCont.inventory = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_id,  
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color
        } = req.body


  const regResult = await inventoryModel.insertInventory(
          classification_id,  
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color)

  if (regResult) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you\'re successfullly added a new inventory.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })

  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add inventory",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont