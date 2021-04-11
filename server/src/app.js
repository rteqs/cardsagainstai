const express = require('express');
const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('./controllers/auth');
const db = require('./db');

require('express-async-errors');

const app = express();
const middleware = require('./utils/middleware');

app.disable('x-powered-by');
app.use(cors());
app.use(express.static('build'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/account/login',
    session: true,
  }),
  (req, res) => {
    console.log('here');
    res.redirect('http://localhost:3000/');
  }
);

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/account/login',
    session: true,
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/');
  }
);

app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/account/login',
    session: true,
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/');
  }
);

app.get('/table', db.createUserTable);
app.get('/account/login', (req, res) => {
  res.status(200).json(JSON.stringify({ something: 'ok' }));
});
// app.get('/account/logout');
// // app.use('/game'); // protect middleware (make sure request coming from authenticated user)
// app.get('/game/lobby'); // sends list of games in lobby through websocket
// app.get('/game/:game'); // sends player to that room if they are in that game
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
