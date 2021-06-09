require("dotenv").config();
var bcrypt = require("bcryptjs")
var createError = require('http-errors');
var express = require('express');
var passport = require("passport");
var session = require("express-session");
var LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
var flash = require('connect-flash');

var mongoose = require("mongoose");
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"))

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { messages: "Incorrect username!" })
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user)
        } else {
          return done(null, false, { messages: "Incorrect password!"})
        }
      })
    })
  })
)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  app.locals.currentUser = req.user;
  req.session.currentUser = req.user;
  next();
}); // gives user access to currentUser variables 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())

// route handling code
app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
