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

window.requestAnimationFrame = (function(){
    // return  window.requestAnimationFrame       ||
    //         window.webkitRequestAnimationFrame ||
    //         window.mozRequestAnimationFrame    ||
    //         window.oRequestAnimationFrame      ||
    //         window.msRequestAnimationFrame     ||
           return function (callback) {
              return window.setTimeout(callback, 1000 / 60);
            };
})();

/*============================================*/

var ColorSpin = (function(){

    var container = get('widgetContainer');
    var canvas = get('canvas');
    var ctx = canvas.getContext('2d');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    /*--- settings from banner flow ---*/
    var dotColor1, dotColor2, dotColor3, dotColor4, dotColor5;
    var dotSize;
    var spawnRate;
    var moveSpeed;
    var shrinkTime;

    var dots = [];
    var options = {};
    var colors = ['#F44336', ,'#2196F3', '#00BCD4', '#4CAF50', '#CDDC39'];

    var timeoutValue = 1000/60;
    var resizeDelta;

    var cc = 0;

    var timeoutRender;

    function render() {
      if(options.clear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      for(var i=0; i<options.spawnRate; i++) {
        options.rotation = options.rotation < 360 ? options.rotation + options.spawnRotationSpeed : options.rotation - 360 + options.spawnRotationSpeed;
        cc = cc < colors.length - 1 ? cc + 1 : 0;
        
        var dot = {
          rotation: options.rotation,
          x: canvas.width / 2,
          y: canvas.height / 2,
          size: options.size,
          color: colors[cc]
        };
        
        dots.push(dot);
      }

      var i =0;
      while(i< dots.length) {
        var d = {
          x: options.moveSpeed * Math.cos(dots[i].rotation * Math.PI / 180),
          y: options.moveSpeed * Math.sin(dots[i].rotation * Math.PI / 180)
        }
        
        dots[i].x += d.x;
        dots[i].y += d.y;

        dots[i].size -= resizeDelta;
        
        dots[i].rotation += options.dotRotationSpeed;
        
        if(dots[i].size < 0.5) {
          dots.splice(i, 1);
          continue;
        }
        
        ctx.fillStyle = dots[i].color;
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, dots[i].size, 0, 2 * Math.PI, false);
        ctx.fill();

        i++;
      }
    };

    function runAnimation() {
      if(isStop) {
        isRunning = false;
        if(timeoutRender)
          clearTimeout(timeoutRender);

        return;
      }

      render();
      timeoutRender = requestAnimationFrame(runAnimation)
    }

    function startWidget(currentSesssion) {

      canvas.setAttribute('width', containerWidth);
      canvas.setAttribute('height',  containerHeight);

      dots = [];

      options = {
        size: dotSize,
        spawnRate: spawnRate,
        rotation: 0,
        spawnRotationSpeed: 23,
        dotRotationSpeed: 0.2,
        moveSpeed: moveSpeed,
        shrinkTime: shrinkTime,
        clear: true
      };

      colors = [dotColor1, dotColor2, dotColor3, dotColor4, dotColor5];

      resizeDelta = options.size / (options.shrinkTime*1000 / timeoutValue);

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

          dotColor1 = BannerFlow.settings.dotColor1;
          dotColor2 = BannerFlow.settings.dotColor2;
          dotColor3 = BannerFlow.settings.dotColor3;
          dotColor4 = BannerFlow.settings.dotColor4;
          dotColor5 = BannerFlow.settings.dotColor5;

          dotSize = BannerFlow.settings.dotSize;
          if(dotSize == 0)
            dotSize = 10;

          spawnRate = BannerFlow.settings.spawnRate;
          if(spawnRate == 0)
            spawnRate = 3;

          moveSpeed = BannerFlow.settings.moveSpeed;
          if(moveSpeed == 0)
            moveSpeed = 3;

          shrinkTime = BannerFlow.settings.shrinkTime;
          if(shrinkTime == 0)
            shrinkTime = 2;

        } else {

          dotColor1 = '#F44336';
          dotColor2 = '#2196F3';
          dotColor3 = '#00BCD4';
          dotColor4 = '#4CAF50';
          dotColor5 = '#CDDC39';

          dotSize = 10;  
          spawnRate = 3;  
          moveSpeed = 3;
          shrinkTime = 2;  

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
      init();
    }


    function onResize(){
      onStart();
    }

    function resetParameter(){
      onStart();
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

      onResized: onResize,

      onSettingChanged: resetParameter
    };

})();

if(typeof BannerFlow == "undefined"){
    ColorSpin.start();
} else {
    BannerFlow.addEventListener(BannerFlow.INIT, function () {
        ColorSpin.start();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        ColorSpin.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        ColorSpin.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        ColorSpin.start();
    });
}

