function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 6,
		center: {lat: 50.7596754, lng: 10.2076453},
		mapTypeId: 'roadmap',
		scrollwheel:  false
	});
	map.setOptions({zoomControl: true, scrollwheel: false, disableDoubleClickZoom: false});
	window.map = map;
	$map = map;
}

$(window).load(function(){
	initMap();
});