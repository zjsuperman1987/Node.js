var Canvas = require('canvas');
var fs = require('fs');
// 创建canvas and context
var canvas = new Canvas(350,350);
var ctx = canvas.getContext('2d');
// 创建带阴影的长方形
// 存储context
ctx.save();
ctx.shadowOffsetX = 10;
ctx.shadowOffsetY = 10;
ctx.shadowBlur = 5;
ctx.shadowColor = 'rgba(0,0,0,0.4)';
ctx.fillStyle = '#fff';
ctx.fillRect(30,30,300,300);
// 完成阴影
ctx.restore();
ctx.strokeRect(30,30,300,300);

// MDN例子: 优化图片， 在之前创建出来的正方形中插入偏移量
ctx.translate(125,125);
for(i = 1; i < 6; i++){
	ctx.save();
	ctx.fillStyle = 'rgb(' + (51 * i) + ',' + (255 - 51 * i) + ',255)';
	for(j = 0; j < i * 6; j++){
		ctx.rotate(Math.PI * 2 / (i * 6));
		ctx.beginPath();
		ctx.arc(0, i * 12.5, 5, 0, Math.PI * 2, true);
		ctx.fill();
	}	
	ctx.restore();
	// 存储为PNG文件
	var out = fs.createWriteStream(__dirname + '/shadow.png');
	var stream = canvas.createPNGStream();
	stream.on('data', function(chunk){
		out.write(chunk);
	});
	stream.on('end',function(){
		console.log('saved png');
	})
}