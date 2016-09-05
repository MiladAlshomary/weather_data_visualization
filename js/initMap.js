function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 5,
		center: {lat: 52.56441, lng: 13.308848},
		mapTypeId: 'roadmap'
	});
	
	window.map = map;
	$map = map;
	//addOverlay(new google.maps.LatLng(62.281819, -150.287132), new google.maps.LatLng(62.400471, -150.005608), './images/heatmap.png')
}

$(window).load(function(){
	initMap();
});