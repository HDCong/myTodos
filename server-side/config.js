require('dotenv').config()

const { Pool } = require('pg')
    // const isProduction = process.env.NODE_ENV === 'production'
    // console.log(isProduction)
    // const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
    // console.log(connectionString)
    // console.log(process.env.DB_DATABASE + ' ' + process.env.DB_HOST + ' ' + process.env.DB_PASSWORD + ' ' + process.env.DB_PORT + ' ' + process.env.DB_USER)
    // console.log(DATABASE_URL)
    // console.log(process.env.DATABASE_URL)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

module.exports = pool