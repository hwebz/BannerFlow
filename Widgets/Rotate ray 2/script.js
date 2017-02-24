window.RotateRay2 = (function(){
  var IE                      = navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/)) || window.navigator.userAgent.indexOf("MSIE")>0;
  var _rayWidth               = IE ? 600 : 4000;
  var _rayHeight              = 0;
  var _animationTime          = 100;
  function RotateRay2(){
    this.init                 = this.init.bind(this);
    this.firstTime            = true;
    this.supportTouch         = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    this.default              = {
      color                   : "#F0CB3A",
      speed                   : 4,
      rayNumber               : 13,
    }; 
    this.options              = {};
    this.sunburst             = null;
  }
  RotateRay2.prototype.init = function(BannerFlow) {
    if (this.firstTime) {      
      this.container          = document.querySelector(".container");
      this.sunburst           = document.querySelector(".sunburst"); 
      if (IE) this.container.style.transform = "scale(4)";
      this.firstTime = false;     
    }
    for (var attr in this.default){
      this.options[attr]      = this.default[attr];
    }
    if (BannerFlow) {
      for (var attr in this.default){
        this.options[attr]      = BannerFlow.settings[attr] || this.default[attr];        
      }
      this.options["rayNumber"] = Math.max(this.options["rayNumber"],2);
    }    
    this.container.style.opacity= 0;
    this.sunburst.innerHTML   = "";
    var corner = Math.PI / this.options.rayNumber  ;
    _rayHeight = _rayWidth*Math.tan(corner/2);
    var settingStyle          = "";
    var animation             = "rotateBackground "+_animationTime/this.options.speed+"s linear infinite";
    settingStyle += getStyle(".sunburst",{
      "color"                 : this.options.color,
      //"animation-duration"    : _animationTime/this.options.speed+"s"
      "-webkit-animation"     : animation,
      "-moz-animation"        : animation,
      "-o-animation"          : animation,
      "animation"             : animation,
    });
    settingStyle += getStyle(".sunburst b",{
      "border-width"          : _rayHeight + "px " + _rayWidth + "px",
      "top"                   : "calc(50% - "+_rayHeight+"px)",
      "left"                  : "calc(50% - "+_rayWidth+"px)",
    });
    for (var i = 0;i<this.options.rayNumber;i++) {
      var b = document.createElement("b");
      this.sunburst.appendChild(b);
      setStyleCss3(b,"transform","rotate("+i*2*corner+"rad)");
    }
    document.querySelector("#settings").innerHTML = settingStyle;
    this.container.style.opacity = 1;
  };
  return RotateRay2;
})();
/*-----------------
      Utils
-----------------*/
//get style from object style
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
//get CSS3 style
var setStyleCss3 = function (object, key, value) {
  object.style['-webkit-'+ key] = value;
  object.style['-moz-'+key] = value;
  object.style['-ms-'+key] = value;
  object.style[key] = value;
}
/*-----------------
  Main function
-----------------*/
var timer,widget=new RotateRay2(); ;
if (typeof BannerFlow != 'undefined') {
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    clearTimeout(timer);
    timer = setTimeout(function(){
        widget.init(BannerFlow);
    },500);
  });
} else {
  window.addEventListener("load",function(){
    widget.init();
  });
}