//bowyer to implement dlnay trianglulation

function triangluate(points) {
	var bounds = getXYBoundingBox(points);
	leftUpPoint = new Point(bounds.minX, bounds.minY);
	leftDownPoint = new Point(bounds.minX, bounds.maxY);
	rightUpPoint = new Point(bounds.maxX, bounds.minY);
	rightDownPoint = new Point(bounds.maxX, bounds.maxY);

}

function getXYBoundingBox(points) {
	var minX = Number.MAX_VALUE;
	var minY = Number.MAX_VALUE;
	var maxX = Number.MIN_VALUE;
	var maxY = Number.MIN_VALUE;

	for(var k in points) {
		p = points[k];
		if(p.x < minX) { minX = p.x}
		if(p.x > maxX) { maxX = p.x}
		if(p.y < minY) { minY = p.y}
		if(p.y > maxY) { maxY = p.y}
	}
	
	return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
}


function getLatLngBoundingBox(points) {
	var minLat = Number.MAX_VALUE;
	var minLng = Number.MAX_VALUE;
	var maxLat = Number.MIN_VALUE;
	var maxLng = Number.MIN_VALUE;

	for(var k in points) {
		p = points[k];
		if(p.lat < minLat) { minLat = p.lat}
		if(p.lat > maxLat) { maxLat = p.lat}
		if(p.lng < minLng) { minLng = p.lng}
		if(p.lng > maxLng) { maxLng = p.lng}
	}
	
	return {minLat: minLat, minLng: minLng, maxLat: maxLat, maxLng: maxLng};
}

function getSuperTriangle(leftUpPoint, leftDownPoint, rightDownPoint, rightUpPoint) {
	leftUpPoint.x -= 10;
	leftUpPoint.y -= 10;
	leftDownPoint.x += 10;
	leftDownPoint.y - = 10;

	var E = rightUpPoint.sub(leftUpPoint);
	var F = rightDownPoint.sub(leftDownPoint);

	var P = new Point(- E.y, E.x);
	float h = ()
}