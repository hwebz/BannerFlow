window.PeelingSticker = (function(){
  function PeelingSticker(){
    this.init                 = this.init.bind(this);
    this.direction            = {
      top                     : 0,
      right                   : 90,
      bottom                  : 180,
      left                    : -90,
      "top-right"             : 45,
      "bottom-right"          : 135,
      "bottom-left"           : -135,
      "top-left"              : -45
    };
    this.default              = {
      stickerSize             : "400",
      stickerColor            : "rgba(133,186,129,1)",
      stickerBehindColor      : "rgba(200,200,200,1)",
      direction               : "bottom",
      begin                   : 20,
      end                     : 95,
      topFont                 : "Arial, Times, serif",
      topColor                : "rgba(255,255,255,1)",
      topSize                 : 24,
      behindFont              : "Arial, Times, serif",
      behindColor             : "rgba(255,255,255,1)",
      behindSize              : 24,
    }
    this.options              = {};
    this.container            = null;
    this.firstTime            = true;
  }
  PeelingSticker.prototype.init = function(BannerFlow){
    if (this.firstTime) {
      this.firstTime = false;
      this.container = document.querySelector(".container");
    }
    this.container.style.opacity= 0;
    //default settings
    for(var attr in this.default) {
      this.options[attr]      = this.default[attr];
    }
    //bannerflow settings
    if (BannerFlow) {
      if (BannerFlow.text && BannerFlow.text!="Enter text..."){
        var text = BannerFlow.text.split(":");
        document.querySelector('.text.top').innerHTML = text[0].trim();
        document.querySelector('.text.behind').innerHTML = text[1].trim();
      }
      if (BannerFlow.settings) {
        for(var attr in this.default) {
          this.options[attr]    = BannerFlow.settings[attr] || this.default[attr];
        }
      }
    }
    var settingStyle            = "";
    settingStyle += getStyle(".container",{
      "width"                   : (+this.options.stickerSize+2)+"px",
      "height"                  : (+this.options.stickerSize+2)+"px",
      "margin-top"              : (innerHeight-this.options.stickerSize)/2+"px"
    });
    settingStyle += getStyle(".container .circle",{
      "height"                  : this.options.stickerSize+"px",
      "width"                   : this.options.stickerSize+"px",
    });
    settingStyle += getStyle(".front .circle",{      
      "background-image"        : gradient(this.options.stickerColor,0.75,50,95)
    });
    settingStyle += getStyle(".back .circle",{      
      "background-image"        : gradient(this.options.stickerColor,1.3)
    });
    settingStyle += getStyle(".reveal .circle",{      
      "background-image"        : gradient(this.options.stickerBehindColor,0.9,null,null,"to bottom")
    });
    var degVal = this.direction[this.options.direction];
    settingStyle += getStyle(".sticky",{
      "-webkit-transform"       : "rotate("+degVal+"deg)",
      "-moz-transform"          : "rotate("+degVal+"deg)",
      "-o-transform"            : "rotate("+degVal+"deg)",
      "transform"               : "rotate("+degVal+"deg)",
    });
    settingStyle += getStyle(".back",{      
      "height"                  : this.options.begin+"%",
      "top"                     : this.options.begin+"%"
    });
    settingStyle += getStyle(".front",{      
      "height"                  : (100-this.options.begin)+"%",
    });
    settingStyle += getStyle(".container:hover .back",{      
      "height"                  : this.options.end+"%",
      "top"                     : this.options.end+"%"
    });
    settingStyle += getStyle(".container:hover .front",{      
      "height"                  : (100-this.options.end)+"%",
    });
    settingStyle += getStyle(".text.top",{      
      "color"                   : this.options.topColor,
      "font-family"             : this.options.topFont,
      "font-size"               : this.options.topSize      
    });
    settingStyle += getStyle(".text.behind",{      
      "color"                   : this.options.behindColor,
      "font-family"             : this.options.behindFont,
      "font-size"               : this.options.behindSize
    });
    document.querySelector("#settings").innerHTML = settingStyle;
    this.container.style.opacity = 1;
  }
  return PeelingSticker;
})();
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
var gradient = function(color1, lum, percent1, percent2, direction) {
    var color2 = changeLuminance(color1,lum);
    percent1 = percent1 ? percent1+"%" : "0%";
    percent2 = percent2 ? percent2+"%" : "100%";   
    direction = direction ? direction : "to top";
    return "linear-gradient("+direction+", "+color1+" "+percent1+", "+color2+" "+percent2+")";
}
/*-----------------Main function-----------------*/
var timer,widget=new PeelingSticker(); ;
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