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
}

function preProcessLanguageText(text) {
  text = text || "";

  var removeTags = ["s","u","i","b"];
  var patt;

  for(var i=0;i<removeTags.length;i++) {
    var patt = new RegExp("</?" + removeTags[i] + ">", "g");
    text = text.replace(patt, "");
  }

  var lineTexts = new Array();
  patt = new RegExp("<div>([^<]*)</div>", "g");
  var m;

  lineTexts = new Array();
  while(m = patt.exec(text)) {
    lineTexts.push(m[1]);
  }

  if(lineTexts.length == 0)
    lineTexts.push(text);

  return lineTexts;
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

var SpinningWheel = (function() {
    
    // Helpers
    var blackHex = '#d2e2e1',
        whiteHex = '#fff',
        halfPI = Math.PI / 2,
        doublePI = Math.PI * 2;

    String.prototype.hashCode = function(){
      // See http://www.cse.yorku.ca/~oz/hash.html
      var hash = 5381,
              i;
      for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)+hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    };

    Number.prototype.mod = function(n) {
      return ((this%n)+n)%n;
    };
        
    // Wheel
    var wheel = {
      isRunning: false,
      isStop: false,

      width: 1000,
      height: 800,
      timerHandle : 0,
      timerDelay : 1000/60,

      angleCurrent : 0,
      angleDelta : 0,

      size : 800/2-15,

      canvasContext : null,

      colors : [ '#003366','#FF6600','#CCCC00','#006600','#3333CC','#CC0066','#FF3300','#009900' ],

      backgroundImage: "",

      segments : [],

      icons: [],

      seg_colors : [], // Cache of segments to colors
      
      maxSpeed : Math.PI / 18,
      baseSpeed: Math.PI / 45,

      upTime : 1000, // How long to spin up for (in ms)
      baseUpTime: 1000,
      downTime : 5000, // How long to slow down for (in ms)
      baseDownTime: 5000,

      spinStart : 0,

      centerX : 1000/2,
      centerY : 800/2,

      realRotated: 0,
      
      stopAt: 0,

      paddingEdge: 15,

      init: function(option) {
        
        this.option = option;

        if(option.width && option.height && option.width > 0 && option.height > 0) {
          this.width = option.width;
          this.height = option.height;
          this.size = this.width < this.height ? this.width/2 - 15 : this.height/2 - 15;

          this.centerX = this.width/2;
          this.centerY = this.height/2;
        }

        if(!this.option || this.option.stopRandom) {
          this.stopAt = -1;
        } else {
          if(this.option.isText) {
            if(this.option.stopAt < 0 || this.option.stopAt >= this.segments.length)
              this.option.stopAt = 0;
          } else if(this.option.stopAt < 0 || this.option.stopAt >= this.icons.length)
              this.option.stopAt = 0;

          this.stopAt = this.option.stopAt;
        }

        if(this.option && this.option.paddingEdge >= 0)
          this.paddingEdge = this.option.paddingEdge;


        this.initCanvas();
        this.draw();
      },

      initCanvas: function() {
        var canvas = get('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.addEventListener("click", this.spin.bind(this), false);
        this.canvasContext = canvas.getContext("2d");
      },

      spin: function() {
        // Start the wheel only if it's not already spinning
        if (this.timerHandle == 0) {
          if(this.stopAt < 0 || this.stopAt >= this.segments.length)
            this.maxSpeed = (this.option.maxSpeed ? this.option.maxSpeed : 5) * Math.PI / (90 + Math.random()); // Randomly vary how hard the spin is
          else
            this.maxSpeed = (this.option.maxSpeed ? this.option.maxSpeed : 5) * this.baseSpeed;

          if(this.stopAt >= 0) {
            this.spinEndAtDefinedSpot();
          } else {
            this.spinStart = new Date().getTime();
            this.timerHandle = setInterval(this.onTimerTick.bind(this), this.timerDelay);
          }
        }
      },

      spinEndAtDefinedSpot: function() {
        var totalTimeUp  = Math.round(this.upTime/this.timerDelay);
        var acceleratorUp = this.maxSpeed/totalTimeUp;
        var totalAngleUp = totalTimeUp * totalTimeUp * acceleratorUp/2;

        // Calculate real angle end
        var totalTimeDown  = Math.round(this.downTime/this.timerDelay);
        var acceleratorDown = -this.maxSpeed/totalTimeDown;
        var totalAngleDown =  this.maxSpeed * totalTimeDown + acceleratorDown * totalTimeDown * totalTimeDown / 2;

        var totalAngle = this.angleCurrent + totalAngleUp + totalAngleDown;
        
        // if(totalAngle < doublePI)
        //   return;

        var realAngleEnd = totalAngle - Math.floor(totalAngle/doublePI) * doublePI;

        var len = (!this.option || this.option.isText) ? this.segments.length : this.icons.length;

        var angleAtStop = ((len - 1 - this.stopAt) + 0.5) *  doublePI / len;
        var delta = doublePI/len/4;

        if(realAngleEnd < angleAtStop - delta || realAngleEnd > angleAtStop + delta) {
          realAngleEnd = angleAtStop;
        }

        // Recalculate acceleratorDown after having new angle end
        totalAngle = Math.floor(totalAngle/doublePI) * doublePI + realAngleEnd;
        while(totalAngle < totalAngleUp + this.angleCurrent) {
          totalAngle += doublePI;
        }

        totalAngleDown = totalAngle - totalAngleUp - this.angleCurrent;
        // acceleratorDown = 2 * (totalAngleDown - this.maxSpeed * totalTimeDown) / totalTimeDown / totalTimeDown;
        acceleratorDown = -2 * totalAngleDown / totalTimeDown / totalTimeDown;
        var maxSpeedDown = -acceleratorDown * totalTimeDown;

        this.aUp = acceleratorUp;
        this.tUp = totalTimeUp;
        this.aDown = acceleratorDown;
        this.tDown = totalTimeDown;
        this.maxSpeedDown = maxSpeedDown;
        this.countUp = 1;
        this.countDown = 1;
        // this.totalAngleDown = totalAngleDown;

        this.timerHandle = setTimeout(this.onTimerTickWithDefinedStop.bind(this), this.timerDelay);
      },

      onTimerTick: function() {
        
        if(this.isStop) {
          this.isRunning = false;
          clearTimeout(this.timerHandle);
          return;
        }

        this.isRunning = true;

        var duration = (new Date().getTime() - this.spinStart),
            progress = 0,
            finished = false;

        this.draw();

        if (duration < this.upTime) {
          progress = duration / this.upTime;
          this.angleDelta = this.maxSpeed * Math.sin(progress * halfPI);
        } else {
          progress = duration / this.downTime;
          this.angleDelta = this.maxSpeed * Math.sin(progress * halfPI + halfPI);

          if(progress > 1) {
            finished = true;
          }
        }

        this.angleCurrent += this.angleDelta;

        // Keep the angle in a reasonable range
        while (this.angleCurrent >= doublePI) {
          this.angleCurrent -= doublePI;
        }

        if (finished) {
          clearInterval(this.timerHandle);
          this.timerHandle = 0;
          this.angleDelta = 0;
        }
      },

      onTimerTickWithDefinedStop: function() {

        if(this.isStop) {
          this.isRunning = false;
          clearTimeout(this.timerHandle);
          return;
        }

        this.isRunning = true;

        var finished = false;
        var s = 0;

        this.draw();

        if(this.countUp <= this.tUp) {
          s = (this.countUp > 0 ? (this.countUp + (this.countUp-1)) : 0) * this.aUp/2; //s2-s1
          this.countUp++;
        } else if(this.countDown <= this.tDown) {
          s = this.maxSpeedDown + (this.countDown > 0 ? (this.countDown + (this.countDown-1)) : 0) * this.aDown/2; //s2-s1
          this.countDown++;
          this.isDown = true;
        } else {
          finished = true;
        }

        if (finished) {
          // console.log('real rotated down vs calculated dow', this.realRotated, "-" ,this.totalAngleDown);

          clearTimeout(this.timerHandle);
          this.timerHandle = 0;
          this.realRotated = 0;
          this.isDown = false;
        } else {
          this.angleCurrent += s;

          if(this.isDown) {
            this.realRotated += s;
          }

          // Keep the angle in a reasonable range
          while (this.angleCurrent >= doublePI) {
            this.angleCurrent -= doublePI;
          }

          this.timerHandle = setTimeout(this.onTimerTickWithDefinedStop.bind(this), this.timerDelay);
        }

      },

      // Called when segments have changed
      update: function() {
        // Ensure we start mid way on a item
        //var r = Math.floor(Math.random() * wheel.segments.length);
        var r = 0,
            colors   = this.colors,
            colorLen = colors.length,
            seg_color = [],
            len     = (this.option && !this.option.isText) ? this.icons.length : this.segments.length,
            i;
        this.angleCurrent = ((r + 0.5) / len) * doublePI;
              
        for (i = 0; i < len; i++){
          seg_color.push(colors[i%colors.length]);
        }

        this.seg_colors = seg_color;
        this.draw();
      },

      draw : function() {
        this.clear();
        this.drawWheel();
        this.drawNeedle();
      },

      clear : function() {
        this.canvasContext.clearRect(0, 0, this.width, this.height);
      },

      getIndexAt: function(angle) {
        return this.segments.length - Math.floor((angle / doublePI) * this.segments.length) - 1;
      },

      drawNeedle : function() {
        var ctx = this.canvasContext,
        centerX = this.centerX,
        centerY = this.centerY,
        size = this.size,
        centerSize = centerX + size,
        len = this.segments.length,
        i, winner;

        ctx.lineWidth = 2;
        ctx.strokeStyle = blackHex;
        ctx.fillStyle = whiteHex;

        ctx.beginPath();

        ctx.moveTo(centerSize - 10, centerY);
        ctx.lineTo(centerSize + 10, centerY - 10);
        ctx.lineTo(centerSize + 10, centerY + 10);
        ctx.closePath();

        ctx.stroke();
        ctx.fill();

        // Which segment is being pointed to?
        // i = len - Math.floor((this.angleCurrent / doublePI) * len) - 1;

        // Now draw the winning name
        // ctx.textAlign = "left";
        // ctx.textBaseline = "middle";
        // ctx.fillStyle = blackHex;
        // ctx.font = "32px Arial";
        // ctx.fillText(i, centerSize + 20, centerY);
      },

      drawSegment : function(key, lastAngle, angle) {
        var ctx = this.canvasContext,
        centerX = this.centerX,
        centerY = this.centerY,
        size    = this.size,
        colors  = this.seg_colors;

        if(!this.backgroundImage) {
          //ctx.save();
          ctx.beginPath();

          // Start in the centre
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, size, lastAngle, angle, false); // Draw an arc around the edge
          ctx.lineTo(centerX, centerY); // Now draw a line back to the centre

          // Clip anything that follows to this area
          //ctx.clip(); // It would be best to clip, but we can double performance without it
          ctx.closePath();

          ctx.fillStyle = colors[key];
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.beginPath();

          // Start in the centre
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, size, lastAngle, angle, false); // Draw an arc around the edge
          ctx.lineTo(centerX, centerY); // Now draw a line back to the centre

          ctx.closePath();
          ctx.stroke();
        }

        // Now draw the text
        ctx.save(); // The save ensures this works on Android devices
        ctx.translate(centerX, centerY);
        ctx.rotate((lastAngle + angle) / 2);

        ctx.fillStyle = (this.option && this.option.textColor) ? this.option.textColor : whiteHex;

        if(this.option.isText) {
          var value = this.segments[key];
          ctx.fillText(value, size - this.paddingEdge, 0);
        } else {
          var image = this.icons[key];
          var width = this.option && this.option.imageSize ? this.option.imageSize : 30;
          var height = image.height/image.width * width;

          ctx.drawImage(image, size - this.paddingEdge - width, -height/2, width, height);
        }

        ctx.restore();
      },

      drawWheel : function() {
        var ctx = this.canvasContext,
        angleCurrent = this.angleCurrent,
        lastAngle    = angleCurrent,
        len     = (this.option && !this.option.isText) ? this.icons.length : this.segments.length,
        centerX = this.centerX,
        centerY = this.centerY,
        size    = this.size,
        angle,i;

        // Draw background image

        if(this.backgroundImage) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angleCurrent);

          ctx.beginPath();
          ctx.arc(0, 0, size, 0, doublePI, false);
          ctx.closePath();
          ctx.clip();

          var width  = this.backgroundImage.width;
          var height = this.backgroundImage.height;

          if(width > height) {
            width  = width * 2 * size/height;
            height = 2*size;
          } else {
            height = height * 2 * size/width;
            width  = 2*size;
          }

          ctx.drawImage(this.backgroundImage, -width/2, -height/2, width, height);
          ctx.restore();
        }

        ctx.lineWidth    = 1;
        ctx.strokeStyle  = blackHex;
        ctx.textBaseline = "middle";
        ctx.textAlign    = "right";
        if(this.option && this.option.font && this.option.textSize)
          ctx.font       = this.option.textSize +  "px " + this.option.font;
        else ctx.font    = "1em Arial";

        for (i = 1; i <= len; i++) {
          angle = doublePI * (i / len) + angleCurrent;
          this.drawSegment(i - 1, lastAngle, angle);
          lastAngle = angle;
        }

        // Draw a center circle

        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, doublePI, false);
        ctx.closePath();

        ctx.fillStyle   = whiteHex;
        ctx.fill();
        ctx.stroke();

        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, doublePI, false);
        ctx.closePath();

        ctx.lineWidth   = 2;
        ctx.stroke();
      }
    };


  //--------------------------------------------------------------
  //--------------------------------------------------------------
  //--------------------------------------------------------------
  //--------------------------------------------------------------
  //--------------------------------------------------------------


    var container = get('widgetContainer');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;


    /*--- settings from banner flow ---*/
    var languageText, font, textColor, textSize;
    var images, imageSize;
    var contentType;
    var colors;
    var backgroundImage;
    var stopRandom;
    var stopAt;
    var maxSpeed;
    var paddingEdge;
    var duration;

    var CONTENT_TEXT = "Text";
    var CONTENT_IMAGE = "Image";

    /*--- other variables ---*/
    var arrLanguageText = [];


    function startWidget(currentSesssion) {
      if(currentSesssion != sessionId)
        return;

      // Get text
      if(languageText && languageText.length > 0) {
        arrLanguageText = preProcessLanguageText(languageText);
        wheel.segments = [];
        for(var i=0; i<arrLanguageText.length; i++) {
          wheel.segments.push(arrLanguageText[i]);
        }
      }

      // Get images
      if(images && images.length > 0) {
        wheel.icons = [];
        for(var i=0; i<images.length; i++) {
          wheel.icons.push(images[i]);
        }
      }

      if(contentType.toLowerCase() == CONTENT_TEXT.toLowerCase()) {
        if(!arrLanguageText || arrLanguageText.length == 0)
          return;

        if(stopRandom == false && (stopAt <= 0 || stopAt > arrLanguageText.length))
          stopAt = 1;
      } else {
        if(!images || images.length == 0)
          return;

        if(stopRandom == false && (stopAt <= 0 || stopAt > images.length))
          stopAt = 1;
      }

      if(colors && colors.length > 0) {
        wheel.colors = [];
        for(var i=0; i<colors.length; i++) {
          wheel.colors.push(colors[i]);
        }
      }

      wheel.backgroundImage = backgroundImage;

      wheel.upTime = wheel.baseUpTime / (wheel.baseUpTime + wheel.baseDownTime) * duration;
      wheel.downTime = wheel.baseDownTime / (wheel.baseUpTime + wheel.baseDownTime) * duration;

      wheel.init({
        width: containerWidth,
        height: containerHeight,
        maxSpeed: maxSpeed,
        stopRandom: stopRandom,
        stopAt: stopAt - 1,
        isText: (contentType.toLowerCase() == CONTENT_TEXT.toLowerCase()) ? true : false,

        font: font,
        textColor: textColor,
        textSize: textSize,
        imageSize: imageSize,
        paddingEdge: paddingEdge
      });

      wheel.update();
    }

    /*==============================================*/
    /*===== Start point of animation  =====*/
    /*==============================================*/

    function reloadGlobalVariables() {

      containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
      containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

    }

    function stopCurrentAnimation(callback) {

        wheel.isStop = true;

        if(wheel.isRunning) {
            var timeout = setTimeout(function(){
                clearTimeout(timeout);
                stopCurrentAnimation(callback);
            }, 200);
        } else {
            wheel.isStop = false;
            if(callback)
                callback();
        }

    }

    function startAnimation(currentSesssion) {
        stopCurrentAnimation(function(){
          if((contentType.toLowerCase() == CONTENT_IMAGE.toLowerCase() && images && images.length > 0) || (backgroundImage && backgroundImage.length > 0)) {
            var loadedImages = [];
            var bgImage = "";
            var count = 0;

            var totalImage = images.length;

            if(backgroundImage && backgroundImage.length > 0)
              totalImage++;

            var cbLoadedImage = function() {
              count++;

              if(count == totalImage) {
                if(currentSesssion == sessionId) {
                  backgroundImage = bgImage;
                  images = loadedImages;

                  startWidget(currentSesssion);
                }
              }
            }

            for(var i=0; i<images.length; i++) {
              var image = new Image();
              image.onload = cbLoadedImage;
              image.src = images[i];

              loadedImages.push(image);
            }

            if(backgroundImage && backgroundImage.length > 0) {
              bgImage = new Image();
              bgImage.onload = cbLoadedImage;
              bgImage.src = backgroundImage;
            }

          } else
            startWidget(currentSesssion);
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

      colors = [];

      if(typeof BannerFlow !== "undefined") {
        font        = BannerFlow.settings.font;
        textColor   = BannerFlow.settings.textColor;
        textSize    = BannerFlow.settings.textSize;
        images      = getImages(BannerFlow.settings.images, true);
        imageSize   = BannerFlow.settings.imageSize;
        contentType = BannerFlow.settings.contentType;

        for(var i=1; i<=8; i++) {
          if(BannerFlow.settings["color"+i])
            colors.push(BannerFlow.settings["color"+i]);
        }

        backgroundImage = "";
        var backgroundImageData = getImages(BannerFlow.settings.backgroundImage, true);
        if(backgroundImageData && backgroundImageData.length > 0) {
          backgroundImage = backgroundImageData[0];
        }

        maxSpeed   = BannerFlow.settings.maxSpeed;
        stopRandom = BannerFlow.settings.stopRandom;
        stopAt     = BannerFlow.settings.stopAt;
        paddingEdge = BannerFlow.settings.paddingEdge;
        duration   = BannerFlow.settings.duration;
        
      } else {
        font        = "";
        textColor   = "#ff0000";
        textSize    = 16;
        images      = ["./1.png", "./2.png", "./3.png", "./4.png", "./5.png", "./6.png"];
        imageSize   = 30;
        contentType = CONTENT_IMAGE;
        colors      = ["red", "green", "blue", "yellow"];
        backgroundImage = "./background.jpg";
        maxSpeed    = 5;
        stopRandom  = false;
        stopAt      = 1;
        paddingEdge = 10;
        duration    = 1;
      }

      font     = getFont(font);
      if(maxSpeed <= 0)
        maxSpeed = 1;

      if(imageSize <= 0)
        imageSize = 10;

      if(stopAt <= 0)
        stopAt = 1;

      if(duration <= 0)
        duration = 5;

      duration *= 1000;

    }

    function getLanguageText() {
        if(typeof BannerFlow !== "undefined") {
          languageText = BannerFlow.text;
        } else {
          languageText = "<div>Option 1</div><div>Option 2</div><div>Option 3</div><div>Option 4</div><div>Option 5</div>";
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

    
    // var isStartAnimation = false;

    function onStart() {
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

    return {
        start: onStart,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    SpinningWheel.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        SpinningWheel.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        SpinningWheel.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        SpinningWheel.start();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        SpinningWheel.start();
    });
}


