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

function setStyleCss3(object, key, value) {
  object.style['webkit'+key.substr(0,1).toUpperCase() + key.substr(1).toLowerCase()] = value;
  object.style['moz'+key.substr(0,1).toUpperCase() + key.substr(1).toLowerCase()] = value;
  object.style['ms'+key.substr(0,1).toUpperCase() + key.substr(1).toLowerCase()] = value;
  object.style[key.toLowerCase()] = value;
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

var ClickSlideshow = (function(){

    var container = get('widgetContainer');
    var slideShowContainer = get('slideShowContainer');
    var textWarning = get('textWarning');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    /*--- settings from banner flow ---*/

    var useFeed;
    var images = new Array();
    var transitionType;
    var actionType;
    var backgroundSize;

    var BACKGROUND_CONTAIN = "Contain";
    var BACKGROUND_COVER   = "Cover";

    /*================================================================================*/

    var TRANSITION_NONE = "None";
    var TRANSITION_FADE_IN = "Fade in";
    var TRANSITION_SLIDE_LEFT = "Slide left";
    var TRANSITION_SLIDE_RIGHT = "Slide right";

    var ACTION_CLICK = "Click";
    var ACTION_HOVER = "Hover";

    var animationEvents = ["webkitTransitionEnd", "transitionend", "msTransitionEnd"];

    var slideTransitionParam = "0.5s ease-in-out";

    var languageText = "";

    var SlideShow = function(images, container, opts) {

      if(!opts)
        return;

      this.options = opts;
      this.container = container;
      this.currentIndex = 0;
      this.items = new Array();
      this.enableNext = true;

      this.isSlideAnimation = this.options.transition.toLowerCase() === TRANSITION_SLIDE_LEFT.toLowerCase() || 
          this.options.transition.toLowerCase() === TRANSITION_SLIDE_RIGHT.toLowerCase();
      this.isSlideRight  = this.options.transition.toLowerCase() === TRANSITION_SLIDE_RIGHT.toLowerCase();

      this.isFadeIn = this.options.transition.toLowerCase() === TRANSITION_FADE_IN.toLowerCase();

      // Insert the first image to the end of slide and the last image to the start of slide
      if(images && images.length > 1){
        if(this.isSlideAnimation) {
          images.push(images[0]);
          images.splice(0,0,images[images.length-2]);
        }
      }

      // Create the slide
      if(images && images.length > 0) {
        container.style.height = this.options.height + 'px';
        container.style.width = this.options.width * (this.isSlideAnimation ? images.length : 1) + 'px';

        for(var i=0;i<images.length;i++) {
          var div = document.createElement('div');
          div.dataClass = new Array('slideshow-item');
          div.style.backgroundImage = "url('" + images[i] + "')";
          div.style.width = this.options.width + 'px';
          div.style.height = this.options.height + 'px';
          div.style.backgroundSize = this.options.backgroundSize;

          if(this.isSlideAnimation) {
            if(i == 1) {
              div.dataClass.push('active');
              this.currentIndex = 1;
            }
          } else {
            div.dataClass.push('none-slide');
            if(this.isFadeIn) {
              div.dataClass.push('fadein-slide');
            }
            if(i == 0)
              div.dataClass.push('active');
          }

          div.setAttribute('class', div.dataClass.join(' '));

          this.items.push(div);

          if(!this.isSlideRight)
            container.appendChild(div);
          else
            container.insertBefore(div, container.firstChild);
        }

        if(this.isSlideAnimation && images.length > 1) { 
          if(!this.isSlideRight) {
            setStyleCss3(container, 'transform', 'translate(-'+this.options.width+'px,0)')
          } else {
            setStyleCss3(container, 'transform', 'translate(-'+(this.options.width*(images.length-2))+'px,0)')
          }

          container.getBoundingClientRect();
          setStyleCss3(container, 'transition', 'transform ' + slideTransitionParam);
        } else {
          setStyleCss3(container, 'transition', 'none');
          setStyleCss3(container, 'transform', 'translate(0,0)');
        }
      }
    };

    SlideShow.prototype.registerEvent = function() {
      if(this.options.action.toLowerCase() === ACTION_CLICK.toLowerCase()) {
        this.container.onmouseup = this.slide.bind(this);
      } else if(this.options.action.toLowerCase() === ACTION_HOVER.toLowerCase()) { 
        this.container.onmouseenter = this.slide.bind(this);
        this.container.ontouchend = this.slide.bind(this);
      }

    };

    SlideShow.prototype.slide = function() {
      if(!this.enableNext)
        return;

      this.enableNext = false;

      if(!this.isSlideAnimation && !this.isFadeIn) {
        this.slideStatic();
      } else if(this.isFadeIn) {
        this.slideFadeIn();
      } else {
        this.slideAnimation();
      }
    }

    // Transition is none
    SlideShow.prototype.slideStatic = function() { 
      this.items[this.currentIndex].style.opacity = 0;
      this.currentIndex++;
      if(this.currentIndex >= this.items.length)
        this.currentIndex = 0;

      this.items[this.currentIndex].style.opacity = 1;

      this.enableNext = true;
    }

    // Transition is fade in
    SlideShow.prototype.slideFadeIn = function() { 
      var oldIndex = this.currentIndex;
      this.currentIndex++;
      if(this.currentIndex >= this.items.length)
        this.currentIndex = 0;

      var isEndAnimationOld = false;
      var isEndAnimationCurrent = false;

      var _self = this;

      // Check transition animation end of the old item

      var transitionEndOldItem = function() {
        if(isEndAnimationOld)
          return;
        isEndAnimationOld = true;

        if(this.removeEventListener) {
            for(var i = 0; i < animationEvents.length; i++) {
                this.removeEventListener(animationEvents[i], transitionEndOldItem, false);
            }
        } else if(this.detachEvent) {
            for(var i = 0; i < animationEvents.length; i++) {
                this.detachEvent(animationEvents[i], transitionEndOldItem, false);
            }
        }

        if(isEndAnimationCurrent)
          _self.enableNext = true;
      }

      if(this.items[oldIndex].addEventListener) {
          for(var i = 0; i < animationEvents.length; i++) {
              this.items[oldIndex].addEventListener(animationEvents[i], transitionEndOldItem, false);
          }
      } else if(this.items[oldIndex].attachEvent) {
          for(var i = 0; i < animationEvents.length; i++) {
              this.items[oldIndex].attachEvent(animationEvents[i], transitionEndOldItem, false);
          }
      }


      // Check transition animation end of the next item

      var transitionEndCurrentItem = function() {
        if(isEndAnimationCurrent)
          return;
        isEndAnimationCurrent = true;

        if(this.removeEventListener) {
            for(var i = 0; i < animationEvents.length; i++) {
                this.removeEventListener(animationEvents[i], transitionEndCurrentItem, false);
            }
        } else if(this.detachEvent) {
            for(var i = 0; i < animationEvents.length; i++) {
                this.detachEvent(animationEvents[i], transitionEndCurrentItem, false);
            }
        }

        if(isEndAnimationOld)
          _self.enableNext = true;
      }

      if(this.items[this.currentIndex].addEventListener) {
          for(var i = 0; i < animationEvents.length; i++) {
              this.items[this.currentIndex].addEventListener(animationEvents[i], transitionEndCurrentItem, false);
          }
      } else if(this.items[this.currentIndex].attachEvent) {
          for(var i = 0; i < animationEvents.length; i++) {
              this.items[this.currentIndex].attachEvent(animationEvents[i], transitionEndCurrentItem, false);
          }
      }

      this.items[oldIndex].style.opacity = 0;
      this.items[this.currentIndex].style.opacity = 1;
    }

    // Transition is slide
    SlideShow.prototype.slideAnimation = function() {
      if(this.isSlideRight)
        this.slideAnimationRight();
      else
        this.slideAnimationLeft();
    }

    SlideShow.prototype.registerSlideAnimationEnd = function(callback) { 

      var isAnimationEnd = false;
      var transitionEnd = function() {
        if(isAnimationEnd)
          return;

        isAnimationEnd = true;

        if(this.removeEventListener) {
            for(var i = 0; i < animationEvents.length; i++) {
                this.removeEventListener(animationEvents[i], transitionEnd, false);
            }
        } else if(this.detachEvent) {
            for(var i = 0; i < animationEvents.length; i++) {
                this.detachEvent(animationEvents[i], transitionEnd, false);
            }
        }

        if(callback)
          callback();
      };

      if(this.container.addEventListener) {
          for(var i = 0; i < animationEvents.length; i++) {
              this.container.addEventListener(animationEvents[i], transitionEnd, false);
          }
      } else if(this.container.attachEvent) {
          for(var i = 0; i < animationEvents.length; i++) {
              this.container.attachEvent(animationEvents[i], transitionEnd, false);
          }
      }
    }

    SlideShow.prototype.slideAnimationLeft = function() {
      var _self = this;

      this.registerSlideAnimationEnd(function(){
        if(_self.currentIndex >= _self.items.length - 1) {
          _self.currentIndex = 1;
          setStyleCss3(_self.container, 'transition', 'transform 0s');
          setStyleCss3(_self.container, 'transform', 'translate(-'+(_self.options.width * _self.currentIndex)+'px,0)');

          _self.container.getBoundingClientRect();

          setStyleCss3(_self.container, 'transition', 'transform ' + slideTransitionParam);
        }

        _self.enableNext = true;
      });

      this.currentIndex++;

      setStyleCss3(this.container, 'transform', 'translate(-'+(this.options.width * this.currentIndex)+'px,0)');
    }

    SlideShow.prototype.slideAnimationRight = function() { 
      var _self = this;

      this.registerSlideAnimationEnd(function(){
        if(_self.currentIndex >= _self.items.length - 1) {
          _self.currentIndex = 1;
          setStyleCss3(_self.container, 'transition', 'transform 0s');
          setStyleCss3(_self.container, 'transform', 'translate(-'+(_self.options.width * (_self.items.length - 1 - _self.currentIndex))+'px,0)');

          _self.container.getBoundingClientRect();

          setStyleCss3(_self.container, 'transition', 'transform ' + slideTransitionParam);
        }

        _self.enableNext = true;
      });

      this.currentIndex++;

      setStyleCss3(this.container, 'transform', 'translate(-'+(this.options.width * (this.items.length - 1 - this.currentIndex))+'px,0)');
    }

    /*================================================================================*/

    function createSlideshow() {
      slideShowContainer.innerHTML = "";

      var options = {
        width: containerWidth,
        height: containerHeight,
        transition: transitionType,
        action: actionType,
        backgroundSize: backgroundSize
      };

      var slideShow = new SlideShow(images, slideShowContainer, options);
      slideShow.registerEvent();
    }

    function startWidget(currentSesssion) {
      createSlideshow();
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
        if((!images || images.length == 0) && typeof BannerFlow != "undefined" && BannerFlow.editorMode) {
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

        useFeed = BannerFlow.settings.useFeed;
        transitionType = BannerFlow.settings.transitionType;
        actionType = BannerFlow.settings.actionType;
        backgroundSize = BannerFlow.settings.backgroundSize;

        if(!useFeed) {
          images = getImages(BannerFlow.settings.images, true);
        }
        
      } else {

        useFeed = false;
        transitionType = TRANSITION_SLIDE_LEFT;
        actionType = ACTION_CLICK;
        backgroundSize = BACKGROUND_COVER;

        images = new Array();
        images.push("http://www.hdwallpapers.in/walls/corona_del_mar_newport_beach-wide.jpg");
        images.push("http://www.hdwallpapers.in/walls/emma_stone_vogue_2016-wide.jpg");
        images.push("http://www.hdwallpapers.in/walls/space_orcus_4k-wide.jpg");
        images.push("http://www.hdwallpapers.in/walls/the_legend_of_tarzan_alexander_skarsgard_margot_robbie-HD.jpg");
        images.push("http://www.hdwallpapers.in/walls/lykan_hypersport_hypercar-wide.jpg");
        images.push("http://www.hdwallpapers.in/walls/zoe_saldana_star_trek_beyond-wide.jpg");
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

    function getFeedData() {
      if(!useFeed)
        return;

      images = new Array();
      var selectedKey = BannerFlow.getStyle('feed-field');

      if(selectedKey && selectedKey.length > 0) {
        for(var i=0;i<BannerFlow.feed.length;i++) {
          if(selectedKey === BannerFlow.feed[i].name) {
            for(var j=0;j<BannerFlow.feed[i].values.length;j++) {
              if(BannerFlow.feed[i].values[j])
                images.push(BannerFlow.feed[i].values[j]);
            }
          }
        }
      }

      if(BannerFlow.editorMode) {
        if(languageText && languageText.indexOf("://") >= 0) {
          images.push(languageText);
        }
      }
    }


    // var isStartAnimation = false;

    function onStart() {
      // if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
      //     return;
      // }

      // isStartAnimation = true;

      loadSettings();
      getFeedData();
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

      onStart();
    }

    function onTextChanged() {
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
          return;
      }

      languageText = BannerFlow.text;
      onStart();
    }

    return {
      start: onStart,

      onResized: onResized,

      onSettingChanged: onSettingChanged,

      textChanged: onTextChanged
    };
})();

if(typeof BannerFlow == "undefined"){
  ClickSlideshow.start();
} else {
  BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function () {
    ClickSlideshow.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    ClickSlideshow.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    ClickSlideshow.onSettingChanged();
  });

  BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    ClickSlideshow.textChanged();
  });
}

