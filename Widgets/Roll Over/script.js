window.raf = (function(){
  return requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || function(c){setTimeout(c,1000/fps);};
})();
/*---------------------Utils---------------------*/
Element.prototype.addClass = function(c) {
    if (!this.hasClass(c)) this.className += (" " +c+" ");
}
Element.prototype.removeClass = function(c) {
    if (this.hasClass(c)) this.className = (" "+this.className+" ").replace(" "+c+" "," ").trim();
}
Element.prototype.hasClass = function(c) {
    return (" "+this.className+" ").replace(/[\n\t]/g, " ").indexOf(" "+c) > -1;
}
Element.prototype.toggleClass = function(c) {
    if (this.hasClass(c)) this.removeClass(c)
    else this.addClass(c);
}
//remove html from string
var stripHtml = function(html){
  var div = document.createElement("div");
  div.innerHTML = html;
  var text = div.textContent || div.innerText || "";
    return text;
}
//get font
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
/*--------------simple scroll-----------------*/
window.SimpleScroll = (function(){
  function dragDealer(el, context) {
    var lastPageY;
    el.addEventListener('mousedown', function(e) {
      lastPageY = e.pageY;
      el.classList.add('ss-grabbed');
      d.body.classList.add('ss-grabbed');
      d.addEventListener('mousemove', drag);
      d.addEventListener('mouseup', stop);
      return false;
    });
    function drag(e) {
      var delta = e.pageY - lastPageY;
      lastPageY = e.pageY;
      raf(function() {
        context.el.scrollTop += delta / context.scrollRatio;
      });
    }
    function stop() {
      el.classList.remove('ss-grabbed');
      d.body.classList.remove('ss-grabbed');
      d.removeEventListener('mousemove', drag);
      d.removeEventListener('mouseup', stop);
    }
  }
  // Constructor
  function SimpleScroll(el) {
    this.target = el;
    this.bar = '<div class="ss-scroll">';
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('class', 'ss-wrapper');
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'ss-content');
    this.wrapper.appendChild(this.el);
    while (this.target.firstChild) {
      this.el.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);
    this.target.insertAdjacentHTML('beforeend', this.bar);
    this.bar = this.target.lastChild;
    dragDealer(this.bar, this);
    this.moveBar();
    this.el.addEventListener('scroll', this.moveBar.bind(this));
    this.el.addEventListener('mouseenter', this.moveBar.bind(this));
    this.target.classList.add('ss-container');
    var css = window.getComputedStyle(el);
    if (css['height'] === '0px' && css['max-height'] !== '0px') {
      el.style.height = css['max-height'];
    }
  }
  SimpleScroll.prototype = {
    moveBar: function(e) {
      var totalHeight = this.el.scrollHeight,
          ownHeight = this.el.clientHeight,
          _this = this;
      this.scrollRatio = ownHeight / totalHeight;
      raf(function() {
        // Hide scrollbar if no scrolling is possible
        if(_this.scrollRatio === 1) {
          _this.bar.classList.add('ss-hidden')
        } else {
          _this.bar.classList.remove('ss-hidden')
          _this.bar.style.cssText = 'height:' + (_this.scrollRatio) * 100 + '%; top:' + (_this.el.scrollTop / totalHeight ) * 100 + '%;right:-' + (_this.target.clientWidth - _this.bar.clientWidth-8) + 'px;';
        }
      });
    }
  }
  return SimpleScroll;
})();
/*--------------roll over-----------------*/
window.RollOver = (function(){
  function RollOver(){
    this.init                 = this.init.bind(this);
    this.options              = {};
    this.firstTime            = true;
    this.supportTouch         = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    this.default              = {
      openCondition           : "click",
      fontFamily              : "arial",
      fontColor               : "#fff",
      fontSize                : 12,
      fontStyle               : "normal",
      bgColor                 : "#85bae5",
      lineHeight              : 12,
      animationDirection      : "bottom",
      verticalAlign           : "top",
      closeButtonTheme        : "#fff",
      openButtonTheme         : "#6084a0",
      openButtonStyle         : "text",
      openTop                 : 70,
      openLeft                : 10
    };
    
  }
  RollOver.prototype.init     = function(BannerFlow){
    var that=this;
    if (this.firstTime) {
      this.firstTime          = false;
      this.container          = document.querySelector(".container");
      this.openButton         = document.querySelector(".open");
      this.closeButton        = document.querySelector(".close");
      this.clickArea          = document.querySelector(".click-area");
      this.content            = document.querySelector(".content");
      this.text               = document.querySelector(".text");
      this.scroll             = new SimpleScroll(document.querySelector(".position"));      
    }
    this.container.style.opacity= 0;
    //default settings
    for(var attr in this.default) {
      this.options[attr]      = this.default[attr];
    }
    //bannerflow settings
    if (BannerFlow) {
      //edit mode
      if (BannerFlow.editorMode) {
        this.content.removeClass("hide");
        this.openButton.style.opacity = "0.3";
      }
      //change text
      if (BannerFlow.text && BannerFlow.text!="Enter text..."){
        var arr = stripHtml(BannerFlow.text).split(":");
        this.text.innerHTML       = (arr[0]||"").trim();
        this.openButton.innerHTML = (arr[1]||"").trim();
      }
      //get settings
      if (BannerFlow.settings) {
        for(var attr in this.default) {
          this.options[attr]      = BannerFlow.settings[attr] !=null && BannerFlow.settings[attr]!="" ? BannerFlow.settings[attr] : this.default[attr];
        }
      }
    }
    //apply settings
    this.content.className        = this.content.className.replace(/top|bottom|left|right/g, "").trim()+" "+this.options.animationDirection.toLowerCase().replace("-"," ");
    this.openButton.addEventListener(BannerFlow ? BannerFlow.CLICK : that.supportTouch ? "touchstart" : "click",function(){
      if (that.options.openCondition.toLowerCase() == "click") {
        that.content.removeClass("hide");
        that.openButton.addClass("hide");
      }
    });
    this.openButton.addEventListener(BannerFlow ? BannerFlow.MOUSE_MOVE : that.supportTouch ? "touchmove" : "mousemove",function(){
      if (that.options.openCondition.toLowerCase() == "hover") {
        that.content.removeClass("hide");
        that.openButton.addClass("hide");
      }
    });
    this.closeButton.addEventListener(BannerFlow ? BannerFlow.CLICK : that.supportTouch ? "touchstart" : "click" ,function(){
      that.content.addClass("hide");
      that.openButton.removeClass("hide");
    });
    var settingStyle              = "";
    settingStyle += getStyle(".content",{
      "font-family"               : getFont(+this.options.fontFamily),
      "color"                     : this.options.fontColor,
      "font-size"                 : this.options.fontSize+"px",
      "background-color"          : this.options.bgColor,
      "line-height"               : this.options.lineHeight+"px",
      "align-items"               : {
        top                       : "flex-start",
        center                    : "center",
        bottom                    : "flex-end"
      }[this.options.verticalAlign]
    });
    settingStyle += getStyle(".open",{
      "font-family"           : getFont(+this.options.fontFamily),
      "color"                 : this.options.openButtonTheme,
      "font-size"             : this.options.fontSize+"px",
      "font-weight"           : this.options.fontStyle.toLowerCase() == "bold" ? "bold" : "normal",
      "font-style"            : this.options.fontStyle.toLowerCase() == "italic" ? "italic" : "normal",
      "top"                   : this.options.openTop+"%",
      "left"                  : this.options.openLeft+"%",
    });
    settingStyle += getStyle(".close",{
      "border-color"          : this.options.closeButtonTheme,
      "color"                 : this.options.fontColor,
    });
    if(this.options.openButtonStyle.toLowerCase()=="text") {
      settingStyle += getStyle(".open",{
        "border"              : "none",
        "background-color"    : "transparent",
        "margin-left"         : "-9px"
      });
    };
    document.querySelector("#settings").innerHTML = settingStyle;
    this.container.style.opacity = 1;
  }
  return RollOver;
})();

/*-----------------Main function-----------------*/
var timer,widget=new RollOver(); ;
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