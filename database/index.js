
const { append } = require("express/lib/response")
const {Pool} = require("pg")
const { connectionString } = require("pg/lib/defaults")
require("dotenv").config()

/*
Connection Pool
SSL Object needed for local testing of append
But will cause problems in production environment
If - else will make determination which to use
*/

let pool
if(process.env.NODE_ENV == "development"){
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    // Added for trobleshooting quesies
    // during development
    module.exports = {
        async query(text, params) {

            try{
                const res = await pool.query(text, params)
                console.log("executed query", {text})
                return res

            } catch (error){
                console.error("error in query", {text})
                throw error
            }
        },
    }
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    module.exports = pool
}
