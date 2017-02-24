

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
}

function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
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

var HandWriting = (function(){

    var container = get('widgetContainer');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var canvas = get("canvas");
    var ctx = canvas.getContext('2d');

    var lineTexts = new Array();

    var removeTags = ["s","u","i","b"];

    /*--- settings from banner flow ---*/
    var text, speed, font, fontSize, color;

    var dashLen = 220, dashOffset = dashLen, x = 0, y = 0, indexText = 0, indexLine = 0;

    function loopAnimation() {
      
      if(isStop) {
        isRunning = false;
        return;
      }

      isRunning = true;

      if(!text || text.length == 0) {
        nextLine();
      } else {
        ctx.clearRect(x, y, 60, 200);
        ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]);
        dashOffset -= speed;
        ctx.strokeText(text[indexText], x, y);

        if (dashOffset > 0) requestAnimationFrame(loopAnimation);
        else {
          ctx.fillText(text[indexText], x, y);
          dashOffset = dashLen;
          x += ctx.measureText(text[indexText++]).width + ctx.lineWidth;
          if(indexText < text.length && text[indexText] === ' ') {
            x += ctx.measureText(text[indexText++]).width + ctx.lineWidth
          }

          if (indexText < text.length)
            requestAnimationFrame(loopAnimation);
          else {
            nextLine();
          }
        }
      }
    }

    function nextLine() {      
      if(indexLine < lineTexts.length) {
        indexText = 0;
        x = 0;
        y = fontSize * 5/4 * indexLine;
        text = lineTexts[indexLine++];

        loopAnimation();
      } else {
        isRunning = false;
      }
    }

    function startWidget(currentSesssion) {

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      dashOffset = dashLen;
      indexText = 0;
      indexLine = 0;
      x = 0;
      y = 0;
      text = "";

      if(!lineTexts || lineTexts.length == 0)
        return;

      ctx.font = fontSize + "px " + font;
      ctx.textBaseline = "top";
      ctx.lineWidth = 1; 
      ctx.lineJoin = "round";
      ctx.strokeStyle = ctx.fillStyle = color;

      loopAnimation();
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

        color = BannerFlow.settings.color;
        speed = BannerFlow.settings.speed;
        if(speed <= 0)
          speed = 1;
        font = BannerFlow.settings.font;
        fontSize = BannerFlow.settings.fontSize;
        if(fontSize <= 0)
          fontSize = 30;

      } else {

        color = "#000";
        speed = 5;
        font = "Arial";
        fontSize = 45;
        // text = "Amazing Text Animation";
        text = "<div><b><i><u><s>Amazing Text</s></u></i></b></div><div>the second line</div><div>the third line</div>";

        var patt;
        for(var i=0;i<removeTags.length;i++) {
          var patt = new RegExp("</?" + removeTags[i] + ">", "g");
          text = text.replace(patt, "");
        }

        lineTexts = new Array();
        patt = new RegExp("<div>([^<.]*)</div>", "g");
        var m;

        lineTexts = new Array();
        while(m = patt.exec(text)) {
          lineTexts.push(m[1]);
        }

        if(lineTexts.length == 0)
          lineTexts.push(text);

      }

      font = getFont(font);
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

        var patt;
        for(var i=0;i<removeTags.length;i++) {
          var patt = new RegExp("</?" + removeTags[i] + ">", "g");
          text = text.replace(patt, "");
        }

        lineTexts = new Array();
        patt = new RegExp("<div>([^<.]*)</div>", "g");
        var m;

        lineTexts = new Array();
        while(m = patt.exec(text)) {
          lineTexts.push(m[1]);
        }

        if(lineTexts.length == 0)
          lineTexts.push(text);
      }
    }

    // var isStartAnimation = false;

    function onStarted() {
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

      start: onStarted,

      onResized: onResized,

      onSettingChanged: onSettingChanged

    };
})();

if(typeof BannerFlow == "undefined"){
  HandWriting.start();
} else {
  BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
    HandWriting.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    HandWriting.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    HandWriting.onSettingChanged();
  });

  BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    HandWriting.start();
  });
}

