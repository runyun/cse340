const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      // account_type default to the number 1, refer to 'Client' type
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 1) RETURNING *"

      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])

    } catch (error) {

      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_password, type_name AS account_type FROM account_type AS a INNER JOIN account AS b ON a.type_id = b.account_type WHERE account_email = $1',
      [account_email]
    )
    return result.rows[0]

  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_password, type_name AS account_type FROM account_type AS a INNER JOIN account AS b ON a.type_id = b.account_type WHERE account_id = $1',
      [account_id])
    return result.rows[0]

  } catch (error) {
    return new Error("No matching email found")
  }
}

async function updateAccount (account_id, account_firstname, account_lastname, account_email) {
  try {
    const result = await pool.query(
      'UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *',
      [account_firstname, account_lastname, account_email, account_id])
    return result.rows[0]

  } catch (error) {
    return error.message
  }
}

async function updatePassword (account_id, account_password) {
  try {
    const result = await pool.query(
      'UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *',
      [account_password, account_id])
    return result.rows[0]

  } catch (error) {
    return error.message
  }
}


async function getAccountsExcept(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname FROM account WHERE account_id <> $1', [account_id])
    return result.rows

  } catch (error) {
    return error.message
  }
}

async function getAccountType() {
  try {
    const result = await pool.query(
      'SELECT * FROM account_type')
    return result.rows

  } catch (error) {
    return error.message
  }
}

async function updateAccountType (account_id, type_id) {
  try {
    const result = await pool.query(
      'UPDATE public.account SET account_type = $1 WHERE account_id = $2 RETURNING *',
      [type_id, account_id])
    return result.rows[0]

  } catch (error) {
    return error.message
  }
}


module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword, getAccountsExcept, getAccountType, updateAccountType}