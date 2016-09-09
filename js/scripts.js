$(window).load(function(){
	
	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
		$("#data-upload").removeAttr("disabled");
	});
	
	function cleanupPrevExperiment(){
		//$("." + $canvasClass).remove();
		deleteMarkers();
		deletePolygons();
	}
	
	function triangulateOnTimestamp(timestamp){
		// set the data's min/ max vaues
		setMinMaxValues(timestamp);
		
		$("#main").css('opacity', 1);
		
		// Cleanup previous interpolation
		cleanupPrevExperiment();

		// console.log(timestamp);
		triangluate($finalData[timestamp], function(callback){
			$triangles = callback;
			$trianglesTotal = $triangles.length;
			
			// when done, draw them
			drawTriangulation();
		});
	}
	
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
			
			// Start triangulation
			//triangulateOnTimestamp($dataTimestamp);
			$timeStamps = Object.keys($finalData);
			window.currentTS = 0;

			for (var ts in $finalData) {
				var data = $finalData[ts];
				setMinMaxValues(ts);
				// console.log(timestamp);
				triangluate(data, function(callback){
					$triangles = callback;
					$trianglesTotal = $triangles.length;
					// when done, draw them
					drawTriangulation(callback, ts, 'none');
				});
			}

			window.setInterval(nextHeatMap, 1000);

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
	
	// Timestamp select
	$("#timestamp-select").on('change', function(){
		var timestamp = $(this).find("option:selected" ).val();
		//triangulateOnTimestamp(timestamp);
		$('.canvas-w' + $dataTimestamp.replace(/:/g, '').replace(/-/g, '')).fadeOut();
		$('.canvas-w' + timestamp.replace(/:/g, '').replace(/-/g, '')).fadeIn();
		$dataTimestamp = timestamp;
	});
	
});

function nextHeatMap() {
	var cts = $timeStamps[window.currentTS];
	window.currentTS = window.currentTS + 1;
	var nts = $timeStamps[window.currentTS]; 

	console.log(nts);
	$('.canvas-w' + cts.replace(/:/g, '').replace(/-/g, '')).fadeOut();
	$('.canvas-w' + nts.replace(/:/g, '').replace(/-/g, '')).fadeIn();
}