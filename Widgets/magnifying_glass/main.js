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

function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
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

var MagnifyingGlass = (function(){

    var container = get('widgetContainer');
    var glass = get('glassContainer');
    var textWarning = get('textWarning');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;
    var checkingArea = {
      minX: 0, minY: 0,
      maxX: 0, maxY: 0
    };

    var backgroundSizeZoom;
    var originalScale;

    /*--- settings from banner flow ---*/
    var image;
    var zoom;
    var glassSize;
    var borderColor;
    var borderThickness;

    
    function scaleImageOnTheGlass(x, y) {

      if(!image){
        glass.style.display ="none";
        return;
      }

      glass.style.display ="block";
      
      
      x = (-(x - checkingArea.minX)/originalScale) * (originalScale*zoom) + glassSize/2 - borderThickness + 'px';
      y = (-(y - checkingArea.minY)/originalScale) * (originalScale*zoom) + glassSize/2 - borderThickness + 'px';

      glass.style.backgroundRepeat = "no-repeat";
      glass.style.backgroundImage = "url("+image+")";
      glass.style.backgroundColor = "#ffffff";
      glass.style.backgroundPosition = x + ' ' + y;
      glass.style.backgroundSize = backgroundSizeZoom;

    }

    function registerEvent() {

        var mouseMove = function(e) {
          var x = e.pageX;
          var y = e.pageY;
          if(e.touches) {
            x = e.touches[0].pageX;
            y = e.touches[0].pageY;
          }

          glass.style.left = x + "px";
          glass.style.top = y + "px";

          scaleImageOnTheGlass(x, y);
        };

        container.onmousemove = mouseMove;
        container.ontouchmove = mouseMove;
    }

    function startWidget(currentSesssion) {
      glass.style.display ="none";

      if(!image) {
        container.style.display ="none";
        return;
      } else {
        container.style.display ="block";
      }

      // Set style for the glass
      glass.style.width = glassSize + 'px';
      glass.style.height = glassSize + 'px';
      glass.style.margin = -glassSize/2 + 'px 0 0 ' + (-glassSize)/2 + 'px';
      glass.style.border = borderThickness + "px solid " + borderColor;


      var imageObj = new Image();
      imageObj.onload = function() {
        if(currentSesssion == sessionId) {
          container.style.background = "url("+image+") no-repeat center center";

          if(this.width/this.height > containerWidth/containerHeight) {
            container.style.backgroundSize = "100% auto";

            backgroundSizeZoom = zoom * containerWidth + 'px auto';
            originalScale = containerWidth/ this.width;

            checkingArea = {
              minX: 0,
              minY: (containerHeight - this.height/this.width * containerWidth)/2,
              maxX: containerWidth,
              maxY: (containerHeight + this.height/this.width * containerWidth)/2
            };

          } else {
            container.style.backgroundSize = "auto 100%";

            backgroundSizeZoom = 'auto ' + zoom * containerHeight + 'px';
            originalScale = containerHeight/ this.height;

            checkingArea = {
              minX: (containerWidth - this.width/this.height * containerHeight)/2,
              minY: 0,
              maxX: (containerWidth + this.width/this.height * containerHeight)/2,
              maxY: containerHeight
            };
          }

          registerEvent();
        }
      };
      imageObj.src = image;
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

        var imageData = getImages(BannerFlow.settings.image, true);
        image = (imageData && imageData.length > 0) ? imageData[0] : "";
        zoom = BannerFlow.settings.zoom;
        if(zoom == 0)
          zoom = 4;

        glassSize = BannerFlow.settings.glassSize;
        if(glassSize == 0)
          glassSize = 150;
        borderColor = BannerFlow.settings.borderColor;
        borderThickness = BannerFlow.settings.borderThickness;

      } else {
        image = "http://i.imgur.com/snukYdE.jpg";
        // image = "./image.jpg";
        zoom = 4;
        glassSize = 150;
        borderColor = "rgba(255,255,255,1)";
        borderThickness = 10;
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
  MagnifyingGlass.start();
} else {
  BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function () {
    MagnifyingGlass.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    MagnifyingGlass.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    MagnifyingGlass.onSettingChanged();
  });
}

