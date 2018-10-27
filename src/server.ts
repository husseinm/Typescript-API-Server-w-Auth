import * as Sentry from "@sentry/node"

import app from "./app"
import logger from "./logger"

/* =========== *
 * Let'er Rip! *
 * =========== */
app.listen(app.get("port"), () => {
  Sentry.init({ dsn: process.env.SENTRY_DSN })

  const startMsg = `App is Online! Port: ${app.get("port")}, Mode: ${app.get("env")}`

  logger.info("")
  logger.info(startMsg)
  logger.info("~".repeat(startMsg.length) + "\n\n")
})
