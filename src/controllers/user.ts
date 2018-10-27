import { Request, Response } from "express"
// import Sequelize from "../db"
// import logger from "../logger"

export let getUser = [
  async (req: Request, res: Response) => {
    const { user } = req
    return res.json({ user })
  }
]
