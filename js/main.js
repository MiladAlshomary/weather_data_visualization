var overlay;

var xx = 100;
var yy = 100;
var triangles = [
	{p1: {x: 464, y: 134, val: 19.3, lat: 53.633186, lng: 9.988085}, p2: {x: 432, y: 138, lat:53.53316, lng:8.576083 ,val:19.4}, p3: {x: 435, y: 125, lat: 53.871254, lng: 8.705821 ,val: 18.6}}
];

USGSOverlay.prototype = new google.maps.OverlayView();

function drawTriangulation() {
	for (var i = triangles.length - 1; i >= 0; i--) {
		t = triangles[i];
		t = new Triangle(
				new Point(464, 134, {air_temperature: 19.3, Latitude: 53.633186, Longitude: 9.988085}),
				new Point(432, 138, {air_temperature: 14, Latitude: 53.53316, Longitude: 8.576083}),
				new Point(435, 125, {air_temperature: 23.8, Latitude: 53.871254, Longitude: 8.705821})
	  );
		addOverlay(t);
	}
}

function addOverlay(triangle){
	// The photograph is courtesy of the U.S. Geological Survey.
	window.overlay = new USGSOverlay(triangle, window.map);
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

function loadHeatMapPoints(json) {
	var jsonObj = JSON.parse(json);
	var points = [];
	for (var key in jsonObj) {
	  if (jsonObj.hasOwnProperty(key)) {
		point = jsonObj[key];
		latlng = window.map.getProjection().fromPointToLatLng(new google.maps.Point(point.x, point.y));
		points.push({location: latlng, weight: point.value});
	  }
	}

	heatmap = new google.maps.visualization.HeatmapLayer({
          data: points,
          map: window.map,
	  dissipating : false
        });

var gradient = [
	  'rgba(0, 0, 0, 0)','rgba(25, 0, 0, 1)', 'rgba(50, 0, 0, 1)', 'rgba(75, 0, 0, 1)', 'rgba(100, 0, 0, 1)', 'rgba(125, 0, 0, 1)' ,'rgba(200, 0, 0, 1)', 'rgba(255, 0, 0, 1)'
	]
	heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
	heatmap.set('radius', 20);

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

/**
* onAdd is called when the map's panes are ready and the overlay has been
* added to the map.
*/
USGSOverlay.prototype.onAdd = function() {
	
	// Create the img element and attach it to the div.
	var canvas = document.createElement('canvas');
	canvas.style.border = 'none';
	canvas.style.borderWidth = '0px';
	canvas.style.position = 'absolute';
	canvas.className = "fuckme";    

	this.canvas_ = canvas;

	// Add the element to the "overlayImage" pane.
	var panes = this.getPanes();
	panes.overlayImage.appendChild(this.canvas_);
};

function getTriangleArea(aa, bb, cc){
	var ab = bb.sub(aa);
	var ac = cc.sub(aa);
	
	return cross(ab, ac) / 2;
}

USGSOverlay.prototype.draw = function() {
	var canvas = this.canvas_;
	// We use the south-west and north-east
	// coordinates of the overlay to peg it to the correct position and size.
	// To do this, we need to retrieve the projection from the overlay.
	var overlayProjection = this.getProjection();
	var p1 = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(t[0].attributes.Latitude, t[0].attributes.Longitude));
	var p2 = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(t[1].attributes.Latitude, t[1].attributes.Longitude));
	var p3 = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(t[2].attributes.Latitude, t[2].attributes.Longitude));

	var result = getBounds([p1, p2, p3]);

	// Resize the image's div to fit the indicated dimensions.
	canvas.style.left = result.minX + 'px';
	canvas.style.top  = result.minY + 'px';
	canvas.style.width = (result.maxX - result.minX) + 'px';
	canvas.style.height = (result.maxY - result.minY) + 'px';
	canvas.style.opacity = 0.9;

	var pp1 = convertPosition(p1, result, canvas.width, canvas.height);
	var pp2 = convertPosition(p2, result, canvas.width, canvas.height);
	var pp3 = convertPosition(p3, result, canvas.width, canvas.height);
	
	t[0].x = pp1.x;
	t[0].y = pp1.y;
	t[1].x = pp2.x;
	t[1].x = pp2.y;
	t[2].x = pp3.x;
	t[2].x = pp3.y;
	
	var triangleGradient = function(point){
		
		
		if ( !t.containsPoint(point) ){
			return [0, 0, 0, 0];
		}
		
		else{
			// find u, v and w
			// u = CAP_Area / ABC_Area
			// v = ABP_Area / ABC_Area
			
			var a = t[0];
			var b = t[1];
			var c = t[2];
			
			// Get area of ABC triangle (the triangle we are currently in in the loop!)
			var ABC_Area = getTriangleArea(a, b, c);

			// Get area of all 3 triangles that sum up to 1 inside ABC (passing by point P)
			var CAP_Area = getTriangleArea(c, a, point);
			var ABP_Area = getTriangleArea(a, b, point);

			var u = CAP_Area / ABC_Area;
			var v = ABP_Area / ABC_Area;

			var pVal = u * a.attributes.air_temperature + v * b.attributes.air_temperature + (1-u-v) * c.attributes.air_temperature;

				// Normalization
			var normalizedAttributeVal = ( (pVal - $finalDataMinVal) / ($finalDataMaxVal - $finalDataMinVal) );
			var aR = 0;   var aG = 0; var aB=255;  // blue
			var bR = 255; var bG = 0; var bB=0;    // red

			var red   = ( (bR - aR) * normalizedAttributeVal ) + aR;
			var green = ( (bG - aG) * normalizedAttributeVal ) + aG;
			var blue  = ( (bB - aB) * normalizedAttributeVal ) + aB;

			return [red, green, blue, 255];
		}
	}
	
	process(this.canvas_, triangleGradient);
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