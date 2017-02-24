

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


var SpeechBubble = (function(){

    var container = document.getElementById('widgetContainer');
    var bubble = document.getElementById('bubbleContainer');

    var containerWidth, containerHeight;

    /*--- settings from banner flow ---*/

    var bubbleText, bubbleBackgroundColor, bubbleShadowColor, textColor;
    var borderWidth;
    var position;
    var style;
    var font;
    var enableTextShadow;

    var allPositions = [{
            position: "Top left",
            class: "top-left"
        }, {
            position: "Top",
            class: "top"
        }, {
            position: "Top right",
            class: "top-right"
        }, {
            position: "Right",
            class: "right"
        }, {
            position: "Bottom right",
            class: "bottom-right"
        }, {
            position: "Bottom",
            class: "bottom"
        }, {
            position: "Bottom left",
            class: "bottom-left"
        }, {
            position: "Left",
            class: "left"
        }
    ];

    //"3D","Wow","Surround"
    var allStyles = [{
            style: "3D",
            class: "three-d",
            hasBorder: true,
            hasShadow: false
        }, {
            style: "Wow",
            class: "wow",
            hasBorder: false,
            hasShadow: false
        }, {
            style: "Surround",
            class: "surround",
            hasBorder: false,
            hasShadow: true
        }
    ];

    var isRunning = false;
    var isStop = false;

    var bubbleClasses = [];

    function setStyleFor3D(className){
        var strHTML = "";
        strHTML += "." + className + "{" +
                            "border-color:" + bubbleShadowColor + ";" +
                        "}\n";

        strHTML += "." + className + ":before{" +
                            "border-color:" + bubbleShadowColor + ";" + 
                        "}\n";
        strHTML += "." + className + ":after{" +
                            "border-color:" + bubbleBackgroundColor + ";" + 
                        "}\n";

        return strHTML;
    }

    function setStyleForWow(className) {
        var strHTML = "";
        strHTML += "." + className + ":before{" +
                            "border-color:" + bubbleBackgroundColor + ";" + 
                        "}\n";

        return strHTML;
    }

    function setStyleForSurround(className) {
        var strHTML = "";
        strHTML += "." + className + ":before{" +
                            "-webkit-box-shadow: inset 0 0 0 " + borderWidth + "px " + bubbleShadowColor + ";" +
                            "-moz-box-shadow: inset 0 0 0 " + borderWidth + "px " + bubbleShadowColor + ";" +
                            "-ms-box-shadow: inset 0 0 0 " + borderWidth + "px " + bubbleShadowColor + ";" +
                            "box-shadow: inset 0 0 0 " + borderWidth + "px " + bubbleShadowColor + ";" +

                            "top: -" + borderWidth + "px;" +
                            "left: -" + borderWidth + "px;" +
                            "right: -" + borderWidth + "px;" +
                            "bottom: -" + borderWidth + "px;" +
                        "}\n";

        strHTML += "." + className + ":after{" +
                            "border-color:" + bubbleBackgroundColor + ";" + 
                        "}\n";

        return strHTML;
    }



    function createBubble() {

        if(font && font.length > 0) {
            container.style.fontFamily = font;
        }

        bubbleClasses = ["common-bubble"];
        // Add style for the bubble
        var inlineStyle = document.createElement('style');
        inlineStyle.setAttribute("type", "text/css");
        var styleInnerHtml = "";

        // for All
        styleInnerHtml += ".common-bubble{" +
                                "background-color:" + bubbleBackgroundColor + ";" + 
                                "color:" + textColor + ";" + 
                                (!enableTextShadow ? "text-shadow: none;" : "text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);") +
                            "}\n";

        for(var i=0;i<allStyles.length;i++) {
            if(allStyles[i].style.toLowerCase() === style.toLowerCase()) {
                bubbleClasses.push(allStyles[i].class);
            }

            if(allStyles[i].hasBorder) { // for 3D
                styleInnerHtml += setStyleFor3D(allStyles[i].class);
            }

            if(allStyles[i].hasShadow) { // for Surround
                styleInnerHtml += setStyleForSurround(allStyles[i].class);
            }

            if(!allStyles[i].hasBorder && !allStyles[i].hasShadow) { // for Wow
                styleInnerHtml += setStyleForWow(allStyles[i].class);
            }
        }

        for(var i=0;i<allPositions.length;i++) {
            if(allPositions[i].position.toLowerCase() === position.toLowerCase()) {
                bubbleClasses.push(allPositions[i].class);
            }
        }


        inlineStyle.innerHTML = styleInnerHtml;
        document.head.appendChild(inlineStyle);
        
        bubble.setAttribute("class", bubbleClasses.join(" "));

        // Add text for bubble
        bubble.innerHTML = bubbleText;

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
            createBubble();
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {
            
            bubbleBackgroundColor = BannerFlow.settings.bubbleBackgroundColor;
            bubbleShadowColor = BannerFlow.settings.bubbleShadowColor;
            textColor = BannerFlow.settings.textColor;
            borderWidth = BannerFlow.settings.borderWidth;
            enableTextShadow = BannerFlow.settings.enableTextShadow;

            position = BannerFlow.settings.position;
            style = BannerFlow.settings.style;

            font = BannerFlow.settings.font;
        } else {
            bubbleBackgroundColor = "#99B15B";
            bubbleShadowColor = "#7e9346";
            textColor = "#6f823e";
            borderWidth = 5;
            enableTextShadow = true;

            position = "Top left";
            style = "Surround";

            font = "Arial";
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

    var isStartAnimation = false;

    function onStarted() {
        if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
            return;
        }

        isStartAnimation = true;
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

        if(typeof BannerFlow !== "undefined")
            bubbleText = BannerFlow.text;

        if(!bubbleText || bubbleText.length == 0) {
            bubbleText = "Enter text ...";
        }
    }

    return {
        start: onStarted,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    SpeechBubble.start();
} else {
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        SpeechBubble.start();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        SpeechBubble.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        SpeechBubble.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        SpeechBubble.start();
    });
}
