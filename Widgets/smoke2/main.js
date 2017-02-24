
var SecondSmokeEffectWidget = (function() {

    function rgbaToObject(rgba) {
        rgba = rgba || "";
        colorsOnly = rgba.substring(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(/,\s*/);
        return {
            red: colorsOnly[0],
            green: colorsOnly[1],
            blue: colorsOnly[2],
            opacity: parseFloat(colorsOnly[3])
        };
    }

    var requestAnimationFrame = window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame || 
                                window.webkitRequestAnimationFrame || 
                                window.msRequestAnimationFrame || 
                                function(c) { setTimeout(c, 1000 / 60); };

    window.requestAnimationFrame = requestAnimationFrame;

    /*--- Widget starts here ---*/

    var container = document.getElementById('widgetContainer');
    var canvas = document.getElementById('widgetCanvas');
    var context = canvas.getContext('2d');
    var containerWidth, containerHeight;

    /*--- Settings ---*/

    var color, velocity, spawnTime;

    var imageWidth = 32, imageHeight = 32;
    var parts = [], lastTime, maxLifeTime, emitterX, emitterY, smokeImage;

    var loaded = false;
    var isColorChanged = false;

    var origImage = new Image();
    origImage.onload = function() { loaded = true; }
    origImage.src = document.getElementById("pattern").src;


    function Smoke(x, y) {
        this.x = x;
        this.y = y;

        this.size = 1;
        this.startSize = 32;
        this.endSize = 40;

        this.angle = Math.random() * 359;

        this.startLife = new Date().getTime();
        this.lifeTime = 0;

        this.velY = velocity*(-1 - Math.random());
        this.velX = Math.floor(Math.random() * (-8) + 4) / 4;
    }

    Smoke.prototype.update = function () {
        this.lifeTime = new Date().getTime() - this.startLife;

        var lifePerc = (this.lifeTime / maxLifeTime) * 100;

        this.size = this.startSize + ((this.endSize - this.startSize) * lifePerc * .1);

        this.alpha = 1 - (lifePerc * .01);
        this.alpha = Math.max(this.alpha, 0);

        this.x += this.velX;
        this.y += this.velY;
    }

    function spawn() {
        if (new Date().getTime() > lastTime + spawnTime) {
            lastTime = new Date().getTime();
            parts.push(new Smoke(emitterX, emitterY));
        }
    }

    function changeColor() {
        if(!loaded) {
            var timeout = setTimeout(function() {
                clearTimeout(timeout);
                changeColor();
            }, 200);

            return;
        }

        var tCanvas = document.createElement("canvas");
        var tCtx = tCanvas.getContext("2d");
      
        tCanvas.width = imageWidth;
        tCanvas.height = imageHeight;
        tCtx.drawImage(origImage, 0, 0, imageWidth, imageHeight);
        tCtx.globalCompositeOperation = "source-in";
        tCtx.fillStyle = color;
        tCtx.fillRect(0, 0, imageWidth, imageHeight);

        smokeImage = tCanvas;
        isColorChanged = true;
    }

    function configure() {
        
        canvas.height = containerHeight;
        canvas.width = containerWidth;

        lastTime = new Date().getTime();
        maxLifeTime = Math.min(5000, (canvas.height / (1.5 * 60) * 1000));
        emitterX = containerWidth / 2;
        emitterY = containerHeight + imageHeight;

        isColorChanged = false;

        changeColor();

    }


    var isStop = false;
    var isRunning = false;

    function playAnimation(currentSesssion) {

        if(!isColorChanged) { // make sure that the image is loaded and changed color
            var timeout = setTimeout(function() {
                clearTimeout(timeout);
                playAnimation(currentSesssion);
            }, 200);
            return;
        }

        if(isStop || currentSesssion != sessionId) {
            isRunning = false;
            return;
        }

        isRunning = true;

          
        var len = parts.length;
        context.clearRect(0, 0, canvas.width, canvas.height);

        while (len--) {
            if (parts[len].y < 0 || parts[len].lifeTime > maxLifeTime) {
                parts.splice(len, 1);
            } else {
                parts[len].update();

                var offsetX = parts[len].size / 2,
                    offsetY = parts[len].size / 2;

                context.save();
                context.translate(parts[len].x, parts[len].y);
                context.rotate(parts[len].angle / 180 * Math.PI);
                context.globalAlpha = parts[len].alpha;
                context.drawImage(smokeImage, -offsetX, -offsetY, parts[len].size, parts[len].size);
                context.restore();
            }
        }

        spawn();

        requestAnimationFrame(function(){
            playAnimation(currentSesssion);
        });

    }

    /*---- starting point of the widget ----*/

    var timeoutStart;
    var sessionId = 0;

    function init() {
        if(timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function() {
                startAnimation(++sessionId);
            }, 500);
        } else {
            timeoutStart = setTimeout(function(){
                startAnimation(++sessionId);
            }, 0);
        }
    }

    function startAnimation(currentSesssion) {
        stopCurrentAnimation(function(){
            containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
            containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

            if(!containerWidth || !containerHeight)
                return;

            reloadGlobalVariables();
            loadSettings();
            configure();
            playAnimation(currentSesssion);
        });
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

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {

            color       = BannerFlow.settings.color;
            velocity    = BannerFlow.settings.velocity;
            spawnTime    = BannerFlow.settings.spawnTime;
          
        } else {
          
            color       = "#ff0000";
            velocity    =  10;
            spawnTime = 100;

        }

        velocity  /= 100;

    }

    function reloadGlobalVariables() {

        containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
        containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

    }



    /*-------------------------------*/

    var isStartAnimation = false;

    function onStarted() {
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
          return;
      }

      isStartAnimation = true;
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
        onStarted: onStarted,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if (typeof BannerFlow == 'undefined') {
    SecondSmokeEffectWidget.onStarted();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        SecondSmokeEffectWidget.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        SecondSmokeEffectWidget.onSettingChanged();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        SecondSmokeEffectWidget.onStarted();
    });
}

