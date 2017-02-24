
function isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

var isTouch = isTouchDevice();

function get(el) {
    if(typeof el === "string") 
        return document.getElementById(el);
    return el;
}

function mouseX (e) {

    if (e.pageX) {
        return e.pageX;
    }

    if (e.clientX) {
        return e.clientX;
    }

    if(e.touches)
        return e.touches[0].clientX;

    return null;
}

function mouseY (e) {
    if (e.pageY) {
        return e.pageY;
    }

    if (e.clientY) {
        return e.clientY;
    }

    if(e.touches)
        return e.touches[0].clientY;

    return null;
}

function dragable (clickEl, dragEl, container, callback) {
    var p = get(clickEl);
    var t = get(dragEl);
    var drag = false;
    offsetX = 0;
    offsetY = 0;
    var mousemoveTemp = null;

    var contWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
    var contHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));
    var offsetContX = container.getBoundingClientRect().left;
    var offsetContY = container.getBoundingClientRect().top;


    if (t) {
        var move = function (x,y) {
            var positionX = (parseInt(t.style.left) + x);
            var positionY = (parseInt(t.style.top) + y);
            t.style.left = positionX + "px";
            //t.style.top  = positionY + "px";


            if(callback)
                callback(positionX, positionY);
        }

        var mouseMoveHandler = function (e) {
            e = e || window.event;

            if(!drag){
                return true;
            };

            var x = mouseX(e);
            var y = mouseY(e);

            if (x != offsetX || y != offsetY) {
                move(x-offsetX, y-offsetY);
                offsetX = x;
                offsetY = y;
            }

            return false;
        }

        var start_drag = function (e) {

            e = e || window.event;

            offsetX = mouseX(e);
            offsetY = mouseY(e);
            drag = true; // basically we're using this to detect dragging

            // save any previous mousemove event handler:
            if(isTouch) {
                container.addEventListener("touchmove", mouseMoveHandler, false);

            } else {
                if (container.onmousemove) {
                    mousemoveTemp = container.onmousemove;
                }

                container.onmousemove = mouseMoveHandler;
            }

            return false;
        }

        var stop_drag = function () {
            drag = false;

            // restore previous mousemove event handler if necessary:
            if(isTouch) {
                container.removeEventListener("touchmove", mouseMoveHandler, false);
            }

            container.onmousemove = mousemoveTemp;
            mousemoveTemp = null;
            
            return false;
        }


        if(isTouch) {
            p.addEventListener("touchstart", start_drag, false);
            p.addEventListener("touchend", stop_drag, false);
            
            container.addEventListener("touchend", stop_drag, false);

        } else {
            p.onmousedown = start_drag;
            p.onmouseup = stop_drag;
            container.onmouseup = stop_drag;
        }
    }
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

function getImages(imageSetting, isOriginal){
    var images = [];

    if(imageSetting && imageSetting.length > 0)
        for(var i=0;i<imageSetting.length;i++) {
            var imgArr = imageSetting[i].images
            if(isOriginal)
                images.push(imgArr[0].url); // get original image
            else
                images.push(imgArr[imgArr.length-1].url); //get smallest image
        }

    return images;
}

var ToggleSlider = (function(){

    var container = get('widgetContainer');
    var leftWrapper = get('leftWrapper');
    var leftContainer = get('leftContent');
    var rightContainer = get('rightContent');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    /*--- settings from banner flow ---*/
    var backgroundColorLeft, imageLeft;
    var backgroundColorRight, imageRight;
    var delta = 50;
    var sliderPosition = 50;
    var sliderColor = "#484e5d";
    var sliderArrowColor = "#777e8e";
    var sliderHeight = "Align to image";

    var font, textColorLeft, textSizeLeft, textLeftPositionX, textLeftPositionY;
    var textColorRight, textSizeRight, textRightPositionX, textRightPositionY;

    var languageTexts = [];


    function initDragDivider() {
        var initLeft = containerWidth * sliderPosition/100;
        if(initLeft < delta)
            initLeft = delta;
        else if(initLeft > containerWidth - delta)
            initLeft = containerWidth - delta;

        var divider = get("divider");
        divider.style.left = initLeft + 'px';
        leftWrapper.style.width = initLeft + 'px';
        leftContent.style.width = containerWidth + 'px';

        dragable("slider", "divider", container, function(x, y) {
            var width = x;
            if(x <= delta){
                width = delta;
            }
            else if (x >= containerWidth - delta) {
                width = containerWidth - delta;
            }

            leftWrapper.style.width = width + 'px';
            divider.style.left = width + "px";
        });
    }

    function fillTwoPanel(){
        if(!imageLeft && imageLeft.length == 0) {
            leftContainer.style.backgroundColor = backgroundColorLeft;
            leftContainer.style.backgroundImage = "none";
        }
        else {
            leftContainer.style.backgroundColor = "transparent";
            leftContainer.style.backgroundImage = "url('" + imageLeft + "')";
        }

        leftContainer.style.backgroundRepeat = "no-repeat";
        leftContainer.style.backgroundPosition = "top left";
        leftContainer.style.backgroundSize = "auto 100%";
        if(languageTexts.length >= 1) {
            var div = document.createElement('div');
            div.setAttribute("class", "panel-text");
            div.style.fontFamily = font;
            div.style.fontSize = textSizeLeft + "px";
            div.style.color = textColorLeft;
            div.style.left = textLeftPositionX + "px";
            div.style.top = textLeftPositionY + "px";

            div.innerHTML = languageTexts[0];
            leftContainer.innerHTML = "";
            leftContainer.appendChild(div);
        }

        if(!imageRight && imageRight.length == 0) {
            rightContainer.style.backgroundColor = backgroundColorRight;
            rightContainer.style.backgroundImage = "none";
        }
        else {
            rightContainer.style.backgroundColor = "transparent";
            rightContainer.style.backgroundImage = "url('" + imageRight + "')";
        }
        
        rightContainer.style.backgroundRepeat = "no-repeat";
        rightContainer.style.backgroundPosition = "top right";
        rightContainer.style.backgroundSize = "auto 100%";
        if(languageTexts.length >= 2) {
            var div = document.createElement('div');
            div.setAttribute("class", "panel-text right");
            div.style.fontFamily = font;
            div.style.fontSize = textSizeRight + "px";
            div.style.color = textColorRight;
            div.style.right = textRightPositionX + "px";
            div.style.top = textRightPositionY + "px";

            div.innerHTML = languageTexts[1];
            rightContainer.innerHTML = "";
            rightContainer.appendChild(div);
        }

        if(sliderPosition < 0)
            sliderPosition = 0;
        else if(sliderPosition > 100)
            sliderPosition = 100;

        var divider = get("divider");
        if(sliderHeight.toLowerCase() === "Align to image".toLowerCase()) {
            divider.style.top = 0;
            divider.style.bottom = 0;

            container.style.top = 0;
            container.style.bottom = 0;
        }
        else {
            divider.style.top = '-12px';
            divider.style.bottom = '-12px';

            container.style.top = '12px';
            container.style.bottom = '12px';
        }

        var styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');
        var innerHTML = "";
        innerHTML += ".divider {" +
                        "background-color: " + sliderColor + ";" +
                    "}" +
                    ".slider:before {" +
                        "border-right-color: " + sliderArrowColor + ";" +
                    "}" + 
                    ".slider:after {" +
                        "border-left-color: " + sliderArrowColor + ";" +
                    "}";
        styleElement.innerHTML = innerHTML;

        document.head.appendChild(styleElement);

        initDragDivider();
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
            fillTwoPanel();
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {

            backgroundColorLeft     = BannerFlow.settings.backgroundColorLeft;
            backgroundColorRight    = BannerFlow.settings.backgroundColorRight;

            var imageLeftData  = getImages(BannerFlow.settings.imageLeft, true);
            var imageRightData = getImages(BannerFlow.settings.imageRight, true);

            imageLeft   = (imageLeftData && imageLeftData.length > 0) ? imageLeftData[0] : "";
            imageRight  = (imageRightData && imageRightData.length > 0) ? imageRightData[0] : "";

            delta = BannerFlow.settings.delta;

            sliderPosition      = BannerFlow.settings.sliderPosition;
            sliderColor         = BannerFlow.settings.sliderColor;
            sliderArrowColor    = BannerFlow.settings.sliderArrowColor;
            sliderHeight        = BannerFlow.settings.sliderHeight;

            font                = BannerFlow.settings.font;
            textColorLeft       = BannerFlow.settings.textColorLeft;
            textSizeLeft        = BannerFlow.settings.textSizeLeft > 0 ? BannerFlow.settings.textSizeLeft : 20;
            textLeftPositionX   = BannerFlow.settings.textLeftPositionX;
            textLeftPositionY   = BannerFlow.settings.textLeftPositionY;

            textColorRight      = BannerFlow.settings.textColorRight;
            textSizeRight       = BannerFlow.settings.textSizeRight > 0 ? BannerFlow.settings.textSizeRight : 20;
            textRightPositionX  = BannerFlow.settings.textRightPositionX;
            textRightPositionY  = BannerFlow.settings.textRightPositionY;

        } else {
            backgroundColorLeft     = "#393f4c";
            backgroundColorRight    = "#656c7c";

            imageLeft   = "http://i.imgur.com/uKnMvyp.jpg";
            imageRight  = "http://i.imgur.com/fTN9FCB.jpg";

            sliderPosition      = 50;
            sliderColor         = "#484e5d";
            sliderArrowColor    = "#777e8e";
            sliderHeight        = "Align to image";

            font                = "Arial";
            textColorLeft       = "#000000";
            textSizeLeft        = "20";
            textLeftPositionX   = 50;
            textLeftPositionY   = 50;

            textColorRight      = "#000000";
            textSizeRight       = "20";
            textRightPositionX  = 50;
            textRightPositionY  = 50;
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

        languageTexts = [];

        var tmpText = "";

        if(typeof BannerFlow !== "undefined")
            tmpText = BannerFlow.text;

        if(tmpText && tmpText.length > 0) {
            languageTexts = tmpText.split(':');
        }

        // languageTexts.push("Old stuff");
        // languageTexts.push("New stuff");
    }

    return {
        start: onStarted,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    ToggleSlider.start();
} else {
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        ToggleSlider.start();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        ToggleSlider.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        ToggleSlider.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        ToggleSlider.start();
    });
}
