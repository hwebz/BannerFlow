/*Theme*/
var Nature = new google.maps.StyledMapType(
[{"featureType":"water","elementType":"all","stylers":[{"hue":"#76aee3"},{"saturation":38},{"lightness":-11},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"hue":"#8dc749"},{"saturation":-47},{"lightness":-17},{"visibility":"on"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#c6e3a4"},{"saturation":17},{"lightness":-2},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"hue":"#cccccc"},{"saturation":-100},{"lightness":13},{"visibility":"on"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"hue":"#5f5855"},{"saturation":6},{"lightness":-31},{"visibility":"on"}]},{"featureType":"road.local","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[]}]
,{name: 'Nature'});
var Green = new google.maps.StyledMapType(
[{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#b6c2c7"},{"visibility":"on"}]}]
,{name: 'Green'});
var Light = new google.maps.StyledMapType(
[{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
,{name: 'Light'});
var Gray = new google.maps.StyledMapType(
[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
,{name: 'Gray'});
var Dark = new google.maps.StyledMapType(
[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative.province","elementType":"labels.text.fill","stylers":[{"color":"#999999"}]},{"featureType":"administrative.province","elementType":"labels.text.stroke","stylers":[{"color":"#ff0000"},{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"lightness":"0"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.fill","stylers":[{"color":"#272727"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi.attraction","elementType":"geometry.fill","stylers":[{"lightness":"0"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"lightness":"-7"}]},{"featureType":"poi.place_of_worship","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":"0"}]},{"featureType":"poi.place_of_worship","elementType":"geometry.fill","stylers":[{"lightness":"0"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"-14"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"-13"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"lightness":"-21"},{"visibility":"on"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"19"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"lightness":"-26"},{"color":"#f0f0f0"}]}]
,{name: 'Dark'});
var gmapThemes                      = {
  Nature                            : Nature,
  Green                             : Green,
  Light                             : Light,
  Gray                              : Gray,
  Dark                              : Dark,
}
window.GoogleMapWidget              = (function(){
  'use strict';
  function GoogleMapWidget(){
    var that                        = this;
    this.isMobile                   = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|webOS|BB|mobi|tablet|IEMobile|opera mini|nexus)/i);
    this.init                       = this.init.bind(this);
    this.getUserPosition            = this.getUserPosition.bind(this);
    this.markPlaces                 = this.markPlaces.bind(this);
    this.calcRoute                  = this.calcRoute.bind(this);
    this.createMarker               = this.createMarker.bind(this);
    this.firstTime                  = true;
    this.firstClick                 = false;    
    this.default                    = {
      layout                        : "show map",//flip,slide,show map
      defaultView                   : "show-map",//"show-map","show-map-icon"
      zoom                          : 13,
      search                        : "pizza",
      limit                         : 3,
      latitude                      : 59.326789,
      longitude                     : 18.072027,
      showUserLocation              : true,
      toggleLeft                    : 10,
      toggleBottom                  : 28,
      userIcon                      : {
        url                         : 'https://maps.google.com/mapfiles/ms/icons/green.png',
        width                       : 25,
        height                      : 25,
      },
      logo                          : {
        url                         : 'https://maps.google.com/mapfiles/ms/icons/red.png',
        width                       : 50,
        height                      : 50,
      },
      userSize                      : 25,
      logoSize                      : 25,
      travelMode                    : google.maps.TravelMode.DRIVING,
      theme                         : 'Green',
    }
    this.options                    = {};
    this.markers                    = [];  //markers array for found result
    this.center                     = new google.maps.LatLng(this.default.latitude,this.default.longitude);
    this.end                        = null;
    this.travelSelctor              = document.querySelector('.travel-select');
    this.carSelector                = document.querySelector('.travel-select .car');
    this.walkSelector               = document.querySelector('.travel-select .walk');
    this.innerContainer             = document.querySelector('.inner');
    this.mapContainer               = document.querySelector('#map');
    this.popup                      = document.querySelector('.popup');
    this.popupContent               = document.querySelector('.popup .content');
    this.popupDirection             = document.querySelector('.popup .direction');
    this.popupClose                 = document.querySelector('.popup .close');
    this.routeInfo                  = new google.maps.InfoWindow({zIndex: 99999999});
    this.nearbyInfo                 = new google.maps.InfoWindow();
    this.userInfo                   = new google.maps.InfoWindow({content : 'Your location'});
    this.map                        = new google.maps.Map(this.mapContainer, {
      center                        : this.center,
      zoom                          : this.default.zoom,
      mapTypeId                     : 'roadmap',
      mapTypeControl                : false,
      streetViewControl             : false,
    });
    //set themes
    for (var theme in gmapThemes) {
      this.map.mapTypes.set(theme, gmapThemes[theme]);  
    }
    this.map.setMapTypeId(this.default.theme);
    // map services
    this.directionsService          = new google.maps.DirectionsService(map);
    this.directionsDisplay          = new google.maps.DirectionsRenderer({
      map                           : this.map,
      suppressMarkers               : true, //hide AB default marker on route
      preserveViewport              : true, //zoom into the direction
    });
    this.userMarker                 = null;
    this.input                      = document.querySelector('#search-input');
    this.searchBox                  = new google.maps.places.SearchBox(this.input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input);
    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener('bounds_changed', function() {
      that.searchBox.setBounds(that.map.getBounds());
    });
    // Listen for the event fired when the user selects a prediction and retrieve    
    this.searchBox.addListener('places_changed', function() {
      that.markPlaces(that.searchBox.getPlaces());
    });
    this.container                  = document.querySelector(".container");
    this.travelSelect               = document.querySelector(".travel-select")
    this.inner                      = this.container.querySelector(".inner");
    this.toggle                     = this.container.querySelector(".toggle-map");
    this.travelSelect.style.right   = "10px";
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.travelSelect);
    var triggerToggle               = function(){
      if (this.hasClass("loading")) return;
      if (that.innerContainer.hasClass("active")) that.innerContainer.removeClass("active");
      else that.innerContainer.addClass("active");
    }
    var triggerCarSelector          = function(){
      if (that.end == null) return;
      that.firstClick               = true;
      that.directionsDisplay.setMap(null);
      that.options.travelMode = google.maps.TravelMode.DRIVING;
      that.calcRoute(that.end,that.center);
    }
    var triggerWalkSelector         = function(){      
      if (that.end == null) return;
      that.firstClick               = true;
      that.directionsDisplay.setMap(null);
      that.options.travelMode = google.maps.TravelMode.WALKING;
      that.calcRoute(that.end,that.center);
    }
    var toggleTravelSelector        = function(){
      if (this.hasClass("walk-selected")) {
        this.removeClass("walk-selected");
        triggerCarSelector();
      } else{
        this.addClass("walk-selected");
        triggerWalkSelector();
      }
    }
    var closePopup                  = function(){
      that.popup.removeClass("active");
    }
    this.toggle.addEventListener(this.isMobile ? 'touchstart' : 'click',triggerToggle);
    this.carSelector.addEventListener(this.isMobile ? 'touchstart' : 'click',triggerCarSelector);
    this.walkSelector.addEventListener(this.isMobile ? 'touchstart' : 'click',triggerWalkSelector);
    this.popupDirection.addEventListener(this.isMobile ? 'touchstart' : 'click',toggleTravelSelector);
    this.popupClose.addEventListener(this.isMobile ? 'touchstart' : 'click',closePopup);
    /*var myoverlay = new google.maps.OverlayView();
    myoverlay.draw = function () {
      this.getPanes().markerLayer.id='markerLayer';
    };
    myoverlay.setMap(this.map);*/
  }
  GoogleMapWidget.prototype.init = function(BannerFlow){
    var that                        = this;
    var isChangeMap                 = false;
    var oldOptions                  = {};
    //store old settings
    for (var attr in this.options) {
      oldOptions[attr]              = this.options[attr];
    }
    //get default settings
    for (var attr in this.default) {
      this.options[attr]            = this.default[attr];
    }
    //get banner flow settings
    if(typeof BannerFlow != 'undefined') {
      for (var attr in this.default) {
        this.options[attr]          = BannerFlow.settings[attr] || this.default[attr];
      }
      this.options.userIcon         = getFirstImages(BannerFlow.settings.userIcon) || this.default.userIcon;
      this.options.logo             = getFirstImages(BannerFlow.settings.logo) || this.default.logo;
      this.options.showUserLocation = BannerFlow.settings.showUserLocation;
      this.options.travelMode       = this.options.travelMode.toUpperCase().trim();
    }
    //detect setting changes cause reloading map
    var checkAttr = ["search","limit","latitude","longitude","showUserLocation","userIcon","logo","theme","userSize","logoSize"];
    for (var i=0;i<checkAttr.length;i++){
      var attr = checkAttr[i];
      if (oldOptions[attr]          != this.options[attr]) {
        isChangeMap = true;
        break;
      }
    }
    if (this.firstTime) isChangeMap = true;
    //Check editor mode
    if (!BannerFlow || BannerFlow && BannerFlow.editorMode) {
      if (this.options.defaultView.toLowerCase() == "show-map") {
        that.innerContainer.addClass("active");
      } else {
        that.innerContainer.removeClass("active");
      }
    }
    //reset
    this.inner.removeClass("flip");
    this.inner.removeClass("slide");
    //apply settings
    this.toggle.style.left          = this.options.toggleLeft+"px";
    this.toggle.style.bottom        = this.options.toggleBottom+"px";
    this.toggle.removeClass("none");    
    if (this.options.layout.toLowerCase() == "flip")  {
      this.inner.addClass("flip");
    } else if (this.options.layout.toLowerCase() == "slide"){
      this.inner.addClass("slide");
    } else {
      this.toggle.addClass("none");
      that.innerContainer.addClass("active");
    }
    if (oldOptions.zoom!=this.options.zoom)
      this.map.setZoom(this.options.zoom);
    if (oldOptions.theme!=this.options.theme)
      this.map.setMapTypeId(this.options.theme);
    if (isChangeMap) {
      if (!this.options.showUserLocation) {
        this.popupDirection.addClass("none");
        this.travelSelctor.addClass("none");
      }
      else {
        this.popupDirection.removeClass("none");
        this.travelSelctor.removeClass("none");
      }      
      this.innerContainer.addClass("loading");
      this.routeInfo.close();
      this.nearbyInfo.close();
      this.userInfo.close();
      this.directionsDisplay.setMap(null);
      clearMarkers(that.markers);
      this.getUserPosition();
      setTimeout(function(){
        that.innerContainer.removeClass("loading");
      },5000);
    }
    this.firstTime = false;
  }
  //get user location
  GoogleMapWidget.prototype.getUserPosition = function () {
    var that = this,isMapLoaded = false, isGotUserLocation = false  ;
    var createUserMarker            = function() {
      if (!isMapLoaded || !isGotUserLocation) return;
      var userIcon                  = that.options.userIcon;
      var scale                     = that.options.userSize/Math.max(userIcon.width,userIcon.height);
      var width                     = userIcon.width * scale;
      var height                    = userIcon.height * scale;
      if (that.options.showUserLocation) {
        that.userMarker             = that.createMarker({
          position                  : that.center,
          map                       : that.options.showUserLocation ? that.map : null,
          icon                      : {
            url                     : userIcon.url,
            size                    : new google.maps.Size(width, height),
            origin                  : new google.maps.Point(0, 0),
            anchor                  : new google.maps.Point(width/2, height),
            scaledSize              : new google.maps.Size(width, height),
          },
          content                   : "Your location",
        },that.userInfo,null,true);
        that.markers.push(that.userMarker);
      }
      if (that.options.search) {
        that.input.addClass("none");
        setTimeout(function(){
          that.input.value          = that.options.search;
          google.maps.event.trigger(that.input, 'focus')
          google.maps.event.trigger(that.input, 'keydown', { keyCode: 13 });          
        },1500);//wait for map re-center
      } else {
        that.input.removeClass("none");
      }
    }
    google.maps.event.addListenerOnce(that.map, 'idle', function(){
      isMapLoaded                   = true;
      createUserMarker();
    });
    if (!isGotUserLocation) {
      if (navigator.geolocation) {
        var success                 = function(position){
          var lat                   = position.coords.latitude;
          var lng                   = position.coords.longitude;
          that.center               = new google.maps.LatLng(lat,lng);
          that.map.setCenter(that.center);
          that.map.panTo(that.center);
          isGotUserLocation         = true;
          createUserMarker();
        };
        var error                   = function(){
          isGotUserLocation         = true;
          createUserMarker();
          console.error("cannot get user location,fall back to initialize location");
        }
        navigator.geolocation.getCurrentPosition(success,error);
      }
    }
  }
  //create markers for found place
  GoogleMapWidget.prototype.markPlaces = function(places){
    var that                        = this;
    if (places.length == 0) return;
    for (var i=0;i<places.length;i++) places[i].lineDistance = +getDistance(places[i].geometry.location,that.center);
    places.sort(function(p1,p2){
      var d1 = p1.lineDistance,d2   = p2.lineDistance;
      return d1 == d2 ? 0 : d1 > d2 ? 1 : -1 ;
    });
    var bounds                      = new google.maps.LatLngBounds();
    for (var i=0;i<Math.min(places.length,that.options.limit);i++){
      if (!places[i].geometry) continue;
      var place                     = places[i];
      var show                      = i==0 ;
      var openStatus                = '';
      try{
        if (place.opening_hours.open_now) {
          openStatus+="<p class='is-open'> Open now </p>";
        }
        openStatus+= place.opening_hours.periods[1].open.time + "-" + place.opening_hours.periods[1].close.time;
      } catch(e){
        openStatus+="";
      }
      var logo = that.options.logo;
      var scale                     = that.options.logoSize/Math.max(logo.width,logo.height);
      var width                     = logo.width * scale;
      var height                    = logo.height * scale;
      var marker                    = that.createMarker({
        position                    : place.geometry.location,
        map                         : that.map,
        //optimized                   : false,
        icon                        : {
          url                       : logo.url,
          size                      : new google.maps.Size(width, height),
          origin                    : new google.maps.Point(0, 0),
          anchor                    : new google.maps.Point(width/2, height),
          scaledSize                : new google.maps.Size(width, height),
        },
        content                     : "<p class='shop-name'>"+place.name+"</p>" + "<p>" + place.formatted_address + "</p>" + openStatus,
      },that.nearbyInfo,that.calcRoute,show,show);//show direction if only 1 store
      that.markers.push(marker);
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);// Only geocodes have viewport.
      } else {
        bounds.extend(place.geometry.location);
      }
    }
    bounds.extend(that.center);
    that.map.fitBounds(bounds);
  }
  //calculate direction between two location
  GoogleMapWidget.prototype.calcRoute = function(end,start){
    var that                = this;
    this.end                = end;
    var callback            = function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        if (that.firstClick) {
          that.popup.addClass("active");          
          //that.directionsDisplay.preserveViewport = false;//zoom on direction on first user click
        }
        else {
          that.innerContainer.removeClass("loading");  
        }
        that.directionsDisplay.setDirections(response);
        that.directionsDisplay.setMap(that.options.showUserLocation ? that.map : null);
        that.popupContent.innerHTML = that.end.content;
        var result          = calcRouteTime(response);
        var isCar           = that.options.travelMode==google.maps.TravelMode.DRIVING;
        if (isCar) that.popupDirection.removeClass("walk-selected");
        else that.popupDirection.addClass("walk-selected");
        var report          = isCar ? that.popupDirection.querySelector(".data.car") : that.popupDirection.querySelector(".data.walk");
        report.innerHTML    = "Distance : "+result.distance+"</br> Duration : "+result.duration;
      } else {
        console.error("fail to get direction from",start,end);
      }
    }
    this.directionsService.route({
      origin                : start || that.center,
      destination           : end.getPosition() ,
      travelMode            : that.options.travelMode
    },callback);
  }
  //create marker
  GoogleMapWidget.prototype.createMarker = function(opt,info,callback,open,showDirection){
    var that                = this;
    opt.content             = "<div class='scrollFix'>" + opt.content + "</div>"
    var marker              = new google.maps.Marker(opt);
    info                    = info || new google.maps.InfoWindow({content : opt.content});
    marker.addListener('click',function(){
      //info.setContent(this.content);
      //info.open(opt.map,this);
      that.firstClick = true;
      if(callback) callback(this);
    });
    if (open) {
      //info.setContent(marker.content);
      //info.open(opt.map,marker);
    }
    if (callback && showDirection)
      //waiting for marker is set into the map
      setTimeout(function(){
        callback(marker);
      }, 100);
    return marker;
  }
  return GoogleMapWidget;
})();
/*-----------------------------------
                Utils
-----------------------------------*/
//clear array of markers
var clearMarkers          = function(markers){
  for(var i=0;i<markers.length;i++) {
    if (markers[i]) markers[i].setMap(null);
  }
  markers = [];
  return markers;
}
//round float number
var round                 = function(value,exp) {
  if (typeof exp =='undefined' || exp==null) exp = 2;
  var c = Math.pow(10, exp);
  return Math.round(value * c) / c;
}
//calculate duration and distance from direction response
var calcRouteTime         = function(response){
  var totalDistance       = 0;
  var totalDuration       = 0;
  var legs                = response.routes[0].legs;
  var steps               = legs[legs.length/2|0].steps;
  var position            = steps[steps.length/2|0].start_location;
  for(var i=0; i<legs.length; ++i) {
    totalDistance         += legs[i].distance.value;
    totalDuration         += legs[i].duration.value;
  }
  totalDistance           = round(totalDistance/1000,1);
  totalDuration           = round(totalDuration/60,0) ;
  return {
    distance              : totalDistance + " km",
    duration              : totalDuration + " min",
    position              : position
  }
}
//get distance between two location
var getDistance = function(p1, p2) {
  var rad = function(x) {return x * Math.PI / 180;};
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};
if (!HTMLElement.prototype.hasClass) {
  Element.prototype.hasClass = function(c) {
    return (" " + this.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + c + " ") > -1;
  }
}
if (!HTMLElement.prototype.addClass) {
  Element.prototype.addClass = function(c) {
    if (!this.hasClass(c)) this.className += (" " + c);
    return this;
  }
}
if (!HTMLElement.prototype.removeClass) {
  Element.prototype.removeClass = function(c) {
    if (this.hasClass(c)) this.className = (" " + this.className + " ").replace(" " + c + " ", " ").trim();
    return this;
  }
}
//Get images from new settings
var getFirstImages = function(imageSetting){  
  if (imageSetting) {
    for(var i=0;i<imageSetting.length;i++){
      var imgArr = imageSetting[i].images;
      if (imgArr && imgArr.length>0) {
        var img = imgArr[imgArr.length-1];
        return img;
      }
    }
  }
  return {};
}
/*-----------------------------------
                Main
-----------------------------------*/
var widget=new GoogleMapWidget();
/*var timer;
if (typeof BannerFlow != 'undefined') {
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    clearTimeout(timer);
    timer = setTimeout(function(){
        
    },1000);
  });
} else {
  document.addEventListener("DOMContentLoaded",function(){
    widget.init();
  })
}*/
BannerFlow.addEventListener(BannerFlow.INIT, function(){
    widget.init(BannerFlow);
})