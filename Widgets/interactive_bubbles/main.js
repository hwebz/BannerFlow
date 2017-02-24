function get(el) {
    if(typeof el === "string") 
        return document.getElementById(el);
    return el;
}

var rand = function(max, min, _int) {
  var max = (max === 0 || max) ? max : 1, 
      min = min || 0, 
      gen = min + (max - min)*Math.random();
  
  return (_int)?Math.round(gen):gen;
};

/*============================================*/

var InteractiveBubble = (function(){

    var container = get('widgetContainer');
    var canvas = get('widgetCanvas');
    var context = canvas.getContext('2d');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var TWO_PI = 2 * Math.PI;
    var particles = [];
    var pool = [];

    /*--- settings from banner flow ---*/
    var size, color, amount;
    var minSpeed, maxSpeed;
    var colors;

    function Particle( x, y, radius ) {
        this.init( x, y, radius );
    }
    Particle.prototype = {
        init: function( x, y, radius ) {
            this.alive = true;
            this.radius = radius || 10;
            this.wander = 0.15;
            this.theta = rand( TWO_PI );
            this.drag = 0.1;
            this.color = "rgba(255,255,255,1)";
            this.x = x || 0.0;
            this.y = y || 0.0;
            this.vx = 0.0;
            this.vy = 0.0;
        },
        move: function() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= this.drag;
            this.vy *= this.drag;
            this.theta += rand( 0.5, -0.5 ) * this.wander;
            this.vx += Math.sin( this.theta ) * 0.1;
            this.vy += Math.cos( this.theta ) * 0.1;
            this.radius *= 0.96;
            this.alive = this.radius > 0.5;
        },
        draw: function( ctx ) {
            ctx.beginPath();
            ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    };    

    function startWidget(currentSesssion){

        if(!containerWidth || !containerHeight)
            return;

        canvas.width = containerWidth;
        canvas.height = containerHeight;

        setup();
    }

    function setup() {
        var x, y;
        for (var i = 0; i < amount/2; i++ ) {
            x = ( containerWidth * 0.5 ) + rand( 100, -100 );
            y = ( containerHeight * 0.5 ) + rand( 100, -100 );
            spawn( x, y );
        }

        update();

        container.onmousemove = mousemove;
        container.ontouchmove = mousemove;

    };

    function spawn( x, y ) {
      if ( particles.length >= amount )
          pool.push( particles.shift() );
      var particle = pool.length ? pool.pop() : new Particle();
      particle.init( x, y, rand( size, 5 ) );
      particle.wander = rand( 2, 0.5 );
      particle.color = "rgba("+colors[0]+","+colors[1]+","+colors[2]+"," + rand(0.9,0.1) +")";
      particle.drag = rand( 0.99, 0.9 );
      var theta = rand( TWO_PI );
      var minForce = minSpeed;
      var maxForce = maxSpeed;

      if(maxForce < minForce) {
          var temp = maxForce;
          maxForce = minForce;
          minForce = temp;
      }

      var force = rand( maxForce, minForce );
      particle.vx = Math.sin( theta ) * force;
      particle.vy = -force;
      particles.push( particle );
    };

    function update() {

        if(isStop){
            isRunning = false;
            return false;
        }
        
        isRunning = true;

        var i, particle;
        for ( i = particles.length - 1; i >= 0; i-- ) {
            particle = particles[i];
            if ( particle.alive ) particle.move();
            else pool.push( particles.splice( i, 1 )[0] );
        }

        draw();

        requestAnimationFrame(update);
    };
    function draw() {

        context.clearRect(0, 0, containerWidth, containerHeight);
        context.save();
        // context.globalCompositeOperation  = 'lighter';

        for ( var i = particles.length - 1; i >= 0; i-- ) {
            particles[i].draw( context );
        }
        context.restore();
    };

    function mousemove(e) {
        var x = e.touches ? e.touches[0].clientX : e.clientX;
        var y = e.touches ? e.touches[0].clientY : e.clientY;

        var max = rand( 4, 1 );
        for (var j = 0; j < max; j++ ) {
            spawn(x, y);
        }
    };
    
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

            size   = BannerFlow.settings.size;
            color  = BannerFlow.settings.color;
            amount = BannerFlow.settings.amount;
            minSpeed = BannerFlow.settings.minsSpeed;
            maxSpeed = BannerFlow.settings.maxSpeed;

        } else {
            size   = 50;
            color  = "rgba(65,157,239,1)";
            amount = 400;
            minSpeed  = 5; 
            maxSpeed  = 15;
        }

        if(size <= 5)
            size = 6;

        colors = color.substring("rgba(".length);
        colors = colors.split(",");
        color = [parseInt(colors[0]), parseInt(colors[2]), parseInt(colors[2])];

        if(minSpeed <= 0)
            minSpeed = 0;
        if(maxSpeed <= 0)
            maxSpeed = 0;

        if(amount <= 0)
            amount = 1;

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
    InteractiveBubble.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        InteractiveBubble.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        InteractiveBubble.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        InteractiveBubble.start();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        InteractiveBubble.start();
    });
}

