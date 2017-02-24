

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

var DrawOnBanner = (function(){

    var container = get('widgetContainer');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var resultCanvas = get("resultCanvas");
    var drawCanvas = get("drawCanvas");

    var ctxResult = resultCanvas.getContext('2d');
    var ctxDraw = drawCanvas.getContext('2d');

    /*--- settings from banner flow ---*/

    var DRAW_CLICK = "Click";
    var DRAW_HOVER = "Hover";

    var strokeColor, lineWidth, drawType;
  
    function startWidget(currentSesssion) {
      
      resultCanvas.width = containerWidth;
      resultCanvas.height = containerHeight;
      drawCanvas.width = containerWidth;
      drawCanvas.height = containerHeight;

      var isDrawing = false;
      var isDrawHover = false;
      if(drawType.toLowerCase() === DRAW_HOVER.toLowerCase()){
        isDrawHover = true;
        isDrawing = true;
      } else {
        isDrawHover = false;
      }


      var points = new Array();

      ctxDraw.lineWidth = lineWidth;
      ctxDraw.lineJoin = ctxDraw.lineCap = "round";
      ctxDraw.strokeStyle = strokeColor;

      // bind mouse events

      var mouseDown = function(e) {
        isDrawing = true;
        var x = e.pageX;
        var y = e.pageY;
        if(e.touches) {
          x = e.touches[0].pageX;
          y = e.touches[0].pageY;
        }

        points.push({x: x, y: y});
      };

      var mouseMove = function(e) {
        var x = e.pageX;
        var y = e.pageY;
        if(e.touches) {
          x = e.touches[0].pageX;
          y = e.touches[0].pageY;
        }

        if (!isDrawing) {
           return;
        }

        points.push({x: x, y: y});

        ctxDraw.clearRect(0, 0, ctxDraw.canvas.width, ctxDraw.canvas.height);
        ctxDraw.beginPath();

        ctxDraw.moveTo(points[0].x, points[0].y);

        for(var i = 1 ; i < points.length - 2 ; i++){
          var tmpX = (points[i].x + points[i+1].x) / 2;
          var tmpY = (points[i].y + points[i+1].y) / 2;
          ctxDraw.quadraticCurveTo(points[i].x, points[i].y, tmpX, tmpY);
        }

        // For the last point
        if(i + 1 < points.length) {
          var tmpX = (points[i].x + points[i+1].x)/2;
          var tmpY = (points[i].y + points[i+1].y)/2;
          ctxDraw.quadraticCurveTo(points[i].x, points[i].y, tmpX, tmpY);
        }

        ctxDraw.stroke();
      };

      var mouseUp = function(e) {
        if(!isDrawHover)
          isDrawing = false;
        points.length = 0;
        ctxResult.drawImage(drawCanvas, 0, 0, drawCanvas.width, drawCanvas.height);
        ctxDraw.clearRect(0, 0, ctxDraw.canvas.width, ctxDraw.canvas.height);
      };

      drawCanvas.onmousedown = mouseDown;
      drawCanvas.onmousemove = mouseMove;
      drawCanvas.onmouseup = mouseUp;
      container.onmouseleave = mouseUp;
      
      drawCanvas.ontouchstart = mouseDown;
      drawCanvas.ontouchmove = mouseMove;
      drawCanvas.ontouchend = mouseUp;
      container.ontouchcancel = mouseUp;

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

        strokeColor = BannerFlow.settings.strokeColor;
        lineWidth = BannerFlow.settings.lineWidth;
        if(lineWidth <= 0)
          lineWidth = 1;
        drawType = BannerFlow.settings.drawType;

      } else {
        strokeColor = "red"; 
        lineWidth = 5; 
        drawType = DRAW_CLICK;
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
      getLanguageText();
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
  DrawOnBanner.start();
} else {
  BannerFlow.addEventListener(BannerFlow.INIT, function () {
    DrawOnBanner.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    DrawOnBanner.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    DrawOnBanner.onSettingChanged();
  });

  BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    DrawOnBanner.start();
  });
}

