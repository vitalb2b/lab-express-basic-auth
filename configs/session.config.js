const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const activateSession = app => {
  app.use(session({
    secret: 'adk98a09d8as09d8as09d8as90d8a0s9d8309384d0928409q8jf0w8',
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: { maxAge: 120000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24,
    }),
  }));
};

module.exports = activateSession;