'use strict';
window.raf = (function(){
  return function(c){setTimeout(c,1000/10);};
})();
window.DigitalClock = (function() {
  //convert rgb to hsl
  var rgb2hsl = function(r,g,b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d ; break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
    }
    return [h*60, s*100, l*100];
  }
  //get lighter or darker color
  var changeLuminance = function(rgba,scale){
    var i1 = rgba.indexOf("("),
        i2 = rgba.indexOf(")"),
        arr = rgba.substring(i1+1,i2).split(","),
        hsl = (rgb2hsl(arr[0],arr[1],arr[2]));
    return "hsla("+hsl[0]+","+hsl[1]+"%,"+hsl[2]*scale+"%,"+arr[3]+")";
  }
  var getLighter = function(rgba){
    var o = /[^,]+(?=\))/g.exec(rgba)[0]*0.75;
    return rgba.replace(/[^,]+(?=\))/g,o);
  }
  var getStyle = function(selector,styleObj){
    var isAttribute = false;
    var newStyle = selector+"{";
    for(var attr in styleObj) {
      if (styleObj[attr]) {
        isAttribute = true;
        newStyle += attr+" : "+styleObj[attr]+";";
      }
    }
    newStyle+="}";
    return isAttribute ? newStyle : "";
  }
  function DigitalClock(){
    this.init                 = this.init.bind(this);    
    this.animation            = this.animation.bind(this);
    this.update               = this.update.bind(this);
    this.pulse                = this.pulse.bind(this);
    this.firstTime            = true;
    this.default              = {
      size                    : 50,
      stroke                  : 20,
      seperateSize            : 28,
      color                   : 'rgba(121,181,210,1)',
      colorV                  : '',
      inactiveColor           : 'rgba(230,230,230,1)',
      inactiveColorV          : '',
      freeColor               : true,
      space                   : 1,
      showSeconds             : false,
      timeFormat              : "24 hours",//"24 hours","AM/PM"
    }
    this.options              = {};
    this.count                = 0;
  }
  DigitalClock.prototype.init = function(BannerFlow){
    this.container            = document.querySelector(".container");
    for(var attr in this.default) {
      this.options[attr]      = this.default[attr];
    }    
    if (BannerFlow) {
      var settings = BannerFlow.settings;
      this.options.size     = settings.size>=0 ? settings.size : this.default.size;
      this.options.stroke   = settings.stroke>=0 ? settings.stroke : this.default.size;
      this.options.color    = settings.color ? settings.color : this.default.color;
      this.options.inactiveColor = settings.inactiveColor ? settings.inactiveColor : this.default.inactiveColor;
      this.options.freeColor= settings.freeColor;
      this.options.space    = settings.space > this.default.space ? settings.space : this.default.space;
      this.options.showSeconds = settings.showSeconds;
      this.options.timeFormat = settings.timeFormat;
    }
    this.options.seperateSize = (this.options.size*2 + this.options.stroke*3)/5;
    console.log(this.options.space);
    this.options.colorV       = changeLuminance(this.options.color,0.9);
    this.options.inactiveColorV = changeLuminance(this.options.inactiveColor,0.9);
    var settingStyle = "";
    settingStyle += getStyle(".digital,.seperator,.period",{      
      "margin"                : this.options.space/2+"px"
    });
    settingStyle += getStyle(".digital",{
      "border-radius"         : this.options.stroke/2+"px",
      "border-color"          : this.options.inactiveColor,
      "border-top-color"      : this.options.inactiveColorV,
      "border-bottom-color"   : this.options.inactiveColorV,      
    });
    settingStyle += getStyle(".digital:before,.digital:after",{
      "width"                 : this.options.size+"px",
      "height"                : this.options.size+"px",
      "border-width"          : this.options.stroke+"px"
    });
    settingStyle += getStyle(".digital:before",{
      "border-bottom-width"   : this.options.stroke/2+"px"
    });
    settingStyle += getStyle(".digital:after",{
      "border-top-width"      : this.options.stroke/2+"px"
    });
    settingStyle += getStyle("[class*='number']:before,[class*='number']:after,.seperator:before,.seperator:after",{
      "border-color"          : this.options.color,
      "border-top-color"      : this.options.colorV,
      "border-bottom-color"   : this.options.colorV
    });
    settingStyle += getStyle(".seperator:before,.seperator:after",{
      "margin-top"            : this.options.seperateSize+"px",
      "width"                 : this.options.seperateSize/5+"px",
      "height"                : this.options.seperateSize/5+"px",
      "border-width"          : this.options.seperateSize*0.4+"px"
    });
    settingStyle += getStyle(".period:before",{
      "color"                 : this.options.color,
      "margin"                : this.options.space/2+"px",
      "margin-top"            : this.options.seperateSize+"px",
      "font-size"             : this.options.seperateSize/0.6+"px",
    });
    settingStyle += getStyle(".second",{
      "display"               : this.options.showSeconds ? "inline-block" : "none"
    });
    document.querySelector("#setting").innerHTML = settingStyle;
    if(this.firstTime) {
      this.animation();
      this.firstTime = false;
    }
  }
  DigitalClock.prototype.pulse = function(){
    this.count+=2;
    var updateStyle           = "";
    if (this.options.freeColor) {
      updateStyle += getStyle("[class*='number']:before,[class*='number']:after,.seperator:before,.seperator:after",{
      "border-color"          : 'hsla('+this.count+',50%,50%,1)',
      "border-top-color"      : 'hsla('+this.count+',60%,60%,1)',
      "border-bottom-color"   : 'hsla('+this.count+',60%,60%,1)'
      });
      updateStyle += getStyle(".period:before",{
        "color"               : 'hsla('+this.count+',50%,50%,1)'        
      });      
    }
    document.querySelector("#update").innerHTML = updateStyle;
  }
  DigitalClock.prototype.update = function(arr){
    var children = this.container.querySelectorAll("span");
    //reset all data
    if (arr.length != children.length) {
      this.container.innerHTML = "";
      children = [];
    }
    for(var i=0;i<arr.length;i++){
      var span = children[i];
      if (!span) {
        span = document.createElement("span");
        this.container.appendChild(span);
      }
      span.className = arr[i];
    }
  }
  DigitalClock.prototype.animation = function(){    
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var period = "";    
    if (this.options.timeFormat.toLowerCase() == "am/pm") {
      period = hour > 12 ? "pm" : "am";
      hour %= 12;
    }
    this.update([
      "hour digital number-"+(hour/10|0),
      "hour digital number-"+hour%10,
      "minute seperator",
      "minute digital number-"+(minute/10|0),
      "minute digital number-"+minute%10,
      "second seperator",
      "second digital number-"+(second/10|0),
      "second digital number-"+second%10,
      "period "+period
    ]);
    this.pulse();
    raf(this.animation);
  }
  return DigitalClock;
})();
var timer,widget = new DigitalClock();
if (typeof BannerFlow!='undefined') {
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    clearTimeout(timer);
    timer = setTimeout(function(){
        widget.init(BannerFlow);
    },500);
  });
} else {
  window.addEventListener("load",function(){
    widget.init();
  })
}