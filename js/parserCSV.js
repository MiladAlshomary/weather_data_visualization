function setMinMaxValues(timestamp){
	$finalDataMinVal = 150;
	$finalDataMaxVal = -150;
	
	$.each($finalData[timestamp], function(i, point){
		var temperature = point.attributes.air_temperature;
		if ( temperature != "" ){
			$finalDataMinVal = ( temperature < $finalDataMinVal ) ? temperature : $finalDataMinVal;
			$finalDataMaxVal = ( temperature > $finalDataMaxVal ) ? temperature : $finalDataMaxVal;
		}
	});

	$("#max-value span").html($finalDataMaxVal);
	$("#min-value span").html($finalDataMinVal);
	$("#attribute-gradient-w").show();
}

function parseData(content){
	if ( content == "" ) return false;
	var lines = content.split('\n');      			
	// Columns
	var columnsLine = lines[0];
	var columns = columnsLine.split(";");
	
	// Data
	var data = lines.slice(1, lines.length);
	
	$.each (data, function(i, entry){
		$rawData[i] = [];
		var entryData = entry.split(";");
		$.each (entryData, function(ii, entryValue){
			if ( columns[ii] == "air temperature" ) columns[ii] = "air_temperature";
			$rawData[i][columns[ii]] = entryValue;
		});
	});
		
	var counter = 0;
	var prevSize = 0;
	
	$("#timestamp-select option").remove();
	$.each ($rawData, function(k, pointData){
		if(pointData.Date !== undefined && pointData.air_temperature !== "") {
			// initialize array for specific time if not found
			if ($finalData[pointData.Date] === undefined ){
				$finalData[pointData.Date] = [];
				
				var dateParsed = Date.parse(pointData.Date.slice(0,-1));
				dateParsedText = dateParsed.toString('dddd dd, HH:mm');
				
				// add the timestamp to the HTML timestamp selector
				var selected = ( pointData.Date == $dataTimestamp ) ? "selected" : "";
				$("#timestamp-select").append("<option " + selected + " value='" + pointData.Date + "'>" + dateParsedText + "</option>");
			}
			
			prevSize = $finalData[pointData.Date].length;
			
			// push a new point entry for this specific time
			// convert long and lat to x, y as well before saving each Point in a time entry
			var pXY = getXY(pointData.Latitude, pointData.Longitude);
			$finalData[pointData.Date][prevSize] = new Point(pXY.x, pXY.y, pointData);
		}
		
		counter++;
	});
	
	return false;
}