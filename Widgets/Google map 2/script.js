var initialize        = function(){
  var query           = "cafe";
  var mapContainer    = document.querySelector("#googleMap");
  var center          = new google.maps.LatLng(21.003988480567475,105.79211175441742);
  var map             = new google.maps.Map(mapContainer,{
    center            : center,
    zoom              : 17,
    mapTypeId         : google.maps.MapTypeId.ROADMAP
  });
  var placesService   = new google.maps.places.PlacesService(map);
  var directionsService = new google.maps.DirectionsService(map);
  var directionsDisplay = new google.maps.DirectionsRenderer({
    map               : map,
    suppressMarkers   : true //hide AB default marker on route
  });
  
  var centerMarker    = new google.maps.Marker({
    position          : center,
    map               : map,
    icon              : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  });
  var infoWindow      = new google.maps.InfoWindow({
    content           : 'Your location',
    closeBoxURL       : '',
  });
  centerMarker.addListener('click',function(){
    infoWindow.open(map,centerMarker);
  });

  var nearby          = [];
  var nearbyInfo      = new google.maps.InfoWindow({
    closeBoxURL       : '',
  });
  infoWindow.open(map,centerMarker);
  var getUserPosition = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat       =  position.coords.latitude;
        var lng       = position.coords.longitude;
        center        = new google.maps.LatLng(lat,lng);
        map.setCenter(center);
        centerMarker.setPosition(center);
        infoWindow.open(map,centerMarker);
        nearbySearch();
      });
    }
  }
  var clearNearby     = function(){
    for (var i=0;i<nearby.length;i++){
      nearby[i].setMap(null);
    }
    nearby            = [];
  }
  var createMarker    = function(place){    
    var content       = place.name + " " + place.vicinity;
    var found         = content.toLowerCase().indexOf(query.toLowerCase())>=0;
    console.log(found, content);
    if (!found) return null;
    var m = new google.maps.Marker({
      position        : place.geometry.location,
      map             : map,
      icon            : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    m.content         = "<b>"+place.name+"</b></br>" + " " + place.vicinity;    
    m.id              = place.id;
    m.addListener('click',function(){
      nearbyInfo.setContent(this.content);
      nearbyInfo.open(map,m);
      calcRoute(m.getPosition());
    });
    return m;
  }
  var calcRoute       = function(end,start,travelMode){
    directionsService.route({
      origin          : start || center,
      destination     : end,
      travelMode      : travelMode || google.maps.TravelMode.DRIVING
    },function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(map);
      } else {
        console.log("fail to get direction from",start,end);
      }
    });

  }
  var nearbySearch    = function(){
    placesService.nearbySearch({
      location        : center,
      radius          : '50000',
      types           : ['store','restaurant']
    },function(results, status){
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        clearNearby();
        var bounds = new google.maps.LatLngBounds();//make bound      
        for (var i = 0; i < results.length; i++) {
          var m = createMarker(results[i]);
          if (m!=null) {
            nearby.push(m);
            bounds.extend(m.getPosition());
          }
        }
        bounds.extend(centerMarker.getPosition());
        map.fitBounds(bounds);//fit bound to include all visible marker
      }
    });
  }
  getUserPosition();
  nearbySearch();
}
var loadScript = function (src,callback){
  var script = document.createElement("script");
  script.type = "text/javascript";
  if(callback) script.onload=callback;
  document.querySelector("head").appendChild(script);
  script.src = src;
}
loadScript(
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyDDJCfm026nu_AEN7fdhEWxmNV-OuJvgPg&libraries=geometry,places,drawing',
  initialize
);