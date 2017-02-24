function get(el) {
    if(typeof el === "string") 
        return document.getElementById(el);
    return el;
}

function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

/*============================================*/

var TwitterFeed = (function(){

    var container = get('widgetContainer');
    var content = get('widgetContent');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    /*--- settings from banner flow ---*/
    var TWITTER_TIMELINE = "timeline";
    var TWITTER_FOLLOW = "follow";

    var twitterType = TWITTER_TIMELINE;
    var twitterAccount = "Arsenal";
    var border, borderColor;
    var scrollbar, theme;

    var isTransparent = false;

    function createWidget() {
        theme = theme.toLowerCase();

        if(theme === "transparent") {
            isTransparent = true;
        }

        borderColor = rgb2hex(borderColor);

        if(twitterType.toLowerCase() === TWITTER_TIMELINE.toLowerCase()) {
            twttr.widgets.createTimeline({
              sourceType: "profile",
              screenName: twitterAccount
            }, content, {
                height: containerHeight,
                chrome: "noheader nofooter" + (border ? "" : " noborders ") + (isTransparent ? " transparent " : "") + (scrollbar ? "": " noscrollbar "),
                borderColor: borderColor,
                theme: (isTransparent ? null : theme)
            }).then(function(el){});

        } else if(twitterType.toLowerCase() === TWITTER_FOLLOW.toLowerCase()) {

            twttr.widgets.createFollowButton(twitterAccount, container, {
                size: 'medium',
                count: 'none'
            }).then(function (el) {
            });
        }
    }
   
    function startWidget(){
        if(!containerHeight)
            return;

        content.innerHTML = "";
        createWidget();
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
            startWidget();
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {

            twitterType = BannerFlow.settings.twitterType;
            twitterAccount = BannerFlow.settings.twitterAccount;

            border = BannerFlow.settings.border;
            borderColor = BannerFlow.settings.borderColor;
            scrollbar = BannerFlow.settings.scrollbar;
            theme = BannerFlow.settings.theme;

        } else {
           twitterType = TWITTER_TIMELINE;
           twitterAccount = "BannerFlow";

           border = false;
           borderColor = "rgba(0, 255, 0, 1)";
           scrollbar = false;
           theme = "light";
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


    var isStartAnimation = false;

    function onStart() {
        if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
            return;
        }

        isStartAnimation = true;

        init();
    }


    function onResize(){}

    function resetParameter(){

        if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
            return;
        }

        init();
    }

    return {
        start: onStart,

        onResized: onResize,

        onSettingChanged: resetParameter
    };
})();

if(typeof BannerFlow == "undefined"){
    TwitterFeed.start();
} else {

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        TwitterFeed.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        TwitterFeed.onSettingChanged();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        TwitterFeed.start();
    });
}
