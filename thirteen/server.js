var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs');
	// counter; 加异步了 不需要
	
app.listen(8124);
function handler(req,res){
	fs.readFile(__dirname + '/client.html', function(err,data){
		if(err){
			res.writeHead(500);
			return res.end("Error loading client.html");
		}
		counter = 1;
		res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
		res.end(data,'utf8');
	})
}
io.sockets.on('connection', function(socket){
	// 下面空格的都是将counter 装进套接字 考虑的是 异步 
	socket.counter = 1;

	socket.emit('news',{news: 'Counting...'});
	socket.on('echo',function(data){
		// if(counter <= 50){
		if(socket.counter <= 50){
			// counter++;
			data.back += socket.counter //counter;

			socket.counter++;
			
			socket.emit('news',{news: data.back});
		}
	})
})

// =========================第二种方式======================================
// io.sockets.on('connection',function(socket){
// 	socket.send("All the news that's fit to print");
// 	socket.on('message',function(msg){
// 		console.log(msg);
// 	})
// })
// =========================第二种方式自动应答======================================
// io.sockets.on('connect',function(socket){
// 			socket.emit('news',{news: 'All the news that\'s fit to print'},function(data){
// 				console.log(data);
// 			});
// })

console.log('Server runing at 8124');