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

function preProcessLanguageText(text) {
  text = text || "";

  var removeTags = ["s","u","i","b"];
  var patt;

  for(var i=0;i<removeTags.length;i++) {
    var patt = new RegExp("</?" + removeTags[i] + ">", "g");
    text = text.replace(patt, "");
  }

  var lineTexts = new Array();
  patt = new RegExp("<div>([^<]*)</div>", "g");
  var m;

  lineTexts = new Array();
  while(m = patt.exec(text)) {
    lineTexts.push(m[1]);
  }

  if(lineTexts.length == 0)
    lineTexts.push(text);

  return lineTexts;
}

function getFont(family) {
  family        = (family || "").replace(/[^A-Za-z]/g, '').toLowerCase();   
  var sans      = 'Helvetica, Arial, "Microsoft YaHei New", "Microsoft Yahei", "微软雅黑", 宋体, SimSun, STXihei, "华文细黑", sans-serif';
  var serif     = 'Georgia, "Times New Roman", "FangSong", "仿宋", STFangSong, "华文仿宋", serif';
  var fonts     = {
      helvetica : sans,
      verdana   : "Verdana, Geneva," + sans,
      lucida    : "Lucida Sans Unicode, Lucida Grande," + sans,
      tahoma    : "Tahoma, Geneva," + sans,
      trebuchet : "Trebuchet MS," + sans,
      impact    : "Impact, Charcoal, Arial Black," + sans,
      comicsans : "Comic Sans MS, Comic Sans, cursive," + sans,
      georgia   : serif,
      palatino  : "Palatino Linotype, Book Antiqua, Palatino," + serif,
      times     : "Times New Roman, Times," + serif,
      courier   : "Courier New, Courier, monospace, Times," + serif
  }
  var font      = fonts[family] || fonts.helvetica;
  return font;
}

/*============================================*/

var RotatingWords = (function(){

    var container = get('widgetContainer');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var isTesting = true;

    /*--- settings from banner flow ---*/
    var text;
    var font, textColor, textSize, duration, rotateDirection, background, isLoop, delay, verticalPadding, horizonalPadding;

    var ROTATE_DOWN  = "Rotate down";
    var ROTATE_UP    = "Rotate up";
    var ROTATE_LEFT  = "Rotate left";
    var ROTATE_RIGHT = "Rotate right";

    var currentText = get('currentText');
    var nextText    = get('nextText');
    var textWrapper = get('textWrapper');

    /*--- animation will start here ---*/

    var widthText, heightText;
    var currentIndex = -1;

    var animationEvents = ["webkitTransitionEnd", "transitionend", "msTransitionEnd"];

    function startWidget(currentSesssion) {
      if(typeof(text) == "string")
        text = preProcessLanguageText(text);

      widthText = getMaxWidth(text) + 2 + horizonalPadding * 2;
      heightText = textSize + 4 + verticalPadding * 2;

      setStyleForText(widthText, heightText);

      if(text && text.length > 0) {
        currentText.innerHTML = text[0];
        currentIndex = 0;

        if(text.length > 1){
          nextText.innerHTML =  text[1];
          currentIndex = 1;

          setTransition(duration);

          var timeoutDelay = setTimeout(function() {
            clearTimeout(timeoutDelay);
            run();
          }, delay);
        }
      }
    }

    function run() {
      if(isStop) {
        isRunning = false;
        return;
      }

      isRunning = true;

      var isCurrentTextEnd = false;
      var isNextTextEnd = false;

      var nextLoop = function() {
        if(!isCurrentTextEnd || !isNextTextEnd)
          return;

        setTransition(0);
        currentText.getBoundingClientRect();
        nextText.getBoundingClientRect();

        currentText.innerHTML = text[currentIndex];
        setStyleCss3(currentText, "transform", "translate(0, 0)");
        setStyleCss3(nextText, "transform", "translate(0, 0)");
        currentText.getBoundingClientRect();
        nextText.getBoundingClientRect();

        currentIndex++;
          
        if(isLoop && currentIndex >= text.length) {
          currentIndex = 0;
        }

        if(currentIndex < text.length) {
          nextText.innerHTML = text[currentIndex];
          setTransition(duration);

          currentText.getBoundingClientRect();
          nextText.getBoundingClientRect();

          var timeoutDelay = setTimeout(function() {
            clearTimeout(timeoutDelay);
            run();
          }, delay);
        } else {
          isRunning = false;
        }
      }

      registerTransitionEnd(currentText, function(){
        isCurrentTextEnd = true;
        nextLoop();
      });

      registerTransitionEnd(nextText, function(){
        isNextTextEnd = true;
        nextLoop();
      });

      animateText();
    }

    function animateText() {
      switch(rotateDirection.toLowerCase()) {
        case ROTATE_DOWN.toLowerCase():
          setStyleCss3(currentText, "transform", "translate(0, 100%)");
          setStyleCss3(nextText, "transform", "translate(0, 100%)");
          break;
        case ROTATE_RIGHT.toLowerCase():
          setStyleCss3(currentText, "transform", "translate(100%, 0)");
          setStyleCss3(nextText, "transform", "translate(100%, 0)");
          break;
        case ROTATE_LEFT.toLowerCase():
          setStyleCss3(currentText, "transform", "translate(-100%, 0)");
          setStyleCss3(nextText, "transform", "translate(-100%, 0)");
          break;
        default: // default is rotating up
          setStyleCss3(currentText, "transform", "translate(0, -100%)");
          setStyleCss3(nextText, "transform", "translate(0, -100%)");
      }
    }

    function registerTransitionEnd(element, callback) {
      var isEndTransition = false;

      var callbackTransitionEndCurrentText = function() {
          if(isEndTransition)
              return;
          isEndTransition = true;

          if(this.removeEventListener) {
              for(var i = 0; i < animationEvents.length; i++) {
                  this.removeEventListener(animationEvents[i], callbackTransitionEndCurrentText, false);
              }
          } else if(this.detachEvent) {
              for(var i = 0; i < animationEvents.length; i++) {
                  this.detachEvent(animationEvents[i], callbackTransitionEndCurrentText, false);
              }
          }

          if(callback)
            callback();
      };

      if(element.addEventListener) {
          for(var i = 0; i < animationEvents.length; i++) {
              element.addEventListener(animationEvents[i], callbackTransitionEndCurrentText, false);
          }
      } else if(element.attachEvent) {
          for(var i = 0; i < animationEvents.length; i++) {
              element.attachEvent(animationEvents[i], callbackTransitionEndCurrentText, false);
          }
      }
    }

    function setTransition(duration) {
      currentText.style.webkitTransition = "-webkit-transform " + duration + "ms ease-in-out";
      currentText.style.mozTransition    = "-moz-transform " + duration + "ms ease-in-out";
      currentText.style.msTransition     = "-ms-transform " + duration + "ms ease-in-out";
      currentText.style.transition       = "transform " + duration + "ms ease-in-out";

      nextText.style.webkitTransition = "-webkit-transform " + duration + "ms ease-in-out";
      nextText.style.mozTransition    = "-moz-transform " + duration + "ms ease-in-out";
      nextText.style.msTransition     = "-ms-transform " + duration + "ms ease-in-out";
      nextText.style.transition       = "transform " + duration + "ms ease-in-out";
    }

    function setStyleForText(width, height) {
      textWrapper.style.fontSize   = textSize + "px";
      textWrapper.style.fontFamily = font;
      textWrapper.style.color      = textColor;
      textWrapper.style.textAlign  = "left";
      textWrapper.style.lineHeight = height + "px";
      textWrapper.style.backgroundColor = background;
      textWrapper.style.width  = width + "px";
      textWrapper.style.height = height + "px";

      currentText.style.width  = width + "px";
      currentText.style.height = height + "px";
      currentText.style.fontFamily   = "inherit";
      currentText.style.fontSize     = "inherit";
      currentText.style.padding = "0px " + horizonalPadding + "px";

      nextText.style.width  = width + "px";
      nextText.style.height = height + "px";
      nextText.style.fontFamily   = "inherit";
      nextText.style.fontSize     = "inherit";
      nextText.style.padding = "0px " + horizonalPadding + "px";

      switch(rotateDirection.toLowerCase()) {
        case ROTATE_DOWN.toLowerCase():
          nextText.style.left = "0px";
          nextText.style.top  = "-100%";
          break;
        case ROTATE_RIGHT.toLowerCase():
          nextText.style.left = "-100%";
          nextText.style.top  = "0px";
          break;
        case ROTATE_LEFT.toLowerCase():
          nextText.style.left = "100%";
          nextText.style.top  = "0";
          break;
        default: // default is rotating up
          nextText.style.left = "0px";
          nextText.style.top  = "100%";
      }
    }

    function getMaxWidth(languageTexts) {

      if(!languageTexts || languageTexts == 0)
        return 0;

      var idTemptDiv = "divTempt";
      var idTempSpan = "spanTempt";

      // Create temp div to calculate the biggest text in options
      var divTempt = document.createElement('div');
      divTempt.setAttribute('id', idTemptDiv);
      divTempt.style.display = "block";
      divTempt.style.width = "1000px";
      divTempt.style.visibility = "hidden";

      var spanTempt = document.createElement('span');
      spanTempt.setAttribute('id', idTempSpan);
      spanTempt.style.fontFamily = font;
      spanTempt.style.fontSize = textSize + "px";
      spanTempt.style.display = "inline-block";

      divTempt.appendChild(spanTempt);
      document.body.appendChild(divTempt);

      var maxWidth = 0;

      for(var i=0; i<languageTexts.length; i++) {
          spanTempt.innerHTML = languageTexts[i];
          spanTempt.getBoundingClientRect();
          var textWidth =  parseInt(window.getComputedStyle(spanTempt).getPropertyValue('width'));

          if(textWidth > maxWidth)
            maxWidth = textWidth;
      }

      // Remove temp div
      document.body.removeChild(divTempt);

      return maxWidth;

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
          font      = BannerFlow.settings.font;
          textColor = BannerFlow.settings.textColor;
          textSize  = BannerFlow.settings.textSize;
          duration  = BannerFlow.settings.duration;
          rotateDirection = BannerFlow.settings.rotateDirection;
          background = BannerFlow.settings.background;
          isLoop    = BannerFlow.settings.isLoop;
          delay     = BannerFlow.settings.delay;
          verticalPadding = BannerFlow.settings.verticalPadding;
          horizonalPadding = BannerFlow.settings.horizonalPadding;
        } else {
          font      = "";
          textColor = "#000000";
          textSize  = 20;
          duration  = 1;
          rotateDirection = ROTATE_RIGHT;
          background = "#00ff00";
          isLoop    = true;
          delay     = 1;
          verticalPadding = 20;
          horizonalPadding = 50;
        }

        duration = duration * 1000 / 2;
        delay    = delay * 1000 / 2;
        font     = getFont(font);

    }

    function getLanguageText() {
        if(typeof BannerFlow !== "undefined"){
          text = BannerFlow.text;
        }
        if(isTesting) {
          text = "<div>Banner</div><div>Flow</div><div>This is a demo</div><div>try to testing this widget</div><div>Finish</div>";
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

    
    // var isStartAnimation = false;

    function onStart() {
      // if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
      //     return;
      // }

      // isStartAnimation = true;
      getLanguageText();
      init();
    }


    function onResized(){
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
          return;
      }

      init();
    }

    function onSettingChanged(){
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
          return;
      }

      init();
    }

    return {
        start: onStart,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    RotatingWords.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        RotatingWords.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        RotatingWords.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        RotatingWords.start();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        RotatingWords.start();
    });
}

