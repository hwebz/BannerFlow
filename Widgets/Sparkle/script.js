'use strict';
(function(window,document) {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
})(window,document);

(function(window, document) {
  var NAME = 'Sparkle';
  function Sparkle(parent,options) {
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.toggleEvent = this.toggleEvent.bind(this);
    this.createSparkles = this.createSparkles.bind(this);
    this.draw = this.draw.bind(this);
    this.update = this.update.bind(this);
    this.cancel = this.cancel.bind(this);
    this.over = this.over.bind(this);
    this.out = this.out.bind(this);
    this.datauri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAHCAYAAAD5wDa1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDNFMzM5REEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDNFMzM5RUEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0M0UzMzlCQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0M0UzMzlDQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jzOsUQAAANhJREFUeNqsks0KhCAUhW/Sz6pFSc1AD9HL+OBFbdsVOKWLajH9EE7GFBEjOMxcUNHD8dxPBCEE/DKyLGMqraoqcd4j0ChpUmlBEGCFRBzH2dbj5JycJAn90CEpy1J2SK4apVSM4yiKonhePYwxMU2TaJrm8BpykpWmKQ3D8FbX9SOO4/tOhDEG0zRhGAZo2xaiKDLyPGeSyPM8sCxr868+WC/mvu9j13XBtm1ACME8z7AsC/R9r0fGOf+arOu6jUwS7l6tT/B+xo+aDFRo5BykHfav3/gSYAAtIdQ1IT0puAAAAABJRU5ErkJggg==";        
    this.options = options;
    this.parent = parent;
    this.init();    
  }
  Sparkle.prototype.destroy = function() {
    this.out();
    this.parent.removeChild(this.canvas);
  }
  Sparkle.prototype.toggleEvent = function(attach) {    
    this.overEffect = function(e) {this.over();}.bind(this);
    this.outEffect = function(e) {this.out();}.bind(this);
    if (this.supportTouch) {      
      var over = false;
      this.container.addEventListener("touchstart",function(){
        over = !over;
        if (over) this.over()
        else this.out();
      });      
    }
    if (attach) {
      this.parent.addEventListener("mouseover", this.overEffect);
      this.parent.addEventListener("focus", this.overEffect);
      this.parent.addEventListener("mouseout", this.outEffect);
      this.parent.addEventListener("blur", this.outEffect);        
    } else {
      this.parent.removeEventListener("mouseover", this.overEffect);
      this.parent.removeEventListener("focus", this.overEffect);
      this.parent.removeEventListener("mouseout", this.outEffect);
      this.parent.removeEventListener("blur", this.outEffect);  
    }    
  }
  Sparkle.prototype.init = function() {    
    this.canvas = document.createElement("canvas");
    this.canvas.className = "sparkle-canvas";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "-" + this.options.overlap + "px";
    this.canvas.style.left = "-" + this.options.overlap + "px";
    this.canvas.style["pointer-events"] = "none";    
    this.context = this.canvas.getContext("2d");
    this.sprite = new Image();
    this.sprites = [0, 6, 13, 20];
    this.sprite.src = this.datauri;
    this.canvas.width = this.options.width + (this.options.overlap * 2);
    this.canvas.height = this.options.height + (this.options.overlap * 2);
    this.particles = this.createSparkles(this.canvas.width, this.canvas.height);
    this.anim = null;
    this.fade = true;    
    this.parent.appendChild(this.canvas);
    if (this.options.display.toLowerCase() == "automatically") {
      this.toggleEvent(false);
      this.over();
    } else {
      this.toggleEvent(true);
    } 
  }
  Sparkle.prototype.createSparkles = function(w, h) {
    var holder = [];
    for (var i = 0; i < this.options.count; i++) {
      var color = this.options.color;
      if (this.options.color == "rainbow") {
        color = '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
      } else if (this.options.color.constructor === Array) {
        color = this.options.color[Math.floor(Math.random() * this.options.color.length)];
      }
      holder[i] = {
        position: {
          x: Math.floor(Math.random() * w),
          y: Math.floor(Math.random() * h)
        },
        style: this.sprites[Math.floor(Math.random() * 4)],
        delta: {
          x: Math.floor(Math.random() * 1000) - 500,
          y: Math.floor(Math.random() * 1000) - 500
        },
        size: parseFloat((Math.random() * 2).toFixed(2)),
        color: color
      };
    }
    return holder;
  }
  Sparkle.prototype.draw = function(time, fade) {
    var ctx = this.context;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < this.options.count; i++) {
      var derpicle = this.particles[i];
      var modulus = Math.floor(Math.random() * 7);
      if (Math.floor(time) % modulus === 1) { // Default 0
        derpicle.style = this.sprites[Math.floor(Math.random() * 3)]; // Default 4
      }
      ctx.save();
      ctx.globalAlpha = derpicle.opacity;
      ctx.drawImage(this.sprite, derpicle.style, 0, 7, 7, derpicle.position.x, derpicle.position.y, 7, 7);
      if (this.options.color) {
        ctx.globalCompositeOperation = "source-atop";
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = derpicle.color;
        ctx.fillRect(derpicle.position.x, derpicle.position.y, 7, 7);
      }
      ctx.restore();
    }
  }
  Sparkle.prototype.cancel = function() {
    this.fadeCount = 100;
  }
  Sparkle.prototype.over = function() {
    window.cancelAnimationFrame(this.anim);
    for (var i = 0; i < this.options.count; i++) {
      this.particles[i].opacity = Math.random();
    }
    this.fade = false;
    this.update();
  }
  Sparkle.prototype.out = function() {
    this.fade = true;
    this.cancel();
  }
  Sparkle.prototype.update = function() {
    this.anim = window.requestAnimationFrame(function(time) {
      for (var i = 0; i < this.options.count; i++) {
        var u = this.particles[i];
        var randX = (Math.random() > Math.random() * 2);
        var randY = (Math.random() > Math.random() * 3);
        if (randX) {
          u.position.x += ((u.delta.x * this.options.speed) / 1500);
        }
        if (!randY) {
          u.position.y -= ((u.delta.y * this.options.speed) / 800);
        }
        if (u.position.x > this.canvas.width) {
          u.position.x = -7;
        } else if (u.position.x < -7) {
          u.position.x = this.canvas.width;
        }
        if (u.position.y > this.canvas.height) {
          u.position.y = -7;
          u.position.x = (Math.random() * this.canvas.width);
        } else if (u.position.y < -7) {
          u.position.y = this.canvas.height;
          u.position.x = Math.floor(Math.random() * this.canvas.width);
        }
        if (this.fade) {
          u.opacity -= 0.02;
        } else {
          u.opacity -= 0.005;
        }
        if (u.opacity <= 0) {
          u.opacity = (this.fade) ? 0 : 1;
        }
      }
      this.draw(time);
      if (this.fade) {
        this.fadeCount -= 1;
        if (this.fadeCount < 0) {
          window.cancelAnimationFrame(this.anim);
        } else {
          this.update();
        }
      } else {
        this.update();
      }
    }.bind(this));
  }
  window[NAME] = Sparkle;
})(window, document);

(function(window,document){
  var NAME = "SparkleWidget";
  function SparkleWidget() {
    this.sparkle = null;
    this.supportTouch= 'ontouchstart' in window || navigator.msMaxTouchPoints;
  }
  SparkleWidget.prototype.changeSetting = function(BannerFlow){
    this.element = document.querySelector(".container");
    this.options = {
      width: this.element.offsetWidth,
      height: this.element.offsetHeight,
      color: "#FFFFFF",
      count: 30,
      overlap: 0,
      speed : 1,
      display : "automatically"
    }
    if (typeof BannerFlow!= 'undefined' && BannerFlow.settings) {
      if (BannerFlow.settings.Amount.constructor != null ) this.options.count = BannerFlow.settings.Amount;
      if (BannerFlow.settings.Speed.constructor  != null ) this.options.speed = BannerFlow.settings.Speed;
      if (BannerFlow.settings.Display  != null ) this.options.display = BannerFlow.settings.Display;
      if (BannerFlow.settings.FreeColor) this.options.color = "rainbow";
      else {
        var colors = [];
        if (BannerFlow.settings.Color1) colors.push(BannerFlow.settings.Color1);
        if (BannerFlow.settings.Color2) colors.push(BannerFlow.settings.Color2);
        if (BannerFlow.settings.Color3) colors.push(BannerFlow.settings.Color3);
        if (BannerFlow.settings.Color4) colors.push(BannerFlow.settings.Color4);
        if (BannerFlow.settings.Color5) colors.push(BannerFlow.settings.Color5);
        this.options.color = colors;
      }
    }
    if (this.sparkle!= null) {
      this.sparkle.destroy();
    }
    this.sparkle = new Sparkle(this.element,this.options);
  }
  window[NAME] = SparkleWidget;
})(window,document);

var timer,widget = new SparkleWidget();
if (typeof BannerFlow != 'undefined') {  
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    clearTimeout(timer);
    timer = setTimeout(function(){
      widget.changeSetting(BannerFlow);
    },500);
  });
}else {
  document.addEventListener("DOMContentLoaded", function() {
    widget.changeSetting(undefined);    
  });
}