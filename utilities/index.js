const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'

  data.rows.forEach((row) => {
    list += "<li>"
    list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
    list += "</li>"
  })

  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildItemGrid = async function(data){
  let grid;

  grid = '<div class="item-detail">';
    grid += `<img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">`;
    grid += `<div>
      <p><span class="detail-title">Year:</span> ${data.inv_year}</p>
      <p><span class="detail-title">Price:</span> ${Number(data.inv_price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
      <p><span class="detail-title">Description:</span> ${data.inv_description}</p>
      <p><span class="detail-title">Color:</span> ${data.inv_color}</p>
      <p><span class="detail-title">Miles:</span> ${data.inv_miles.toLocaleString()}</p>`;
    grid += '</div>';
  grid += '</div>';

  return grid;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classification_id" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {

      if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }

      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
    })
  } else {
    next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.isAuthorizedAccount = (req, res, next) => {
  const accountType = res.locals.accountData.account_type
  if(accountType == 'Client'){
    return res.redirect("/account/login")
  } 
  next()
}

Util.isAdminAccount = (req, res, next) => {
  const accountType = res.locals.accountData.account_type
  if(accountType != 'Admin'){
    return res.redirect("/account/login")
  } 
  next()
}

Util.buildAccountList = async function (login_id = null, account_id = null) {

  let data = await accountModel.getAccountsExcept(login_id)

  let accountList =
    '<select name="account_id" id="account_id" required>'
  accountList += "<option value=''>Choose an account</option>"
  data.forEach((row) => {
    accountList += '<option value="' + row.account_id + '"'

  if (
      account_id != null &&
      row.account_id == account_id
    ) {
      accountList += " selected "
    }

    accountList += ">" + row.account_firstname + " " + row.account_lastname + "</option>"
  })

  accountList += "</select>"
  return accountList
}

Util.buildAccountTypeList = async function (type_id = null) {

  let data = await accountModel.getAccountType()
  let accountTypeList =
    '<select name="type_id" id="type_id" required>'
  accountTypeList += "<option value=''>Choose a type</option>"
  data.forEach((row) => {
    accountTypeList += '<option value="' + row.type_id + '"'

    if (
      type_id != null &&
      row.type_id == type_id
    ) {
      accountTypeList += " selected "
    }

    accountTypeList += ">" + row.type_name + "</option>"
  })

  accountTypeList += "</select>"
  return accountTypeList
}

module.exports = Util