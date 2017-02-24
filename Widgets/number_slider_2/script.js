window.raf = (function(){
  return requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || function(c){setTimeout(c,1000/60|0);};
})();
window.NumberSlider2 = (function(){
  function NumberSlider2(){
    this.init                 = this.init.bind(this);
    this.setValue             = this.setValue.bind(this);
    this.getValue             = this.getValue.bind(this);
    this.update               = this.update.bind(this);
    this.addEvent             = this.addEvent.bind(this);
    this.colorEffect          = this.colorEffect.bind(this);
    this.valueEffect          = this.valueEffect.bind(this);
    this.default              = {
      color                   : "#4eb7da",
      inactiveColor           : "#f1f1f1",
      layout                  : "left",//left,top,bottom
      min                     : 0,
      max                     : 100,
      step                    : 10,
      value                   : 50,
      range                   : 100,
      percent                 : 0,
      surfix                  : "Kr",
      label                   : "Startbelopp",
      thumbSize               : 20,
      freeColor               : false,
      offset                  : 0,
      animation               : "0%:100%:50%",
      animationTime           : 10,
      font                    : "Arial",
    }
    this.options              = {};
    this.firstTime            = true;
    this.active               = false;
    this.supportTouch         = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    this.container = this.input = this.slider = this.thumb = this.surfix = this.freeColorChange = this.valueChange = null;
  }
  NumberSlider2.prototype.init = function(BannerFlow){
    //init for the first time
    if(this.firstTime) {
      this.firstTime          = false;
      this.label              = document.querySelector("[for~='number-slider']");
      this.input              = document.querySelector(".number-slider");
      this.slider             = document.createElement("div");
      this.thumb              = document.createElement("div");
      this.surfix             = document.createElement("span");
      this.container          = this.input.parentNode;
      this.thumb.className    = "thumb";
      this.slider.className   = "slider";
      this.surfix.className   = "surfix";
      this.container.appendChild(this.surfix);
      this.container.appendChild(this.slider);
      this.slider.appendChild(this.thumb);
      this.addEvent();
    }
    this.container.style.opacity = 0;
    //get default settings
    for(var attr in this.default) {
      this.options[attr]      = this.input[attr] || this.default[attr];
    }
    //get banner flow settings
    if (BannerFlow && BannerFlow.settings) {
      for(var attr in this.default) {
        this.options[attr]    = BannerFlow.settings[attr] || this.default[attr];
      }
      if (BannerFlow.text && BannerFlow.text!="Enter text...") {
        var text = BannerFlow.text.strip().split(":");
        this.options.label = text[0] || this.default.label;
        this.options.surfix = text[1] || this.default.surfix;
      }
      this.options.animation = BannerFlow.settings.animation;
    }
    this.options.range        = this.options.max - this.options.min;
    //apply settings
    this.input.value          = this.options.value;
    this.input.min            = this.options.min;
    this.input.max            = this.options.max;
    this.input.step           = this.options.step;
    this.label.innerHTML      = this.options.label;
    this.surfix.innerHTML     = this.options.surfix;
    var settingStyle = "";
    settingStyle += getStyle(".thumb",{
      "background-color"      : this.options.color,
      "border-color"          : this.options.color
    });
    //apply layout
    var layout = this.options.layout.toLowerCase();
    this.container.appendChild(this.slider);//default layout
    if (layout == 'left'){
      settingStyle += getStyle(".slider",{
        "width"               : (+this.container.getBoundRect().width - this.input.getBoundRect().width - this.surfix.getBoundRect().width - 40)+"px",
      });
    } else {
      settingStyle += getStyle(".container",{
        "text-align"          : "center",
      });
      settingStyle += getStyle("[for~='number-slider']",{
        "display"             : "inline-block",
      });
      settingStyle += getStyle(".slider",{
        "width"               : "100%",
        "margin"              : layout == 'bottom' ? "30px 0 10px": "10px 0",
      });
      if (layout == 'bottom'){
        this.container.insertBefore(this.slider,this.container.childNodes[0]);
      }
    }
    settingStyle += getStyle(".container",{
        "font-family"         : getFont(this.options.font)
      });
    document.querySelector("#settings").innerHTML = settingStyle;
    //apply free color
    this.colorEffect();
    //apply animation
    this.valueEffect();
    //set first value
    this.setValue(this.options.value);
    this.container.style.opacity = 1;
  }
  NumberSlider2.prototype.colorEffect = function(){
    var color=0,time=0,interval=1000/60,circle=60;
    var colorRun = function(){
      if (!this.options.freeColor) return;
      if (time>circle) {
        time=0;
        this.options.color = "hsl("+(color++)+",65%,58%)";
        this.update("color");
      }
      time+=interval;      
      raf(colorRun);      
    }.bind(this);
    if (this.options.freeColor && this.freeColorChange==null){
      this.freeColorChange = raf(colorRun);
    }
    else if (!this.options.freeColor && this.freeColorChange!=null) {      
      clearTimeout(this.freeColorChange);
      this.freeColorChange = null;
    }
  }
  NumberSlider2.prototype.valueEffect = function(){
    if (!this.options.animation) return;
    var arr = this.options.animation.split(":"),result=[];
    for(var i=0,k;i<arr.length;i++){
      k =arr[i].trim();
      if (k.indexOf("%")>-1) {
        k = getInRange(k.slice(0,-1),0,100);
        k = (+this.options.min)+this.options.range*k/100;
      }
      else {
        k = getInRange(k,this.options.min,this.options.max);
      }
      result.push(k);
    }
    this.options.animation = result;
    if (this.options.animation && this.options.animation.length > 1) {
      if (this.valueChange!=null) clearTimeout(this.valueChange);//hard reset
      var progress            = 1.1,
          loop                = 0,
          len                 = this.options.animation.length,
          iTime               = 1000/60,
          jump                = iTime*len/(1000*this.options.animationTime),
          range, value, start,end;
      var valueRun = function(){
        if (progress>1){
          loop++;
          if (loop>=this.options.animation.length) {
            return;
          }
          progress =0;
          start = this.options.animation[loop-1];
          end = this.options.animation[loop];
          range = end-start;
        }
        value = +start+range*Math.sin(progress*Math.PI/2);
        this.setValue(value|0);
        progress+=jump;
        this.update("value");
        raf(valueRun);
      }.bind(this);
      this.thumb.addClass("active");
      this.valueChange = raf(valueRun);
    }
  }
  NumberSlider2.prototype.update = function(part){
    var color = !part || part=="color", value = !part || part=="value";
    if (color) {
      this.thumb.style.backgroundColor= this.options.color;
      this.thumb.style.borderColor    = this.options.color;
      this.slider.style.background    = "linear-gradient(to right,"+this.options.color+" "+this.options.percent*100+"%,"+this.options.inactiveColor+" "+this.options.percent*100+"%)";
    }
    if (value) {
      this.thumb.style.left           = this.options.offset + "px";
      var w = +getComputedStyle(this.thumb, ':before').getPropertyValue('width').slice(0,-2)+20;
      if (this.options.offset + this.slider.getBoundRect().left> innerWidth - w) this.thumb.addClass("right");
        else this.thumb.removeClass("right");
    }
  }
  NumberSlider2.prototype.setValue  = function(value,check){
    if (check){
      value = getInRange(value,this.options.min,this.options.max);
      value = getRound(value,this.options.step);
    }
    var p                           = this.slider.getBoundRect();
    this.options.percent            = (value-this.options.min)/this.options.range;
    this.options.offset             = this.options.percent*p.width - this.options.thumbSize/2;
    this.options.value              = value;
    this.input.value                = value;
    this.thumb.setAttribute("value",value+" "+this.options.surfix);
    this.update();
  }
  NumberSlider2.prototype.getValue  = function(){
    return this.options.value;
  }
  NumberSlider2.prototype.addEvent  = function(){
    var that = this;
    var active = function(b) {
      if (b) { that.thumb.addClass("active"); }
      else { that.thumb.removeClass("active"); }
      that.active = b;
    }
    var calculateValue = function(e){
      if (!that.active) return;
      e = that.supportTouch ? e.touches[0] : e;
      var p = that.slider.getBoundRect(),
          value = +that.options.min+(e.pageX - p.left)/p.width*that.options.range;
      that.setValue(value,true);
    }
    that.input.addEventListener('input', function (evt) {
      that.setValue(this.value);
    });
    that.slider.addEventListener(that.supportTouch ? "touchstart" : "mousedown",function(e){
      e.preventDefault();
      active(true);
      calculateValue(e);
    });
    that.thumb.addEventListener(that.supportTouch ? "touchstart" : "mousedown",function(e){
      e.preventDefault();
      active(true);
    });
    document.addEventListener(that.supportTouch ? "touchend" : "mouseup",function(e){
      e.preventDefault();
      active(false);
    });
    document.addEventListener(that.supportTouch ? "touchmove" : "mousemove",function(e){
      calculateValue(e);
    });
  }
  return NumberSlider2;
})()
/*-------------------------------------
  UTils
-------------------------------------*/
var getInRange = function(val,min,max){
  return val > max ? max : val < min ? min : val;
}
var getRound = function(number,basis){
  var i = number/basis | 0, d = number -i*basis;
  return i*basis + (d > basis/2 ? +basis : 0);
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
if (!HTMLElement.prototype.getBoundRect) {
  HTMLElement.prototype.getBoundRect = function(c){
    return {
      top : this.offsetTop,
      left : this.offsetLeft,
      right : this.offsetLeft + this.offsetWidth,
      bottom : this.offsetTop + this.offsetHeight,
      width : this.offsetWidth,
      height : this.offsetHeight,
    }
  }
}
if (!String.prototype.strip) {
    String.prototype.strip = function() {
      return this.replace(/(<[^>]+>)/ig," ").trim();
    }
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
/*-------------------------------------
                Main
-------------------------------------*/
var timer,widget=new NumberSlider2(); ;
if (typeof BannerFlow!= 'undefined') {
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    clearTimeout(timer);
    timer = setTimeout(function(){
      widget.init(BannerFlow);
    },500);
  });
} else {
  document.addEventListener("DOMContentLoaded",function(e){
    widget.init();
  });
}