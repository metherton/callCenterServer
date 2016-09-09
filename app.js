var express = require('express');
var sessions = require('express-session');
var compression   = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var authenticate = require('./authenticate');

var LocalStrategy = require('passport-local').Strategy;

var config = require('./config');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected correctly to server");
});

var routes = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var favoriteRouter = require('./routes/favoriteRouter');
var sprintRouter = require('./routes/sprintRouter');
var storyRouter = require('./routes/storyRouter');
var validationRouter = require('./routes/validationRouter');
var loginRouter = require('./routes/loginRouter');
var sessionRouter = require('./routes/sessionRouter');

var app = express();

/* check if the application runs on heroku */
var util;

if(process.env.DYNO){
  util = require("./util-pg.js")
} else {
  util = require("./util-file.js")
}

// Secure traffic only
//app.all('*', function(req, res, next){
//  console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));
//  if (req.secure) {
//    return next();
//  };
//
//  res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
//});

app.all("/api/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, x-access-token");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(compression());
app.use(sessions({resave: true, saveUninitialized: false, secret: 'keyboard cat', name: 'session',  cookie: {expires: util.generateSessionExirationDate() }}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
  util.getConfiguration(function(error, configuration){
    if(error){
      res.status(500).json({stack: error.stack, message: error.message })
    } else {
      req.configuration = configuration;
      next();
    }
  })
})



// passport config

app.use(passport.initialize());

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/dist')));


app.use('/', routes);
app.use('/api/users', users);
app.use('/api/sprints', sprintRouter);
app.use('/api/stories', storyRouter);
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leadership',leaderRouter);
app.use('/favorites',favoriteRouter);
app.use('/api/setup/validate',validationRouter);
app.use('/api/agents/login',loginRouter);
app.use('/api/agents/session',sessionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
