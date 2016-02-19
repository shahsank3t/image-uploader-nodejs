(function(){
	'use strict';
	var preview = $('#preview');
	preview.hide();

	function validateAction(fileObj){
		var minWidth = 755,
			minHeight = 450,
			img = new Image();

        img.onload = function() {
			if(this.width >= minWidth && this.height >= minHeight){
				uploadAction($('[type="file"]')[0].files[0]);
			} else {
				$('#loading').hide();
				alert("Image dimensions does not meet the requirement.\n"+
					"Current dimensions: "+this.width + " x " + this.height+"\n"+
					"Required minimum dimensons: "+minWidth + " x " + minHeight);
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
					if(data.images){
						showImages(data.images);
					}
				}
			},
			error: function(data){
				$('#loading').hide();
				throw new Error(data.statusText);
			}
		});
	}

	function showImages(images){
		preview.html('<h3 class="heading">Uploaded images:</h3>');
		images.forEach(function(obj){
			var elem = '<div>'+
							'<h4>'+obj.type+' ('+obj.dimensions+'):</h4>'+
							'<img src="'+obj.url+'">'+
						'</div>';
			preview.append(elem);
		});
		preview.show();
	}


	$('[name="fileToUpload"]').change(function(e){
		preview.empty().hide();
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