var fps           = 60;
window.raf = (function(){
  return requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || function(c){setTimeout(c,1000/fps);};
})();
/*--------------=== Slot machine definition ===--------------*/
(function() {
  var NAME        = "SlotMachine",
  defaultSettings = {
    width           : "600",
    height          : "400",
    colNum          : 5,
    rowNum          : 9,
    winRate         : 100,
    autoPlay        : 'playonce',
    autoPlayCount   : 1,
    autoSize        : false,
    autoPlayTime    : 10,
    layout          : 'compact',
    handleShow      : true,
    handleWidth     : 35,
    handleHeight    : 30,
    spinHeight      : 52,
    machineBorder   : 15,    
    control         : 'button',
    machineColor    : 'rgba(230,230,230,1)',
    themes          : '',
    spinColor       : 'hsl(30, 70%, 60%)',
    spinDirection   : 'downwards',
    spinTextColor   : '#fff',
    backgroundValue : '',
    winnerLogo      : '',
    winnerColor     : '#F0CB3A',
    names           : [
      "seven",
      "lemon",
      "cherry",
      "watermelon",
      "banana",
      "bar",
      "prune",
      "bigwin",
      "orange"
    ]
  },
  completed       = true,
  isShuffle       = true,
  supportTouch    = 'ontouchstart' in window || navigator.msMaxTouchPoints,
  firstTime       = true,
  nextLoop        = null ;
  SlotMachine = function (argument) {
    this.init = this.init.bind(this);
    this.run = this.run.bind(this);
    this.addListener = this.addListener.bind(this);
    this.beforeRun = this.beforeRun.bind(this);
    this.afterRun = this.afterRun.bind(this);
    this.showWin = this.showWin.bind(this);
    this.controlActive = this.controlActive.bind(this);
    this.colArr = [];
    this.options = {};
  }
  SlotMachine.prototype.beforeRun = function(moreClick){
    if (moreClick) {
      //reset all
      completed = true;
      clearTimeout(nextLoop);    
      this.options.autoPlayCount = 1;
    }
    if (this.options.autoPlayCount <= 0) return;
    this.options.autoPlayCount--;
    if (completed) {
      this.showWin(false);
      completed = false;
      var result = null;
      var k = random(this.options.rowNum*100/this.options.winRate)|0;
      result = this.options.names[k];//set winrate
      for(var i=0;i<this.options.colNum;i++){        
        this.colArr[i].beforeRun(result,this.options.spinDirection=="upwards");
      }
      this.controlActive();
      this.run();
    }
    nextLoop = setTimeout(function(){this.beforeRun()}.bind(this),this.options.autoPlayTime*1000);
  }
  SlotMachine.prototype.afterRun = function(){
    completed = true;
    var results = [],win=true;
    for(var i=0;i<this.options.colNum;i++){
      results.push(this.colArr[i].getResult());
      if (i>0 && results[i]!=results[i-1]) {
        win = false;
        break;
      }
    }
    if(win){
      this.showWin(true);
      setTimeout(function(){
        this.showWin(false);
      }.bind(this),this.options.autoPlayTime*1000);
    }
  }
  SlotMachine.prototype.controlActive = function(){
    if (this.options.control.toLowerCase()=="handle") {
      var handle = document.querySelector(".handle");
      if (handle) {
        handle.addClass("active");
        setTimeout(function(){
          handle.removeClass("active");
        },1000);
      }
    } else if (this.options.control.toLowerCase()=="button") {
      var spin = document.querySelector(".spin");
      if (spin) {
        spin.addClass("active");
        setTimeout(function(){
          spin.removeClass("active");
        },1000);
      }
    }
  }
  SlotMachine.prototype.run = function(){
    var done = true;
    for(var i=0;i<this.options.colNum;i++){
      done &= this.colArr[i].run();
    }
    if (!done) raf(this.run)
    else this.afterRun();
  }
  SlotMachine.prototype.showWin = function(show){
    var winner = document.querySelector(".winner");
    if (winner) winner.className= show ? "winner active" : "winner";
  }
  SlotMachine.prototype.init = function(){
    //reset all
    completed = true;
    clearTimeout(nextLoop);
    //get settings
    var BannerFlow = arguments[0],
        settingStyle = "",
        machine = document.querySelector(".machine"),
        container = document.querySelector(".container");
    machine.style.opacity = 0;
    for(var key in defaultSettings) {
      this.options[key] = defaultSettings[key];
    }
    if (BannerFlow!==undefined){
      var settings = BannerFlow.settings;
      this.options.winRate = settings.winRate ? settings.winRate : defaultSettings.winRate;
      this.options.autoPlay = settings.autoPlay ? settings.autoPlay : defaultSettings.autoPlay;
      
      this.options.colNum = settings.numberColumn ? settings.numberColumn : defaultSettings.colNum;
      this.options.layout = settings.layout ? settings.layout : defaultSettings.layout;
      this.options.machineColor = settings.machineColor ? settings.machineColor : defaultSettings.machineColor;
      this.options.machineBorder = settings.machineBorder>=0 ? settings.machineBorder : defaultSettings.machineBorder;
      this.options.height = settings.height ? settings.height : defaultSettings.height;
      this.options.width = settings.width ? settings.width : defaultSettings.width;
      this.options.autoSize = settings.autoSize;
      if (this.options.autoSize) {
        this.options.height = window.innerHeight;
        this.options.width = window.innerWidth;
      }
      this.options.control = settings.control;
      this.options.handleWidth = this.options.control.toLowerCase()=="handle" ? defaultSettings.handleWidth : 0;
      this.options.spinHeight = this.options.control.toLowerCase()=="button" ? defaultSettings.spinHeight : 0;
      this.options.autoPlayTime = settings.autoPlayTime ? settings.autoPlayTime : defaultSettings.autoPlayTime;
      this.options.background = settings.background;
      var bgSelect = this.options.background.toLowerCase();
      if (bgSelect== "themes") {
        this.options.themes = settings.themes ? settings.themes : defaultSettings.themes;
      } else if (bgSelect=="transparent"){
        this.options.backgroundValue = "none";
      } else if (bgSelect=="color") {
        this.options.backgroundValue = settings.backgroundColor ? settings.backgroundColor : '';
      } else if (bgSelect=="image") {
        this.options.backgroundValue = settings.backgroundImage ? "url("+settings.backgroundImage+")" : '';
      }
      this.options.spinColor = settings.spinColor ? settings.spinColor : defaultSettings.spinColor;
      this.options.spinTextColor = settings.spinTextColor ? settings.spinTextColor : defaultSettings.spinTextColor;
      this.options.winnerLogo = settings.winnerLogo ? "url("+settings.winnerLogo+")" : '';
      this.options.winnerColor = settings.winnerColor ? settings.winnerColor : defaultSettings.winnerColor;
      this.options.spinDirection = settings.spinDirection ? settings.spinDirection.toLowerCase().trim() : defaultSettings.spinDirection;      
      if (BannerFlow.text && BannerFlow.text!="Enter text..." && BannerFlow.text.length > 0){
        var urls = BannerFlow.text.strip().split(",");
        this.options.names = [];
        for(var i=0;i<urls.length;i++){
          var name = "image-"+i ; urls[i];
          this.options.names.push(name);
          settingStyle += getStyle("."+name+":after",{
            "background-image"  : "url('"+urls[i]+"')"
          });
          this.options.rowNum = this.options.names.length;
        }
      }
    }
    var autoSelect = this.options.autoPlay.toLowerCase();
    this.options.autoPlayCount = (autoSelect == "autoplay") ? 999999 : (autoSelect == "playonce") ? 1 : 0;            
    //apply settings
    container.className = "container theme"+this.options.themes;
    settingStyle += getStyle(".machine",{
      "margin-top"          : (window.innerHeight - this.options.height)/2 +"px",
      "margin-left"         : (window.innerWidth - this.options.width)/2 +"px"
    });
    settingStyle += getStyle(".container",{
      "height"              : this.options.height - this.options.spinHeight +"px",
      "width"               : this.options.width - this.options.handleWidth +"px",
      "border-width"        : this.options.machineBorder + "px",
      "border-color"        : this.options.machineColor + " " + changeLuminance(this.options.machineColor,1.25) ,
      "background"          : this.options.backgroundValue
    });
    var border = this.options.machineBorder > 5 ? 1.2*this.options.machineBorder : 6;
    settingStyle += getStyle(".container:before",{
      "border-color"        : "transparent " + changeLuminance(this.options.machineColor,1.25) ,
      "border-width"        : border + "px",
      "width"               : "calc(100% - "+ (2*border-2) +"px)",
      "top"                 : "calc(50% - "+ border +"px)"
    });
    var rowHeight = this.options.width/this.options.colNum;
    settingStyle += getStyle(".container:after",{
      "height"              : rowHeight+"px",
      "top"                 : "calc(50% - "+rowHeight/2+"px)"
    });
    var winnerSize = Math.sqrt(this.options.height*this.options.height + this.options.width*this.options.width);
    settingStyle += getStyle(".winner:before",{
      "height"              : winnerSize+"px",
      "width"               : winnerSize+"px",
      "top"                 : (this.options.height-winnerSize)/2 - 40 + "px",
      "left"                : (this.options.width-winnerSize)/2 - this.options.handleWidth + "px"
    });
    settingStyle += getStyle(".winner:after",{
      "background-image"     : this.options.winnerLogo
    });
    settingStyle += getStyle(".sunburst,.galaxy",{
      "border-color"        : this.options.winnerColor
    });
    settingStyle += getStyle(".handle",{
      "display"             : this.options.control.toLowerCase()=="handle" ? "block" : "none",
      "margin-top"          : this.options.height/2-this.options.handleHeight+"px"
    });
    settingStyle += getStyle(".footer",{
      "background-color"    : this.options.machineColor,
      "display"             : this.options.control.toLowerCase()=="button" ? "block" : "none",
      "margin-right"        : this.options.control.toLowerCase()=="button" ? "0" : "13px"
    });
    settingStyle += getStyle(".spin",{
      "background-color"    : this.options.spinColor,
      "color"               : this.options.spinTextColor
    });
    settingStyle += getStyle(".spin:hover,.spin.active",{
      "background-color"    : changeLuminance(this.options.spinColor,0.75)
    });
    document.querySelector("#setting").innerHTML = settingStyle;
    //remove old cols
    if (this.colArr && this.colArr.length > 0)
      for (var i=0;i<this.colArr.length;i++){
        container.removeChild(this.colArr[i].getDOM());
      }
    this.colArr = [];
    // add new cols
    for(var i=0;i<this.options.colNum;i++){
      var col = new SlotColumn();
      col.init(this.options.names.slice(0,this.options.rowNum),isShuffle);
      this.colArr.push(col);
      document.querySelector(".container").appendChild(col.getDOM());
    }
    machine.style.opacity = "1";
  }
  SlotMachine.prototype.addListener = function(){
    var BannerFlow=arguments[0],timer,
        that = this ,
        container = document.querySelector(".container");
    if (typeof BannerFlow!= 'undefined') {
      // BannerFlow event
      BannerFlow.addEventListener(BannerFlow.RESIZE, function() {
        //clearTimeout(timer);
        //timer = setTimeout(function(){that.init(BannerFlow);that.beforeRun()},500);
      });
      BannerFlow.addEventListener(BannerFlow.MOUSE_DOWN, function() {
        that.beforeRun(true);
      });
      window.addEventListener("click",function(){
        that.beforeRun(true);
      });
    } else {
      // Window event
      window.addEventListener('resize', function(){
        //clearTimeout(timer);
        //timer = setTimeout(function(){that.init(BannerFlow);that.beforeRun()},500)
      });
      if (supportTouch) {
        window.addEventListener("touchstart",function(){
          that.beforeRun(true);
        });
      } else {
        window.addEventListener("click",function(){
          that.beforeRun(true);
        });
      }
    }
    var slotTrigger = document.querySelector("#slot-trigger");
    if (slotTrigger) {
      slotTrigger.addEventListener("click",function(e){
        this.addClass('slot-triggerDown');
      })
    }
  }
  window[NAME]= SlotMachine;
})();
/*--------------=== Slot Column definition ===--------------*/
(function(){
  var NAME = "SlotColumn";
  SlotColumn = function(){
    this.col = document.createElement("div");
    this.col.className = "col";
    this.init = this.init.bind(this);
    this.run = this.run.bind(this);
    this.beforeRun = this.beforeRun.bind(this);
    this.getResult = this.getResult.bind(this);
    this.getDOM = this.getDOM.bind(this);
    this.arr = [];
    this.colHeight=this.rowHeight=0;
    this.loop = 2;
  }
  SlotColumn.prototype.init = function(){
    this.col.empty();
    this.arr=arguments[0];
    var isShuffle=arguments[1];
    if(isShuffle) shuffle(this.arr);
    for(var i=0; i<this.arr.length*this.loop;i++){
      var row = document.createElement("div");
      row.className = "row "+this.arr[i%this.arr.length];
      this.col.appendChild(row);
    }
    this.top = 0;
  }
  SlotColumn.prototype.beforeRun = function(){
    this.halfHeight = this.col.offsetHeight/this.loop;
    this.colHeight = this.col.scrollHeight/2;
    this.rowHeight = this.colHeight/this.arr.length;
    this.nextResult = arguments[0];
    this.spinDirection = arguments[1];
    var next = this.arr.indexOf(this.nextResult);
    if (next==-1) next=random(0,this.arr.length-1)|0;
    var s,n;
    //default is upwards
    if (this.spinDirection)
      s = this.top + (random(2,10)|0)*this.colHeight + ((next+0.5)*this.rowHeight|0) - this.halfHeight;
    else 
      s = -this.top + (random(2,10)|0)*this.colHeight - ((next+0.5)*this.rowHeight|0) + this.halfHeight;
    n = (random(2,6)|0) * fps;
    this.speed = 2*s/(n+1);
    this.acceleration = this.speed/n;
    //console.log(this.arr[next],s,n,this.speed,this.acceleration);
  }
  SlotColumn.prototype.getResult = function(){
    var result = Math.ceil(((this.halfHeight-this.top)%this.colHeight)/this.rowHeight)-1;
    //console.log(this.top,result,this.arr[result],this.halfHeight,this.colHeight,this.rowHeight);
    return this.arr[result];
  }
  SlotColumn.prototype.run = function(){
    if(this.speed <= 0) return true;//completed
    if (this.spinDirection)
      this.top = (this.top - this.speed) % this.colHeight;
    else 
      this.top = (this.top - this.colHeight + this.speed) % this.colHeight;
    this.speed -= this.acceleration;    
    this.col.style.transform = "translateY("+this.top+"px)";    
    return false;//not completed
  }
  SlotColumn.prototype.getDOM = function(){
    return this.col;
  }
  window[NAME] = SlotColumn;
}());
/*--------------=== Utils definition ===--------------*/
//random in range
var random = function(){
  var isNumeric = function(n){return !isNaN(parseFloat(n)) && isFinite(n)},
      val = Math.random(),
      arg = arguments;
  return isNumeric(arg[0]) ? isNumeric(arg[1]) ? arg[0] + val*(arg[1] - arg[0]) : val*arg[0] : val;
};
//shuffle an array
var shuffle = function(arr){
  var j,tmp;
  for(var i=0;i<arr.length;i++){
    j = random(arr.length)|0;
    tmp = arr[i];arr[i]=arr[j];arr[j]=tmp;
  }
}
//get CSS3 style
var setStyleCss3 = function (object, key, value) {
  object.style['-webkit-'+ key] = value;
  object.style['-moz-'+key] = value;
  object.style['-ms-'+key] = value;
  object.style[key] = value;
}
//get name from url
var getNameFromUrl = function(url){
  if (url) {
    var s=url.lastIndexOf("/")+1,e =url.lastIndexOf(".");
    return s<e ? url.substring(s,e) : "";
  }
  return "";
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
// get lighter color from rgba colors
var getLighter = function(rgba){
  var o = /[^,]+(?=\))/g.exec(rgba)[0]*0.75;
  return rgba.replace(/[^,]+(?=\))/g,o);
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
//remove html from text
if (!String.prototype.strip) {
    String.prototype.strip = function() {
        return this.replace(/(<[^>]+>)/ig," ").trim();
    }
}
//remove all child node
if (!Node.prototype.empty) {
    Node.prototype.empty = function(){
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
    }
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
/*--------------=== Main function ===--------------*/
var timer,widget = null;
if (typeof BannerFlow != 'undefined') {
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    clearTimeout(timer);
    timer = setTimeout(function(){
      if (widget==null) {
        widget = new SlotMachine();
        widget.addListener(BannerFlow);
      }
      widget.init(BannerFlow);
      widget.beforeRun();
    },500);
  });
}else {
  window.addEventListener("load",function(e){
    if (widget==null) {
      widget = new SlotMachine();
      widget.addListener();
    }
    widget.init();
    widget.beforeRun();
  })
}