/*===================================================*/
/*=====  UTILITIES =====*/
/*===================================================*/

function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = new Date() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = new Date();
    var callNow = immediate && !timeout;
    
    if (!timeout) timeout = setTimeout(later, wait);
    
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};


window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function (callback) {
              window.setTimeout(callback, 1000 / 60);
          };
})();

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

var FreezeGameWidget = (function(){
  var image;
  var MAX_WIDTH_DEFAULT = 50;

  var DIRECTION_LEFT = "Left";
  var DIRECTION_RIGHT = "Right";
  var DIRECTION_UP = "Up";
  var DIRECTION_DOWN = "Down";

  var ON_STOP_SHAKE = "Shake";
  var ON_STOP_SHRINK = "Shrink";
  var ON_STOP_NOTHING = "Nothing";

  var directionLeft = false;
  var directionRight = false;
  var directionUp = false;
  var directionDown = false;

  var imageSrc = "http://media.nj.com/njcom_boys_soccer_blog/photo/10159250-large.png";
  var imageMaxWidth = MAX_WIDTH_DEFAULT;
  var imageMaxHeight;

  var SPEED_DEFAULT = 10;
  var speed = SPEED_DEFAULT;
  var direction = DIRECTION_UP;
  var onStop = ON_STOP_SHAKE;

  var shakingAtStop = false;
  var shrinkingAtStop = false;

  var textWarning = document.getElementById('textWarning');
  var container;
  var containerWidth, containerHeight;

  var leftDefault = -100;
  var leftImage = leftDefault;
  var topDefault = -100;
  var topImage = topDefault;

  var enableMove = true;
  var isRegisterEvent = false;
  var stopByKeyFrame = false;
  var animationClass;

  var animationKeyframeEvents = ["webkitAnimationEnd", "animationend", "MSAnimationEnd"];

  /*==========================================================*/

  function startGame() {
    initImage(function() {
      registerEvent();
    });
  }

  function initImage(callback) {
    container = document.getElementById("container");
    containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
    containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

    if(!imageSrc || imageSrc.length == 0 || !containerWidth || !containerHeight)
      return false;

    image = new Image();

    image.onload = function() {
      imageMaxHeight = this.height/this.width * imageMaxWidth;
      this.style.maxWidth = imageMaxWidth + 'px';

      if(directionLeft) {
        this.style.top = "50%";
        this.style.left = (containerWidth + imageMaxWidth) + "px";
        setStyleCss3(this, "transform", "translate(0, -50%)");

        leftDefault = containerWidth + imageMaxWidth;

      }else if(directionRight) {
        this.style.top = "50%";
        this.style.left = "-" + imageMaxWidth + "px";
        setStyleCss3(this, "transform", "translate(0, -50%)");
        leftDefault = -imageMaxWidth;

      }else if(directionUp) {
        this.style.top = (imageMaxHeight + containerHeight) + "px";
        this.style.left = "50%";
        setStyleCss3(this, "transform", "translate(-50%, 0)");

        topDefault = imageMaxHeight + containerHeight;

      } else if(directionDown) {
        this.style.top = "-" + imageMaxHeight + "px";
        this.style.left = "50%";
        setStyleCss3(this, "transform", "translate(-50%, 0)");

        topDefault = -imageMaxHeight;

      }

      leftImage = leftDefault;
      topImage = topDefault;

      container.innerHTML = "";
      container.appendChild(this);
      if(callback)
        callback();
    }

    image.src = imageSrc;
  }

  function registerEvent() {
    if(isRegisterEvent)
      return;

    isRegisterEvent = true;

    // callback after clicking the widget
    var toggleImageMove = debounce(function() {

      if(shakingAtStop || shrinkingAtStop) {
        if(enableMove) {
          enableMove = !enableMove;
          stopByKeyFrame = true;

          if(shakingAtStop)
            image.setAttribute('class', animationClass);
          else if(shrinkingAtStop)
            image.setAttribute('class', animationClass);

        } else if(!stopByKeyFrame) {
          enableMove = !enableMove;
          image.setAttribute('class', '');

        }

      } else {
        enableMove = !enableMove;
      }

    }, 100);

    // callback after shrinking/shake, enable to click
    var endKeyframeAnimation = function() {
      stopByKeyFrame = false;
    }

    // register for keyframe animation end
    for(var i=0;i<animationKeyframeEvents.length; i++) {
      if(image.addEventListener) { // normal browser
        image.addEventListener(animationKeyframeEvents[i], endKeyframeAnimation);
      }
      else if(image.attachEvent) { // IE 10
        image.attachEvent(animationKeyframeEvents[i], endKeyframeAnimation);
      }
    }

    // register for click event

    container.onmousedown = toggleImageMove;
    container.ontouchstart = toggleImageMove;

    playGame();
  }

  function playGame(){
    
    if(enableMove) {
      // Calculate the new position
      if(directionLeft) {
        leftImage -= speed;
        image.style.left = leftImage + 'px';
      }
      else if(directionRight) {
        leftImage += speed;
        image.style.left = leftImage+'px';
      }
      else if(directionUp) {
        topImage -= speed;
        image.style.top = topImage+'px';
      }
      else if(directionDown) {
        topImage += speed;
        image.style.top = topImage+'px';
      }

      // Check to reset the position

      if(directionLeft) {
        if(leftImage < -imageMaxWidth)
          leftImage = leftDefault;

      } else if(directionRight){
        if(leftImage > containerWidth)
          leftImage = leftDefault;

      } else if(directionUp) {
        if(topImage < -imageMaxHeight)
          topImage = topDefault;

      } else if(directionDown) {
        if(topImage > containerHeight)
          topImage = topDefault;
      }
    }

    requestAnimationFrame(playGame);
  }


  /*==============================================*/
  /*===== Default settings from Banner Flow  =====*/
  /*==============================================*/

  function loadSettings() {
    if(typeof BannerFlow !== "undefined"){
      var images = getImages(BannerFlow.settings.image, true);
      imageSrc = "";
      if(images && images.length > 0)
        imageSrc = images[0];

      imageMaxWidth = BannerFlow.settings.imageMaxWidth > 0 ? BannerFlow.settings.imageMaxWidth : MAX_WIDTH_DEFAULT;
      speed = BannerFlow.settings.speed > 0 ? BannerFlow.settings.speed : SPEED_DEFAULT;
      direction = BannerFlow.settings.direction;
      onStop = BannerFlow.settings.onStop;
    }

    switch(direction.toLowerCase()) {
      case DIRECTION_LEFT.toLowerCase():
        directionLeft = true;
        directionRight = false;
        directionUp = false;
        directionDown = false;
        break;
      case DIRECTION_RIGHT.toLowerCase():
        directionLeft = false;
        directionRight = true;
        directionUp = false;
        directionDown = false;
        break;
      case DIRECTION_UP.toLowerCase():
        directionLeft = false;
        directionRight = false;
        directionUp = true;
        directionDown = false;
        break;
      case DIRECTION_DOWN.toLowerCase():
        directionLeft = false;
        directionRight = false;
        directionUp = false;
        directionDown = true;
        break;
    }

    if(onStop.toLowerCase() == ON_STOP_SHAKE.toLowerCase()) {
      shakingAtStop = true;
      shrinkingAtStop = false;

      if(directionLeft || directionRight) {
        animationClass = "shaking-horizontal";
      } else {
        animationClass = "shaking-vertical";
      }
    } else if(onStop.toLowerCase() == ON_STOP_SHRINK.toLowerCase()) {
      shakingAtStop = false;
      shrinkingAtStop = true;

      if(directionLeft || directionRight) {
        animationClass = "shrinking-horizontal";
      } else {
        animationClass = "shrinking-vertical";
      }
    } else {
      shakingAtStop = false;
      shrinkingAtStop = false;

      animationClass = "";
    }
  }
  
  /*====================================================*/  

  function init() {
    loadSettings();

    if((!imageSrc || imageSrc.length == 0) && typeof BannerFlow != "undefined" && BannerFlow.editorMode) {
      textWarning.style.display = "block";
    } else {
      textWarning.style.display = "none";
    }


    startGame();

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
      onStart: onStart,

      onResized: onResized,

      onSettingChanged: onSettingChanged
  };
})();

if(typeof BannerFlow == "undefined"){
  FreezeGameWidget.onStart();
} else {
  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    FreezeGameWidget.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    FreezeGameWidget.onSettingChanged();
  });
  BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
    FreezeGameWidget.onStart();
  });
}
