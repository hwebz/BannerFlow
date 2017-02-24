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

function setStyleCss3(object, key, value) {
  var keyName = key.substr(0,1).toUpperCase() + key.substr(1);
  object.style['webkit' + keyName] = value;
  object.style['moz' + keyName] = value;
  object.style['ms' + keyName] = value;
  object.style[key] = value;
}

/*============================================*/

var OldCinemaEffect = (function(){

    var container = get('widgetContainer');

    var canvas = get("canvas");
    var ctx = canvas.getContext('2d');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    /*--- settings from banner flow ---*/

    var intensity = 2;
    

    /*-----------------------------------------------------*/

    // reference: https://codepen.io/zadvorsky/pen/PwyoMm/


    function startWidget(currentSesssion){

      if(!containerWidth || !containerHeight)
        return;

      // change these settings
      var patternSize = 50,
          patternScaleX = intensity,
          patternScaleY = intensity,
          patternRefreshInterval = 6,
          patternAlpha = 15; // int between 0 and 255,

      var patternPixelDataLength = patternSize * patternSize * 4,
          patternCanvas,
          patternCtx,
          patternData,
          frame = 0;

      // create a canvas which will render the grain
      function initCanvas() {
          canvas.width = containerWidth;
          canvas.height = containerHeight;
          ctx = canvas.getContext('2d');

          ctx.scale(patternScaleX, patternScaleY);
      }

      // create a canvas which will be used as a pattern
      function initGrain() {
          patternCanvas = document.createElement('canvas');
          patternCanvas.width = patternSize;
          patternCanvas.height = patternSize;
          patternCtx = patternCanvas.getContext('2d');
          patternData = patternCtx.createImageData(patternSize, patternSize);
      }

      // put a random shade of gray into every pixel of the pattern
      function update() {
          var value;

          for (var i = 0; i < patternPixelDataLength; i += 4) {
              value = (Math.random() * 255) | 0;

              patternData.data[i    ] = value;
              patternData.data[i + 1] = value;
              patternData.data[i + 2] = value;
              patternData.data[i + 3] = patternAlpha;
          }

          patternCtx.putImageData(patternData, 0, 0);
      }

      // fill the canvas using the pattern
      function draw() {
          ctx.clearRect(0, 0, containerWidth, containerHeight);

          ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
          ctx.fillRect(0, 0, containerWidth, containerHeight);
      }

      function loop() {

          if(isStop){
            isRunning = false;
            return;
          }

          isRunning = true;

          if (++frame % patternRefreshInterval === 0) {
              update();
              draw();
          }

          requestAnimationFrame(loop);
      }

      initCanvas();
      initGrain();
      requestAnimationFrame(loop);

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

          intensity = BannerFlow.settings.intensity;

        } else {
          intensity = 5;
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
      if(typeof BannerFlow !== "undefined"){
        text = BannerFlow.text;
      }
    }

    var isStartAnimation = false;

    function onStart() {
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
          return;
      }

      isStartAnimation = true;
      getLanguageText();
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
    OldCinemaEffect.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        OldCinemaEffect.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        OldCinemaEffect.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        OldCinemaEffect.start();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        OldCinemaEffect.start();
    });
}

