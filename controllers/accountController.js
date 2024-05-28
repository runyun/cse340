const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })

  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

async function login(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const regResult = await accountModel.login(
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re successfullly log in.`
    )
    res.status(201).render("/", {
      title: "Home",
      nav,
    })

  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })

      req.flash("notice", "You're logged in")

      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }

      return res.redirect("/account/")
    }
    
  } catch (error) {
    return new Error('Access Forbidden')
  }
  
 }

async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

async function buildAccountEdit(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const account = await accountModel.getAccountById(account_id)

  res.render("account/edit", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_id: account.account_id,
  })
}

async function updateAccount(req, res, next) {
  const nav = await utilities.getNav()
  const {account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname,account_email)

  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)
    res.locals.accountData = accountData

    req.flash("notice", `The account was successfully updated.`)
    res.redirect("/account")

  } else {
    
    req.flash("notice", "Sorry, the update failed.")
    res.redirect("/account")

  }
}

async function updatePassword(req, res, next) {
  const nav = await utilities.getNav()
  const {account_id, account_password} = req.body

  let hashedPassword =''
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)

  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update.')
    res.status(500).render("account/edit", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id
    })
  }

  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

  if (updateResult) {
    req.flash("notice", `The password was successfully updated.`)
    res.redirect("/account/")

  } else {
    
    req.flash("notice", "Sorry, the update failed.")
    res.redirect("/account/")

  }
}

async function logout(req, res, next) {
  res.clearCookie("jwt")
  res.redirect('/')
}


module.exports = { buildLogin, buildRegister, registerAccount, login, accountLogin, buildLoginManagement: buildAccountManagement, buildAccountEdit, updateAccount, updatePassword, logout}