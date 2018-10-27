import * as Sentry from "@sentry/node"
import * as bcrypt from "bcrypt"
import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"
import Sequelize from "../db"
import logger from "../logger"

import { Model } from "sequelize-typescript"
import User from "../db/models/user"

const generateJwtForUser = (user: Model<User>): [string, number] => {
  const secret: jwt.Secret = process.env.JWT_PRIVATE_KEY || "undefined"

  // We set the issuedAt to now and return it as part of the Function so the DB matches the token
  const iat = Math.floor(Date.now() / 1000)

  if (secret === "undefined") {
    logger.error('ENV Variable "JWT_PRIVATE_KEY" is not defined!')
  }

  return [
    jwt.sign({ ...user.toJSON(), iat }, secret, {
      algorithm: "RS256",
      audience: process.env.CLIENT_URL,
      issuer: process.env.BASE_URL,
      subject: user.id.toString()
    }),
    iat
  ]
}

export let login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await Sequelize.models.User.findOne({ where: { email } })

    if (user) {
      const doPasswordsMatch = await bcrypt.compare(password, user.password)

      if (doPasswordsMatch) {
        const [token, issuedAt] = generateJwtForUser(user)

        const session = Sequelize.models.Session.build({ userId: user.id, issuedAt })
        await session.save()

        return res.json({ token })
      }
    }

    return res.status(401).json({ error: "Wrong Username/Password" })
  } catch (e) {
    logger.error(e)
    Sentry.captureException(e)

    return res.status(500).json({ error: "An Internal Error has occured" })
  }
}
