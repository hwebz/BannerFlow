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

var MovingWallpaper = (function(){

    var container = get('widgetContainer');
    var background = get('widgetBackground');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var DIRECTION_HORIZONTAL = "Horizontal";
    var DIRECTION_VERTICAL = "Vertical";
    var DIRECTION_DIAGONALLY = "Diagonally";

    var MOVING_DEFAULT = "Default";
    var MOVING_OPPOSITE = "Opposite";

    var classForStyleElement = "style-inline";
    var classForBackgroundWidget = "widget-background";
    var animationBackground = "animation-background";

    /*--- settings from banner flow ---*/

    var color1, color2, color3, color4;
    var stripeDirection, movingDirection, stripeThickness, movingDuration;



    function startWidget(currentSesssion){

      if(!containerWidth || !containerHeight)
        return;
      
      removeOldStyle();        
      createStripes();
      animateStripes();

    }

    function removeOldStyle() {
      var styles = document.querySelectorAll('.' + classForStyleElement);
      if(styles && styles.length > 0) {
        for(var i=0;i<styles.length;i++) {
          document.head.removeChild(styles[i]);
        }
      }

      setStyleCss3(widgetBackground, "transform", "translate(-50%, -50%)");
      widgetBackground.style.width = "100%";
      widgetBackground.style.height = "100%";
    }


    function createStripes() {
      switch(stripeDirection.toLowerCase()) {
        case DIRECTION_HORIZONTAL.toLowerCase():
          _createStripesHorizontal();
          break;
        case DIRECTION_VERTICAL.toLowerCase():
          _createStripesVertical();
          break;
        case DIRECTION_DIAGONALLY.toLowerCase():
          _createStripesDiagonally();
          break;
        default:
          _createStripesVertical();
      }
    }

    function animateStripes() {
      switch(stripeDirection.toLowerCase()) {
        case DIRECTION_HORIZONTAL.toLowerCase():
          _animateStripeHorizontal();
          break;
        case DIRECTION_VERTICAL.toLowerCase():
          _animateStripeVertical();
          break;
        case DIRECTION_DIAGONALLY.toLowerCase():
          _animateStripeHorizontal();
          break;
        default:
          _animateStripeVertical();
      }
    }


    /*------------ Create stripes -----------------------*/

    function getColors() {
      var colors = new Array();
      if(color1 && color1.length > 0)
        colors.push(color1);
      if(color2 && color2.length > 0)
        colors.push(color2);
      if(color3 && color3.length > 0)
        colors.push(color3);
      if(color4 && color4.length > 0)
        colors.push(color4);

      return colors;
    }

    function _createStripesHorizontal() {
      var colors = getColors();
      if(!colors || colors.length == 0)
        return false;

      var width = containerWidth;
      var height = stripeThickness;

      var svg = "<svg width='" + width + "' height='" + (height * colors.length) + "' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + width + " " + (height * colors.length) + "'>";

      for(var i=0;i<colors.length;i++) {
        svg += "<path fill='" + colors[i] + "' d='M0 " + (i*height) + " l0 " + height + " l" + width + " 0 l0 -" + height + " Z'/>";
      }

      svg += "</svg>";

      widgetBackground.style.backgroundImage = "url('data:image/svg+xml;base64," + btoa(svg) + "')";
      widgetBackground.style.backgroundRepeat = "repeat-y";
    }

    function _createStripesVertical() {
      var colors = getColors();
      if(!colors || colors.length == 0)
        return false;

      var width = stripeThickness;
      var height = containerHeight;

      var svg = "<svg width='" + (width * colors.length) + "' height='" + height + "' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + (width * colors.length) + " " + height + "'>";

      for(var i=0;i<colors.length;i++) {
        svg += "<path fill='" + colors[i] + "' d='M" + (i*width) + " 0 l0 " + height + " l" + width + " 0 l0 -" + height + " Z'/>";
      }

      svg += "</svg>";

      widgetBackground.style.backgroundImage = "url('data:image/svg+xml;base64," + btoa(svg) + "')";
      widgetBackground.style.backgroundRepeat = "repeat-x";
    }

    function _createStripesDiagonally() {
      var colors = getColors();
      if(!colors || colors.length == 0)
        return false;

      var newContainerWidth = Math.ceil(Math.sqrt(containerWidth*containerWidth + containerHeight*containerWidth));
      var newContainerHeight = newContainerWidth;

      widgetBackground.style.width = newContainerWidth + 'px';
      widgetBackground.style.height = newContainerHeight + 'px';

      var width = newContainerWidth;
      var height = stripeThickness;

      var svg = "<svg width='" + width + "' height='" + (height * colors.length) + "' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + width + " " + (height * colors.length) + "'>";

      for(var i=0;i<colors.length;i++) {
        svg += "<path fill='" + colors[i] + "' d='M0 " + (i*height) + " l0 " + height + " l" + width + " 0 l0 -" + height + " Z'/>";
      }

      svg += "</svg>";

      widgetBackground.style.backgroundImage = "url('data:image/svg+xml;base64," + btoa(svg) + "')";
      widgetBackground.style.backgroundRepeat = "repeat-y";
      setStyleCss3(widgetBackground, "transform", "translate(-50%, -50%) rotate(-45deg)");
    }


    /*------------- Animate stripe background --------------------------*/

    function _animateStripeHorizontal() {
      var indicateDirection = 1;
      if(movingDirection.toLowerCase() === MOVING_OPPOSITE.toLowerCase())
        indicateDirection = -1;

      var colors = getColors();
      var imageHeight = stripeThickness * colors.length;

      var heightBackground = containerHeight;

      if(containerHeight % imageHeight != 0) {
        heightBackground = imageHeight * parseInt((containerHeight / imageHeight) + 1);
      }

      var style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.setAttribute("class", classForStyleElement);

      var innerHTML = "@-webkit-keyframes " + animationBackground + "{\n" +
                          "0% { background-position: 0px 0px; }\n" +
                          "100% { background-position: 0px " + indicateDirection * heightBackground + "px; }\n" +
                      "}\n" +
                      "@-moz-keyframes " + animationBackground + "{\n" +
                          "0% { background-position: 0px 0px; }\n" +
                          "100% { background-position: 0px " + indicateDirection * heightBackground + "px; }\n" +
                      "}\n" +
                      "@keyframes " + animationBackground + "{\n" +
                          "0% { background-position: 0px 0px; }\n" +
                          "100% { background-position: 0px " + indicateDirection * heightBackground + "px; }\n" +
                      "}\n";

      innerHTML += "." + classForBackgroundWidget + "{\n" +
                          "-webkit-animation: " + animationBackground + " " + movingDuration + "ms infinite forwards linear; \n" +
                          "-moz-animation: " + animationBackground + " " + movingDuration + "ms infinite forwards linear; \n" +
                          "animation: " + animationBackground + " " + movingDuration + "ms infinite forwards linear; \n" +
                      "}\n";

      style.innerHTML = innerHTML;
      document.head.appendChild(style);
    }

    function _animateStripeVertical() {

      var indicateDirection = 1;
      if(movingDirection.toLowerCase() === MOVING_OPPOSITE.toLowerCase())
        indicateDirection = -1;

      var colors = getColors();
      var imageWidth = stripeThickness * colors.length;

      var widthBackground = containerWidth;

      if(containerWidth % imageWidth != 0) {
        widthBackground = imageWidth * parseInt((containerWidth / imageWidth) + 1);
      }

      var style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.setAttribute("class", classForStyleElement);

      var innerHTML = "@-webkit-keyframes " + animationBackground + "{\n" +
                          "0% { background-position: 0px; }\n" +
                          "100% { background-position: " + indicateDirection * widthBackground + "px; }\n" +
                      "}\n" +
                      "@-moz-keyframes " + animationBackground + "{\n" +
                          "0% { background-position: 0px; }\n" +
                          "100% { background-position: " + indicateDirection * widthBackground + "px; }\n" +
                      "}\n" +
                      "@keyframes " + animationBackground + "{\n" +
                          "0% { background-position: 0px; }\n" +
                          "100% { background-position: " + indicateDirection * widthBackground + "px; }\n" +
                      "}\n";

      innerHTML += "." + classForBackgroundWidget + "{\n" +
                          "-webkit-animation: " + animationBackground + " " + movingDuration + "ms infinite forwards linear; \n" +
                          "-moz-animation: " + animationBackground + " " + movingDuration + "ms infinite forwards linear; \n" +
                          "animation: " + animationBackground + " " + movingDuration + "ms infinite forwards linear; \n" +
                      "}\n";

      style.innerHTML = innerHTML;
      document.head.appendChild(style);
    }

    function _animateStripeDiagonally() {}

    
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

          color1 = BannerFlow.settings.color1;
          color2 = BannerFlow.settings.color2;
          color3 = BannerFlow.settings.color3;
          color4 = BannerFlow.settings.color4;
          stripeDirection = BannerFlow.settings.stripeDirection;
          movingDirection = BannerFlow.settings.movingDirection;
          stripeThickness = BannerFlow.settings.stripeThickness;
          if(stripeThickness <= 0)
            stripeThickness = 10;
          movingDuration = BannerFlow.settings.movingDuration;
          if(movingDuration <= 0)
            movingDuration = 5;

        } else {

          color1 = "#f73c5b";
          color2 = "#3cf749";
          color3 = "#3c71f7";
          color4 = "#f7e83c";
          stripeDirection = DIRECTION_DIAGONALLY;
          movingDirection = MOVING_OPPOSITE;
          stripeThickness = 250;
          movingDuration = 5;
        }

        movingDuration *= 1000;
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
    MovingWallpaper.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        MovingWallpaper.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        MovingWallpaper.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        MovingWallpaper.start();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        MovingWallpaper.start();
    });
}

