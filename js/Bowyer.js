//bowyer to implement dlnay trianglulation

function triangluate(points) {
	var triangles = [];
	var bounds = getXYBoundingBox(points);
	var leftUpPoint = new Point(bounds.minX, bounds.minY);
	var leftDownPoint = new Point(bounds.minX, bounds.maxY);
	var rightUpPoint = new Point(bounds.maxX, bounds.minY);
	var rightDownPoint = new Point(bounds.maxX, bounds.maxY);

	var superTri = getSuperTriangle(leftUpPoint, leftDownPoint, rightDownPoint, rightUpPoint);
	triangles.push(superTri);
	for (var i = points.length - 1; i >= 0; i--) {
		var point = points[i];
		var badTriangles = [];
		for (var i = triangles.length - 1; i >= 0; i--) {
			var t = triangles[i];
			if(t.isInsideCircumcircle(point)) {
				badTriangles.push(t);
			}
		}
	}

	
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
	var h = dot(leftUpPoint.sub(leftDownPoint), P)/dot(F,P);//( (A-C) * P ) / ( F * P )

	F.x = F.x * h;
	F.y = F.y * h;
	var inteP = leftDownPoint.add(F);

	var superTri = new Triangle(leftDownPoint, leftUpPoint, inteP);

	return superTri;
}