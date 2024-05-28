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
  const carName = data.inv_make + ' ' + data.inv_model;

  res.render("./inventory/itemDetail", {
    title: carName,
    nav,
    grid
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
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
    const classificationSelect = await utilities.buildClassificationList()
    req.flash(
      "notice",
      `Congratulations, you\'re successfullly added a new inventory.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)

  if (invData[0].inv_id) {
    return res.json(invData)

  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getItemByInvId(inv_id)
  const classificationDropdownlist = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationDropdownlist: classificationDropdownlist,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getItemByInvId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}


invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let {inv_id} = req.body
  inv_id = parseInt(inv_id)
  const {inv_make, inv_model} = req.body
  
  const deleteResult = await invModel.deleteInventory(inv_id)

  const itemName = inv_make + " " + inv_model

  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")

  } else {
    
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

module.exports = invCont