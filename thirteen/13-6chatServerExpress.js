var express = require('express'),
	sio = require('socket.io'),
	static = require('serve-static'),
	http = require('http'),
	fs = require('fs'),
	app = express();
var server = http.createServer(app);
app.use(static(__dirname + '/public'));

app.get('/',function(req,res){
	res.send('hello');
	// fs.readFile(__dirname + '/public/chatClient.html', function(err,data){
	// 	if(err){
	// 		res.writeHead(500);
	// 		return res.end('Error loading chatClient.html');
	// 	}
	// 	res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
	// 	res.end(data);
	// })
})
var io = sio.listen(server);
server.listen(8124);
io.sockets.on('connection',function(socket){
	socket.on('addme',function(username){
		socket.username = username;
		socket.emit('chat', 'SERVER', 'You have connected');
		socket.broadcast.emit('chat', 'SERVER', username + ' is on deck');
	})
	socket.on('sendchat', function(data){
		io.sockets.emit('chat', socket.username, data);
	})
	socket.on('disconnect',function(){
		io.sockets.emit('chat', 'SERVER', socket.username + ' has left the building');
	})
})
