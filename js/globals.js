var $HTML_SITE = "http://localhost/weather_data_visualization/";
var $rawData = {};
var $finalData = {};
var $triangles = [];
var $trianglesTotal = 0;
var $triangleCounterLoop = 0;
var $map;

var $finalDataMinVal = 150;
var $finalDataMaxVal = -150;

var $dataTimestamp = "2016-07-24T23:00:00Z";
var $timeStamps = [];
var $currentTS = 0;
var $ready = false;

var $canvasClass = "canvas-w";
var $canvasOpacity = 0.9;

var $allMapMarkers = [];
var $allMapPolygons = [];

var $color1 = [0, 0, 255];
var $color2 = [255, 0, 0];