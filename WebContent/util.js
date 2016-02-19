(function(){
	'use strict';
	var preview = $('#preview');

	function validateAction(fileObj){
		var width = 1024,
			height = 1024,
			img = new Image();

        img.onload = function() {
        	if(this.width === width && this.height === height){
        		uploadAction($('[type="file"]')[0].files[0]);
        	} else {
				$('#loading').hide();
        		alert("Image dimensions are not proper.\n"+
        			"Current dimensions: "+this.width + " x " + this.height+"\n"+
        			"Required dimensons: "+width + " x " + height);
        	}
        };
        img.onerror = function() {
			$('#loading').hide();
            alert( "Selected file is not an image.");
        };
        img.src = URL.createObjectURL(fileObj);
	}

	function uploadAction(fileObj){
		var data = new FormData();
		data.append('fileToUpload', fileObj);
		$.ajax({
			url: '/upload',
			type: 'POST',
			data: data,
			cache:false,
            contentType: false,
            processData: false,
			success: function(data){
				if(data.status === 'success'){
					$('#loading').hide();
					preview.html('<label>Uploaded images:</label><br/>');
					data.images.forEach(function(obj){
						var img = new Image();
						img.src = obj.url;
						preview.append('<label>'+obj.type+':</label>').append(img).append('<br/>');
					});
				}
			},
			error: function(data){
				$('#loading').hide();
				throw new Error(data.statusText);
			}
		});
	}


	$('#submit').on('click', function(e){
		preview.empty();
		$('#loading').show();
		var fileInput = $('[type="file"]')[0];
		var fileObj = fileInput.files[0];
		if(!fileObj){
			alert('Select an image to upload');
			$('#loading').hide();
		} else {
			validateAction(fileObj);
		}
	});
})();