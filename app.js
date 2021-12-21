const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sqlite = require("better-sqlite3");
const session = require("express-session");
const SqliteStore = require("better-sqlite3-session-store")(session)

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');


require('dotenv').config();

const app = express();

// Start database
const { sequelize } = require("./models");

sequelize.authenticate()
  .then(async () => {
    // await sequelize.sync({ force: true });
    console.log('Connection has been established successfully.')
  })
  .catch(error => console.error('Unable to connect to the database:', error));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'squirrelly');



const env = process.env.NODE_ENV || "development";

// Session setup
const cookie = env === "development" ? {} : { secure: true };

const db = new sqlite("sessions.db", { verbose: console.log });
// const { auth } = require("./middleware/auth");

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.APP_SECRET,
  store: new SqliteStore({
    client: db,
    expired: {
      clear: true,
      intervalMs: 900000 //ms = 15min
    }
  }),
  resave: false,
  saveUninitialized: true,
  cookie
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth");
  }
  next();
}

function guest(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}

app.use('/auth', guest, authRouter);
app.use('/', auth, indexRouter);
app.use('/users', auth, usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
