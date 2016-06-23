// This example creates a 2-pixel-wide red polyline showing the path of William
// Kingsford Smith's first trans-Pacific flight between Oakland, CA, and
// Brisbane, Australia.
var LatLngArray = new google.maps.MVCArray();
var map;
var poly;
var reader;
var apiKey = 'ur_rd_k';
var placeIdArray = [];
var snappedCoordinates = [];
var bounds = new google.maps.LatLngBounds();

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 0, lng: -180},
    mapTypeId: google.maps.MapTypeId.HYBRID
  });
  poly = new google.maps.Polyline({
    strokeColor: '#FF0000',
    strokeOpacity: 0,
    strokeWeight: 2,
    map: map
  });
}
function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    displayContents(contents);
  };
  reader.readAsText(file);
}


function displayContents(content) {
  //var el = document.getElementById('main');
  //el.innerHTML = reader.responseText;

  var fileText = content.split("\n");

  for (var i = 0; i < fileText.length -1; i++) {
      var split = fileText[i].split("\t");
      LatLngArray.push(new google.maps.LatLng(split[0], split[1]));
      addLatLng(new google.maps.LatLng(split[0], split[1]),i == 0 || i == fileText.length -2);
      bounds.extend(new google.maps.LatLng(split[0], split[1]));
  }
  
  for (var i = 0; i <= poly.getPath().length/100 + 1 ; i++) {
    var sliced = new google.maps.MVCArray();
    for(var j = i*100; j < (i+1) * 100 && j < poly.getPath().length; j++){
      sliced.push(poly.getPath().getAt(j));
    }
    if(sliced.getLength() > 0){
      runSnapToRoad(sliced);
    }
  }
  // map.setCenter(new google.maps.LatLng("31.256170","29.978059"));
  map.setZoom(12); //constant zoom ratio because laziness 
  map.fitBounds(bounds);
}

//draws pins and marks start and end
function addLatLng(latlng,bola) {
  poly.getPath().push(latlng);
  if(bola){
  // Add a new marker at the new plotted point on the polyline.
  var marker = new google.maps.Marker({
    position: latlng,
    title: '#' + poly.getPath().getLength(),
    map: map
  });
  }
}
function runSnapToRoad(path) {
  var pathValues = [];
  for (var i = 0; i < path.getLength(); i++) {
    pathValues.push(path.getAt(i).toUrlValue());
  }
  $.get('https://roads.googleapis.com/v1/snapToRoads', {
    interpolate: true,
    key: apiKey,
    path: pathValues.join('|')
  }, function(data) {
    processSnapToRoadResponse(data);
    drawSnappedPolyline();
    // getAndDrawSpeedLimits();
  });
}

function processSnapToRoadResponse(data) {
  snappedCoordinates = [];
  placeIdArray = [];
  for (var i = 0; i < data.snappedPoints.length; i++) {
    var latlng = new google.maps.LatLng(
        data.snappedPoints[i].location.latitude,
        data.snappedPoints[i].location.longitude);
    snappedCoordinates.push(latlng);
    placeIdArray.push(data.snappedPoints[i].placeId);
  }
}
function drawSnappedPolyline() {
  var snappedPolyline = new google.maps.Polyline({
    path: snappedCoordinates,
    strokeColor: 'black',
    strokeWeight: 3
  });

  snappedPolyline.setMap(map);
}

 
$(window).load(initMap);

document.getElementById('file-input').addEventListener('change', readSingleFile, false);
