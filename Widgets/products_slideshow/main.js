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

function setStyleCss3(object, key, value) {
  object.style['webkit'+key.substr(0,1).toUpperCase() + key.substr(1).toLowerCase()] = value;
  object.style['moz'+key.substr(0,1).toUpperCase() + key.substr(1).toLowerCase()] = value;
  object.style['ms'+key.substr(0,1).toUpperCase() + key.substr(1).toLowerCase()] = value;
  object.style[key.toLowerCase()] = value;
}


/*============================================*/

var ProductsSlideShow = (function(){

    var container = get('widgetContainer');
    var prev = get('prevButton');
    var next = get('nextButton');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;


    var BUTTON_ARROW = "Arrow";
    var BUTTON_CIRCLE = "Circle";
    var BUTTON_HALF_CIRCLE = "Half Circle";

    /*--- settings from banner flow ---*/

    var buttonStyle;
    var buttonColor;
    var arrowColor;
    var buttonSize;
    var autoLoop;

    function createArrows() {
      var idExtraStyle = "extraStyle";
      var oldStyle = get(idExtraStyle);
      if(oldStyle)
        document.head.removeChild(oldStyle);

      var style = document.createElement('style');
      style.setAttribute('type', 'text/css');

      var innerHTML = ".action-button {" +
                        "width: " + buttonSize + 'px;' + 
                        "height: " + buttonSize + 'px;' +
                        "background-color: " + buttonColor + ";" +
                      "}" +
                      ".prev-button, .next-button {" +
                        "-webkit-transform: translate(0,-50%);" +
                        "-moz-transform: translate(0,-50%);" +
                        "-ms-transform: translate(0,-50%);" +
                        "transform: translate(0,-50%);" +
                      "}" +
                      ".prev-button:after, .prev-button:before, .next-button:after, .next-button:before {" + 
                        "width: " + buttonSize * 6/50 + "px;" +
                        "height: " + buttonSize * 2/5 + "px;" +
                        "background-color:" + arrowColor + ";" +
                        "-webkit-transform-origin: 50% 50%;" +
                        "-moz-transform-origin: 50% 50%;" +
                        "-ms-transform-origin: 50% 50%;" +
                        "transform-origin: 50% 50%;" +
                      "}" +
                      ".prev-button:after, .prev-button:before {" +
                        "right: 45%;" +
                        "left: auto;" +
                      "}" +
                      ".next-button:after, .next-button:before {" +
                        "left: 45%;" +
                        "right: auto;" +
                      "}" +
                      ".prev-button:before, .next-button:before {" +
                        "top: 20%;" +
                        "bottom: auto;" +
                      "}" +
                      ".prev-button:after, .next-button:after {" +
                        "bottom: 20%;" +
                        "top: auto;" +
                      "}";

      if(buttonStyle.toLowerCase() == BUTTON_ARROW.toLowerCase()) {
        innerHTML += ".action-button {" + 
                        "background-color: transparent;" +
                     "}";
      } else if(buttonStyle.toLowerCase() == BUTTON_CIRCLE.toLowerCase()) {
        innerHTML += ".action-button {" + 
                        "-webkit-border-radius: 100%;" +
                        "-moz-border-radius: 100%;" +
                        "-ms-border-radius: 100%;" +
                        "border-radius: 100%;" +
                     "}";
      } else if(buttonStyle.toLowerCase() == BUTTON_HALF_CIRCLE.toLowerCase()) {
        innerHTML += ".action-button {" + 
                        "-webkit-border-radius: 100%;" +
                        "-moz-border-radius: 100%;" +
                        "-ms-border-radius: 100%;" +
                        "border-radius: 100%;" +
                     "}" +
                     ".prev-button {" +
                        "-webkit-transform: translate(-60%,-50%);" +
                        "-moz-transform: translate(-60%,-50%);" +
                        "-ms-transform: translate(-60%,-50%);" +
                        "transform: translate(-60%,-50%);" +
                     "}" + 
                     ".next-button {" +
                        "-webkit-transform: translate(60%,-50%);" +
                        "-moz-transform: translate(60%,-50%);" +
                        "-ms-transform: translate(60%,-50%);" +
                        "transform: translate(60%,-50%);" +
                     "}" +
                     ".prev-button:after, .prev-button:before {" + 
                        "left: 60%;" +
                        "right: auto;" +
                        "margin-left: 1px;" +
                      "}" +
                      ".prev-button:before, .next-button:before {" +
                        "bottom: 50%;" +
                        "top: auto;" +
                        "-webkit-transform-origin: 100% 100%;" +
                        "-moz-transform-origin: 100% 100%;" +
                        "-ms-transform-origin: 100% 100%;" +
                        "transform-origin: 100% 100%;" +
                      "}" +
                      ".prev-button:before {" +
                        "-webkit-transform-origin: 0% 100%;" +
                        "-moz-transform-origin: 0% 100%;" +
                        "-ms-transform-origin: 0% 100%;" +
                        "transform-origin: 0% 100%;" +
                      "}" +
                      ".prev-button:after, .next-button:after {" +
                        "top: 50%;" +
                        "bottom: auto;" +
                        "-webkit-transform-origin: 100% 0%;" +
                        "-moz-transform-origin: 100% 0%;" +
                        "-ms-transform-origin: 100% 0%;" +
                        "transform-origin: 100% 0%;" +
                      "}" +
                      ".prev-button:after {" +
                        "-webkit-transform-origin: 0% 0%;" +
                        "-moz-transform-origin: 0% 0%;" +
                        "-ms-transform-origin: 0% 0%;" +
                        "transform-origin: 0% 0%;" +
                      "}" +
                      ".next-button:after, .next-button:before {" + 
                        "right: 60%;" +
                        "left: auto;" +
                        "margin-right: 1px;" +
                      "}" +
                      ".prev-button:after, .prev-button:before,.next-button:after, .next-button:before {"+
                        "height: " + buttonSize * 1/5 + "px;" +
                        "width: " + buttonSize * 3/50 + "px;" +
                      "}";
      }

      style.innerHTML = innerHTML;
      document.head.appendChild(style);

    }
         
    function startWidget(currentSesssion) {
      createArrows();

      // document.body.onmouseover = function() {
      //     BannerFlow.pause();
      // }
      // document.body.onmouseout = function() {
      //     BannerFlow.play();
      // }
      
      next.onclick = function() {
          BannerFlow.nextLoop(true);
      }
      
      prev.onclick = function() {
          BannerFlow.prevLoop(true);
      }

      if(!autoLoop)
        BannerFlow.pause();
      else
        BannerFlow.play();

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

        buttonStyle = BannerFlow.settings.buttonStyle;
        buttonColor = BannerFlow.settings.buttonColor;
        arrowColor = BannerFlow.settings.arrowColor;
        buttonSize = BannerFlow.settings.buttonSize;
        if(buttonSize <= 0)
          buttonSize = 50;

        autoLoop = BannerFlow.settings.autoLoop;
        
      } else {

        buttonSize = 50;
        buttonStyle = BUTTON_HALF_CIRCLE;
        buttonColor = "black"
        arrowColor = "blue";
        autoLoop = true;

      }
    }

    /*====================================================*/  

    var timeoutStart;
    var sessionId = 0;

    function init() {
      if(timeoutStart) {
        clearTimeout(timeoutStart);

        timeoutStart = setTimeout(function() {
          start();
        }, 500);
      } else {
        timeoutStart = setTimeout(function(){
          start();
        }, 0);
      }
    }

    function start() {
      loadSettings();
      reloadGlobalVariables();
      startAnimation(++sessionId);
    }


    function onStart() {
      init();
    }

    function onResize() {
      init();
    }

    function resetParameter() {
      init();
    }

    return {
      start: onStart,

      onResized: onResize,

      onSettingChanged: resetParameter

    };
})();

if(typeof BannerFlow == "undefined"){
  ProductsSlideShow.start();
} else {
  BannerFlow.addEventListener(BannerFlow.INIT, function () {
    ProductsSlideShow.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    ProductsSlideShow.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    ProductsSlideShow.onSettingChanged();
  });
}

