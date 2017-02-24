window.raf = (function(){
  return requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || function(c){setTimeout(c,1000/60|0);};
})();
(function(window,document){
  'use strict';
  var NAME = "Hypnotic";
  function Hypnotic(){
    this.init           = this.init.bind(this);
    this.animation      = this.animation.bind(this);
    this.firstTime      = true;
    this.default        = {
      size              : 400,
      lineWidth         : 1,
      lineSpace         : 5,
      lineDistance      : 6,
      colorSpeed        : 1,//must != 0
      colors            : ["hsl(0,75%,75%)","hsl(50,75%,75%)","hsl(100,75%,75%)"],
      freeColor         : false,
      reverseColor      : false,
      moveSpeed         : 1,
      reverseMove       : true,
      layout            : "fullwidth",
      frame             : 0
    }
    this.options        = {};
  }
  Hypnotic.prototype.init = function(BannerFlow){
    var options = {};
    for (var attr in this.default) {
      options[attr] = this.default[attr];
    }
    if(typeof BannerFlow != 'undefined') {
      switch(BannerFlow.settings.ColorSpeed) {
        case "0.5x": options.colorSpeed = 1;break;
        case "1x"  : options.colorSpeed = 2;break;
        case "1.5x": options.colorSpeed = 3;break;
        case "2x"  : options.colorSpeed = 4;break;
        default    : options.colorSpeed = 1;
      }
      switch(BannerFlow.settings.MoveSpeed) {
        case "0x"  : options.moveSpeed = 0;break;
        case "0.5x": options.moveSpeed = 1;break;
        case "1x"  : options.moveSpeed = 2;break;
        case "1.5x": options.moveSpeed = 3;break;
        case "2x"  : options.moveSpeed = 4;break;
        default    : options.moveSpeed = 1;
      }
      options.freeColor = BannerFlow.settings.FreeColor;
      options.reverseColor = BannerFlow.settings.ReverseColor;
      options.reverseMove = BannerFlow.settings.ReverseMove;
      if (BannerFlow.settings.FreeColor == false) {
        var colors = [];
        if (BannerFlow.settings.Color1) colors.push(BannerFlow.settings.Color1);
        if (BannerFlow.settings.Color2) colors.push(BannerFlow.settings.Color2);
        if (BannerFlow.settings.Color3) colors.push(BannerFlow.settings.Color3);
        if (BannerFlow.settings.Color4) colors.push(BannerFlow.settings.Color4);
        if (BannerFlow.settings.Color5) colors.push(BannerFlow.settings.Color5);
        if(colors.length == 0) options.freeColor = true;
        else options.colors = colors;
      }
      if (BannerFlow.settings.LineWidth >= 0) options.lineWidth = BannerFlow.settings.LineWidth;
      if (BannerFlow.settings.LineSpace >= 0) options.lineSpace = BannerFlow.settings.LineSpace;
      options.lineDistance = options.lineWidth + options.lineSpace;
      if (BannerFlow.settings.Layout) {
        options.layout = BannerFlow.settings.Layout;
      }
    }
    var size = {
      "fullheight" : window.innerHeight,
      "fullwidth" : window.innerWidth,
      "contain" : Math.min(window.innerHeight,window.innerWidth),
      "cover" : Math.sqrt(window.innerHeight*window.innerHeight+window.innerWidth*window.innerWidth)
    }
    options.size = size[options.layout.toLowerCase()];
    options.size = options.size + options.lineDistance - options.size % options.lineDistance;//remove redundancy color
    this.options = options;
    canvas.width = canvas.height = this.options.size;
    canvas.style.marginLeft = (window.innerWidth - this.options.size)/2+"px";
    canvas.style.marginTop = (window.innerHeight - this.options.size)/2+"px";
    if (this.firstTime) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.context.imageSmoothingEnabled= false;
      this.animation();
      this.firstTime = false;
    }
  }
  Hypnotic.prototype.animation = function(){
    var options = this.options;
    //if (options.frame==100) return;
    this.context.clearRect(0,0,options.size,options.size);
    var r = options.size/2;
    options.frame++;
    for(var i = 0,h,color; i < options.size ; i++){
      if (options.freeColor) {
        h = (i*360/r + options.frame*options.colorSpeed) % 360;
        color = 'hsl(hue, 80%, 50%)'.replace('hue',h);
      }
      else {
        h = (i*4/r + options.frame/80*options.colorSpeed) % options.colors.length | 0 ;
        color = options.colors[h];
      }
      this.context.strokeStyle = ( (options.reverseMove ? options.size-i : i) +options.frame/8*options.moveSpeed) % options.lineDistance < options.lineWidth ? color : 'rgba(0, 0, 0, 0)';
      this.context.beginPath();
      this.context.arc(r, r, (options.reverseColor ? i : options.size-i)%options.size, 0, Math.PI*2);
      this.context.stroke();
      this.context.closePath();
    }
    raf(this.animation);
  }
  window[NAME] = Hypnotic;
})(window,document);
var timer,widget=new Hypnotic(); ;
if (typeof BannerFlow != 'undefined') {
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    clearTimeout(timer);
    timer = setTimeout(function(){
        widget.init(BannerFlow);
    },500);
  });
} else {
  console.log("here");
  document.addEventListener("DOMContentLoaded",function(){
    widget.init();
  })
  window.addEventListener("resize",function(){
    widget.init();
  });
}