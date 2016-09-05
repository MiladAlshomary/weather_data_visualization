function getXY(lat, lng){
	return $map.getProjection().fromLatLngToPoint(new google.maps.LatLng(lat, lng));
}

$(window).load(function(){
	
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
			console.log("Fetched data file...");
			parseData(contents);
			console.log("Parsed data file...");
			triangluate($finalData["2016-07-23T00:00:00Z"]);
		};
	});
	
	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
		$("#data-upload").removeAttr("disabled");
	});
	
	function parseData(content){
			if ( content == "" ) return false;
			var lines = content.split('\n');      			
			// Columns
			var columnsLine = lines[0];
			var columns = columnsLine.split(";");
			
			// Data
			var data = lines.slice(1, lines.length);
			
			var tempData = {};
			
			$.each (data, function(i, entry){
				tempData[i] = [];
				var entryData = entry.split(";");
				$.each (entryData, function(ii, entryValue){
					tempData[i][columns[ii]] = entryValue;
				});
			});
			
			var counter = 0;
			var prevSize = 0;
			$.each (tempData, function(k, pointData){
				
				// initialize array for specific time if not found
				if ( $finalData[pointData.Date] === undefined ){
					$finalData[pointData.Date] = [];
				}
				
				prevSize = $finalData[pointData.Date].length;
				
				// push a new point entry for this specific time
				// convert long and lat to x, y as well before saving each Point in a time entry
				var pXY = getXY(pointData.Latitude, pointData.Longitude);
				$finalData[pointData.Date][prevSize] = new Point(pXY.x, pXY.y, pointData);
				
				counter++;
			});
			
			console.log($finalData);
		
	}// parseData

});