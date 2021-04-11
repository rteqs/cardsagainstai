const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

const config = require('../utils/config');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Query db for user id
  // if exist okay
  // else handle
  //
  // User.findById(id, function (err, user) {
  //   done(err, user);
  // });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: `${config.GOOGLE_CLIENT_ID}`,
      clientSecret: `${config.GOOGLE_CLIENT_SECRET}`,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // upsert to db
      //
      console.log(profile);
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: `${config.TWITTER_CLIENT_ID}`,
      consumerSecret: `${config.TWITTER_CLIENT_SECRET}`,
      callbackURL: '/auth/twitter/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // upsert to db
      //
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: `${config.GITHUB_CLIENT_ID}`,
      clientSecret: `${config.GITHUB_CLIENT_SECRET}`,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // upsert to db
      //
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
    }
  )
);

module.exports = passport;
