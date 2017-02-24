function get(el) {
    if(typeof el === "string") 
        return document.getElementById(el);
    return el;
}

var utils = {
  norm: function(value, min, max) {
    return (value - min) / (max - min);
  },

  lerp: function(norm, min, max) {
    return (max - min) * norm + min;
  },

  map: function(value, sourceMin, sourceMax, destMin, destMax) {
    return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
  },

  clamp: function(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  },

  distance: function(p0, p1) {
    var dx = p1.x - p0.x,
      dy = p1.y - p0.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  distanceXY: function(x0, y0, x1, y1) {
    var dx = x1 - x0,
      dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  },

  circleCollision: function(c0, c1) {
    return utils.distance(c0, c1) <= c0.radius + c1.radius;
  },

  circlePointCollision: function(x, y, circle) {
    return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
  },

  pointInRect: function(x, y, rect) {
    return utils.inRange(x, rect.x, rect.x + rect.width) &&
      utils.inRange(y, rect.y, rect.y + rect.height);
  },

  inRange: function(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  },

  rangeIntersect: function(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) &&
      Math.min(min0, max0) <= Math.max(min1, max1);
  },

  rectIntersect: function(r0, r1) {
    return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
      utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
  },

  degreesToRads: function(degrees) {
    return degrees / 180 * Math.PI;
  },

  radsToDegrees: function(radians) {
    return radians * 180 / Math.PI;
  },

  randomRange: function(min, max) {
    return min + Math.random() * (max - min);
  },

  randomInt: function(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  },

  randomFloat: function(min, max) {
    return min + Math.random() * (max - min);
  }

};

/*============================================*/

var ClassicConfetti = (function(){

    var container = get('widgetContainer');
    var canvas = get('widgetCanvas');
    var context = canvas.getContext('2d');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    /*--- settings from banner flow ---*/

    var number, gravity, wind, windDirection, colors, shape, spawnDelay, numberAtStart;
    var selectedShapeIndex, isMixed;

    var DIRECTION_LEFT = "From Left";
    var DIRECTION_RIGHT = "From Right";

    var SHAPE_RECTANGLE = "Rectangle";
    var SHAPE_CIRCLE = "Circle";
    var SHAPE_TRIANGLE = "Triangle";
    var SHAPE_HEART = "Heart";
    var SHAPE_SMALL_RECTANGLE = "Small Rectangle";
    var SHAPE_MIXED = "Mixed";

    var ALL_SHAPES = [SHAPE_RECTANGLE, SHAPE_CIRCLE, SHAPE_TRIANGLE, SHAPE_HEART, SHAPE_SMALL_RECTANGLE];

    var FRICTION_X = 0.99;
    var FRICTION_Y = 0.95;
    var generator;

    function Particle(x, y) {
      this.x = x;
      this.y = y;
      this.vx = utils.randomFloat(-4, 4);
      this.vy = utils.randomFloat(-10, 0);

      this.w = utils.randomRange(5, 20);
      this.h = utils.randomRange(5, 20);

      this.r = utils.randomRange(5, 10);
      this.size = utils.randomRange(10, 20);

      this.angle = utils.degreesToRads(utils.randomFloat(0, 360));
      this.anglespin = utils.randomFloat(-0.2, 0.2);
      this.rotateY = utils.randomFloat(0, 1);
      this.directionRotate = 1;

      this.color = colors[Math.floor(Math.random() * colors.length)];

      if(isMixed)
        this.type = utils.randomInt(0, 4); // 4 is ALL_SHAPES.length-1
      else
        this.type = selectedShapeIndex;

      if(this.type === 4) {
        this.w = utils.randomRange(3, 10);
        this.h = utils.randomRange(3, 10);
        this.type = 0;
      }
    }

    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += gravity;
      this.vx += wind;
      this.vx *= FRICTION_X;
      this.vy *= FRICTION_Y;

      if(this.directionRotate > 0) {
        if (this.rotateY < 1) {
          this.rotateY += 0.05;
        } else {
          this.directionRotate = -1;
        }
      }
      else {
        if (this.rotateY > -1) {
          this.rotateY -= 0.05;
        } else {
          this.directionRotate = 1;
        } 
      }
      this.angle += this.anglespin;

      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.scale(1, this.rotateY);

      context.beginPath();
      context.fillStyle = this.color;
      context.strokeStyle = this.color;
      context.lineCap="round";
      context.lineWidth = 2;

      if (this.type === 0) {
        context.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      }else if(this.type === 1){
        context.beginPath();
        context.arc(0, 0, this.r, 0, 2 * Math.PI);
        context.fill();
      }else if(this.type === 2){
        context.beginPath();
        context.moveTo(0, -this.h/2);
        context.lineTo(this.w/2, this.h/2);
        context.lineTo(-this.w/2, this.h/2);
        context.fill();
      }else if(this.type === 3){
        var centerX = this.size/2;
        var centerY = this.size/2;

        context.moveTo(0 - centerX, this.size / 4 - centerY);
        context.quadraticCurveTo(0 - centerX, 0 - centerY, this.size/4 - centerX, 0 - centerY);
        context.quadraticCurveTo(this.size/2 - centerX, 0 - centerY, this.size/2 - centerX, this.size/4 - centerY);
        context.quadraticCurveTo(this.size/2 - centerX, 0 - centerY, this.size*3/4 - centerX, 0 - centerY);
        context.quadraticCurveTo(this.size - centerX, 0 - centerY, this.size - centerX, this.size/4 - centerY);
        context.quadraticCurveTo(this.size - centerX, this.size/2 - centerY, this.size*3/4 - centerX, this.size*3/4 - centerY);
        context.lineTo(this.size/2 - centerX, this.size - centerY);
        context.lineTo(this.size/4 - centerX, this.size*3/4 - centerY);
        context.quadraticCurveTo(0 - centerX, this.size/2 - centerY, 0 - centerX, this.size/4 - centerY);
        context.fill();
      }

      context.closePath();
      context.restore();
    }


    function ParticleGenerator(x, y, w, h, number, numberAtStart, delay, text) {
      // particle will spawn in this aera
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.number        = number;
      this.numberAtStart = numberAtStart;
      this.particles     = [];
      this.text          = text;
      this.recycle       = true;
      
      this.type = 1;

      this.count = 0;
      this.delay = delay;

      if(this.delay <= 0)
        this.delay = 1;

      this.isFirstTime = true;

    }

    ParticleGenerator.prototype.animate = function() {

      this.count++;

      if (this.particles.length < this.number && this.count % this.delay == 0) {
        if(!this.isFirstTime)
          this.particles.push(
            new Particle(utils.clamp(utils.randomFloat(this.x, this.w + this.x), this.x, this.w + this.x), this.y-30, this.text)
          );
        else {
          this.isFirstTime = !this.isFirstTime;
          for(var i=0; i<this.numberAtStart; i++) {
            this.particles.push(
              new Particle(utils.clamp(utils.randomFloat(this.x, this.w + this.x), this.x, this.w + this.x), this.y-30, this.text)
            );
          }
        }
      }

      for (var i = 0; i < this.particles.length; i++) {
        p = this.particles[i];
        p.update();
        if (p.y > this.h || p.y < -100 + this.y || p.x > this.w + 100 || p.x < -100 + this.x && this.recycle) {
          this.particles[i] = new Particle(utils.clamp(utils.randomFloat(this.x, this.w + this.x), this.x, this.w + this.x), this.y, this.text);
        }
      }

    }
    

    function startWidget(currentSesssion){

      if(!containerWidth || !containerHeight)
        return;

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      generator = new ParticleGenerator(0, 0, containerWidth, containerHeight, number, numberAtStart, spawnDelay);
        
      update();
    }

    function update() {

      if(isStop) {
        isRunning = false;
        return;
      }

      isRunning = true;
      
      context.clearRect(0, 0, containerWidth, containerHeight);
      generator.animate();
      requestAnimationFrame(update);

    }

    
    /*==============================================*/
    /*===== Start point of animation  =====*/
    /*==============================================*/

    function reloadGlobalVariables() {

        containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
        containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

    }

    function stopCurrentAnimation(callback) {

        isStop = true;

        if(isRunning) {
            var timeout = setTimeout(function(){
                clearTimeout(timeout);
                stopCurrentAnimation(callback);
            }, 200);
        } else {
            isStop = false;
            if(callback)
                callback();
        }

    }

    function startAnimation(currentSesssion) {
        stopCurrentAnimation(function(){
            startWidget(currentSesssion);
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {

          colors = [];
          for(var i=1;i<=6;i++) {
            var color = BannerFlow.settings["color"+i];
            if(color && color.length > 0) {
              colors.push(color);
            }
          }

          shape         = BannerFlow.settings.shape;
          number        = BannerFlow.settings.number;
          gravity       = BannerFlow.settings.gravity;
          wind          = BannerFlow.settings.wind;
          windDirection = BannerFlow.settings.windDirection;
          spawnDelay    = BannerFlow.settings.spawnDelay;
          numberAtStart = BannerFlow.settings.numberAtStart;

          if(spawnDelay <= 0)
            spawnDelay = 1;

          if(number <= 0)
            number = 1;

          if(gravity <= 0)
            gravity = 1;

          if(numberAtStart <= 0)
            numberAtStart = 1;  

        } else { 

          colors = [
            '#f44336', '#9c27b0', '#00bcd4', 
            '#8BC34A', '#CDDC39', '#FFEB3B'
          ];
          shape = SHAPE_MIXED;
          number = 40;
          gravity = 5;
          wind = 0;
          windDirection = DIRECTION_LEFT;
          spawnDelay = 10;

          numberAtStart = 10;

        }

        gravity /= 50;
        wind /= 100;

        if(windDirection.toLowerCase() == DIRECTION_RIGHT.toLowerCase())
          wind *= -1;

        selectedShapeIndex = 0;
        if(shape.toLowerCase() == SHAPE_MIXED.toLowerCase())
          isMixed = true;
        else {
          isMixed = false;
          switch(shape.toLowerCase()) {
            case SHAPE_RECTANGLE.toLowerCase():
              selectedShapeIndex = 0;
              break;
            case SHAPE_CIRCLE.toLowerCase():
              selectedShapeIndex = 1;
              break;
            case SHAPE_TRIANGLE.toLowerCase():
              selectedShapeIndex = 2;
              break;
            case SHAPE_HEART.toLowerCase():
              selectedShapeIndex = 3;
              break;
            case SHAPE_SMALL_RECTANGLE.toLowerCase():
              selectedShapeIndex = 4;
              break;
          }
        }
    }

    /*====================================================*/  

    var timeoutStart;
    var sessionId = 0;

    function init() {
        if(timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function() {
                loadSettings();
                reloadGlobalVariables();
                startAnimation(++sessionId);
            }, 500);
        } else {
            timeoutStart = setTimeout(function(){
                loadSettings();
                reloadGlobalVariables();
                startAnimation(++sessionId);
            }, 0);
        }
    }

    var isStartAnimation = false;

    function onStart() {
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
          return;
      }

      isStartAnimation = true;
      init();
    }


    function onResize(){
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
          return;
      }

      init();
    }

    function resetParameter(){
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
          return;
      }

      init();
    }

    return {
        start: onStart,

        onResized: onResize,

        onSettingChanged: resetParameter
    };

})();

if(typeof BannerFlow == "undefined"){
    ClassicConfetti.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        ClassicConfetti.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        ClassicConfetti.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        ClassicConfetti.start();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        ClassicConfetti.start();
    });
}

