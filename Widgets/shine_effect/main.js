

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


/*============================================*/

var ShineEffect = (function(){

    var container = get('widgetContainer');
    var canvas = get('canvas');
    var ctx = canvas.getContext('2d');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;
    var gradient;
    var skew, maxSkew = 0.5; // maxSkew is skew of 30 degree - skew will be used to calculate of rotating angle ( = Math.atag(skewValue))6
    var startX, deltaX, currentX, endX, timeoutValue, timeout;
    var startColor, centerColor;

    /*--- settings from banner flow ---*/
    var duration;
    var size;
    var color;
    var isRepeat;
    var delayRepeat;
    var directionFrom;
    var directionSkew;
    var angleRotate;

    function runAnimation() {

      if(isStop){
        isRunning = false;
        if(timeout)
          clearTimeout(timeout);
        return;
      }

      
      ctx.save();
      ctx.clearRect(0,0, containerWidth, containerHeight);
      ctx.translate(containerWidth/2, containerHeight/2);
      ctx.transform(1, 0, skew, 1, 0, 0);

      gradient = ctx.createLinearGradient(currentX, 0, currentX + size, 0);
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(0.5, centerColor);
      gradient.addColorStop(1, startColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(currentX, -containerHeight/2, size, containerHeight);
      ctx.restore();

      if((currentX > endX && directionSkew == -1) || (currentX < endX && directionSkew == 1)) {
        if(isRepeat){
          currentX = startX;

          if(delayRepeat) {
            timeout = setTimeout(function(){
              if(timeout)
                clearTimeout(timeout);

              runAnimation();
            }, delayRepeat * 1000);

            return false;
          }
        }
        else {
          isRunning = false;
          return false;
        }
      }

      currentX += deltaX;

      timeout = setTimeout(function(){
        if(timeout)
          clearTimeout(timeout);

        runAnimation();
      }, timeoutValue);

    }

    function startWidget(currentSesssion) {

      if(!containerWidth || !containerHeight) // check if the widget is hide
        return;

      canvas.setAttribute('width', containerWidth);
      canvas.setAttribute('height',  containerHeight);

      // Calculate color gradient
      color = color.substring('rgba('.length);
      color = color.split(',');
      startColor = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ", 0)";
      centerColor = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ", 0.7)";

      // Calculate skew value
      // skew = containerWidth/containerHeight;
      // if(skew > maxSkew)
      //   skew = maxSkew;

      skew = Math.tan(Math.PI * angleRotate / 180); // get rotate angle from the setting parameter

      // Calculate startX to draw, endX and timeout value

      if(directionFrom.toLowerCase() == "left") {
        startX = -(size + containerWidth/2) - skew*containerHeight/2;
        endX = containerWidth/2 + skew*containerHeight/2;
        if(skew < 0) {
          startX = -(size + containerWidth/2) + skew * containerHeight /2;
          endX = containerWidth/2 - skew * containerHeight /2;
        }

        directionSkew = -1;

      } else if(directionFrom.toLowerCase() == "right") {
        
        startX = containerWidth/2 + skew*containerHeight/2;
        endX = -(size + containerWidth/2) - skew*containerHeight/2;
        if(skew < 0) {
          startX = containerWidth/2 - skew*containerHeight/2;
          endX = -(size + containerWidth/2) + skew*containerHeight/2;
        }

        directionSkew = 1;

      }

      duration *= 1000/2;
      timeoutValue = parseInt(1000/60);
      deltaX = (endX - startX)/(duration/timeoutValue);
      currentX = startX;

      // Run animation
      isRunning = true;

      runAnimation();

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

          size = BannerFlow.settings.size;
          color = BannerFlow.settings.color;
          duration = BannerFlow.settings.duration;
          if(duration == 0)
            duration = 1;
          isRepeat = BannerFlow.settings.isRepeat;
          delayRepeat = BannerFlow.settings.delayRepeat;
          directionFrom = BannerFlow.settings.directionFrom;
          angleRotate = parseInt(BannerFlow.settings.angleRotate);
          var angleRotateWith90 = parseInt(angleRotate / 90);
          if(angleRotate % 90 == 0 && angleRotateWith90 % 2 != 0)
            angleRotate = 0;

        } else {

          size = 80;
          color = "rgba(255,255,255,1)";
          duration = 10;
          isRepeat = true;
          delayRepeat = 1;
          directionFrom = "left";
          angleRotate = 30;

          var angleRotateWith90 = parseInt(angleRotate / 90);

          if(angleRotate % 90 == 0 && angleRotateWith90 % 2 != 0)
            angleRotate = 0;

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
      init();
    }

    function onTextChanged() {
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
        return;
      }

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

    function onStartAnimation() {

      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
        return;
      }

      isStartAnimation = true;
      init();
    }

    function getLanguageText() {

        languageTexts = [];

        var tmpText = "";

        if(typeof BannerFlow !== "undefined")
            tmpText = BannerFlow.text;

        if(tmpText && tmpText.length > 0) {
            languageTexts = tmpText.split(':');
        }
    }

    return {
        start: onStart,

        onTextChanged: onTextChanged,

        onResized: onResize,

        onSettingChanged: resetParameter,

        onStartAnimation: onStartAnimation
    };
})();

if(typeof BannerFlow == "undefined"){
    ShineEffect.start();
} else {

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        ShineEffect.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        ShineEffect.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        ShineEffect.onTextChanged();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        ShineEffect.onStartAnimation();
    });
}

