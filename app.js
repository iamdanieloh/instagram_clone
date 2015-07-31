var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mailer = require('express-mailer')
var engines = require('consolidate')

var routes = require('./routes/index')

var app = express()

// mailer setup

var mailtrap = {
  from: 'help@example.com',
  host: "mailtrap.io",
  port: 2525,
  auth: {
    user: "38910c6babe4b5f9d",
    pass: "39aa489272fe94"
  }
}

var mailcatcher = {
  from: 'help@example.com',
  host: "localhost",
  port: 1025,
}

mailer.extend(app, mailtrap)

// view engine setup
app.set('views', __dirname + '/views')
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())
app.engine('ejs', require('ejs').renderFile)

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('secret_key', process.env.SECRET_KEY || 'too many secrets')
app.use(cookieParser(app.get('secret_key')))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.set('default_host', process.env.DEFAULT_HOST || 'localhost:3000')

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.error(err.message, err)
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
