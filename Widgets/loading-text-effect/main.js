
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

var LoadingTextWidget = (function(){

    var container = document.getElementById('widgetContainer');
    var wrapper = document.getElementById('wrapper');
    var background = document.getElementById('background');
    var loadingContainer = document.getElementById('loadingContainer');
    var containerWidth, containerHeight;

    var animationKeyframeEvents = ["webkitAnimationEnd", "animationend", "MSAnimationEnd"];

    var allTextLoadingsLiteral = [];
    var allTextLoadingsObj = [];

    var isRunning = false;
    var isStop = false;

    var ANIMATION_DURATION = 3400;
    var DEFAULT_WIDTH_LOADING = 150;

    var timeoutNext, indexNext = 0;

    var textColor = "#000";
    var fontSize = 30;
    var fontFamily;

    var isLoop = true;

    var numberText = 0;

    function LoadingText(text, container) {
        this.text = text;
        this.class = ['hidden-text'];

        this.div = document.createElement('div');
        this.div.setAttribute('class', this.class.join(' '));
        this.div.innerHTML = text;
        if(container) {
            container.appendChild(this.div);
        } else {
            document.body.appendChild(this.div);
        }
        this.div.style.width = window.getComputedStyle(this.div).getPropertyValue('width');

        if(!container) {
            document.body.removeChild(this.div);
        }

        this.active = function(keepShow) {
            this.class.push('loading-text');
            if(keepShow) {
                this.class.push('loading-text-keep-show');
            }
            this.div.setAttribute('class', this.class.join(' '));
        }

        this.suspend = function(keepShow) {
            if(!keepShow) {
                this.class = ['hidden-text'];
                this.div.setAttribute('class', this.class.join(' '));
            }
        }
    }


    function creatAnimationTexts(currentSesssion) {

        loadingContainer.style.height = fontSize + 'px';
        loadingContainer.style.width = DEFAULT_WIDTH_LOADING + 'px';

        widgetContainer.style.color = textColor;
        widgetContainer.style.fontSize = fontSize + 'px';

        if(fontFamily && fontFamily.length > 0) {
            widgetContainer.style.fontFamily = fontFamily;
        }

        var style = document.createElement('style');
        style.setAttribute('type','text/css');
        style.innerHTML = ".loading-text { height: "+fontSize+"px; line-height: "+fontSize+"px;} .loading-text:after { background: " + textColor + "; height: "+fontSize+"px;}";

        document.head.appendChild(style);

        if(sessionId === currentSesssion && allTextLoadingsLiteral.length > 0) {

            loadingContainer.innerHTML = "";
            indexNext = 0;
            allTextLoadingsObj = [];

            numberText = allTextLoadingsLiteral.length;

            var minWidth = 10000;
            for(var i=0;i<numberText;i++) {
                allTextLoadingsObj.push(new LoadingText(allTextLoadingsLiteral[i], loadingContainer));
                
                if(minWidth > parseInt(allTextLoadingsObj[i].div.style.width)) {
                    minWidth = parseInt(allTextLoadingsObj[i].div.style.width);
                }
            }

            if(minWidth > parseInt(loadingContainer.style.width)) {
                loadingContainer.style.width = minWidth + 'px';
            }

            background.setAttribute('class', 'bg active');
            startAnimationText();
        }

    }

    function startAnimationText() {

        if(isStop) {
            isRunning = false;
            if(timeoutNext)
                clearTimeout(timeoutNext);

            return;
        }

        isRunning = true;

        (function(index) {
            var alreadyEndAnimation = false;
            var hideCurrentText = function() {
                if(alreadyEndAnimation)
                    return;

                alreadyEndAnimation = true;

                // Clear keyframe animation event
                for(var i=0;i<animationKeyframeEvents.length; i++) {
                    if(allTextLoadingsObj[index].div.removeEventListener) { // normal browser
                        allTextLoadingsObj[index].div.removeEventListener(animationKeyframeEvents[i], hideCurrentText);
                    }
                    else if (allTextLoadingsObj[index].div.detachEvent){ // IE 10
                        allTextLoadingsObj[index].div.detachEvent(animationKeyframeEvents[i], hideCurrentText);
                    }
                }

                allTextLoadingsObj[index].suspend(!isLoop && index === numberText - 1);
            };

            // Register callback keyframe animation event
            for(var i=0;i<animationKeyframeEvents.length; i++) {
                if(allTextLoadingsObj[index].div.addEventListener) { // normal browser
                    allTextLoadingsObj[index].div.addEventListener(animationKeyframeEvents[i], hideCurrentText);
                }
                else if(allTextLoadingsObj[index].div.attachEvent) { // IE 10
                    allTextLoadingsObj[index].div.attachEvent(animationKeyframeEvents[i], hideCurrentText);
                }
            }
        })(indexNext);

        if(isLoop && allTextLoadingsObj.length <= 2) {
            for(var i=0;i<allTextLoadingsObj.length;i++) {
                allTextLoadingsObj[i].div.style.webkitAnimationIterationCount = "infinite";
                allTextLoadingsObj[i].div.style.mozAnimationIterationCount = "infinite";
                allTextLoadingsObj[i].div.style.msAnimationIterationCount = "infinite";
                allTextLoadingsObj[i].div.style.animationIterationCount = "infinite";
            }
        } else if(!isLoop && indexNext === allTextLoadingsObj.length - 1) {
            allTextLoadingsObj[indexNext].active(true);
            isRunning = false;
            return false;
        }


        allTextLoadingsObj[indexNext].active();

        if(++indexNext >= allTextLoadingsObj.length) {
            indexNext = 0;
        }

        timeoutNext = setTimeout(function(){
            clearTimeout(timeoutNext);
            if(numberText <= 2) {
                isRunning = false;
                allTextLoadingsObj[indexNext].active(!isLoop);
            }
            else if(numberText > 2){
                startAnimationText();
            }
        }, ANIMATION_DURATION/2);

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
            creatAnimationTexts(currentSesssion);
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {
            textColor = BannerFlow.settings.textColor;
            fontSize = BannerFlow.settings.fontSize > 0 ? BannerFlow.settings.fontSize : 18;
            fontFamily = BannerFlow.settings.fontFamily;

            isLoop = BannerFlow.settings.isLoop;
        } else {
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

        if(languageTexts && languageTexts.length > 0) {

            var arr = languageTexts.split(":");
            var length = arr.length;
            for(var i=0;i<length;i++) {
                if(arr[i] && arr[i].length > 0) {
                    allTextLoadingsLiteral.push(arr[i]);
                }
            }

        } else {
            allTextLoadingsLiteral.push("Enter loading text");
        }
    }

    return {
        start: onStarted,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    LoadingTextWidget.start();
} else {
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        LoadingTextWidget.start();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        LoadingTextWidget.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        LoadingTextWidget.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        LoadingTextWidget.start();
    });
}
