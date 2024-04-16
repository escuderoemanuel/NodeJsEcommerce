const dotenv = require('dotenv')
dotenv.config()
module.exports = {
  PORT: process.env.PORT,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_COLLECTION: process.env.MONGO_COLLECTION,
  MONGO_URL: process.env.MONGO_URL,
  GITHUB_OWNED_BY: process.env.GITHUB_OWNED_BY,
  GITHUB_APP_ID: process.env.GITHUB_APP_ID,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY
}
