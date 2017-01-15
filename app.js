var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('mongoose');
var User = require("./models/user");
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var config = require('./config');

var index = require('./controllers/index');
var settings = require('./controllers/settings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: { 
    maxAge: 60000 
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

db.Promise = global.Promise;
db.connect(`mongodb://${config.database.host}/${config.database.name}`, { 
	autoIndex: false,
	user: config.database.user,
	pass: config.database.pass
});
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new LocalStrategy({
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('message','Incorrect username'));
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('message','Incorrect password'));
      }
      return done(null, user);
    });
  }
));


app.use('/widget', index);
app.use('/', settings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
