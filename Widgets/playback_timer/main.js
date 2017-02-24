function get(el) {
    if(typeof el === "string") 
        return document.getElementById(el);
    return el;
}

var request = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(cb) {
    return setTimeout(cb, 1000/60)
};

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


var PlaybackTimer = (function(){

    var container = get('widgetContainer');
    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var svg;
    var percent;
    var isCircle = false;
    var arrPaths = new Array();
    var maxSize = 6;

    /*--- setting from banner flow ---*/
    var color, trailColor, size, trailSize, shape, isShowPercent, duration;
    var percentFont, percentColor, percentFontSize;

    function createPathOfLine(width, height) {

        var halfHeight = parseInt(height/2);
        
        return "M 0 " + halfHeight + " l " + width + " 0";
    }

    function calculateRadiusOfCenterCircle(width, height, size) {
        if(size % 2 != 0) {
            size += 9;
        } else {
            size += 10;
        }

        if(height %2 != 0) height--;    
        if(width %2 != 0) width--;

        var halfSize = parseInt(size/2);
        var min = width;
        if(min > height)
            min = height;
        
        return parseInt(min/2) - halfSize;
    }

    function createPathOfCircle(width, height, radius){
        var path = "M " + width/2 + "," + height/2 + " m 0,-" + radius + " a " + radius + "," + radius + " 0 1 1 0," + (2*radius);
        path += " a " + radius + "," + radius + " 0 1 1 0,-" + (2*radius);
        
        return path;
    }

    function createLoadingSvg() {
        // Reset
        isCircle = shape.toLowerCase() === "circle";
        arrPaths = new Array();
        container.innerHTML = "";

        // Create svg
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id","svgLoading");
        svg.setAttribute("viewBox","0 0 " + containerWidth + ' ' + containerHeight);

        var arrLoadingPaths = new Array();
        var pathLoading = createPathOfLine(containerWidth, containerHeight);

        var centerRadius = calculateRadiusOfCenterCircle(containerWidth, containerHeight, size);
        if(isCircle) {
            pathLoading = createPathOfCircle(containerWidth, containerHeight, centerRadius);
        }

        var loadingTrail = document.createElementNS("http://www.w3.org/2000/svg", "path");
        loadingTrail.setAttribute("fill-opacity", '0');
        loadingTrail.setAttribute("stroke-width", trailSize);
        loadingTrail.setAttribute("stroke", trailColor);
        loadingTrail.setAttribute("d", pathLoading);

        var loading = document.createElementNS("http://www.w3.org/2000/svg", "path");
        loading.setAttribute("fill-opacity", "0");
        loading.setAttribute("stroke", color);
        if(!isCircle || size <= maxSize) {
            loading.setAttribute("stroke-width", size);
            loading.setAttribute("d", pathLoading);
            arrPaths.push(loading);
        } else {
            var halfSize = parseInt(size/2);
            var isOdd = size % 2 != 0;
            var pathLoading2;
            for(var i=0;i<halfSize;i++){
                pathLoading = createPathOfCircle(containerWidth, containerHeight, centerRadius > i ? centerRadius - i : 0);
                loading = document.createElementNS("http://www.w3.org/2000/svg", "path");
                loading.setAttribute("fill-opacity", "0");
                loading.setAttribute("stroke", color);
                loading.setAttribute("stroke-width", i > 0 ? 2 : 1);
                loading.setAttribute("d", pathLoading);
                arrPaths.push(loading);

                if(i > 0) {
                    if(i < halfSize - 1 || isOdd) {
                        pathLoading2 = createPathOfCircle(containerWidth, containerHeight, centerRadius + i);
                        loading = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        loading.setAttribute("fill-opacity", "0");
                        loading.setAttribute("stroke", color);
                        loading.setAttribute("stroke-width", 2);
                        loading.setAttribute("d", pathLoading2);
                        arrPaths.push(loading);
                    }
                }

            }
        }

        svg.appendChild(loadingTrail);
        for(var i=0;i<arrPaths.length;i++) {
            svg.appendChild(arrPaths[i]);
        }

        container.appendChild(svg);

        // Create text of percent
        percent = document.createElement('span');
        percent.setAttribute('class', 'percent-text');
        percent.style.color = percentColor;
        percent.style.fontFamily = percentFont;
        percent.style.fontSize = percentFontSize + 'px';
        percent.innerHTML = '0%';

        if(shape.toLowerCase() === "line") {
            percent.style.right = "10px";
            percent.style.marginTop =  (size + 10) + "px";
        } else {
            percent.style.left = "50%";
            percent.style.webkitTransform = "translate(-50%,-50%)";
            percent.style.mozTransform = "translate(-50%,-50%)";
            percent.style.msTransform = "translate(-50%,-50%)";
            percent.style.transform = "translate(-50%,-50%)";
        }

        container.appendChild(percent);

        startLoadingAnimation();
    }

    function startLoadingAnimation() {
        var arrLengths = new Array();
        for(var i=0;i<arrPaths.length;i++) {
            var length = arrPaths[i].getTotalLength();
            arrLengths.push(length);

            arrPaths[i].style.strokeDasharray = length + ' ' + length;
            arrPaths[i].style.strokeDashoffset = length;
        }

        duration *= 1000;
        var lastTime = new Date().getTime();

        svg.style.opacity = 1;

        if(isShowPercent)
            percent.style.opacity = 1;

        var updateLoadingPosition = function() {
            if(isStop) {
                isRunning = false;
                return;
            }

            isRunning = true;

            var now = new Date().getTime();

            if(now - lastTime >= duration) {
                for(var i=0;i<arrPaths.length;i++) {
                    arrPaths[i].style.strokeDashoffset = 0;
                }
                percent.innerHTML = '100%';
                isRunning = false;
            } else {
                for(var i=0;i<arrPaths.length;i++) {
                    arrPaths[i].style.strokeDashoffset = arrLengths[i] - (now - lastTime)/duration * arrLengths[i];
                }
                percent.innerHTML = parseInt((now - lastTime)/duration * 100) + '%';
                
                request(updateLoadingPosition);
            }
        };

        updateLoadingPosition();
        // path.style.strokeDashoffset = 0;

        // // Clear any previous transition
        // path.style.transition = path.style.WebkitTransition = 'none';

        // // Trigger a layout so styles are calculated & the browser
        // // picks up the starting position before animating
        // path.getBoundingClientRect();  // TRICKY

        // // Define our transition
        // path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 5s ease-in-out';

        // Go!
        // svg.style.opacity = 1;
        // path.style.strokeDashoffset = '0';
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
        stopCurrentAnimation(function() {
            createLoadingSvg();
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {

            color = BannerFlow.settings.color;
            trailColor = BannerFlow.settings.trailColor;
            size = BannerFlow.settings.size;
            trailSize = BannerFlow.settings.trailSize;
            shape = BannerFlow.settings.shape;
            isShowPercent = BannerFlow.settings.isShowPercent;
            duration = BannerFlow.settings.duration;

            percentFont = BannerFlow.settings.percentFont;
            percentColor = BannerFlow.settings.percentColor;
            percentFontSize = BannerFlow.settings.percentFontSize;

        } else {

            color = "#DE3C62";
            trailColor = "#B3AFB0";
            size = 10;
            trailSize = 1;
            shape = "Line";
            isShowPercent = true;
            duration = 2;

            percentFont = "Arial";
            percentColor = "#B3AFB0";
            percentFontSize = 12;

        }

        percentFont = getFont(percentFont);
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

    function onStarted() {
      // if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
      //     return;
      // }

      // isStartAnimation = true;
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
    PlaybackTimer.start();
} else {
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        PlaybackTimer.start();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        PlaybackTimer.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        PlaybackTimer.onSettingChanged();
    });
}
