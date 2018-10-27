"use strict"

const bcrypt = require("bcrypt")

module.exports = {
  up: (queryInterface, Sequelize) => {
    const hash = bcrypt.hashSync("password", 10)

    return queryInterface.bulkInsert(
      "User",
      [
        {
          firstName: "Mahdi",
          lastName: "Hussein",
          email: "mahdi@wellbrighttech.com",
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      "User",
      { email: { [Sequelize.Op.eq]: "mahdi@wellbrighttech.com" } },
      {}
    )
  }
}
