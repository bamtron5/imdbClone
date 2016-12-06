import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as movies from './api/movies';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as acl from 'acl';
import * as colors from 'colors';
import Permission from './config/permission';
import routes from './routes/index';
import * as session from 'express-session';
const MongoStore = require('connect-mongo')(session);

//loggin style
colors.setTheme({
  warn: 'red'
});

//create the app
let app = express();

//load your env vars
if (app.get('env') === 'development') {
  let dotenv = require('dotenv');
  dotenv.load();
}

//config for passport login
require("./config/passport");

//config req.session your session
app.set('trust proxy', 1); // trust first proxy
let sess = {
  maxAge: 172800000, // 2 days
  secure: false,
  httpOnly: true
}

//set to secure in production
if (app.get('env') === 'production') {
  sess.secure = true // serve secure cookies
}

//use session config
app.use(session({
  cookie: sess,
  secret: process.env.SESSION_SECRET, // can support an array
  store: new MongoStore({
    url: process.env.MONGO_URI
  }),
  unset: 'destroy',
  resave: false,
  saveUninitialized: false //if nothing has changed.. do not restore cookie
}));

//connect to DB
let dbc = mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('connected', () => {
  Permission.setPermission(dbc);
});

//report DB error
mongoose.connection.on('error', (err) => {

  /**
   * TODO errorHandler
   */
  console.log('mongoose error');
  console.log(err);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//initializer methods for express
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));

//pathing
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
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

 /**
 *   --==CRUD ERROR HANDLING==--
 *   NOTE npm i --save method-override @types/method-override
 *   NOTE import * as methodOverride from 'method-override';
 *   NOTE https://www.npmjs.com/package/method-override
 *   @summary Allows you override a DELETE|PUT|POST|GET req for a specific routes
 *   Accept no injection from bodies on specific routes
 *   @tutorial
 *   app.use(methodOverride(function (req, res) {
 *     if (req.body && typeof req.body === 'object' && '_method' in req.body) {
 *       // look in urlencoded POST bodies and delete it
 *       var method = req.body._method
 *       delete req.body._method
 *       return method
 *     }
 *   }));
 *
 */

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


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err: Error, req, res, next) => {

    res.status(err['status'] || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
// TODO Error interface
app.use((err:Error, req, res, next) => {
  res.status(err['status'] || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export = app;
