

function setStyleCss3(object, key, value) {
  var keyName = key.substr(0,1).toUpperCase() + key.substr(1);
  object.style['webkit' + keyName] = value;
  object.style['moz' + keyName] = value;
  object.style['ms' + keyName] = value;
  object.style[key] = value;
}

var AnimatedMouseWidget = (function() {

    var DIRECTION_TOP = "Top";
    var DIRECTION_BOTTOM = "Bottom";
    var DIRECTION_LEFT = "Left";
    var DIRECTION_RIGHT = "Right";
    var DIRECTION_TOP_LEFT ="Top-Left";
    var DIRECTION_TOP_RIGHT = "Top-Right";
    var DIRECTION_BOTTOM_RIGHT = "Bottom-Right";
    var DIRECTION_BOTTOM_LEFT = "Bottom-Left";


    // setting variables
    var pointerColor = "white";
    var pointerBorderColor = "black";
    var direction = DIRECTION_TOP_LEFT;
    var delay = 1;
    var duration = 2;

    var container = document.getElementById('widgetContainer');
    var mouseContainer = document.getElementById('mouseContainer');
    var canvasPointer;
    var containerWidth, containerHeight;
    var pointerWidth = 16;
    var pointerHeight = 22;

    var animationEvents = ["webkitTransitionEnd", "transitionend", "msTransitionEnd"];
    var animationKeyframeEvents = ["webkitAnimationEnd", "animationend", "MSAnimationEnd"];


    function startWidget() {

        containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
        containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

        getSettings();
        drawCursorPointer();
        var startTimeout = setTimeout(function(){
            clearTimeout(startTimeout);
            
            animatingPointer();
        }, delay * 1000);

    }

    function getSettings() {
        // setting from banner flow
        if(typeof BannerFlow !== "undefined"){ 
            pointerColor = BannerFlow.settings.pointerColor;
            pointerBorderColor = BannerFlow.settings.pointerBorderColor;
            direction = BannerFlow.settings.direction;
            delay = BannerFlow.settings.delay;
            duration = BannerFlow.settings.duration > 0 ? BannerFlow.settings.duration : 2;
        }

        duration = duration * 1000/4;
    }


    /*-------- Animation part --------*/
    function drawCursorPointer() {
        mouseContainer.innerHTML = "";

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null,"id","canvasPointer");
        svg.setAttributeNS(null,"class","canvas-pointer");
        svg.setAttributeNS(null,"width","16");
        svg.setAttributeNS(null,"height","22");
        svg.setAttributeNS(null,"viewBox","0 0 16 22");

        var pointer = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pointer.setAttributeNS(null,"d","M0 0 1 19 5.8 15 8.4 20.8 11.1 19 7.8 13.8 13 13 0 0");
        pointer.setAttributeNS(null,"fill",pointerColor);
        pointer.setAttributeNS(null,"stroke",pointerBorderColor);

        svg.appendChild(pointer);
        mouseContainer.appendChild(svg);

        canvasPointer = document.getElementById('canvasPointer');
    }

    function getTranslateValue() {
        var translateX = 0;
        var translateY = 0;

        switch(direction.toLowerCase()) {
            case DIRECTION_TOP.toLowerCase():
                translateY = -containerHeight/2 + pointerHeight;
                break;
            case DIRECTION_BOTTOM.toLowerCase():
                translateY = containerHeight/2 - pointerHeight;
                break;
            case DIRECTION_LEFT.toLowerCase():
                translateX = -containerWidth/2 + pointerWidth;
                break;
            case DIRECTION_RIGHT.toLowerCase():
                translateX = containerWidth/2 - pointerWidth;
                break;
            case DIRECTION_TOP_LEFT.toLowerCase():
                translateX = -containerWidth/2 + pointerWidth;
                translateY = -containerHeight/2 + pointerHeight;
                break;
            case DIRECTION_TOP_RIGHT.toLowerCase():
                translateY = -containerHeight/2 + pointerHeight;
                translateX = containerWidth/2 - pointerWidth;
                break;
            case DIRECTION_BOTTOM_RIGHT.toLowerCase():
                translateY = containerHeight/2 - pointerHeight;
                translateX = containerWidth/2 - pointerWidth;
                break;
            case DIRECTION_BOTTOM_LEFT.toLowerCase():
                translateX = -containerWidth/2 + pointerWidth;
                translateY = containerHeight/2 - pointerHeight;
                break;
        }

        return {
            translateX: translateX,
            translateY: translateY
        };
    }

    function animatingPointer() {

        var translate = getTranslateValue();

        var alreadyCallbackMouseMove = false;
        var alreadyCallbackMouseZoom = false;
        var zoomAnimation = function() {
            if(alreadyCallbackMouseMove)
                return;

            alreadyCallbackMouseMove = true;

            // remove callback register

            for(var i=0;i<animationEvents.length; i++) {
                if(mouseContainer.removeEventListener) { // normal browser
                    mouseContainer.removeEventListener(animationEvents[i], zoomAnimation);
                }
                else if (mouseContainer.detachEvent){ // IE 10
                    mouseContainer.detachEvent(animationEvents[i], zoomAnimation);
                }
            }

            // start the second animation

            var timeoutZoom = setTimeout(function() {
                clearTimeout(timeoutZoom);
                setStyleCss3(canvasPointer, "animation", "zoomAnimation 0.5s forwards");
            }, 500);
        };

        var comeback = function() {

            if(alreadyCallbackMouseZoom)
                return;

            alreadyCallbackMouseZoom = true;

            // remove callback register

            for(var i=0;i<animationKeyframeEvents.length; i++) {
                if(canvasPointer.removeEventListener) { // normal browser
                    canvasPointer.removeEventListener(animationKeyframeEvents[i], comeback);
                }
                else if (canvasPointer.detachEvent){ // IE 10
                    canvasPointer.detachEvent(animationKeyframeEvents[i], comeback);
                }
            }

            // trigger click event
            if(typeof BannerFlow !== "undefined") {
                BannerFlow.raiseEvent('widget_mouse_click');
            }

            // delay and come back the start position
            var timeoutFadeout = setTimeout(function() {
                clearTimeout(timeoutFadeout);
                setStyleCss3(mouseContainer, "transform", "translate(0,0)");
            }, 500);
        };

        // Register callback after the mouse comes

        for(var i=0;i<animationEvents.length; i++){
            if(mouseContainer.addEventListener) { // normal browser
                mouseContainer.addEventListener(animationEvents[i], zoomAnimation);
            }
            else if(mouseContainer.attachEvent) { // IE 10
                mouseContainer.attachEvent(animationEvents[i], zoomAnimation);
            }
        }

        // Register callback after the mouse zooms

        for(var i=0;i<animationKeyframeEvents.length; i++) {
            if(canvasPointer.addEventListener) { // normal browser
                canvasPointer.addEventListener(animationKeyframeEvents[i], comeback);
            }
            else if(canvasPointer.attachEvent) { // IE 10
                canvasPointer.attachEvent(animationKeyframeEvents[i], comeback);
            }
        }

        setStyleCss3(mouseContainer, "transition", duration + "ms");
        setStyleCss3(mouseContainer, "transform", "translate(" + translate.translateX + "px," + translate.translateY + "px)");
    }

    function resetPointer() {
        setStyleCss3(mouseContainer, "transition", "10ms");
        setStyleCss3(mouseContainer, "transform", "translate(0,0)");
        mouseContainer.style.display = "block";
        if(canvasPointer)
            setStyleCss3(canvasPointer, "animation", "none");

        mouseContainer.getBoundingClientRect();
    }


    /*====================================*/

    var timeoutStart;
    var sessionId = 0;

    function init() {
        if(timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function() {
                startWidget(++sessionId);
            }, 500);

        } else {
            timeoutStart = setTimeout(function(){
                startWidget(++sessionId);
            }, 0);
        }
    }

    var countStartAnimation = 0;

    function onStart() {
        
        countStartAnimation++;


        if(countStartAnimation > 1) {
            resetPointer();
            var startTimeout = setTimeout(function(){
                clearTimeout(startTimeout);
                
                animatingPointer();
            }, delay * 1000);

        } else {
            init();
        }
    }


    function onResized(){
        if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
            return;
        }

        resetPointer();
        init();
    }

    function onSettingChanged(){
        if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
            return;
        }

        resetPointer();
        init();
    }

    /*--- return object ---*/
    return {
        onStart: onStart,
        onResized: onResized,
        onSettingChanged: onSettingChanged
    }
})();

if(typeof BannerFlow == "undefined"){
    AnimatedMouseWidget.onStart();
}
else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        AnimatedMouseWidget.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        AnimatedMouseWidget.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        AnimatedMouseWidget.onStart();
    });
}