const dotenv = require("dotenv")

dotenv.config()

module.exports = {
  database: process.env.DB_NAME,
  dialect: "postgres",
  host: process.env.DB_HOSTNAME,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  seederStorage: "sequelize"
}
