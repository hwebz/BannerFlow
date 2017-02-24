/*-------------------------------
              Main
-------------------------------*/
var timer,widget = null;
if (typeof BannerFlow != 'undefined') {
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    clearTimeout(timer);
    timer = setTimeout(function(){
      if (widget==null) widget = new Marquee();
      widget.init(BannerFlow);
    },500);
  });
}else {
  window.addEventListener("load",function(){
    if (widget==null) widget = new Marquee();
    widget.init();
  });
}
/*-------------------------------
              Marquee
-------------------------------*/
window.raf = (function(){
  return requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || function(c){setTimeout(c,1000/60|0)};
})();
window.Marquee = (function(){
  function Marquee (){
    this.init             = this.init.bind(this);
    this.addListener      = this.addListener.bind(this);
    this.addFeed          = this.addFeed.bind(this);
    this.animation        = this.animation.bind(this);
    this.default          = {
      text                : "#up Where #down do I begin. : To tell the story of how great a love can be. : The love story that is older than the sea. ",
      backgroundColor     : "transparent",
      fontFamily          : 'Arial',
      fontSize            : 48,
      fontColor           : 'rgba(30,30,30,1)',
      speed               : 0,
      pauseCond           : 'hover',
      source              : "string",
    };
    this.options          = {};
    this.active           = true;
    this.firstTime        = true;
    this.supportTouch     = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    this.container        = null;
    this.firstWord        = null;
    this.left             = 0;
  }
  Marquee.prototype.animation = function(){
    if (this.active) {
      if (this.left > this.firstWord.offsetWidth) {
        this.left -= this.firstWord.offsetWidth;
        this.container.appendChild(this.firstWord);
        this.firstWord = this.container.querySelector("span");
      }
      setStyleCss3(this.container,"transform","translateX("+ (-this.left) +"px)");
      this.left = +this.left + parseFloat(this.options.speed);
    }
    raf(this.animation);
  };
  Marquee.prototype.addFeed   = function(BannerFlow){
    if (typeof BannerFlow == 'undefined' || !BannerFlow) return"";
    var value         = BannerFlow.feed[0].values;
    var key           = BannerFlow.feed[1].values;
    var result        = [];
    var keyCount      = 9;
    var display       = "";
    for(var i=0,k;i<key.length;i++){
      if (i%9==0) {
        k=i/9;
        result[k] = {};
      }
      result[k][ key[i] ] = value[i];
    }
    for(var i=0;i<result.length;i++){
      display+= i>0 ? ":" : "";
      var k = Math.random();
      var icon = k < 0.5 ? "#down" : "#up";
      display+=result[i].name + " " +  icon + " " + result[i].price;
    }
    return display;
  }
  Marquee.prototype.init      = function(BannerFlow){
    //first time init
    if (this.firstTime) {
      this.container      = document.querySelector(".container");
    }
    //reset
    this.firstWord = null;
    this.container.innerHTML = "";
    //hide when change settings
    this.container.style.opacity = 0;
    //default settings
    for(var attr in this.default) {
      this.options[attr]  = this.default[attr];
    }
    //bannerflow settings
    if (typeof BannerFlow != 'undefined' && BannerFlow) {
      for(var attr in this.default) {
        if (attr == 'text') {
          if (BannerFlow.text && BannerFlow.text!="Enter text...")
            this.options[attr] = BannerFlow.text.strip().trim() || this.default[attr];
        } else {
          this.options[attr]  = BannerFlow.settings[attr] || this.default[attr];
        }
      }
      if (BannerFlow.settings.source.toLowerCase() == "feed")
        this.options.text = this.addFeed(BannerFlow);
    }
    //apply settings
    var sentences = this.options.text.trim().replace(/\s+/g," ").split(":");
    var arrows = {"#up":"up","#down":"down"};
    for (var i=0;i<sentences.length;i++){
      var word = sentences[i].trim().replace(/\s+/g," ").split(" ");
      for (var j=0;j<word.length;j++) word[j] = word[j].trim();
      for (var j=0;j<word.length;j++) {
        if (word[j]=="" || arrows[word[j]]) continue;
        var span = document.createElement("span");
        span.innerHTML = word[j];
        this.container.appendChild(span);
        if (this.firstWord == null) this.firstWord = span;
        var hasIcon = arrows[word[j-1]];
        if (hasIcon) {
          var icon = document.createElement("i");
          icon.className = "arrow";
          span.insertBefore(icon,span.childNodes[0]);
          span.className = hasIcon;
        }
      }
      var span = document.createElement("span");
      span.className = "space";
      this.container.appendChild(span);
    }
    //add final space
    setTimeout(function(){
      var width = this.container.offsetWidth;
      var firstWordWidth = this.firstWord.offsetWidth;
      var remainWidth = window.innerWidth - width;
      width = Math.max(firstWordWidth,20) + ( remainWidth > 0 ? remainWidth : 0 );
      var span = document.createElement("span");
      span.style.width = width + "px" ;
      this.container.appendChild(span);
    }.bind(this),0);
    var settingStyle          = "";
    settingStyle += getStyle(".container",{
      "background-color"      : this.options.backgroundColor,
      "color"                 : this.options.fontColor,
      "font-size"             : this.options.fontSize+ "px",
      "font-family"           : getFont(this.options.fontFamily),
      "padding-top"           : (+window.innerHeight-this.options.fontSize)/2+"px",
    });
    settingStyle += getStyle(".container span",{
      "padding-left"          : this.options.fontSize/4+"px",
    });
    settingStyle += getStyle(".arrow",{
      "height"                : this.options.fontSize*0.75+"px",
    });
    document.querySelector("#settings").innerHTML = settingStyle;
    if (this.firstTime) {
      this.animation();
      this.addListener(BannerFlow);
    }
    this.left                 = 0;
    this.firstTime            = false;
    this.container.style.opacity = 1;
  }
  Marquee.prototype.addListener = function(BannerFlow){
    var timer, that = this;
    if (BannerFlow){
      BannerFlow.addEventListener(BannerFlow.RESIZE, function() {
        clearTimeout(timer);
        timer = setTimeout(function(){that.init();},500);
      });
    } else {
      window.addEventListener('resize', function(){
        clearTimeout(timer);
        timer = setTimeout(function(){that.init();},500)
      });
    }
    that.container.addEventListener("mouseenter",function(){
      if (that.options.pauseCond.toLowerCase()!="hover") return;
      that.active = false;
    });
    that.container.addEventListener("mouseleave",function(){
      if (that.options.pauseCond.toLowerCase()!="hover") return;
      that.active = true;
    });
    that.container.addEventListener(that.supportTouch ? "touchstart" : "click",function(){
      if (that.options.pauseCond.toLowerCase()!="click") return;
      that.active = !that.active;
    });
  }
  return Marquee;
})();
/*-------------------------------
              Utils
-------------------------------*/
if (!String.prototype.strip) {
    String.prototype.strip = function() {
      return this.replace(/(<[^>]+>)/ig," ").trim().replace(/\s{2,}/ig, " ");
    }
}
function setStyleCss3(object, key, value) {
  object.style['-webkit-'+ key] = value;
  object.style['-moz-'+key] = value;
  object.style['-ms-'+key] = value;
  object.style[key] = value;
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