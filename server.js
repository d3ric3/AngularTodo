
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var expressJwt = require('express-jwt');
global.jwt_secret = 'qwe1r3f';

var app = express();

// We are going to protect /api routes with JWT
app.use('/api', expressJwt({ secret: global.jwt_secret }));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
app.use(function(err, req, res, next) {
  // Treat as 404
  if (~err.message.indexOf('not found')) return next();
  // Log it
  console.error(err.stack);
  // Error page
  res.status(500).render('root/500', { error: err.stack });
});

// Assume 404 since no middleware responded
app.use(function(req, res, next) {
  res.status(404).render('root/404', { url: req.originalUrl, error: 'Not found' });
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// init db
require('./app/models')(app);

// init controllers
require('./app/controllers')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
