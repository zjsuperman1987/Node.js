// 最基本的静态文件服务器最终版 修改后是支持range的服务器
var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	mime = require('mime'),
	base = "home/examples/public_html";
// 解析range的方法
function processRange(res,ranges,len){
	var start, end;
	// 从range中提取start和stop
	var rangeArray = ranges.split('-');
	start = parseInt(rangeArray[0].substr(6));
	end = parseInt(rangeArray[1]);

	if(isNaN(start)) start = 0;
	if(isNaN(end)) end = len - 1;
	// 若start 超过文件长度
	if(start > len - 1){
		res.setHeader('Content-Range', 'bytes */' + len);
		res.writeHead(416);
		res.end();
	}
	// end 不能超过文件长度
	if(end > len - 1)
		end = len - 1;
	return{start:start, end:end};
}



http.createServer(function(req,res){
	pathname = base + req.url;
	console.log(pathname);

	// 判断是否存在文件夹或文件
	fs.stat(pathname,function(err,stats){
		if(err){
			res.writeHead(404);
			res.write('Bad request 404\n');
			res.end();
		}else if(stats.isFile()){
			var opt = {};
			// 如果没有range
			res.statusCode = 200;
			var len = stats.size;

			// 带有range的请求
			if(req.headers.range){
				opt = processRange(res,req.headers.range,len);
				// 设置长度
				len = opt.end - opt.start + 1;

				// 设置状态码206
				res.statusCode = 206;
				// 设置 header
				var ctstr = 'bytes ' + opt.start + '-' + opt.end + '/' + stats.size;
				res.setHeader('Content-Range', ctstr);
			}
			console.log('len ' + len);
			res.setHeader('Content-Length', len);

			// 内容类型
			var type = mime.lookup(pathname);
			console.log(type);
			res.setHeader('Content-Type', type);
			res.setHeader('Access-Ranges', 'bytes');

			// 200 status -找到文件，无错误 没修改range时候的代码
			// res.statusCode = 200;
			
			// 创建文件读取流
			var file = fs.createReadStream(pathname,opt);
			file.on('open',function(){
				file.pipe(res);
			});
			file.on('error',function(err){
				console.log(err);
			})
		}else{
			res.writeHead(403);
			res.write('Directory access is forbidden');
			res.end();
		}
	})
}).listen(8124);
console.log('Server runing at 8124/');