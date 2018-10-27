# Typescript Express Server w/ Ready-Auth

A highly-opionionated Typescript Express server to kickstart an awesome REST API for your next Awesome Unicorn App.

## The Stack

- Typescript
- Express
- Passport-JWT w/ bcrypt
- Sequelize w/ Postgres
- Morgan
- Winston
- Sentry
- Jest
- Supertest
- Prettier
- Husky commit Hooks

## Installation

```bash
git clone
yarn
```

## Usage

1. Add a .env file to the root of your project using the template below
2. Read the Auth Thoughts and decide where you want to go next with this.
3. Use it! To start the server simply run `yarn run start-dev`

### Usage Notes

- You may want to update the dependencies and such as this project was build in October 2018, there may be security flaws in some of the dependencies that time has come to bear fruit to. Do your research.
- The app auto Prettifies & lints the code on commit, you may want to adjust the prettier configuration (in .prettierrc) and the Typescript Configurations (Linting in tslint.json, Compilation in tsconfig.json) as those are probably the most subjective two.
- Routes are added to the app.js file, there you will find two routers, one strictly for auth that does not require a client auth token to use, the other for authenticated API requests. Simply add your requests in that file under the correct router.
- Configure Winston/Morgan to whatever log format you like
- Add the Implementation for routes in the controllers/ directory.
- Add tests to the tests/ directory
- Yarn script explanations:
  - `yarn run build` = will compile the code to a dist/ directory
  - `yarn run lint` = will lint the code (You could add auto-correction w/ `--fix` added to the script in package.json)
  - `yarn run test` = will run all jest tests and output a coverage report
  - `yarn run start-dev` = will run the server in watch mode auto reloading on edit of a code file
  - `yarn run start` = will try to run the compiled js entry point, assumes you have run `build` prior, `prod` is preferred
  - `yarn run prod` = will run build and then start in one swift stroke

## Example .env File

```env
PORT=3001

SENTRY_DSN="GET_FROM_SENTRY_PANEL"

BASE_URL="localhost"
CLIENT_URL="localhost"

DB_USERNAME="username"
DB_PASSWORD="password"
DB_NAME="MY_AWESOME_APP"
DB_HOSTNAME="localhost"

JWT_PUBLIC_KEY="-----RSA-----\nBLAH\n-----RSA-----"
JWT_PRIVATE_KEY="-----RSA-----\nBLAH\n-----RSA-----"
```

## Auth Thoughts/Where-to-go

- Depending on your app's data sensitivity you may need to add a token expiry
- Update the User Model
- Add Registration (I did not add it as it is very dependent upon the above user model)
- More Tests
- You may want to add a Refresh Token in place of the Auth Token
  - Implementation Recommendations:
    - Make the current token an Auth Token, and don't check the DB for it's validity. The JWT Signature component (the part after the second dot/the last part) is enough as long as `iss` & `aud` are properly configured
    - Do add a second token that you do check the DB for at a refresh access-token endpoint - pretty much the same thing as the current token, however the big difference is to remove the user payload since the `sub` is enough for identification & will prevent duplication of data in the DB
    - Another Speed option would be to instead of checking the DB for the token, instead add Redis and check that.

## License

MIT
