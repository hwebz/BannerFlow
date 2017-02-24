if (!String.prototype.strip) {
    String.prototype.strip = function() {
      return this.replace(/(<[^>]+>)/ig," ").trim().replace(/\s{2,}/ig, " ");
    }
}
(function(window,document){
  'use strict';
  var _name             = "Ripper";
  var _defaultImage     = "./beautiful-girl.jpg";    
  var _imageUrl         = _defaultImage;
  var _waveStrength     = 1;
  var _clickActive      = false;
  var _hoverActive      = true;
  var _autoActiveForever = false;
  var _autoActiveTimes  = 1000;
  var _autoActiveDuration = 10;  
  var raf = function(c){setTimeout(c, 1000/60);};
  var isNumeric = function(n){return (typeof n!== undefined) && !isNaN(parseFloat(n)) && isFinite(n);}
  var random = function(range1,range2){
    var val = Math.random();
    if (isNumeric(range1)) return isNumeric(range2) ? range1 + val*(range2-range1) : val*range1; 
    return val;
  }
  function Ripper(){
    this.init = this.init.bind(this);
    this.initImage = this.initImage.bind(this);
    this.addListener = this.addListener.bind(this);
    this.wave = this.wave.bind(this);
    this.water = this.water.bind(this);
    this.gloop = this.gloop.bind(this);
    this.run = this.run.bind(this);
    this.isTouch = ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    this.image = null;
    this.canvas = null;
    this.context = null;
    this.pointer = {
      active : false,
      x : 0,
      y : 0,
      lastActive : 0
    }
  };
  Ripper.prototype.init = function(BannerFlow){
    if (typeof BannerFlow!= 'undefined' && BannerFlow) {
      if (BannerFlow.text) {
        _imageUrl = BannerFlow.text.strip();
      }
      _waveStrength = BannerFlow.settings.waveStrength || 1;
      _clickActive = BannerFlow.settings.clickActive;
      _hoverActive = BannerFlow.settings.hoverActive;
      _autoActiveTimes = BannerFlow.settings.autoActiveTimes;
      _autoActiveDuration = (BannerFlow.settings.autoActiveDuration || 5) *1000;
      _autoActiveForever = BannerFlow.settings.autoActiveForever;
    }
    //init for the first time
    if (this.canvas == null) {
      this.canvas = document.querySelector("canvas");
      this.image = new Image();
      this.image.crossOrigin = 'anonymous';
      this.context = this.canvas.getContext("2d");
      this.addListener();
      this.image.onload = function(){
        this.initImage();
        this.run();
      }.bind(this);
      this.image.onError = function(){
        _imageUrl = _defaultImage;
        this.initImage();
        this.run();
      }.bind(this);
    }
    this.image.src = _imageUrl;
  }
  Ripper.prototype.addListener = function(){
    var timer = null,
        activeMap = {
          "mousedown" : true,
          "touchstart" : true,
          "touchmove" : true,
          "mousemove" : true,
          "mouseup" : false,
          "touchend" : false,
          "touchcancel" : false
        }
    var update = function(e) {
      if (e.type=="mousemove" && !_hoverActive) return;
      if (e.type=="mousedown" && !_clickActive) return;      
      this.pointer.active = activeMap[e.type];
      if (this.isTouch) e = e.touches[0];
      if (this.pointer.active) {
        //this.pointer.lastActive = Date.now();
        this.pointer.x = e.pageX - canvas.offsetLeft;
        this.pointer.y = e.pageY - canvas.offsetTop;
      }
    }.bind(this);
    if (!this.isTouch) {
      document.addEventListener("mousedown",update);
      document.addEventListener("mouseup",update);
      document.addEventListener("mousemove",update);
    } else {
      document.addEventListener("touchstart",update);
      document.addEventListener("touchmove",update);
      document.addEventListener("touchend",update);
      document.addEventListener("touchcancel",update);
    }
    window.addEventListener("resize",function(e){
      this.initImage();
    }.bind(this));
  }
  Ripper.prototype.initImage = function(){
    var scale = Math.max(window.innerWidth/this.image.width,window.innerHeight/this.image.height);
    this.width = this.image.width*scale | 0;
    this.height = this.image.height*scale | 0;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context.drawImage(this.image,0,0,this.width,this.height);
    this.pointer.lastActive = 0;
    this.hwidth = this.width / 2 | 0,
    this.hheight = this.height / 2 | 0,
    this.size = this.width * (this.height + 2) * 2,
    this.map = new Int16Array(this.size);
    this.oldind = this.width;
    this.len = this.width * this.height;
    this.newind = this.width * (this.height + 3);
     // source texture
    this.texture = this.context.getImageData(0, 0, this.width, this.height);
    this.textureBuffer = new ArrayBuffer(this.texture.data.length);
    this.textureBuffer8 = new Uint8ClampedArray(this.textureBuffer); // 8 bit clamped view
    this.textureBuffer32 = new Uint32Array(this.textureBuffer); // 32 bits view
    // copy texture image
    for (var i = 0; i < this.textureBuffer8.length; i++) {
      this.textureBuffer8[i] = this.texture.data[i];
    }
    // ripple texture
    this.ripple = this.context.getImageData(0, 0, this.width, this.height);
    this.rippleBuffer = new ArrayBuffer(this.ripple.data.length);
    this.rippleBuffer8 = new Uint8ClampedArray(this.rippleBuffer);
    this.rippleBuffer32 = new Uint32Array(this.rippleBuffer);
  }
  Ripper.prototype.wave = function(dx, dy, r) {
    for (var j = dy - r; j < dy + r; j++) {
      for (var k = dx - r; k < dx + r; k++) {
        if (j >= 0 && j < this.height && k >= 0 && k < this.width) {
          this.map[this.oldind + (j * this.width) + k] += 512;
        }
      }
    }
  }
  Ripper.prototype.water = function(){
    var i, x, y, a, b, data, mapind;
    // toggle maps each frame
    i = this.oldind;
    this.oldind = this.newind;
    this.newind = i;
    mapind = this.oldind;
    for (i = 0; i < this.len; i++) {
      x = (i % this.width) | 0;
      y = (i / this.width) | 0;
      data = ((
        this.map[mapind - this.width] +
        this.map[mapind + this.width] +
        this.map[mapind - 1] +
        this.map[mapind + 1]
      ) >> 1 ) - this.map[this.newind + i];
      data -= data >> 6;
      mapind++;
      if (x !== 0) this.map[this.newind + i] = data;
      data = 1024 - data;
      // offsets
      a = (((x - this.hwidth) * data / 1024) + this.hwidth) | 0;
      b = (((y - this.hheight) * data / 1024) + this.hheight) | 0;
      // bounds check
      if (a >= this.width) a = this.width - 1;
      else if (a < 0) a = 0;
      if (b >= this.height) b = this.height - 1;
      else if (b < 0) b = 0;
      // 32 bits pixel copy
      this.rippleBuffer32[i] = this.textureBuffer32[a + (b * this.width)];
    }
    this.ripple.data.set(this.rippleBuffer8);
  }
  Ripper.prototype.gloop = function(){    
    this.wave(random(20,this.width-20)|0, random(20,this.height-20)|0 , +_waveStrength|0);
  }
  Ripper.prototype.run = function(){
    this.water();
    this.context.putImageData(this.ripple, 0, 0);
    // create waves
    if (this.pointer.active) {
      this.wave(this.pointer.x | 0, this.pointer.y | 0, +_waveStrength|0);
    }
    if (Date.now() - this.pointer.lastActive > _autoActiveDuration && (_autoActiveTimes > 0 || _autoActiveForever)) {
      console.log(_autoActiveTimes,+_autoActiveTimes > 0);
      this.pointer.lastActive = Date.now();
      _autoActiveTimes--;
      this.gloop();
    }
    raf(this.run);
  }
  window[_name] = Ripper;
})(window,document);
var timer,widget = new Ripper();
if (typeof BannerFlow != 'undefined') {
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    clearTimeout(timer);
    timer = setTimeout(function(){
      widget.init(BannerFlow);
    },500);
  });
}else {
  document.addEventListener("DOMContentLoaded",function(e){
    widget.init();
  });
}