
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}



var FireEffectWidget = (function(){

  var intensity = 10;
  var speed = 6;
  var color = "rgba(217,98,44,1)";
  var isFollowMouse = true;

  var hslColor;

  var point = 0;
  var POINT_TO_ADD = 10;
  var isStart = true;

  var flameSize = 30;

  var Fire  = function(){

    this.canvas   = document.getElementById('fire');
    this.ctx      = this.canvas.getContext('2d');
    this.canvas.width   = parseInt(window.getComputedStyle(this.canvas).getPropertyValue('width'));
    this.canvas.height  = parseInt(window.getComputedStyle(this.canvas).getPropertyValue('height'));

    this.aFires     = [];
    this.aSpark     = [];
    this.aSpark2    = [];

    this.mouse = {
      x : this.canvas.width * 0.5,
      y : this.canvas.height * 0.75,
    }

    this.init();

  }

  Fire.prototype.refresh = function(){
    this.canvas.width   = parseInt(window.getComputedStyle(this.canvas).getPropertyValue('width'));
    this.canvas.height  = parseInt(window.getComputedStyle(this.canvas).getPropertyValue('height'));

    this.mouse = {
      x : this.canvas.width * 0.5,
      y : this.canvas.height * 0.75,
    }
  }

  Fire.prototype.init = function() {
    if(isFollowMouse) {
      // BannerFlow.addEventListener(BannerFlow.MOUSE_MOVE, (function(_this){
      //   return function () { 
      //     var x = BannerFlow.mouseX - BannerFlow.x;
      //     var y = BannerFlow.mouseY - BannerFlow.y;

      //     _this.mouse.x = x;
      //     _this.mouse.y = y;
      //   }
      // })(this));

      var updateMouse = function(e) {
        var x = e.touches ? e.touches[0].clientX : e.clientX;
        var y = e.touches ? e.touches[0].clientY : e.clientY;

        this.mouse.x = x;
        this.mouse.y = y;
      }

      this.canvas.onmousemove = updateMouse.bind(this);
      this.canvas.ontouchmove = updateMouse.bind(this);
    }

  }

  Fire.prototype.run = function(){
    
    this.update();
    this.draw();

    if( this.bRuning ) {
      var self = this;
      var timeout = setTimeout(function() {
        self.run.bind(self)();
        clearTimeout(timeout);
      }, 1000/(10*speed));
    }

  }
  Fire.prototype.start = function(){

    this.bRuning = true;
    this.run();

  }
  Fire.prototype.stop = function(){

    this.bRuning = false;

  }
  Fire.prototype.update = function(){
    if(isStart) {

      isStart = false;

      this.aFires.push( new Flame( this.mouse ) );
      this.aSpark.push( new Spark( this.mouse ) );
      this.aSpark2.push( new Spark( this.mouse ) );

    } else {

      point += intensity;
      var numberLoop = Math.floor(point/POINT_TO_ADD);
      for(var i=0; i < numberLoop; i++) {
        this.aFires.push( new Flame( this.mouse ) );
        this.aSpark.push( new Spark( this.mouse ) );
        this.aSpark2.push( new Spark( this.mouse ) );        
      }

      if(numberLoop > 0) {
        point = point % POINT_TO_ADD;
      }

    }


    for (var i = this.aFires.length - 1; i >= 0; i--) {

      if( this.aFires[i].alive )
        this.aFires[i].update();
      else
        this.aFires.splice( i, 1 );

    }

    for (var i = this.aSpark.length - 1; i >= 0; i--) {

      if( this.aSpark[i].alive )
        this.aSpark[i].update();
      else
        this.aSpark.splice( i, 1 );

    }


    for (var i = this.aSpark2.length - 1; i >= 0; i--) {

      if( this.aSpark2[i].alive )
        this.aSpark2[i].update();
      else
        this.aSpark2.splice( i, 1 );

    }

  }

  Fire.prototype.draw = function(){

    this.ctx.globalCompositeOperation = "lighter";

    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

    // this.ctx.globalCompositeOperation = "source-over";
    // this.ctx.fillStyle = "rgba( 15, 5, 2, 1 )";
    // this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height);
    
    // this.grd = this.ctx.createRadialGradient( this.mouse.x, this.mouse.y - 200,200,this.mouse.x, this.mouse.y - 100,0 );
    // this.grd.addColorStop(0,"rgb( 15, 5, 2 )");
    // this.grd.addColorStop(1,"rgb( 30, 10, 2 )");
    // this.ctx.beginPath();
    // this.ctx.arc( this.mouse.x, this.mouse.y - 100, 200, 0, 2*Math.PI );
    // this.ctx.fillStyle= this.grd;
    // this.ctx.fill();


    //this.ctx.globalCompositeOperation = "overlay";//or lighter or soft-light

    for (var i = this.aFires.length - 1; i >= 0; i--) {

      this.aFires[i].draw( this.ctx );

    }

    //this.ctx.globalCompositeOperation = "soft-light";//"soft-light";//"color-dodge";

    for (var i = this.aSpark.length - 1; i >= 0; i--) {
      
      if( ( i % 2 ) === 0 )
        this.aSpark[i].draw( this.ctx );

    }

    //this.ctx.globalCompositeOperation = "color-dodge";//"soft-light";//"color-dodge";

    for (var i = this.aSpark2.length - 1; i >= 0; i--) {

      this.aSpark2[i].draw( this.ctx );

    }

  }


  var Flame = function( mouse ){

    this.cx = mouse.x;
    this.cy = mouse.y;
    this.x = rand( this.cx - 25, this.cx + 25);
    this.y = rand( this.cy - 5, this.cy + 5);
    this.vy = rand( 1, 3 );
    this.vx = rand( -1, 1 );
    if(flameSize > 10) {
      this.r = rand( flameSize - 10, flameSize);  
    } else {
      this.r = rand(10, 20);
    }
    
    this.life = rand( 3, 6 );
    this.alive = true;
    this.c = {
      /*
      h : Math.floor( rand( 2, 40) ),
      s : 100,
      l : rand( 80, 100 ),
      a : 0,
      */
      h : Math.floor(hslColor[0]),
      s : 100,
      l : Math.floor(hslColor[2]),
      a : 0,
      ta : rand( 0.8, 0.9 )

    }

  }

  Flame.prototype.update = function() {

    this.y -= this.vy;
    this.vy += 0.05;


    this.x += this.vx;

    if( this.x < this.cx )
      this.vx += 0.1;
    else
      this.vx -= 0.1;




    if(  this.r > 0 )
      this.r -= 0.1;
    
    if(  this.r <= 0 )
      this.r = 0;



    this.life -= 0.09;

    if( this.life <= 0 ){

      this.c.a -= 0.05;

      if( this.c.a <= 0 )
        this.alive = false;

    }else if( this.life > 0 && this.c.a < this.c.ta ){

      this.c.a += .08;

    }

  }


  Flame.prototype.draw = function( ctx ){

    ctx.beginPath();
    ctx.arc( this.x, this.y, this.r * 3, 0, 2*Math.PI );
    ctx.fillStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + (this.c.a/20) + ")";
    ctx.fill();

    ctx.beginPath();
    ctx.arc( this.x, this.y, this.r, 0, 2*Math.PI );
    ctx.fillStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + this.c.a + ")";
    ctx.fill();

  }


  var Spark = function( mouse ){

    this.cx = mouse.x;
    this.cy = mouse.y;
    this.x = rand( this.cx -40, this.cx + 40);
    this.y = rand( this.cy, this.cy + 5);
    this.lx = this.x;
    this.ly = this.y;
    this.vy = rand( 1, 3 );
    this.vx = rand( -4, 4 );
    this.r = rand( 0, 1 );
    this.life = rand( 4, 5 );
    this.alive = true;
    this.c = {
      /*
      h : Math.floor( rand( 2, 40) ),
      s : 100,
      l : rand( 40, 100 ),
      */
      h : Math.floor(hslColor[0]),
      s : 100,
      l : Math.floor(hslColor[2]),
      a : rand( 0.8, 0.9 )

    }

  }

  Spark.prototype.update = function() {

    this.lx = this.x;
    this.ly = this.y;

    this.y -= this.vy;
    this.x += this.vx;

    if( this.x < this.cx )
      this.vx += 0.2;
    else
      this.vx -= 0.2;

    this.vy += 0.08;
    this.life -= 0.1;

    if( this.life <= 0 ){

      this.c.a -= 0.05;

      if( this.c.a <= 0 )
        this.alive = false;

    }

  }


  Spark.prototype.draw = function( ctx ){

    ctx.beginPath();
    ctx.moveTo( this.lx , this.ly);
    ctx.lineTo( this.x, this.y);
    ctx.strokeStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + (this.c.a / 2) + ")";
    ctx.lineWidth = this.r * 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo( this.lx , this.ly);
    ctx.lineTo( this.x, this.y);
    ctx.strokeStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + this.c.a + ")";
    ctx.lineWidth = this.r;
    ctx.stroke();
    ctx.closePath();

  }

  var rand = function( min, max ){ return Math.random() * ( max - min) + min; };

  var oCanvas;

  function startAnimation() {
    if(!oCanvas) {
      oCanvas = new Fire();
      oCanvas.start();
    } else {
      oCanvas.refresh();
    }
  }

  function prepareSettingsData() {
    var colorNumber = color.substring("rgba(".length);
    colorNumber = colorNumber.substring(0, colorNumber.length - 1);
    colorNumber = colorNumber.split(",");

    hslColor = rgbToHsl(colorNumber[0], colorNumber[1], colorNumber[2]);

    hslColor[0] *= 360;
    hslColor[1] *= 100;
    hslColor[2] *= 100;
  }

  /*==============================================*/
  /*===== Default settings from Banner Flow  =====*/
  /*==============================================*/

  function loadSettings() {
    if(typeof BannerFlow !== "undefined"){
      color = BannerFlow.settings.color;
      intensity = BannerFlow.settings.intensity > 0 ? BannerFlow.settings.intensity : 10;
      speed = BannerFlow.settings.speed > 0 ? BannerFlow.settings.speed : 6;
      isFollowMouse = BannerFlow.settings.isFollowMouse;
      flameSize = BannerFlow.settings.flameSize > 10 ? BannerFlow.settings.flameSize : 30
    }
  }
  
  /*====================================================*/  

  function init() {
    loadSettings();
    prepareSettingsData();
    startAnimation();
  }

  function onResize(){
    init();
  }

  function resetParameter(){
    init();
  }


  return {
      start: init,

      onResized: onResize,

      onSettingChanged: resetParameter
  };
})();

if(typeof BannerFlow == "undefined"){
  FireEffectWidget.start();
} else {
  BannerFlow.addEventListener(BannerFlow.INIT, function () {
      FireEffectWidget.start();

      if(BannerFlow.imageGeneratorMode) { 
          document.body.setAttribute('style','display:none;');
      }
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
      FireEffectWidget.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
      FireEffectWidget.onSettingChanged();
  });
}
