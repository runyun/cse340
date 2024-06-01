const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

const accountModel = require("../models/account-model")

/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
      return
    }
    next()
}

/*  **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
  return [
   
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
          errors,
          title: "Login",
          nav,
          account_email,
      })
    return
  }
  next()
}

validate.accountUpdateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
  ]
}

validate.checkAccountUpdateData = async (req, res, next) => {
  const {account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)

  const account = await accountModel.getAccountById(account_id)
  if(account.account_email != account_email){
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  }

  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/edit", {
          errors,
          title: "Edit Account",
          nav,
          account_id,
          account_firstname,
          account_lastname,
          account_email,
      })
    return
  }
  next()
}

validate.updatePasswordRules = () => {
  return [

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

validate.checkPasswordUpdateData = async (req, res, next) => {
  const {account_id, account_password} = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/edit", {
          errors,
          title: "Edit Account",
          nav,
          account_id,
          account_password
      })
    return
  }
  next()
}


validate.accountUpdateTypeRules = () => {
  return [
    body("account_id")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please select an 'account'"),

    body("type_id")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please select a 'type'"),
]}

validate.checkAccountTypeUpdateData = async (req, res, next) => {
  const { account_id, type_id, account_firstname, account_lastname} = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let accountTypeList = await utilities.buildAccountTypeList(type_id)
      let accountList = await utilities.buildAccountList(res.locals.accountData.account_id, account_id)

      res.render("account/edit-type", {
          errors,
          title: "Edit Account Type",
          nav,
          accountTypeList,
          accountList,
          account_id,
          type_id,
          account_firstname,
          account_lastname,
      })
    return
  }
  next()
}

module.exports = validate