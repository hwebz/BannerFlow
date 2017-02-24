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

var WatchWidget = (function(){

    var container = get('widgetContainer');
    var watch = get('watch');
    var watchBaseSize = 30;
    
    var hourHand = get('hourHand');
    var minuteSecond = get('minuteHand');
    var secondsHand = get('secondsHand');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var styleClass = "cssContainer";

    /*--- settings from banner flow ---*/
    var borderColor, faceColor, numberColor, markMinuteColor, hourHandColor, minuteHandColor, secondHandColor;
    

    /*================================================================================*/

    var animationEvents = ["webkitTransitionEnd", "transitionend", "msTransitionEnd"];

    
    /*================================================================================*/

    function startWidget(currentSesssion) {

      // Remove old style
      var oldStyle = get(styleClass);
      var oldStyle = document.querySelectorAll('.' + styleClass);
      if(oldStyle && oldStyle.length > 0) {
        for(var i=0;i<oldStyle.length;i++) {
          document.head.removeChild(oldStyle[i]);
        }
      }

      // Set size of watch
      var size = containerWidth > containerHeight ? containerHeight : containerWidth;
      watch.style.fontSize = parseFloat(size / watchBaseSize) + 'px';

      // Add new style
      var newStyle = document.createElement("style");
      newStyle.setAttribute('type', 'text/css');
      newStyle.setAttribute('class', styleClass);

      var newStyleInnerHTML = "";
      newStyleInnerHTML += ".widget-container { opacity: 1; } \n\n";
      newStyleInnerHTML += "#watch .frame-face:before { border: 1em solid " + borderColor + "; } \n\n" ;
      newStyleInnerHTML += "#watch .frame-face:after { " +
                        "background: " + faceColor + ";\n" +
                        "background: -webkit-radial-gradient(center, ellipse cover, " + faceColor + " 0%, " + faceColor + " 50%, rgba(0,0,0,0) 100%); \n" +
                        "background: -moz-radial-gradient(center, ellipse cover, " + faceColor + " 0%, " + faceColor + " 50%, rgba(0,0,0,0) 100%); \n" +
                        "background: radial-gradient(ellipse at center, " + faceColor + " 0%, " + faceColor + " 50%, rgba(0,0,0,0) 100%); } \n\n";

      newStyleInnerHTML += "#watch .digits { color: " + numberColor + "; } \n\n";
      newStyleInnerHTML += "#watch .minute-marks li { background: " + markMinuteColor + "; } \n\n";

      newStyleInnerHTML += "#watch .hours-hand { background: " + hourHandColor + "; \n" +
                        "-webkit-box-shadow: " + hourHandColor + " 0 0 2px; \n" + 
                        "-moz-box-shadow: " + hourHandColor + " 0 0 2px; \n" + 
                        "box-shadow: " + hourHandColor + " 0 0 2px; } \n\n";

      newStyleInnerHTML += "#watch .minutes-hand { background: " + minuteHandColor + "; \n" +
                        "-webkit-box-shadow: " + minuteHandColor + " 0 0 2px; \n" +
                        "-moz-box-shadow: " + minuteHandColor + " 0 0 2px; \n" +
                        "box-shadow: " + minuteHandColor + " 0 0 2px; } \n\n";

      newStyleInnerHTML += "#watch .seconds-hand { background: " + secondHandColor + "; \n" +
                        "-webkit-box-shadow: " + secondHandColor + " 0 0 2px; \n" +
                        "-moz-box-shadow: " + secondHandColor + " 0 0 2px; \n" +
                        "box-shadow: " + secondHandColor + " 0 0 2px; } \n\n";

      newStyle.innerHTML = newStyleInnerHTML;
      document.head.appendChild(newStyle);

      startWatch();
    }


    function startWatch() {

      var now = new Date();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var seconds = now.getSeconds();

      var hourRotate = (hour % 12 != 0 ? hour % 12 * 6 * 5 : 0) + (minute/60 * 30);
      var minuteRotate = minute * 6 + seconds/60 * 6;
      var secondsRotate = seconds * 6;

      // Set hands rotate for current time
      setStyleCss3(hourHand, "transform", "rotate(" + (hourRotate - 360) + "deg)");
      setStyleCss3(minuteHand, "transform", "rotate(" + (minuteRotate - 360) + "deg)");
      setStyleCss3(secondsHand, "transform", "rotate(" + (secondsRotate - 360) + "deg)");

      var newStyle = document.createElement("style");
      newStyle.setAttribute('type', 'text/css');
      newStyle.setAttribute('class', styleClass);

      // Set style for rotating hands
      var newStyleInnerHTML = "";
      newStyleInnerHTML += "@-webkit-keyframes hours { to { -webkit-transform: rotate(" + hourRotate + "deg); } }\n";
      newStyleInnerHTML += "@-moz-keyframes hours { to { -moz-transform: rotate(" + hourRotate + "deg); } }\n";
      newStyleInnerHTML += "@keyframes hours { to { transform: rotate(" + hourRotate + "deg); } }\n\n";
      newStyleInnerHTML += "#watch .hours-hand {" +
                              "-webkit-animation: hours 43200s linear 0s infinite;\n" +
                              "-moz-animation: hours 43200s linear 0s infinite;\n" +
                              "animation: hours 43200s linear 0s infinite;\n" +
                          "}\n\n";

      newStyleInnerHTML += "@-webkit-keyframes minutes { to { -webkit-transform: rotate(" + minuteRotate + "deg); } }\n";
      newStyleInnerHTML += "@-moz-keyframes minutes { to { -moz-transform: rotate(" + minuteRotate + "deg); } }\n";
      newStyleInnerHTML += "@keyframes minutes { to { transform: rotate(" + minuteRotate + "deg); } }\n\n";
      newStyleInnerHTML += "#watch .minutes-hand {" +
                              "-webkit-animation: minutes 3600s linear 0s infinite;\n" +
                              "-moz-animation: minutes 3600s linear 0s infinite;\n" +
                              "animation: minutes 3600s linear 0s infinite;\n" +
                          "}\n\n";

      newStyleInnerHTML += "@-webkit-keyframes seconds { to { -webkit-transform: rotate(" + secondsRotate + "deg); } }\n";
      newStyleInnerHTML += "@-moz-keyframes seconds { to { -moz-transform: rotate(" + secondsRotate + "deg); } }\n";
      newStyleInnerHTML += "@keyframes seconds { to { transform: rotate(" + secondsRotate + "deg); } }\n\n";
      newStyleInnerHTML += "#watch .seconds-hand {" +
                              "-webkit-animation: seconds 60s steps(60) 0s infinite;\n" +
                              "-moz-animation: seconds 60s steps(60) 0s infinite;\n" +
                              "animation: seconds 60s steps(60) 0s infinite;\n" +
                          "}\n\n";

      newStyle.innerHTML = newStyleInnerHTML;
      document.head.appendChild(newStyle);
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

        borderColor = BannerFlow.settings.borderColor;
        faceColor = BannerFlow.settings.faceColor;
        numberColor = BannerFlow.settings.numberColor;
        markMinuteColor = BannerFlow.settings.markMinuteColor;
        hourHandColor = BannerFlow.settings.hourHandColor;
        minuteHandColor = BannerFlow.settings.minuteHandColor;
        secondHandColor = BannerFlow.settings.secondHandColor;
        
      } else {
        borderColor = "#ff0000";
        faceColor = " rgba(30,247,130,1)";
        numberColor = "#000000";
        markMinuteColor = "#959595";
        hourHandColor = "#232425";
        minuteHandColor = "#343536";
        secondHandColor = "#c00c00";
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

    function onStart() {
      loadSettings();
      init();
    }

    function onResize() {
      init();
    }

    function resetParameter() {
      onStart();
    }

    function onTextChanged() {
      languageText = BannerFlow.text;
      onStart();
    }

    return {
      start: onStart,

      onResized: onResize,

      onSettingChanged: resetParameter,

      textChanged: onTextChanged
    };
})();

if(typeof BannerFlow == "undefined"){
  WatchWidget.start();
} else {
  BannerFlow.addEventListener(BannerFlow.INIT, function () {
    WatchWidget.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    WatchWidget.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    WatchWidget.onSettingChanged();
  });

  BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    WatchWidget.textChanged();
  });
}

