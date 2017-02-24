var rand = function(max, min, _int) {
  var max = (max === 0 || max)?max:1, 
      min = min || 0, 
      gen = min + (max - min)*Math.random();
  
  return (_int)?Math.round(gen):gen;
};


var FireworksWidget = (function(){

  var container = document.getElementById('fireworksContainer');

  var SPARK_NUM = 300;
  var SPEED = 10;
  var FireworksOnClick = true;
  var FireworksAutomatic = true;
  var DelayAutomatic = 2;
  var Colors = ["#00ff00"];
  var numberColor = 5;


  var Fireworks = (function() {
    function Fireworks() {}

    Fireworks.prototype.FIREWORKS_MAX = 3;

    Fireworks.prototype.sparks = [];

    Fireworks.prototype.intervalTimer = 0;

    Fireworks.prototype.is_length = false;

    Fireworks.prototype.fireworks_length = 0;

    Fireworks.prototype.fireAutomatic = true;

    Fireworks.prototype.loop = function() {
      var spark, update_sparks;
      update_sparks = [];

      for (var j = 0; j < this.sparks.length; j++) {
        spark = this.sparks[j];
        if (spark.size > 0.3) {
          spark.update();
          update_sparks.push(spark);
        }
      }

      this.sparks = update_sparks;
      this.fireworks_length = this.sparks.length / SPARK_NUM | 0;
      this.context.clearRect(0, 0, this.stage_W, this.stage_H);
      this.context.globalCompositeOperation = "source-over";
      this.context.globalAlpha = 0.85;
      this.context.drawImage(this.canvas_before, 0, 0);
      
      this.draw_spark();

      this.context_before.clearRect(0, 0, this.stage_W, this.stage_H);
      this.context_before.drawImage(this.canvas, 0, 0);

      if (this.fireworks_length === 0) {
        clearInterval(this.intervalTimer);
        this.context.clearRect(0, 0, this.stage_W, this.stage_H);
        this.context_before.clearRect(0, 0, this.stage_W, this.stage_H);
      }
    };

    Fireworks.prototype.draw_spark = function() {

      this.context.globalCompositeOperation = "lighter";
      this.context.globalAlpha = 1;

      var spark;

      for (var j = 0; j < this.sparks.length; j++) {
        spark = this.sparks[j];
        this.context.beginPath();
        this.context.arc(spark.positon_X, spark.positon_Y, spark.size, 0, Math.PI * 2, false);
        this.context.fillStyle = spark.color;
        this.context.fill();
      }
    };

    Fireworks.prototype.create = function(start_X, start_Y) {

      if (this.fireworks_length >= this.FIREWORKS_MAX) {
        return;
      }

      var spark;
      var indexColor = rand(Colors.length-1, 0, true);
      var color = Colors[indexColor];

      for (var i=0; i < SPARK_NUM; i++) {
        spark = new Spark;
        spark.init(color);
        spark.positon_X = start_X;
        spark.positon_Y = start_Y;
        this.sparks.push(spark);
      }

      if (this.fireworks_length === 0) {
        this.intervalTimer = setInterval(this.loop.bind(this), 1000/6/ SPEED);
      }
      
      this.fireworks_length++;

    };

    Fireworks.prototype.canvas_resize = function() {
      this.stage_W = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
      this.stage_H = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

      this.canvas.width = this.stage_W;
      this.canvas.height = this.stage_H;
      this.canvas_before.width = this.stage_W;
      this.canvas_before.height = this.stage_H;
    };

    Fireworks.prototype.init = function() {
      this.stage_W = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
      this.stage_H = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

      this.canvas = document.getElementById("fireworks");
      this.context = this.canvas.getContext("2d");
      this.canvas_before = document.createElement("canvas");
      this.context_before = this.canvas_before.getContext("2d");

      this.create(this.stage_W/2, this.stage_H/3);

      if(FireworksOnClick) {
        // if(typeof BannerFlow !== "undefined") {
        //   var _this = this;  
        //   BannerFlow.addEventListener(BannerFlow.MOUSE_DOWN, function() {
        //     var x = BannerFlow.mouseX - BannerFlow.x;
        //     var y = BannerFlow.mouseY - BannerFlow.y;
        //     _this.create(x, y);
        //   });
        // }

        if(container.addEventListener) {
        
          container.addEventListener("mousedown", (function(_this) {
            return function(e) {
              return _this.create(e.pageX, e.pageY);
            };
          })(this), false);

          container.addEventListener("touchstart", (function(_this) {
            
            return function(e) {
              return _this.create(e.touches[0].pageX, e.touches[0].pageY);
            };

          })(this), false);

        } else if(container.attachEvent) {

          container.attachEvent("mousedown", (function(_this) {
            return function(e) {
              return _this.create(e.pageX, e.pageY);
            };
          })(this), false);
        }
      }

      this.autoFire();

      this.canvas_resize();
    };

    Fireworks.prototype.autoFire = function() {

      var self = this;

      var fireworksAuto = function() {
        
        var x = rand(this.stage_W, 0);
        var y = rand(this.stage_H, 0);

        if(FireworksAutomatic)
          this.create(x, y);

        var timeout = setTimeout(function(){
          clearTimeout(timeout);
          fireworksAuto.bind(self)();
        }, DelayAutomatic * 500);
      };

      var timeout = setTimeout(function(){
          clearTimeout(timeout);
          fireworksAuto.bind(self)();
        }, DelayAutomatic * 500);
    };    

    Fireworks.prototype.refresh = function() {
      this.canvas_resize();
    };

    return Fireworks;

  })();

  var Spark = (function() {
    function Spark() {}

    Spark.prototype.SIZE = 2.5;

    Spark.prototype.COLOR = "rgba(255,220,100,1)";

    Spark.prototype.DECAY = 0.98;

    Spark.prototype.GRAVITY = 1.5;

    Spark.prototype.positon_X = 0;

    Spark.prototype.positon_Y = 0;

    Spark.prototype.init = function(color) {

      var angle, velocity;

      angle = Math.random() * (2 * Math.PI);
      angle = (angle * 5 | 0) / 5;
      velocity = Math.random() * 5.5;
      velocity = (velocity * 2 | 0) / 2;
      if (velocity > 4.5) {
        velocity = 4.5;
      }

      this.velocity_X = Math.cos(angle) * velocity;
      this.velocity_Y = Math.sin(angle) * velocity;
      this.color = color ? color : this.COLOR;
      this.size = this.SIZE;

    };

    Spark.prototype.update = function() {

      this.velocity_X *= this.DECAY;
      this.velocity_Y *= this.DECAY;
      this.size *= this.DECAY;
      this.positon_X += this.velocity_X;
      this.positon_Y += this.velocity_Y;
      this.positon_Y += this.GRAVITY;

    };

    return Spark;

  })();

  
  /*--------------------------------------------------------------*/

  var fireworks;

  function startAnimation() {
    if(!Colors || Colors.length == 0)
      return;

    if(!fireworks) {

      fireworks = new Fireworks;
      fireworks.init();

    } else {

      fireworks.refresh();

    }
  }

  /*==============================================*/
  /*===== Default settings from Banner Flow  =====*/
  /*==============================================*/

  function loadSettings() {
    if(typeof BannerFlow !== "undefined"){
      SPEED = BannerFlow.settings.speed > 0 ? BannerFlow.settings.speed : 6;
      SPARK_NUM = BannerFlow.settings.sparkNumber > 0 ? BannerFlow.settings.sparkNumber : 300;

      FireworksOnClick = BannerFlow.settings.fireworksOnClick;
      FireworksAutomatic = BannerFlow.settings.fireworksAutomatic;
      DelayAutomatic = BannerFlow.settings.delayAutomatic > 0 ? BannerFlow.settings.delayAutomatic : 2;

      Colors = [];

      for(var i=1;i<=numberColor;i++){
        var color = BannerFlow.settings['color'+i];
        if(color && color.length > 0){
          Colors.push(color);
        }
      }
    }
  }
  
  /*====================================================*/  

  function init() {
    loadSettings();
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
  FireworksWidget.start();
} else {
  BannerFlow.addEventListener(BannerFlow.INIT, function () {
      FireworksWidget.start();

      if(BannerFlow.imageGeneratorMode) { 
          document.body.setAttribute('style','display:none;');
      }
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
      FireworksWidget.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
      FireworksWidget.onSettingChanged();
  });
}
