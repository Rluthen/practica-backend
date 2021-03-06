const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const hbs = require('express-handlebars');
require('dotenv').config();
require('./config/passport');
const cookieSession = require('cookie-session');
const passport = require('passport');

const animalsRouter = require('./routes/animals');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

const app = express();

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['clave']
}))

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/animals', animalsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/', indexRouter);



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
  console.log(err);
  res.render('error', err);
});

module.exports = app;
