// 问题 不稳定 时常掉线客户端

var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs');
app.listen(8124);
function handler(req,res){
	fs.readFile(__dirname + '/chatClient.html', function(err,data){
		if(err){
			res.writeHead(500);
			return res.end('Error loading chatClient.html');
		}
		res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
		res.end(data);
	})
}
io.sockets.on('connection',function(socket){
	socket.on('addme',function(username){
		socket.username = username;
		socket.emit('chat','SERVER', 'You have connected');
		socket.broadcast.emit('chat','SERVER', username + ' is on deck');
	})

	socket.on('sendchat',function(data){
		io.sockets.emit('chat', socket.username, data);
	})

	socket.on('disconnect',function(){
		io.sockets.emit('chat','SERVER',socket.username + 'has left the building');
	})
})








