
const utilities = require('../utilities')
const baseController = {}

baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNav()
    res.render('index', {title: 'Home', nav})
}

baseController.errorTest = async function(req, res) {
    res.render('index', {title: 'Error', nav})
}

module.exports = baseController