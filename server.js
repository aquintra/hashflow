var express = require("express");
var app = express();
var port = process.env.PORT || 3333;
var io = require('socket.io').listen(app.listen(port));
var siteUrl = '<YOUR-URL-HERE>';
var Instagram = require('instagram-node-lib');
var http = require('http');
var request = ('request');
var intervalID;

var tag = "selfie";

var pub = __dirname + '/public',
    view = __dirname + '/views';

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Instagram secret
var clientID = '',
    clientSecret = '';

// Instagram config
Instagram.set('client_id', clientID);
Instagram.set('client_secret', clientSecret);
Instagram.set('callback_url', siteUrl + 'callback');
Instagram.set('redirect_uri', siteUrl);
Instagram.set('maxSockets', 10);

Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: tag,
  aspect: 'media',
  callback_url: siteUrl + 'callback',
  type: 'subscription',
  id: '#'
});

// Socket config
io.configure(function () {
  io.set("transports", [
    'websocket'
    , 'xhr-polling'
    , 'flashsocket'
    , 'htmlfile'
    , 'jsonp-polling'
  ]);
  io.set("polling duration", 10);
});

// Server config
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(pub));
    app.use(express.static(view));
    app.use(express.errorHandler());
});

app.get("/views", function(req, res){
    res.render("index");
});

app.get('/callback', function(req, res){
    var handshake =  Instagram.subscriptions.handshake(req, res);
});

// Get data for every new image
app.post('/callback', function(req, res) {
    var data = req.body;
    data.forEach(function(tag) {
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+clientID;
      sendMessage(url);
    });
    res.end();
});

// Get url so we can make a call
function sendMessage(url) {
  io.sockets.emit('show', { show: url });
}

console.log("Being awesome at " + port);
