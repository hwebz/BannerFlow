function isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}


var ClipPathVideoWidget = (function(){

  var videoUrl;// = "https://cfvod.kaltura.com/pd/p/939341/sp/93934100/serveFlavor/entryId/1_o5ymqou9/v/11/flavorId/1_0gidtbc3/name/a.mp4";
  var imageMaskUrl;// = "http://i.imgur.com/p3FWBWd.png?1";
  var maskOpacity = 0.5;

  var container = document.getElementById('clipVideoContainer');
  var containerWidth, containerHeight;

  
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


  function ClipPathVideo(imgUrl, videoUrl, maskOpacity, containerWidth, containerHeight, container) {

    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;

    this.container = container;

    this.timeoutDraw = null;

    this.imageMask = {
      x: 0, y: 0, // position of the image on canvas
      _width: 0, _height: 0, // the original size of the image
      width: 0, height: 0, // the final size of the image
      url: imgUrl,
      image: null,
      opacity: maskOpacity
    };

    this.video = {
      x: 0, y: 0, // position of the video on canvas
      _width: 0, _height: 0, // the original size of the video
      width: 0, height: 0, // the final size of the video
      url: videoUrl,
      video: null
    };

  }

  ClipPathVideo.prototype.init = function() {

    // Create canvas
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', this.containerWidth);
    canvas.setAttribute('height', this.containerHeight);
    this.ctx = canvas.getContext('2d');
    this.container.appendChild(canvas);

    // Load the mask image

    var self = this;
    this.imageMask.image = new Image();
    this.imageMask.image.onload = function() {

      // Save the original size
      self.imageMask._width = this.width;
      self.imageMask._height = this.height;

      var tmp;

      // Save the new size of the image
      if(self.containerWidth/self.containerHeight >= this.width/this.height) {

        tmp = this.height;
        this.height = self.containerHeight;
        this.width *= this.height/tmp;

      } else {

        tmp = this.width;
        this.width = self.containerWidth;
        this.height *= this.width/tmp;

      }

      // Save the resized size
      self.imageMask.width = this.width;
      self.imageMask.height = this.height;

      self.imageMask.x = (self.containerWidth - this.width)/2;
      self.imageMask.y = (self.containerHeight - this.height)/2;

      self.addVideo();

    };

    this.imageMask.image.src = this.imageMask.url;

  }



  ClipPathVideo.prototype.addVideo = function() {

    var self = this;

    var storeVideoSize = function() {

      // Save the original size of the video
      self.video._width = this.videoWidth;
      self.video._height = this.videoHeight;

      // Calculate the new size of the video on canvas
      if(self.imageMask.width / self.imageMask.height >= this.videoWidth / this.videoHeight) {

        self.video.width = self.imageMask.width;
        self.video.height = this.videoHeight * self.imageMask.width / this.videoWidth;

      } else {

        self.video.height = self.imageMask.height;
        self.video.width = this.videoWidth * self.imageMask.height / this.videoHeight;

      }

      self.video.x = (self.imageMask.width - self.video.width)/2 + self.imageMask.x;
      self.video.y = (self.imageMask.height - self.video.height)/2 + self.imageMask.y;

      self.drawVideo();

    }

    var video = document.createElement('video');
    video.setAttribute('controls','controls');
    video.setAttribute('autoplay','autoplay');
    //video.setAttribute('loop','true');
    video.style.display = "none";

    // Add play button
    var playButton = document.createElement('div');
    playButton.setAttribute('class','play-icon');
    playButton.innerHTML = "&nbsp;";

    if(!isTouchDevice()) {
      playButton.style.display = "none";
    }

    this.container.appendChild(playButton);

    if(video.addEventListener) {

      video.addEventListener( "loadedmetadata", storeVideoSize, false );
      playButton.addEventListener('touchstart', function() {
        video.play();
        this.style.display = "none";
      }, false);

    } else if(video.attachEvent) {

      video.attachEvent( "loadedmetadata", storeVideoSize, false );
      playButton.attachEvent('touchstart', function() {
        video.play();
        this.style.display = "none";
      }, false);

    }


    video.src = this.video.url;

    this.video.video = video;

    this.container.appendChild(video);

  }



  ClipPathVideo.prototype.refresh = function(containerWidth, containerHeight) {
    this.container.innerHTML = "";
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;

    if(this.video.video){
      this.video.video.pause();
      this.video.video = null;
    }

    if(this.timeoutDraw){
      clearTimeout(this.timeoutDraw);
      this.timeoutDraw = null;
    }
  }

  ClipPathVideo.prototype.drawVideo = function() {

    var self = this;

    try {
      this.ctx.clearRect(0,0,this.containerWidth, this.containerHeight);

      this.ctx.save();

      this.ctx.drawImage(this.video.video, 0, 0, this.video._width, this.video._height, this.video.x, this.video.y, this.video.width, this.video.height);
      this.ctx.globalCompositeOperation = "destination-in";
      this.ctx.drawImage(this.imageMask.image, 0, 0, this.imageMask._width, this.imageMask._height, this.imageMask.x, this.imageMask.y, this.imageMask.width, this.imageMask.height);

      this.ctx.restore();

      this.ctx.save();
      this.ctx.globalAlpha = this.imageMask.opacity;
      this.ctx.drawImage(this.imageMask.image, 0, 0, this.imageMask._width, this.imageMask._height, this.imageMask.x, this.imageMask.y, this.imageMask.width, this.imageMask.height);      
      this.ctx.restore();      

    } catch(ex){}

    this.timeoutDraw = setTimeout(function() {
      clearTimeout(self.timeoutDraw);

      if(isStop) {
        isRunning = false;
        self.refresh();
        return;
      }

      isRunning = true;

      self.drawVideo();
    }, 30);

  }

  function stopAnimation() {}


  /*==============================================*/
  /*===== Start point of animation  =====*/
  /*==============================================*/

  function reloadGlobalVariables() {

    containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
    containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

  }

  var clipPathVideo;

  var isRunning = false;
  var isStop = false;

  function startAnimation(currentSesssion) {
      stopCurrentAnimation(function(){
          startWidget(currentSesssion);
      });
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

  function startWidget(currentSesssion) {

    if(!imageMaskUrl || imageMaskUrl.length == 0 || !videoUrl || videoUrl.length == 0)
      return;

    clipPathVideo = new ClipPathVideo(imageMaskUrl, videoUrl, maskOpacity, containerWidth, containerHeight, container);
    clipPathVideo.init();
    
  }

  /*==============================================*/
  /*===== Default settings from Banner Flow  =====*/
  /*==============================================*/

  function loadSettings() {
    if(typeof BannerFlow !== "undefined"){
      
      videoUrl = BannerFlow.settings.videoUrl;
      imageMaskUrl = "";
      var selectedImages = getImages(BannerFlow.settings.imageMaskUrl, true);
      if(selectedImages && selectedImages.length > 0) {
        imageMaskUrl = selectedImages[0];
      }

      maskOpacity = BannerFlow.settings.maskOpacity;
      if(maskOpacity > 100)
        maskOpacity = 1;
      else 
        maskOpacity /= 100;
      
    } else {
      //videoUrl = "./../testing/BigBuckBunny_640x360.mp4";//"https://cfvod.kaltura.com/pd/p/939341/sp/93934100/serveFlavor/entryId/1_o5ymqou9/v/11/flavorId/1_0gidtbc3/name/a.mp4";
      videoUrl = "./bannerflow-culture-video.mp4";
      // imageMaskUrl = "https://bannerflow.blob.core.windows.net/resources/wolf-497efc2e-edac-40b0-a072-affdafbb2aab.png";
      imageMaskUrl = "./mask.png";
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

  function onResized(){
    init();
  }

  function onSettingChanged(){
    init();
  }


  return {
      start: init,

      onResized: onResized,

      onSettingChanged: onSettingChanged,

      changeOpacity: function(opacity) {
        if(timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function() {
                loadSettings();
                maskOpacity = opacity;
                reloadGlobalVariables();
                startAnimation(++sessionId);
            }, 500);
        } else {
            timeoutStart = setTimeout(function(){
                loadSettings();
                maskOpacity = opacity;
                reloadGlobalVariables();
                startAnimation(++sessionId);
            }, 0);
        }
      }
  };
})();

if(typeof BannerFlow == "undefined"){
  ClipPathVideoWidget.start();
} else {
  BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function () {
      ClipPathVideoWidget.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
      ClipPathVideoWidget.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
      ClipPathVideoWidget.onSettingChanged();
  });
}
