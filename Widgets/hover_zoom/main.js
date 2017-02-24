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

function setStyleCss3(object, key, value) {
  var keyName = key.substr(0,1).toUpperCase() + key.substr(1);
  object.style['webkit' + keyName] = value;
  object.style['moz' + keyName] = value;
  object.style['ms' + keyName] = value;
  object.style[key] = value;
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

/*============================================*/

var HoverZoom = (function(){

    var container = get('widgetContainer');
    var textWarning = get('textWarning');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var classForStyle = "inline-style";

    /*--- settings from banner flow ---*/

    var zoomPercent, duration, image;


    function startWidget(currentSesssion){

      // remove old styles
      var styles = document.querySelectorAll('.' + classForStyle);
      if(styles && styles.length > 0) {
        for(var i=0;i<styles.length;i++) {
          document.head.removeChild(styles[i]);
        }
      }

      // create a new style

      var style = document.createElement('style');
      style.setAttribute('class', classForStyle);
      style.setAttribute('type', 'text/css');

      var styleInnerHtml = "";
      styleInnerHtml += ".widget-background {\n" +
                        "background: url('" + image + "')\n no-repeat center center; \n" +
                        "background-size: cover;\n" +
                        "-webkit-transition: -webkit-transform " + duration + "ms linear;\n" +
                        "-moz-transition: -moz-transform " + duration + "ms linear;\n" +
                        "transition: transform " + duration + "ms linear;\n" +
                    "}\n";

      styleInnerHtml += ".widget-background:hover {\n" +
                        "-webkit-transform: scale(" + (1 + zoomPercent/100) + ");" +
                        "-moz-transform: scale(" + (1 + zoomPercent/100) + ");" +
                        "transform: scale(" + (1 + zoomPercent/100) + ");" +
                    "}\n";

      style.innerHTML = styleInnerHtml;
      document.head.appendChild(style);

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
        if((!image || image.length == 0) && typeof BannerFlow != "undefined" && BannerFlow.editorMode) {
          textWarning.style.display = "block";
        } else {
          textWarning.style.display = "none";
        }
        
        startWidget(currentSesssion);
      });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {

          var imageData = getImages(BannerFlow.settings.image, true)
          image = (imageData && imageData.length > 0) ? imageData[0] : "";
          zoomPercent = BannerFlow.settings.zoomPercent;
          duration = BannerFlow.settings.duration;

        } else {
          zoomPercent = 50;
          duration = 1;
          image= "./background.jpg";
        }

        duration = duration * 1000/ 4;

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
        start: onStart,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    HoverZoom.start();
} else {
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function () {
        HoverZoom.start();
    });
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        HoverZoom.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        HoverZoom.onSettingChanged();
    });
}

