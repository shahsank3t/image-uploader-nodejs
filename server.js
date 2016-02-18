var fs = require('fs');
var morgan = require('morgan');
var multer = require('multer');
var easyimg = require('easyimage');
var express = require('express');
var uploadPath = './uploads/';
var port = 3000;

var app = express();

app.use(morgan('dev')); 
app.use(multer({dest: uploadPath}).single('fileToUpload'));

app.use(express.static(__dirname + uploadPath.substr(1, uploadPath.length - 2)));
app.use(express.static(__dirname+'/WebContent'));

var sizeArr = [	{type: 'horizontal', width: 755, height:450},
				{type: 'vertical', width: 365, height:450},
				{type: 'horizontal_small', width: 365, height:212},
				{type: 'gallery', width: 380, height:380}
			];

app.post('/upload', function(req, res){
	var promises = [],
		response = [],
		name = req.file.filename;
	
	sizeArr.forEach(function(obj){
		promises.push(easyimg.crop({
			src: uploadPath + name,
		    dst: uploadPath+obj.type+'/'+name,
		    cropwidth: obj.width,
		    cropheight: obj.height,
		    x: 0,
		    y: 0
		}));
		response.push({type: obj.type, url: obj.type+'/'+name});
	});

	Promise.all(promises).then(function(resultsArr){
		resultsArr.forEach(function(obj){
			console.log('Resized and cropped: ' + obj.width + ' x ' + obj.height);
		});
		fs.unlink(uploadPath+name);
		res.send({
			status: 'success',
			images: response
		});
	});
});

app.listen(port);