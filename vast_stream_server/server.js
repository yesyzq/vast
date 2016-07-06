// setup Dependencies
var connect = require('connect'), express = require('express'), port = (process.env.PORT || 8081);
var Client = require("./client");
var jsonfile = require('jsonfile')
var file = 'stream.json'
// Setup Express
var server = express.createServer();
server.configure(function() {
  server.set('views', __dirname + '/views');
  server.set('view options', {layout : false});
  server.use(connect.bodyParser());
  server.use(express.cookieParser());
  server.use(express.session({secret : "shhhhhhhhh!"}));
  server.use(connect.static(__dirname + '/static'));
  server.use(server.router);
});

// setup the errors
server.error(function(err, req, res, next) {
  if (err instanceof NotFound) {
    res.render('404.jade', {
      locals : {
        title : '404 - Not Found',
        description : '',
        author : '',
        analyticssiteid : 'XXXXXXX'
      },
      status : 404
    });
  } else {
    res.render('500.jade', {
      locals : {
        title : 'The Server Encountered an Error',
        description : '',
        author : '',
        analyticssiteid : 'XXXXXXX',
        error : err
      },
      status : 500
    });
  }
});
server.listen(port);



///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req, res) {
  res.render('index.jade', {
    locals : {
      title : 'Your Page Title',
      description : 'Your Page Description',
      author : 'Your Name',
      analyticssiteid : 'XXXXXXX'
    }
  });
});

server.get('/stream', function(req, res) {
  var uid = "xduac@connect.ust.hk";
  new Client(uid, "vast2016.labworks.org:80", function(ws, message) {
    if (message.type === "control") {
      // control message from the server
      message.body.forEach(function(d) {
        if (d.state === "GOOD" && d.streamIds) {
          // control message for selecting a stream to add
          res.write(JSON.stringify({uid : uid, streamId : d.streamIds[0]}));
          ws.send(JSON.stringify({uid : uid, streamId : d.streamIds[0]}));
        } else if (d.state === "BAD") {
          // Uh oh - handle the error
          console.error(d);
          res.end();
        }
      });
    } else {
      // data message
      jsonfile.writeFile(file, message, function (err) {
        console.error(err)
      })
      res.write(JSON.stringify(message));
      console.log(message);
    }
  });

});

// A Route for Creating a 500 Error (Useful to keep around)
server.get('/500',
           function(req, res) { throw new Error('This is a 500 Error'); });

// The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res) { throw new NotFound; });

function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://0.0.0.0:' + port);
