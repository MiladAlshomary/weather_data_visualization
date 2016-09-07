$(window).load(function(){
	
	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
		$("#data-upload").removeAttr("disabled");
	});
	
	// Browse and select a data file
	$('#data-upload').on('change', function(ee){
		var file = ee.target.files[0];
		if (!file) {
			return;
		}
		var reader = new FileReader
		reader.readAsText(file);
	
		reader.onload = function(e) {
			var contents = e.target.result;
			parseData(contents);
			
			// set the data's min/ max vaues
			setMinMaxValues();
			
			$("#main").css('opacity', 1);
			// calculate the triangles
			triangluate($finalData[$dataTimestamp], function(callback){
				$triangles = callback;
				$trianglesTotal = $triangles.length;
				
				// when done, draw them
				drawTriangulation();
			});
		};
	});
	
	// Transparency slider
	$("#transparency .value").html($canvasOpacity);
	$("#transparency .slider").slider({
			step: 0.1,
			min: 0,
			max: 1,
			value: $canvasOpacity
	})
	.on("slide", function( event, ui ) {
		// when sliding, update the value of the canvas opacity
		$("#transparency .value").html(ui.value);
		$("." + $canvasClass).css('opacity', ui.value);
	});
	
});