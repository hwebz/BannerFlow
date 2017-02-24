
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}


var SmokeEffectWidget = (function(){

    var container = document.getElementById('smokeEffectContainer');
    var containerWidth, containerHeight;
    
    var Blip, blips, canvas, ch, clear, ctx, cw, divider, pi2;
    var rand, run;
    var color;
    var numberBlip;
    var speed;

    canvas = document.getElementById('canvas');

    ctx = canvas.getContext('2d');

    divider = 1.2;

    pi2 = Math.PI * 2;

    blips = [];

    var timeoutAnimation;
    var isStop = false;
    var isRunning = false;

    rand = function(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    };

    window.requestAnimationFrame = function(callback, element) {
        return window.setTimeout(function() {
            return callback(new Date());
        }, 1000 / (10 * speed));
    };

    Blip = function(x, y) {
        this.x = x;
        this.y = y;
        this.r = .1;
        this.rGrowthBase = 1;
        this.rGrowth = 1;
        var isSquare = (cw - 20 <= ch && ch <= cw + 20) || (ch - 20 <= cw && cw <= ch + 20);
        this.rMax = (cw + ch)/(isSquare ? 6 : 7.5);
        this.alpha = 1;
    };

    Blip.prototype.update = function() {
        var percent = (this.rMax - this.r) / this.rMax;
        this.rGrowth = .1 + this.rGrowthBase * percent;
        this.r += this.rGrowth;
        this.alpha = percent;
        if (this.r > this.rMax) {
            return false;
        }

        return true;
    };

    Blip.prototype.render = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, pi2, false);

        ctx.fillStyle = 'hsla('+(color[0]*360)+', '+(color[1]*100)+'%, 1%, ' + this.alpha + ')';
        ctx.fill();
    };

    clear = function() {

        ctx.globalCompositeOperation = 'destination-out';
        //ctx.fillStyle = 'hsla(0, 0%, 0%, .05)';
        ctx.fillStyle = 'rgba(255,0,0, 0.1)';
        ctx.fillRect(0, 0, cw, ch);

        ctx.globalCompositeOperation = 'lighter';

    };

    run = function() {
        if(isStop) {
            isRunning = false;
            blips = [];
            if(timeoutAnimation){
                clearTimeout(timeoutAnimation);
                timeoutAnimation = null;
            }

            return;
        }

        isRunning = true;

        var i;
        timeoutAnimation = window.requestAnimationFrame(run);
        clear();
        i = blips.length;
        while (i--) {
            if(!blips[i].update()) {
                blips.splice(i, 1);
            }
        }
        i = blips.length;
        while (i--) {
            blips[i].render();
        }

        if(blips.length < numberBlip){
            blips.push(new Blip(rand(0, cw), rand(0, ch)));
        }
    };


    /*==============================================*/
    /*===== Start point of animation  =====*/
    /*==============================================*/

    function reloadGlobalVariables() {

        containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
        containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

        cw = canvas.width = containerWidth / divider;
        ch = canvas.height = containerHeight / divider;

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

    function startAnimation() {
        stopCurrentAnimation(function(){
            run();
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined"){

            numberBlip = BannerFlow.settings.maxNumberBlip > 0 ? BannerFlow.settings.maxNumberBlip : 400;
            speed = BannerFlow.settings.speed > 0 ? BannerFlow.settings.speed : 6;

            color = BannerFlow.settings.color;
            color = color.substring("rgba(".length);
            color = color.substring(0, color.length-1);
            var arrColor = color.split(',');
            color = rgbToHsl(arrColor[0], arrColor[1], arrColor[2]);

        } else {
            numberBlip = 400;
            speed = 6;

            //color = "rgba(190, 195, 196, 1)";
            color = "rgba(242, 242, 194, 1)";
            color = color.substring("rgba(".length);
            color = color.substring(0, color.length-1);
            var arrColor = color.split(',');
            color = rgbToHsl(arrColor[0], arrColor[1], arrColor[2]);
        }

    }

    /*====================================================*/  

    var timeoutStart;

    function init() {
        if(timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function() {
                loadSettings();
                reloadGlobalVariables();
                startAnimation();
            }, 500);
        } else {
            timeoutStart = setTimeout(function(){
                loadSettings();
                reloadGlobalVariables();
                startAnimation();
            }, 0);
        }
    }


    function onStart() {
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
    SmokeEffectWidget.start();
} else {
    BannerFlow.addEventListener(BannerFlow.INIT, function () {
        SmokeEffectWidget.start();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        SmokeEffectWidget.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        SmokeEffectWidget.onSettingChanged();
    });
}
