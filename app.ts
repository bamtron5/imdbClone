import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as movies from './api/movies';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as acl from 'acl';
import * as colors from 'colors';
import Permission from './config/permission';
import routes from './routes/index';

let app = express();

//config for pass port
require("./config/passport");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const MONGO_URI = "mongodb://coder:camps@ds115738.mlab.com:15738/imdbclone";
let dbc = mongoose.connect(MONGO_URI);

mongoose.connection.on('connected', () => {
  Permission.setPermission(dbc);
});

mongoose.connection.on('error', (err) => {
  console.log('mongoose error');
  console.log(err);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//initializer methods for express
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('trust proxy', 1) // trust first proxy

//pathing
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/ngApp', express.static(path.join(__dirname, 'ngApp')));
app.use('/api', express.static(path.join(__dirname, 'api')));

//routes
app.use('/', routes);

// APIs
app.use('/api', require('./api/makes'));
app.use('/api', require('./api/cars'));
app.use('/api', require('./api/movies'));
app.use('/api', require('./api/genres'));
app.use('/api', require('./api/guestbook'));
app.use('/api', require('./api/deepThought'));
app.use('/api', require('./api/users'));

// redirect 404 to home for the sake of AngularJS client-side routes
app.get('/*', function(req, res, next) {
  if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
    return next({ status: 404, message: 'Not Found' });
  } else {
    return res.render('index');
  }
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err:Error, req, res, next) => {
    res.status(err['status'] || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err:Error, req, res, next) => {
  res.status(err['status'] || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export = app;
