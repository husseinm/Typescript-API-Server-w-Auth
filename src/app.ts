import * as Sentry from "@sentry/node"
import * as bodyParser from "body-parser"
import * as dotenv from "dotenv"
import * as express from "express"
import * as morgan from "morgan"

import * as passport from "passport"
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from "passport-jwt"
import Sequelize from "./db"
import logger from "./logger"

import * as authController from "./controllers/auth"
import * as userController from "./controllers/user"

const app = express()
export const authApi = express.Router()
export const restrictedApi = express.Router()
export const authenticate = () => passport.authenticate("jwt", { session: false })

// Do not pull the .env file in production since we will use true ENV variables
//  on the production environment
if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

/* ====== *
 * Config *
 * ====== */
app.set("port", process.env.PORT || 8080)
app.disable("x-powered-by")

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)
app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler)

// Support application/json type post data
app.use(bodyParser.json())

app.use(
  morgan(
    "[:date[clf]] :remote-addr :remote-user | :method :url [HTTP/:http-version :status] " +
      "| Bytes: :res[content-length] | :response-time ms \n\n"
  )
)
morgan.token("remote-user", req => (req.user ? req.user.email : "Anonymous"))

passport.use(
  new JwtStrategy(
    {
      algorithms: ["RS256"],
      audience: process.env.CLIENT_URL,
      issuer: process.env.BASE_URL,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_PUBLIC_KEY
    },
    async (jwtPayload: any, done: VerifiedCallback) => {
      const userId = jwtPayload.sub
      const issuedAt = jwtPayload.iat

      // TODO: Cache w/ Redis instead
      const session = await Sequelize.models.Session.findOne({ where: { userId, issuedAt } })
      return session ? done(null, jwtPayload) : done(null, null)
    }
  )
)

/* ====== *
 * Routes *
 * ====== */
authApi.post("/login", authController.login)
// TODO: Signup
// TODO: Registration

restrictedApi.use(passport.authenticate("jwt", { session: false, failWithError: true }))
restrictedApi.use((req, res, next) => {
  Sentry.configureScope(scope => {
    if (req.user && req.user.id && req.user.email) {
      scope.setUser({ id: req.user.id.toString(), email: req.user.email })
    }
  })

  next()
})

// Put Authentication-Secured Endpoints here
restrictedApi.get("/users", userController.getUser)

// Catch-all handler intended for failed Auth preventing Passport from sending HTML to client
restrictedApi.use(
  (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    switch (err.name) {
      case "AuthenticationError":
        return res.status(401).json({ error: "Your session has expired. Please login again." })
      default:
        logger.error(
          `An unknown & unhandled error occured in the handler error catch-all: ${err.toString()}`
        )
        return res
          .status(500)
          .json({ error: "An unknown error occured. You probably need to login again." })
    }
  }
)

app.use("/auth", authApi)
app.use("/api", restrictedApi)
app.use("*", (req, res, next) => {
  return res.status(404).json({ error: "Resource Not found" })
})

export default app
