USGSOverlay.prototype = new google.maps.OverlayView();

function drawTriangulation() {
	var progress = 0;
	
	for (i = 0; i < $trianglesTotal; i++){
		drawTriangleOnMap($triangles[i]);
		addOverlay($triangles[i]);
	}
}

function drawPointMarker(point) {
	point.marker = new google.maps.Marker({
		position: new google.maps.LatLng(point.attributes['Latitude'], point.attributes['Longitude']),
		map: $map,
		title: point.attributes['Stationname']
	});

	var infowindow = new google.maps.InfoWindow({
		content: point.attributes['Stationname'] + ' : ' + point.attributes['air_temperature']
	});

	point.marker.addListener('click', function() {
		infowindow.open(map, point.marker);
	});
	$allMapMarkers.push(point.marker);
}

// delete markers
function deleteMarkers() {
	for (var i = 0; i < $allMapMarkers.length; i++) {
		$allMapMarkers[i].setMap(null);
	}
	$allMapMarkers = [];
}
	
function deletePolygons() {
	for (var i = 0; i < $allMapPolygons.length; i++) {
		$allMapPolygons[i].setMap(null);
	}
	$allMapPolygons = [];
}

function drawTriangleOnMap(t) {
	drawPointMarker(t[0]);
	drawPointMarker(t[1]);
	drawPointMarker(t[2]);

	// Construct the polygon.
	var polygon = new google.maps.Polygon({
		paths: [
			{lat: parseFloat(t[0].attributes['Latitude']), lng: parseFloat(t[0].attributes['Longitude'])},
			{lat: parseFloat(t[1].attributes['Latitude']), lng: parseFloat(t[1].attributes['Longitude'])},
			{lat: parseFloat(t[2].attributes['Latitude']), lng: parseFloat(t[2].attributes['Longitude'])}
		],
		strokeColor: '#FF0000',
		strokeOpacity: 0.2,
		strokeWeight: 2,
	});

	polygon.setMap($map);
	$allMapPolygons.push(polygon);
}

function addOverlay(triangle){
	new USGSOverlay(triangle, window.map);
}

function addMarker(lat, lng, name) {
	var myLatLng = {lat: lat, lng: lng};
	var marker = new google.maps.Marker({
		position: myLatLng,
		map: window.map,
		title: name
	});
}

function addMarkerByXY(x, y) {
	latlng = window.map.getProjection().fromPointToLatLng(new google.maps.Point(x, y));
	addMarker(latlng.lat(), latlng.lng(), name)
}

/** @constructor */
function USGSOverlay(triangle, map) {
	// Now initialize all properties.
	this.triangle = triangle;
	this.map_ = map;
	// Define a property to hold the image's div. We'll
	// actually create this div upon receipt of the onAdd()
	// method so we'll leave it null for now.
	thiscanvas = null;

	// Explicitly call setMap on this overlay
	this.setMap(map);
}

function getTriangleArea(aa, bb, cc){
	var ab = bb.sub(aa);
	var ac = cc.sub(aa);
	
	return cross(ab, ac) / 2;
}

/**
* onAdd is called when the map's panes are ready and the overlay has been
* added to the map.
*/
USGSOverlay.prototype.onAdd = function() {
	// Create the img element and attach it to the div.
	var canvas = document.createElement('canvas');
	canvas.style.position = 'absolute';
	canvas.className = $canvasClass;    

	this.canvas_ = canvas;

	// Add the element to the "overlayImage" pane.
	var panes = this.getPanes();
	panes.overlayImage.appendChild(this.canvas_);
	
	var canvas = this.canvas_;
	// We use the south-west and north-east
	// coordinates of the overlay to peg it to the correct position and size.
	// To do this, we need to retrieve the projection from the overlay.
	var overlayProjection = this.getProjection();
	var p1 = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.triangle[0].attributes.Latitude, this.triangle[0].attributes.Longitude));
	var p2 = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.triangle[1].attributes.Latitude, this.triangle[1].attributes.Longitude));
	var p3 = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.triangle[2].attributes.Latitude, this.triangle[2].attributes.Longitude));

	var result = getBounds([p1, p2, p3]);

	// Resize the image's div to fit the indicated dimensions.
	canvas.style.left = result.minX + 'px';
	canvas.style.top  = result.minY + 'px';
	canvas.style.width = (result.maxX - result.minX) + 'px';
	canvas.style.height = (result.maxY - result.minY) + 'px';
	canvas.style.opacity =  $canvasOpacity;
	
	var pp1 = convertPosition(p1, result, canvas.width, canvas.height);
	var pp2 = convertPosition(p2, result, canvas.width, canvas.height);
	var pp3 = convertPosition(p3, result, canvas.width, canvas.height);
	
	this.triangle[0].x = pp1.x;
	this.triangle[0].y = pp1.y;
	this.triangle[1].x = pp2.x;
	this.triangle[1].y = pp2.y;
	this.triangle[2].x = pp3.x;
	this.triangle[2].y = pp3.y;
	
	var triangleHere = this.triangle;
	colors = [{from:[1,0,0], to:[0,0,1]},{from:[1,1,1], to:[0,0,0]},{from:[0,0,1], to:[0,1,1]},{from:[1,1,1], to:[0,0,0]}];
	
	//random
	var r = 0;//Math.floor((Math.random() * 4) + 0);
	var aR = colors[r].from[0];   var aG = colors[r].from[1]; var aB=colors[r].from[2];
	var bR = colors[r].to[0]; var bG = colors[r].to[1]; var bB=colors[r].to[2];
	
	var triangleGradient = function(point){
		
		if (!triangleHere.containsPoint(point) ){
			return [0, 0, 0, 0];
		}
		
		else{
			//var aR = 0;   var aG = 0; var aB=1;  // blue
			//var bR = 1; var bG = 0; var bB=0;    // red
			
			var a = triangleHere[0];
			var b = triangleHere[1];
			var c = triangleHere[2];
			
			// Get area of ABC triangle (the triangle we are currently in in the loop!)
			var ABC_Area = getTriangleArea(a, b, c);

			// Get area of all 3 triangles that sum up to 1 inside ABC (passing by point P)
			var CAP_Area = getTriangleArea(c, a, point);
			var ABP_Area = getTriangleArea(a, b, point);

			var u = CAP_Area / ABC_Area;
			var v = ABP_Area / ABC_Area;

			var pVal = u * parseFloat(b.attributes.air_temperature) + v * parseFloat(c.attributes.air_temperature) + (1-u-v) * parseFloat(a.attributes.air_temperature);
			// var pVal = (parseFloat(a.attributes.air_temperature) + parseFloat(b.attributes.air_temperature) + parseFloat(c.attributes.air_temperature) ) / 3;

			// Normalization
			var normalizedAttributeVal = ( (pVal - $finalDataMinVal) / ($finalDataMaxVal - $finalDataMinVal) );
			
			// Heuristic threshholding
			
			// if ( normalizedAttributeVal >= 0.8 ){
			// 	normalizedAttributeVal = Math.pow(normalizedAttributeVal, 2);
			// }
			// else{
			// 	normalizedAttributeVal = Math.sqrt(normalizedAttributeVal);
			// }
			
			// if ( normalizedAttributeVal > 1 ) normalizedAttributeVal = 1;
			// if ( normalizedAttributeVal < 0 ) normalizedAttributeVal = 0;

			var red   = ( (bR - aR) * normalizedAttributeVal ) + aR;
			var green = ( (bG - aG) * normalizedAttributeVal ) + aG;
			var blue  = ( (bB - aB) * normalizedAttributeVal ) + aB;

			return [red, green, blue, 1];
		}
	}
	
	process(this.canvas_, triangleGradient);
};

USGSOverlay.prototype.draw = function() {
};

USGSOverlay.prototype.onRemove = function() {
	this.canvas_.parentNode.removeChild(this.canvas_);
};

// Set the visibility to 'hidden' or 'visible'.
USGSOverlay.prototype.hide = function() {
	if (this.canvas_) {
	  // The visibility property must be a string enclosed in quotes.
	  this.canvas_.style.visibility = 'hidden';
	}
};

USGSOverlay.prototype.show = function() {
	if (this.canvas_) {
	  this.canvas_.style.visibility = 'visible';
	}
};

USGSOverlay.prototype.toggle = function() {
	if (this.canvas_) {
	  if (this.canvas_.style.visibility === 'hidden') {
	    this.show();
	  } else {
	    this.hide();
	  }
	}
};

// Detach the map from the DOM via toggleDOM().
// Note that if we later reattach the map, it will be visible again,
// because the containing <div> is recreated in the overlay's onAdd() method.
USGSOverlay.prototype.toggleDOM = function() {
	if (this.getMap()) {
	  // Note: setMap(null) calls OverlayView.onRemove()
	  this.setMap(null);
	} else {
	  this.setMap(this.map_);
	}
};

function getBounds(points) {
	var minX = 1000000;
	var minY = 1000000;
	var maxX = -100000;
	var maxY = -100000;
	for(var k in points) {
		p = points[k];
		if(p.x < minX) { minX = p.x}
		if(p.x > maxX) { maxX = p.x}
		if(p.y < minY) { minY = p.y}
		if(p.y > maxY) { maxY = p.y}
	}
	
	return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
}


function convertPosition(p, bounding, canW, canH) {
	p.x = ((p.x - bounding.minX)/(bounding.maxX - bounding.minX)) * canW;
	p.y = ((p.y - bounding.minY)/(bounding.maxY - bounding.minY)) * canH;

	return p;
}