// Source: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/* Color picker */
function colorpicker(picker){
	
	picker[0] = parseInt(picker.rgb[0]);
	picker[1] = parseInt(picker.rgb[1]);
	picker[2] = parseInt(picker.rgb[2]);
	
	if ( $("#color-picker .jscolor-active").attr("id") == "color-picker-1" ){
		$color1 = picker;
	}
	else{	
		$color2 = picker;
	}
	var hexColor1 = rgbToHex($color1[0], $color1[1], $color1[2]);
	var hexColor2 = rgbToHex($color2[0], $color2[1], $color2[2]);
	console.log(hexColor1);
	
	$("#attribute-gradient").css('background', '-webkit-linear-gradient(left, '+ hexColor1 + ', ' + hexColor2 + ')');
	$("#attribute-gradient").css('background', '-o-linear-gradient(right, '+ hexColor1 + ', ' + hexColor2 + ')');
	$("#attribute-gradient").css('background', '-moz-linear-gradient(right, '+ hexColor1 + ', ' + hexColor2 + ')');
	$("#attribute-gradient").css('background', 'linear-gradient(to right, '+ hexColor1 + ', ' + hexColor2 + ')');
}

$(window).load(function(){
	
	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
		$("#data-upload").removeAttr("disabled");
	});
	
	function cleanupPrevExperiment(){
		//$("." + $canvasClass).remove();
		deleteMarkers();
		deletePolygons();
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
			$("#loading-img").show()
			var contents = e.target.result;
			renderAllData(contents, function(){
				$("#loading-img").hide()
				$("#main").css('opacity', 1);
			});
		};

	});
	
	$("#refresh-colors").on('click', function(){
		//TODO re draw all triangles
	});
	
	$("#play-triangles").on('click', function(){
		window.setInterval(nextHeatMap, 1000);
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

function renderAllData(contents, callback) {
	parseData(contents);
	// Start triangulation
	$timeStamps = Object.keys($finalData);
	window.currentTS = 0;

	for (var ts in $finalData) {
		var data = $finalData[ts];
		setMinMaxValues(ts);
		// console.log(timestamp);
		var result = triangluate(data);
		$triangles = result;
		$trianglesTotal = $triangles.length;
		// when done, draw them
		drawTriangulation(result, ts, 'none');
	}

	if(callback && typeof(callback) === "function"){
		callback();
	}
}

function nextHeatMap() {
	var cts = $timeStamps[window.currentTS];
	window.currentTS = window.currentTS + 1;
	var nts = $timeStamps[window.currentTS]; 

	console.log(nts);
	$('.canvas-w' + cts.replace(/:/g, '').replace(/-/g, '')).fadeOut();
	$('.canvas-w' + nts.replace(/:/g, '').replace(/-/g, '')).fadeIn();
}