var initMap = function(){  
  var center = new google.maps.LatLng(21.003988480567475,105.79211175441742);  
  var map       =new google.maps.Map(document.querySelector("#googleMap"),{
    center      :center,
    zoom        :16,
    mapTypeId   :google.maps.MapTypeId.ROADMAP
  });
  var service   = new google.maps.places.PlacesService(map);
  var myLoc     = new MyLocation({
    map         : map,
    service     : service,
    location    : center,
    radius      : 500
  });
  var select = document.querySelector("select");
  select.addEventListener("click",function(e){
    var value = select.options[select.selectedIndex].value;
    if (value!="Select filter") myLoc.nearbySearch(value);    
  })
}

function MyLocation(options){
  this.options      = options;
  this.map          = this.options.map;
  this.service      = this.options.service;
  this.marker       = new google.maps.Marker({
    position        : this.options.location,
    animation       : google.maps.Animation.DROP,
    map             : this.map
  });
  this.nearby       = {};
  this.oldSearch    = "";
  this.search       = "";
  this.infowindow   = new google.maps.InfoWindow();
  var circle = new google.maps.Circle({
    center          : this.options.location,
    radius          : this.options.radius,
    strokeColor     : "#0000FF",
    strokeOpacity   : 0.2,
    strokeWeight    : 1,
    fillColor       : "#0000FF",
    fillOpacity     : 0.1
  });
  circle.setMap(this.map); 

  this.setCenter    = this.setCenter.bind(this);
  this.setMapAll    = this.setMapAll.bind(this);
  this.nearbySearch = this.nearbySearch.bind(this);
  this.searchCallback = this.searchCallback.bind(this);
  this.showResult   = this.showResult.bind(this);
}
MyLocation.prototype.setCenter = function(){
  this.map.setCenter(this.marker.getPosition());  
}
//set Null to hide all marker
MyLocation.prototype.setMapAll = function(markers,map){
  if (markers)
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}
MyLocation.prototype.nearbySearch = function(type){
  this.oldSearch = this.search;
  this.search = type;
  if (!this.nearby[type]) {
    this.service.nearbySearch({
      location        : this.options.location,
      radius          : this.options.radius,
      type            : [type]
    }, this.searchCallback);
  } else this.showResult();
}
MyLocation.prototype.searchCallback = function(results, status){
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    var arr = [],that = this;
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var marker = new google.maps.Marker({        
        position        : r.geometry.location
      });
      marker.name = r.name;
      google.maps.event.addListener(marker, 'click', function() {        
        that.infowindow.setContent(this.name);
        that.infowindow.open(that.map, this);
      });
      arr.push(marker);
    }
    this.nearby[this.search] = arr;    
  }
  this.showResult();
}
MyLocation.prototype.showResult = function(){
  if (this.oldSearch) this.setMapAll(this.nearby[this.oldSearch],null);
  this.setMapAll(this.nearby[this.search],this.map);  
}