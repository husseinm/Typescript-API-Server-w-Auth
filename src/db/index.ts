import { ISequelizeConfig, Sequelize } from "sequelize-typescript"
import logger from "../logger"
import * as config from "./config"

const configs: ISequelizeConfig = {
  database: config.database || "",
  dialect: config.dialect,
  host: config.host || "",
  logging: logger.info,
  modelPaths: [__dirname + "/models"],
  password: config.password || "",
  username: config.username || ""
}

export default new Sequelize(configs)
