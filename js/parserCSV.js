function getXY(lat, lng){
	return $map.getProjection().fromLatLngToPoint(new google.maps.LatLng(lat, lng));
}

$(window).load(function(){
	
	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
		parseData();
	});
	
	// Get data
	function parseData(){
		jQuery.get($HTML_SITE + 'data/data.csv', function(response) {
			var lines = response.split('\n');      
			
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
		});
		
	}// parseData

});