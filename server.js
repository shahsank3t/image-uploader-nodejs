var fs = require('fs');
var morgan = require('morgan');
var multer = require('multer');
var easyimg = require('easyimage');
var cloudinary = require('cloudinary');
var express = require('express');
var uploadPath = './uploads/';
var port = 3000;

var app = express();

//Configuration of Cloudinary Server
cloudinary.config({
	cloud_name: 'shahsank3t-tmp',
	api_key: '579158554985182',
	api_secret: '7pbyHu5tNmJdH6_CJxeey396xQ8'
});

app.use(morgan('dev')); 
app.use(multer({dest: uploadPath}).single('fileToUpload'));

app.use(express.static(__dirname + uploadPath.substr(1, uploadPath.length - 2)));
app.use(express.static(__dirname+'/WebContent'));

var sizeArr = [	{type: 'horizontal', width: 755, height:450},
				{type: 'vertical', width: 365, height:450},
				{type: 'horizontal_small', width: 365, height:212},
				{type: 'gallery', width: 380, height:380}
			];

//Upload cropped images to Cloudinary Image Storage Server
function uploadToCloud(resultsArr){
	return Promise.all(resultsArr.map(function(obj){
		return cloudinary.uploader.upload(obj.path);
	}));
}

app.post('/upload', function(req, res){
	var promises = [],
		response = [],
		name = req.file.filename;
	
	//Cropping the image and saving locally
	sizeArr.forEach(function(obj){
		promises.push(easyimg.crop({
			src: uploadPath + name,
		    dst: uploadPath+obj.type+'/'+name,
		    cropwidth: obj.width,
		    cropheight: obj.height,
		    x: 0,
		    y: 0
		}));
	});

	Promise.all(promises).then(function(resultsArr){
		var paths = [];
		//remove original image from the local server
		fs.unlink(uploadPath+name);

		uploadToCloud(resultsArr).then(function(cloudResults){

			//Delete cropped images from local server
			sizeArr.forEach(function(obj){
				fs.unlink(uploadPath+obj.type+'/'+name);
				response.push({type: obj.type});
			});

			cloudResults.forEach(function(obj, i){
				response[i].url = obj.url;
			});

			res.send({
				status: 'success',
				images: response
			});
		}).catch(function(err){
			console.log(err);
			throw new Error("Internal Server Error");
		});
	});
});

app.listen(port);