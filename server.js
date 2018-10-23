var express = require('express');
var multer	=	require('multer');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

global.__basedir = __dirname;

var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {

          callback(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  },
  onFileUploadStart: function(file) {

       if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/doc' || file.mimetype == 'image/xls  ') {
           return true;
       }
       else
       {
           return false;
       }
   }


});

var upload = multer({ storage : storage}).single('userPhoto');

require('./app/routers/file.router.js')(app, router, upload);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

app.post('/api/photo',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file. Check file extension !!!");
		}
		res.end("File is uploaded");
	});
});

app.get('/',function(req,res) {
  res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection',function(socket) {

                connections.push(socket);
                console.log('Connected : %s sockets Connected', connections.length);

                //disconnect
                socket.on('disconnect', function(data) {
                  users.splice(users.indexOf(socket.username), 1);
                  updateUsernames();
                  connections.splice(connections.indexOf(socket), 1);
                  console.log('disconnected : %s socket Connected', connections.length);
                });

                //send messages
                socket.on('send message', function(data) {
                  io.sockets.emit('new message', {msg: data, user: socket.username});
                });
                //new users
                socket.on('new user', function(data, callback) {
                  callback(true);
                  socket.username = data;
                  users.push(socket.username);
                  updateUsernames();
                });

                function updateUsernames() {
                  io.sockets.emit('get users', users);
                }


});
