
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

function getImages(imageSetting, isOriginal){
    var images = [];

    if(imageSetting && imageSetting.length > 0)
        for(var i=0;i<imageSetting.length;i++){
            var imgArr = imageSetting[i].images
            if(isOriginal)
                images.push(imgArr[0].url); // get original image
            else
                images.push(imgArr[imgArr.length-1].url); //get smallest image
        }

    return images;
}


var SwingingBadge = (function(){

    var container = document.getElementById('widgetContainer');
    var badge = document.getElementById('badge');
    var badgeText = document.getElementById('badgeText');

    var containerWidth, containerHeight;

    var allTextLoadingsLiteral = [];

    /*--- settings from banner flow ---*/
    var badgeSize;
    var backgroundImage, backgroundColor, borderColor, borderThickness, textColor, textSize, fontFamily, swingingDuration, swingingAngle;
    var swingRopeLength, swingRopeColor, swingRopeThickness;

    var isRunning = false;
    var isStop = false;

    var styleClass = "style-inline";

    function createSwingAnimation() {

        var hasImage = backgroundImage && backgroundImage.length > 0;
        var hasFont = fontFamily && fontFamily.length > 0;

        // remove old styles
        var oldStyles = document.querySelectorAll('.' + styleClass);
        if(oldStyles && oldStyles.length > 0) {
            for(var i = 0; i < oldStyles.length; i++) {
                document.head.removeChild(oldStyles[i]);
            }
        }

        // Add new styles
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('class', styleClass);
        style.innerHTML = ".badges:after {" +
                            "height: " + (swingRopeLength + 2) + "px;" +
                            "top: -" + (swingRopeLength + 2 + borderThickness) + "px;" +
                            "background: " + swingRopeColor + ";"+
                            "left: " + (badgeSize/2 - swingRopeThickness/2 - borderThickness) + "px;" +
                            "width: " + swingRopeThickness + "px;" +

                        "}" + 

                        ".badges {" +
                            "width: " + badgeSize + "px;" + 
                            "height: " + badgeSize + "px;" +
                            "background-color: " + backgroundColor + ";" +
                            (hasImage ? "background-image: url('" + backgroundImage + "');" : "background-image: none;") +
                            "background-size: cover;" +
                            "background-repeat: no-repeat;"+
                            "background-position: center center;"+
                            "border-color: " + borderColor + ";" +
                            "border-width: " + borderThickness + "px;" +
                            "margin-top:" + swingRopeLength + "px;" +
                            "-webkit-transform-origin: 50% -" + swingRopeLength + "px;" +
                            "-moz-transform-origin: 50% -" + swingRopeLength + "px;" +
                            "-ms-transform-origin: 50% -" + swingRopeLength + "px;" +
                            "transform-origin: 50% -" + swingRopeLength + "px;" +
                        "}" + 

                        ".badge-content {" +
                            "color: " + textColor + ";" + 
                            "font-size: " + textSize + "px;" +
                            (hasFont ? "font-family:" + fontFamily +";": "") + 
                        "}" + 

                        "@-webkit-keyframes swing {" +
                            "0%{ -webkit-transform:rotate(" + swingingAngle + "deg); }" +
                            "50%{ -webkit-transform:rotate(-" + swingingAngle + "deg); }" +
                            "100%{ -webkit-transform:rotate(" + swingingAngle + "deg); }" +
                        "}" +
                        "@-moz-keyframes swing {" +
                            "0%{ -moz-transform:rotate(" + swingingAngle + "deg); }" +
                            "50%{ -moz-transform:rotate(-" + swingingAngle + "deg); }" +
                            "100%{ -moz-transform:rotate(" + swingingAngle + "deg); }" +
                        "}" +
                        "@-ms-keyframes swing {" +
                            "0%{ -ms-transform:rotate(" + swingingAngle + "deg); }" +
                            "50%{ -ms-transform:rotate(-" + swingingAngle + "deg); }" +
                            "100%{ -ms-transform:rotate(" + swingingAngle + "deg); }" +
                        "}" +
                        "@keyframes swing {" +
                            "0%{ transform:rotate(" + swingingAngle + "deg); }" +
                            "50%{ transform:rotate(-" + swingingAngle + "deg); }" +
                            "100%{ transform:rotate(" + swingingAngle + "deg); }" +
                        "}" + 
                        ".badge-text {" +
                            "text-align: center;" +
                        "}";

        document.head.appendChild(style);

        // Clear previous texts
        badgeText.innerHTML = "";

        // Insert new texts
        for(var i=0;i<allTextLoadingsLiteral.length;i++) {
            var div = document.createElement('div');
            div.setAttribute('class','badge-text');
            div.innerHTML = allTextLoadingsLiteral[i];

            badgeText.appendChild(div);
        }


        startSwingAnimation();
    }

    function startSwingAnimation(){
        badge.style.webkitAnimation = "swing " + swingingDuration + "s ease-in-out 0s infinite"
        badge.style.mozAnimation = "swing " + swingingDuration + "s ease-in-out 0s infinite"
        badge.style.msAnimation = "swing " + swingingDuration + "s ease-in-out 0s infinite"
        badge.style.animation = "swing " + swingingDuration + "s ease-in-out 0s infinite"
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
            createSwingAnimation();
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {
            
            var backgroundData = getImages(BannerFlow.settings.backgroundImage, true);
            backgroundImage = (backgroundData && backgroundData.length > 0) ? backgroundData[0] : "";
            
            badgeSize = BannerFlow.settings.badgeSize > 0 ? BannerFlow.settings.badgeSize : 150;
            backgroundColor = BannerFlow.settings.backgroundColor;
            borderColor = BannerFlow.settings.borderColor;
            borderThickness = BannerFlow.settings.borderThickness;
            textColor = BannerFlow.settings.textColor;
            textSize = BannerFlow.settings.textSize > 0 ? BannerFlow.settings.textSize : 12;
            fontFamily = BannerFlow.settings.fontFamily;
            swingingDuration = BannerFlow.settings.swingingDuration > 0 ? BannerFlow.settings.swingingDuration : 2;
            swingingAngle = BannerFlow.settings.swingingAngle;

            swingRopeLength = BannerFlow.settings.swingRopeLength > 0 ? BannerFlow.settings.swingRopeLength : 50;
            swingRopeColor = BannerFlow.settings.swingRopeColor;
            if(!swingRopeColor || swingRopeColor.length == 0)
                swingRopeColor = "#000";

            swingRopeThickness = BannerFlow.settings.swingRopeThickness > 0 ? BannerFlow.settings.swingRopeThickness : 1;

        } else {

            badgeSize = 150;
            backgroundImage = "./image.png";
            backgroundColor = "#00ff00";
            borderColor = "#0000ff";
            borderThickness = 2;
            textColor = "#fff";
            textSize = 18;
            fontFamily = "Arial";
            swingingDuration = 1;
            swingingAngle = 3;

            swingRopeLength = 50;
            swingRopeColor = "#ff0000";
            swingRopeThickness = 1;
        }

        fontFamily = getFont(fontFamily);
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

    function getLanguageText() {

        allTextLoadingsLiteral = [];

        var languageTexts;
        if(typeof BannerFlow !== "undefined")
            languageTexts = BannerFlow.text;
        else
            allTextLoadingsLiteral.push("Enter text ...");

        if(languageTexts && languageTexts.length > 0) {

            var arr = languageTexts.split(":");
            var length = arr.length;
            for(var i = 0; i < length; i++) {
                if(arr[i] && arr[i].length > 0) {
                    allTextLoadingsLiteral.push(arr[i]);
                }
            }

        }
    }

    return {
        start: onStarted,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    SwingingBadge.start();
} else {
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        SwingingBadge.start();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        SwingingBadge.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        SwingingBadge.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        SwingingBadge.start();
    });
}
