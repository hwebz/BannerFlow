

(function() {

  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));

        var id = window.setTimeout(function() { 
          callback(currTime + timeToCall); 
        }, timeToCall);
        
        lastTime = currTime + timeToCall;

        return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
  }

}());

function get(el) {
    if(typeof el === "string") 
        return document.getElementById(el);
    return el;
}

var rand = function(max, min, _int) {
  var max = (max === 0 || max)?max:1, 
      min = min || 0, 
      gen = min + (max - min)*Math.random();
  
  return (_int)?Math.round(gen):gen;
};

function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}



/*============================================*/


var InteractiveLine = (function(){

    var container = get('widgetContainer');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var canvas = get("canvas");

    /*--- settings from banner flow ---*/

    var numberLine, lineThick, lineColor1, lineColor2;
  
    function startWidget(currentSesssion) {
      
      canvas.width = containerWidth;
      canvas.height = containerHeight;


      Nodes.init({
        numberLine: numberLine,
        lineThick: lineThick,
        lineColorOne: lineColor1,
        lineColorTwo: lineColor2
      });
    }


    var Nodes = {

      // Settings
      density: 6,
      reactionSensitivity: 3,

      points: [],
      lines: [[], []],
      mouse: { x: -1000, y: -1000, down: false },

      animation: null,

      canvas: null,
      context: null,

      numberLine: 2,
      lineThick: 10,
      colorOne: "red",
      colorTwo: "green",

      init: function(options) {

        options = options || {};

        if(options.numberLine && options.numberLine > 0 && options.numberLine <= 2)
          this.numberLine = options.numberLine;

        if(options.lineThick && options.lineThick > 0)
          this.lineThick = options.lineThick; 

        if(options.lineColorOne)
          this.colorOne = options.lineColorOne;

        if(options.lineColorTwo)
          this.colorTwo = options.lineColorTwo;

        // Set up the visual canvas 
        this.canvas = get("canvas");
        this.context = this.canvas.getContext('2d');

        this.canvas.onmousedown = this.mouseDown;
        this.canvas.onmousemove = this.mouseMove;
        this.canvas.onmouseup = this.mouseUp;
        this.canvas.onmouseleave = this.mouseOut;
        
        this.canvas.ontouchstart = this.mouseDown;
        this.canvas.ontouchmove = this.mouseMove;
        this.canvas.ontouchend = this.mouseUp;
        this.canvas.ontouchcancel = this.mouseOut;

        this.preparePoints();
        this.draw();
        
      },

      preparePoints: function() {

        // Clear the current points
        this.points = [];
        this.lines = [[],[]];
        
        var width, height, i;
        var center = this.canvas.height / 2;

        for( i = -20; i < this.canvas.width + 20; i += this.density ) {

          var line1 = {
            y: center - this.lineThick * 2,
            originalY: (this.numberLine == 1 ? center - this.lineThick/2 : center + this.lineThick/4), 
            color: this.colorOne
          };

          var line2 = {
            y: center - this.lineThick * 2,
            originalY: center - this.lineThick * 5/4,
            color: this.colorTwo
          };

          line1["x"] =  i;
          line1["originalX"] = i;
          
          line2["x"] =  i;
          line2["originalX"] = i;
          
          this.points.push(line1);
          this.points.push(line2);
          
          this.lines[0].push(line1);
          this.lines[1].push(line2);
        }

      },

      updatePoints: function() {

        var i, currentPoint, theta, distance;
        
        for (i = 0; i < this.points.length; i++){

          currentPoint = this.points[i];

          theta = Math.atan2( currentPoint.y - this.mouse.y, currentPoint.x - this.mouse.x);

          if ( this.mouse.down ) {
            distance = this.reactionSensitivity * 300 / Math.sqrt((this.mouse.x - currentPoint.x) * (this.mouse.x - currentPoint.x) +
             (this.mouse.y - currentPoint.y) * (this.mouse.y - currentPoint.y));
          } else {
            distance = this.reactionSensitivity * 150 / Math.sqrt((this.mouse.x - currentPoint.x) * (this.mouse.x - currentPoint.x) +
             (this.mouse.y - currentPoint.y) * (this.mouse.y - currentPoint.y));
          }
          
          currentPoint.x += Math.cos(theta) * distance + (currentPoint.originalX - currentPoint.x) * 0.07;
          currentPoint.y += Math.sin(theta) * distance + (currentPoint.originalY - currentPoint.y) * 0.07;

        }

      },

      drawPoints: function() {

        var i, currentPoint;

        for (i = 0; i < this.numberLine; i++) {
          var line = this.lines[i];
          this.context.beginPath();
          this.context.lineJoin = 'round';
          this.context.moveTo( line[0].x, line[0].y);
          this.context.strokeStyle = line[0].color;
          this.context.lineWidth = this.lineThick;
          for (var j = 1; j < line.length - 2; j++) {
            var point = line[j];

            var xc = (point.x + line[j + 1].x) / 2;
            var yc = (point.y + line[j + 1].y) / 2;

            this.context.quadraticCurveTo(point.x, point.y, xc, yc);

          }
          this.context.stroke();
          this.context.closePath();
        }
      },

      draw: function() {

        if(isStop) {
          isRunning = false;
          return;
        }
        isRunning = true;

        this.clear();
        this.updatePoints();
        this.drawPoints();

        this.animation = requestAnimationFrame(this.draw.bind(this));
      },

      clear: function() {
        this.canvas.width = this.canvas.width;
      },

      mouseDown: function( event ){
        Nodes.mouse.down = true;
      },

      mouseUp: function( event ){
        Nodes.mouse.down = false;
      },
      
      mouseMove: function(event){
        var x = event.pageX;
        var y = event.pageY;
        if(event.touches) {
          x = event.touches[0].pageX;
          y = event.touches[0].pageY;
        }

        Nodes.mouse.x = x;
        Nodes.mouse.y = y;
      },
      
      mouseOut: function(event){
        Nodes.mouse.x = -1000;
        Nodes.mouse.y = -1000;
        Nodes.mouse.down = false;
      }
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

        numberLine = parseInt(BannerFlow.settings.numberLine);
        lineThick = BannerFlow.settings.lineThick;
        if(lineThick <= 0)
          lineThick = 10;
        lineColor1 = BannerFlow.settings.lineColor1;
        lineColor2 = BannerFlow.settings.lineColor2;        

      } else {

        numberLine = 2;
        lineThick = 20;
        lineColor1 = "red";
        lineColor2 = "green";

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

    function getLanguageText() {
      if(typeof BannerFlow !== "undefined")
        text = BannerFlow.text;
    }


    function onStart() {
      init();
    }

    function onResize(){
      init();
    }

    function resetParameter(){
      init();
    }

    return {

      start: onStart,

      onResized: onResize,

      onSettingChanged: resetParameter

    };
})();

if(typeof BannerFlow == "undefined"){
  InteractiveLine.start();
} else {
  BannerFlow.addEventListener(BannerFlow.INIT, function () {
    InteractiveLine.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    InteractiveLine.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    InteractiveLine.onSettingChanged();
  });

  BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    InteractiveLine.start();
  });
}

