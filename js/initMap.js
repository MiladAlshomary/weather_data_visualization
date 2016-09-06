function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 7,
		center: {lat: 50.7596754, lng: 10.2076453},
		mapTypeId: 'roadmap',
		scrollwheel:  false
	});
	map.setOptions({zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});
	window.map = map;
	$map = map;
	//addOverlay(new google.maps.LatLng(62.281819, -150.287132), new google.maps.LatLng(62.400471, -150.005608), './images/heatmap.png')
}

$(window).load(function(){
	initMap();
});