require('dotenv').config();

const { PORT } = process.env;
const { GOOGLE_CLIENT_ID } = process.env;
const { GOOGLE_CLIENT_SECRET } = process.env;
const { GITHUB_CLIENT_ID } = process.env;
const { GITHUB_CLIENT_SECRET } = process.env;
const { TWITTER_CLIENT_ID } = process.env;
const { TWITTER_CLIENT_SECRET } = process.env;
const { POSTGRES_PORT } = process.env;
const { POSTGRES_USER } = process.env;
const { POSTGRES_PASSWORD } = process.env;
const { HOST } = process.env;
const { DATABASE_NAME } = process.env;

module.exports = {
  PORT,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_PORT,
  HOST,
  DATABASE_NAME,
};
