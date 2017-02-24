window.OverlayEffect = (function(){
  function OverlayEffect(){
    this.init                 = this.init.bind(this);
    this.default              = {
      animationDirection      : "top-left",
      overlayColor            : "rgba(0,0,200,0.7)",
      animationTime           : "0.5",
      headerFont              : "Arial, Times, serif",
      headerSize              : 24,
      headerColor             : "#fff",
      descriptionFont         : "'Times New Roman', Times, serif",
      descriptionSize         : 16,
      descriptionColor        : "#fff",
    }
    this.options              = {};
    this.container            = null;
    this.firstTime            = true;    
  }
  OverlayEffect.prototype.init = function(BannerFlow){
    if (this.firstTime) {
      this.firstTime = false;
      this.container = document.querySelector(".container");
    }
    this.container.style.opacity = 0;
    //default settings
    for(var attr in this.default) {
      this.options[attr]      = this.default[attr];
    }
    //bannerflow settings
    if (BannerFlow) {
      if (BannerFlow.editorMode) {
        document.querySelector(".container").addClass("active");
      }
      if (BannerFlow.text && BannerFlow.text!="Enter text..."){
        var text = BannerFlow.text.split(":");
        document.querySelector('.title').innerHTML = text[0].trim();
        document.querySelector('.description').innerHTML = text[1].trim();
      }
      if (BannerFlow.settings) {
        for(var attr in this.default) {
          this.options[attr]    = BannerFlow.settings[attr] || this.default[attr];
        }
      }
    }
    //apply settings
    var content = document.querySelector('.content-details');
    content.className   = content.className.replace(/top|bottom|left|right/g, "").trim()+" "+this.options.animationDirection.replace("-"," ");
    var settingStyle          = "";
    var transition            = "top " + this.options.animationTime + "s," 
                              + "left " + this.options.animationTime + "s,"
                              + "opacity " + this.options.animationTime + "s";
    settingStyle += getStyle(".content",{
      "-webkit-transition"    : transition,
      "-moz-transition"       : transition,
      "-o-transition"         : transition,
      "transition"            : transition,
    });
    settingStyle += getStyle(".content-overlay",{
      "background-color"      : this.options.overlayColor,
    });
    settingStyle += getStyle(".title",{
      "color"                 : this.options.headerColor,
      "font-size"             : this.options.headerSize+"px",
      "font-family"           : getFont(this.options.headerFont),
    });
    settingStyle += getStyle(".description",{
      "color"                 : this.options.descriptionColor,
      "font-size"             : this.options.descriptionSize+"px",
      "font-family"           : getFont(this.options.descriptionFont),
    });
    document.querySelector("#settings").innerHTML = settingStyle;
    this.container.style.opacity = 1;
  }
  return OverlayEffect;
})();
/*-----------------Utils function-----------------*/
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
function getFont(family) {
  family        = (family || "").replace(/[^A-Za-z]/g, '').toLowerCase();    
  var sans      = 'Helvetica, Arial, "Microsoft YaHei New", "Microsoft Yahei", "微软雅黑", 宋体, SimSun, STXihei, "华文细黑", sans-serif';
  var serif     = 'Georgia, "Times New Roman", "FangSong", "仿宋", STFangSong, "华文仿宋", serif';
  var fonts     = {
      helvetica : sans,
      verdana   : "Verdana, Geneva," + sans,
      lucida    : "Lucida Sans Unicode, Lucida Grande," + sans,
      tahoma    : "Tahoma, Geneva," + sans,
      trebuchet : "Trebuchet MS," + sans,
      impact    : "Impact, Charcoal, Arial Black," + sans,
      comicsans : "Comic Sans MS, Comic Sans, cursive," + sans,
      georgia   : serif,
      palatino  : "Palatino Linotype, Book Antiqua, Palatino," + serif,
      times     : "Times New Roman, Times," + serif,
      courier   : "Courier New, Courier, monospace, Times," + serif
  }
  var font      = fonts[family] || fonts.helvetica;
  return font;
}
if (!HTMLElement.prototype.hasClass) {
  Element.prototype.hasClass = function(c) {
    return (" "+this.className+" ").replace(/[\n\t]/g, " ").indexOf(" "+c+" ") > -1;
  }
}
if (!HTMLElement.prototype.addClass) {
  HTMLElement.prototype.addClass = function(c) {
    if (!this.hasClass(c)) this.className += (" " +c);
    return this;
  }
}
if (!HTMLElement.prototype.removeClass) {
  HTMLElement.prototype.removeClass = function(c) {
    if (this.hasClass(c)) this.className = (" "+this.className+" ").replace(" "+c+" "," ").trim();
    return this;
  }
}
/*-----------------Main function-----------------*/
var timer,widget=new OverlayEffect(); ;
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