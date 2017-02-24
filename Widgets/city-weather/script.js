var _PremiumApiBaseURL = 'https://api.worldweatheronline.com/premium/v1/';
//var _PremiumApiKey = '4b90e936f8d448a3bdc90003161306';
var _PremiumApiKey = 'ef0a6da0b5034c32be861804162806';
var region;

var sunShower = document.getElementById('sun-shower');
var thunderStorm = document.getElementById('thunder-storm');
var cloudy = document.getElementById('cloudy');
var flurries = document.getElementById('flurries');
var sunny = document.getElementById('sunny');
var rainy = document.getElementById('rainy');
var tempC, tempF;

function setWeatherIconHide() {
    var ic = document.getElementsByClassName('icon');
    
    for (var i = 0; i < ic.length; i++) {
        ic[i].style.display = 'none';
    }
}

function JSONP_LocalWeather(input) {
    var url = _PremiumApiBaseURL + 'weather.ashx?q=' + input.query + '&format=' + input.format + '&extra=' + input.extra + '&num_of_days=' + input.num_of_days + '&date=' + input.date + '&fx=' + input.fx + '&tp=' + input.tp + '&cc=' + input.cc + '&includelocation=' + input.includelocation + '&show_comments=' + input.show_comments + '&key=' + _PremiumApiKey;
	
    jsonP(url, input.callback);
}

// Helper Method
function jsonP(url, callback) {
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        jsonpCallback: callback,
        dataType: 'jsonp',
        success: function (json) {
            //console.dir('success');
        },
        error: function (e) {
            //console.log(e.message);
        }
    });
}

function GetLocalWeatherByGeo(location) {
    var localWeatherInput = {
        query: location.lat + ", " + location.lon,
        format: 'JSON',
        num_of_days: '2',
        date: '',
        fx: '',
        cc: '',
        tp: '',
        includelocation: '',
        show_comments: '',
        callback: 'LocalWeatherCallback'
    };

    JSONP_LocalWeather(localWeatherInput);
}

function GetLocalWeatherByCityName(location) {
    var localWeatherInput = {
        query: location,
        format: 'JSON',
        num_of_days: '2',
        date: '',
        fx: '',
        cc: '',
        tp: '',
        includelocation: '',
        show_comments: '',
        callback: 'LocalWeatherCallbackCityName'
    };

    JSONP_LocalWeather(localWeatherInput);
}

function LocalWeatherCallback(localWeather) {
    	var weatherBase = localWeather.data.current_condition[0];
    
    	var img = $("#icon-weather");
        var location = $(".text-part .location");
    	var wC = parseInt(weatherBase.weatherCode);

    	setWeatherIconHide();
    	switch(wC) {
            case 374: case 371: case 368: case 365: case 362: case 356: case 353: case 263: case 116:	// Sun-shower
            	sunShower.style.display = 'inline-block';
                break;
            case 395: case 392: case 389: case 386: case 200:	// Thunder Storm
                thunderStorm.style.display = 'inline-block';
            	break;
            case 119: case 122: case 143: case 248: case 281: case 284:	// Cloudy
                cloudy.style.display = 'inline-block';
            	break;
            case 185,227,230,260,320,323,326,329,332,335,338,350,377:	// Flurries
                flurries.style.display = 'inline-block';
            	break;
            case 113: // Sunny
                sunny.style.display = 'inline-block';
            	break;
            case 176: case 179: case 182: case 266: case 293: case 296: case 299: case 302: case 305: case 308: case 311: case 314: case 317: case 359: // Rainy
                rainy.style.display = 'inline-block';
            	break;
        }
    	location.html(region);
    	tempC = weatherBase.temp_C;
    	tempF = weatherBase.temp_F;
    	changeDegreeType(weatherBase);
}

function LocalWeatherCallbackCityName(localWeather) {
    	var weatherBase = localWeather.data.current_condition[0];
    
    	var img = $("#icon-weather");
        var location = $(".text-part .location");
    	var wC = parseInt(weatherBase.weatherCode);
    	var locationName = localWeather.data.request[0].query.toString();
    
    	setWeatherIconHide();
    	switch(wC) {
            case 374: case 371: case 368: case 365: case 362: case 356: case 353: case 263: case 116:	// Sun-shower
            	sunShower.style.display = 'inline-block';
                break;
            case 395: case 392: case 389: case 386: case 200:	// Thunder Storm
                thunderStorm.style.display = 'inline-block';
            	break;
            case 119: case 122: case 143: case 248: case 281: case 284:	// Cloudy
                cloudy.style.display = 'inline-block';
            	break;
            case 185,227,230,260,320,323,326,329,332,335,338,350,377:	// Flurries
                flurries.style.display = 'inline-block';
            	break;
            case 113: // Sunny
                sunny.style.display = 'inline-block';
            	break;
            case 176: case 179: case 182: case 266: case 293: case 296: case 299: case 302: case 305: case 308: case 311: case 314: case 317: case 359: // Rainy
                rainy.style.display = 'inline-block';
            	break;
        }
    	location.html(locationName);
    	tempC = weatherBase.temp_C;
    	tempF = weatherBase.temp_F;
    	changeDegreeType(weatherBase);
}

function appendStyle(styles) {
  var css = document.createElement('style');
  css.type = 'text/css';

  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));

  document.getElementsByTagName("head")[0].appendChild(css);
}

function setKeyframe(name, value, value2) {
    appendStyle('@-webkit-keyframes '+name+' {45% {color: '+value+';background: '+value+';opacity: 0.2;}50% {color: #0cf;background: '+value2+';opacity: 1;}55% {color: '+value+';background: '+value+';opacity: 0.2;}}@keyframes '+name+' {45% {color: '+value+';background: '+value+';opacity: 0.2;}50% {color: #0cf;background: '+value2+';opacity: 1;}55% {color: '+value+';background: '+value+';opacity: 0.2;}}');
}

function setKeyframe2(name, value) {
    appendStyle('@-webkit-keyframes '+name+' {0% {background: '+value+';box-shadow:0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),-0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),-1.375em -0.125em 0 '+value+';}25% {box-shadow:0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),-0.875em 1.125em 0 -0.125em '+value+',-1.375em -0.125em 0 rgba(255,255,255,0.2);}50% {background: rgba(255,255,255,0.3);box-shadow:0.625em 0.875em 0 -0.125em '+value+',-0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),-1.375em -0.125em 0 rgba(255,255,255,0.2);}100% {box-shadow:0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),-0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),-1.375em -0.125em 0 '+value+';}}@keyframes rain {0% {background: '+value+';box-shadow:0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),-0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),-1.375em -0.125em 0 '+value+';}25% {box-shadow:0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),-0.875em 1.125em 0 -0.125em '+value+',-1.375em -0.125em 0 rgba(255,255,255,0.2);}50% {background: rgba(255,255,255,0.3);box-shadow:0.625em 0.875em 0 -0.125em '+value+',-0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),-1.375em -0.125em 0 rgba(255,255,255,0.2);}100% {box-shadow:0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),-0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),-1.375em -0.125em 0 '+value+';}}');
}

function addStylesheetRules (rules) {
  var styleEl = document.createElement('style'),
      styleSheet;

  // Append style element to head
  document.head.appendChild(styleEl);

  // Grab style sheet
  styleSheet = styleEl.sheet;

  for (var i = 0, rl = rules.length; i < rl; i++) {
    var j = 1, rule = rules[i], selector = rules[i][0], propStr = '';
    // If the second argument of a rule is an array of arrays, correct our variables.
    if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
      rule = rule[1];
      j = 0;
    }

    for (var pl = rule.length; j < pl; j++) {
      var prop = rule[j];
      propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
    }

    // Insert CSS Rule
    styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
  }
}

function changeDegreeType(weatherBase) {
    var degree = $(".degree-wrap .degree");
    var unit = $(".degree-wrap .unit");
    
    if(BannerFlow.settings.degreeType == "°C") {
        degree.html(weatherBase.temp_C);
        unit.html("°C");
    } else {
        degree.html(weatherBase.temp_F);   
        unit.html("°F");
    }
}

function changeFonts() {
    var txtPart = $(".text-part");
    var fontFamily = BannerFlow.settings.fonts;
    txtPart.css({'font-family': fontFamily});
}

function updateStyle() {
    addStylesheetRules([
            ['.cloud:after', 
             ['box-shadow', '0 0.4375em 0 -0.0625em '+BannerFlow.settings.iconColor]
            ],
            ['.cloud:nth-child(2)',
            ['box-shadow', '-2.1875em 0.6875em 0 -0.6875em '+BannerFlow.settings.iconColor+',2.0625em 0.9375em 0 -0.9375em '+BannerFlow.settings.iconColor+',0 0 0 0.375em '+BannerFlow.settings.iconColor+',-2.1875em 0.6875em 0 -0.3125em '+BannerFlow.settings.iconColor+',2.0625em 0.9375em 0 -0.5625em '+BannerFlow.settings.iconColor]
            ],
            ['.cloud', 
             ['box-shadow', '-2.1875em 0.6875em 0 -0.6875em '+BannerFlow.settings.backgroundColor+',2.0625em 0.9375em 0 -0.9375em '+BannerFlow.settings.backgroundColor+',0 0 0 0.375em '+BannerFlow.settings.iconColor+',-2.1875em 0.6875em 0 -0.3125em '+BannerFlow.settings.iconColor+',2.0625em 0.9375em 0 -0.5625em '+BannerFlow.settings.iconColor]
            ],
            ['.cloud:nth-child(2), .cloud:nth-child(2):after, .rays, .rays:before, .rays:after', 
             ['background', BannerFlow.settings.iconColor]
            ],
            ['.sun', ['box-shadow', '0 0 0 0.375em '+BannerFlow.settings.iconColor]],
            ['.rays, .rays:before,.rays:after', ['box-shadow', '0 5.375em '+BannerFlow.settings.iconColor]]
        ]);
    if (BannerFlow.settings.isTransparent) {
        addStylesheetRules([
            ['body, .rain, .lightning, .snow', 
             ['background', 'transparent']
            ],
            ['.sun, .cloud, .cloud:after', 
             ['background', BannerFlow.settings.backgroundColor]
            ]
        ]);
    } else {
        addStylesheetRules([
            ['body, .cloud, .cloud:after, .sun, .rain, .lightning, .snow', 
             ['background', BannerFlow.settings.backgroundColor]
            ]
        ]);
    }
    
    setKeyframe('lightning', BannerFlow.settings.iconColor);
    setKeyframe2('rain', BannerFlow.settings.animatedColor);
    addStylesheetRules([
        ['.rain:after', 
         ['background', BannerFlow.settings.animatedColor]
        ]
    ]);
    
    addStylesheetRules([
        ['.location', 
         ['font-size', BannerFlow.settings.locationSize + 'px'],
         ['line-height', BannerFlow.settings.locationSize + 'px'],
         ['color', BannerFlow.settings.locationColor]
        ]
    ]);
    
    addStylesheetRules([
        ['.degree', 
         ['font-size', BannerFlow.settings.degreeSize + 'px'],
         ['line-height', BannerFlow.settings.degreeSize + 'px'],
         ['color', BannerFlow.settings.degreeColor]
        ]
    ]);
    
    addStylesheetRules([
        ['.unit', 
         ['font-size', BannerFlow.settings.unitSize + 'px'],
         ['line-height', BannerFlow.settings.unitSize + 'px'],
         ['color', BannerFlow.settings.unitColor]
        ]
    ]);
    
    addStylesheetRules([
        ['.icon', 
         ['font-size', BannerFlow.settings.iconSize + 'px']
        ]
    ]);
    
    var styleChooser = BannerFlow.settings.styleChooser % 4;
    var cityWeather = document.getElementById("city-weather");
    var style1 = document.getElementsByClassName("style1")[0];
    var style2 = document.getElementsByClassName("style2")[0];
    cityWeather.removeAttribute("style");
    switch(styleChooser) {
        case 0:
            cityWeather.style.display = "block";
            style1.style.width = "100%";
            style2.style.width = "100%";
            style1.style.display = "inline-block";
            style2.style.display = "none";
            break;
        case 1:
            cityWeather.style.display = "block";
            style1.style.width = "100%";
            style2.style.width = "100%";
            style1.style.display = "none";
            style2.style.display = "inline-block";
            break;
        case 2:
            cityWeather.style.display = "inline-block";
            cityWeather.style.float = "left";
            style1.style.width = "initial";
            style2.style.width = "initial";
            style1.style.marginTop = "5%";
            style2.style.marginTop = "5%";
            style1.style.display = "inline-block";
            style2.style.display = "none";
            break;
        case 3:
            cityWeather.style.display = "inline-block";
            cityWeather.style.float = "left";
            style1.style.width = "initial";
            style2.style.width = "initial";
            style1.style.marginTop = "5%";
            style2.style.marginTop = "5%";
            style1.style.display = "none";
            style2.style.display = "inline-block";
            break;
    }
    //$(function() {
        if (BannerFlow.settings.autoDetect) {
            var location = "https://freegeoip.net/json/";
            $.getJSON(location, function(data) {
                var location = {
                    lat: data.latitude,
                    lon: data.longitude
                }
                region = data.city + ',' + data.country_name;
                GetLocalWeatherByGeo(location);
            });
        } else {
            var location = BannerFlow.settings.findByCity.toString().replace(' ', '+');
            GetLocalWeatherByCityName(location);
        }
    //});
    var weatherBase = {
        temp_C: tempC,
        temp_F: tempF
    };
    changeDegreeType(weatherBase);
    changeFonts();
}

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateStyle);