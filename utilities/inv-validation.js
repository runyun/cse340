const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

validate.classificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .escape()
        .isAlpha()
        .withMessage("Only Aphabet and without space.")
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.")
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
      return
    }
    next()
}

validate.inventoryRules = () => {
    return [
      body("classification_id")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please select a 'Classification'"),

      body("inv_make")
        .trim()
        .escape()
        .isLength({ min: 3 })
        .withMessage("Please provide a 'Make' with 3 minimum characters"),

      body("inv_model")
        .trim()
        .escape()
        .isLength({ min: 3 })
        .withMessage("Please provide a 'Model' with 3 minimum characters"),
      
      body("inv_year")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("'Year' only allow nubmer")
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide an 'Year' with 4 digit number"),

      body("inv_description")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a 'Description'"),

      body("inv_image")
        .trim()
        // .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide an 'Image' URL"),

      body("inv_thumbnail")
        .trim()
        // .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a 'Thumbnail' URL"),

      body("inv_price")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Price only allow number")
        .isLength({ min: 1 })
        .withMessage("Please provide a 'Price'"),

      body("inv_miles")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Miles only allow number")
        .isLength({ min: 1 })
        .withMessage("Please provide a 'Miles'"),

      body("inv_color")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a 'Color'"),

    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
            classification_id
     } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationDropdownlist = await utilities.buildClassificationList(classification_id)

        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            classificationDropdownlist,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
      return
    }
    next()
}


module.exports = validate