function get(el) {
    if(typeof el === "string") 
        return document.getElementById(el);
    return el;
}

function degreesToRads(degrees) {
  return degrees / 180 * Math.PI;
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

var BouncingObject = (function(){

    var container = get('widgetContainer');
    var canvas = get('widgetCanvas');
    var context = canvas.getContext('2d');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    /*--- settings from banner flow ---*/

    var image, ballColor;
    var bounceLength, bounceHeight;
    var bounceType;
    var radius, speed;
    
    var BOUNCE_TYPE_SAME_HEIGHT = "Same height";
    var BOUNCE_TYPE_LOWER = "Lower and lower";
    var BOUNCE_REDUCE = 10;


    function BounceBall(x, y, radius, color, image, speed, bounceHeight, bounceLength, maxHeight, maxWidth) {
        this.x            = x;
        this.y            = y;
        this.x0           = x;
        this.y0           = y;
        this.radius       = radius;
        this.color        = color;
        this.image        = image;
        this.speed        = speed/20;
        this.bounceHeight = bounceHeight;
        this.bounceLength = bounceLength;
        this.maxHeight    = maxHeight;
        this.maxWidth     = maxWidth;

        this.bounceReduce = 0;
        this.isRevert = false;
        this.translateX = 0;
        this.rotate = 0;
        this.limitHeightToScale = 20;

        this.allPoints = [];

        if(this.image) {
            var imgWidth  = this.image.width;
            var imgHeight = this.image.height;

            if(imgWidth > imgHeight) {
                this.imgWidth = 2*this.radius;
                this.imgHeight = imgHeight/imgWidth*this.imgWidth;
            } else {
                this.imgHeight = 2*this.radius;
                this.imgWidth = imgWidth/imgHeight*this.imgHeight;
            }
        }
    }

    BounceBall.prototype.setBounceReduce = function(boundReduce) {
        this.bounceReduce = boundReduce;
    }

    BounceBall.prototype.update = function() {
        if(this.bounceHeight <= 0.5 || this.bounceLength <= 0.5 || this.x >= this.maxWidth + this.radius)
            return false;

        this.x0 = this.x;
        this.y0 = this.y;

        this.x += this.speed;
        this.y = this.bounceHeight * Math.sin((this.x - this.translateX) * Math.PI/this.bounceLength + Math.PI/2);

        var isUpdateBounceParam = false;

        if(this.y < 0) {
            this.y *= -1;
            if(!this.isRevert) {
                this.isRevert = true;
                isUpdateBounceParam = true;
            }
        } else {
            if(this.isRevert) {
                this.isRevert = false;
                isUpdateBounceParam = true;
            }
        }

        if(isUpdateBounceParam) {
            this.bounceHeight *= (100 - this.bounceReduce)/100;
            this.bounceLength *= (100 - this.bounceReduce)/100;
            this.translateX = this.x - this.bounceLength - this.bounceLength/2;
            this.y0 = this.bounceHeight * Math.sin((this.x - this.translateX) * Math.PI/this.bounceLength);
        }

        this.y = this.maxHeight - this.y;
        this.y -= this.radius;

        this.rotate += 0.008 * this.speed;

        this.allPoints.push({x: this.x, y: this.y});

        return true;
    }

    BounceBall.prototype.draw = function(ctx, isEnd) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate);

        if(this.y >= this.maxHeight - this.radius*1.05 && this.bounceHeight >= this.limitHeightToScale  && !isEnd){
            ctx.scale(1, this.radius/(this.maxHeight - this.y));
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
        if(this.image) {
            ctx.clip();
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.imgWidth/2, -this.imgHeight/2, this.imgWidth, this.imgHeight);
        } else{
            ctx.fill();
        }

        ctx.restore();
    }

    BounceBall.prototype.drawAllPoints = function(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        for(var i=0; i < this.allPoints.length; i++) {
            ctx.beginPath();
            ctx.arc(this.allPoints[i].x, this.allPoints[i].y, 5, 0, Math.PI * 2, false);
            ctx.fill();
        }
        ctx.restore();
    }


    var ball;

    function startWidget(currentSesssion){

        if(!containerWidth || !containerHeight)
            return;

        canvas.width = containerWidth;
        canvas.height = containerHeight;

        var imageData = null;
        if(image && image.length > 0) {
            imageData = new Image();
            imageData.onload = function() {
                if(currentSesssion != sessionId)
                    return;

                ball = new BounceBall(0, 0, radius, ballColor, this, speed, bounceHeight, bounceLength, containerHeight, containerWidth);
                if(bounceType.toLowerCase() === BOUNCE_TYPE_LOWER.toLowerCase()){
                    ball.setBounceReduce(BOUNCE_REDUCE);
                }
                update();
            };
            imageData.src = image;
        } else {
            ball = new BounceBall(0, 0, radius, ballColor, null, speed, bounceHeight, bounceLength, containerHeight, containerWidth);
            if(bounceType.toLowerCase() === BOUNCE_TYPE_LOWER.toLowerCase()){
                ball.setBounceReduce(BOUNCE_REDUCE);
            }
            update();
        }
    }

    function update() {

        if(isStop){
            isRunning = false;
            ball = null;
            return;
        }

        isRunning = true;

        if(ball.update()) {
            context.clearRect(0, 0, containerWidth, containerHeight);
            // context.fillStyle = "red";
            // context.fillRect(0, containerHeight - bounceHeight, 10, bounceHeight);
            // context.fillRect(0, containerHeight - bounceHeight, containerWidth, 10);
            ball.draw(context);
            requestAnimationFrame(update);
        } else {
            context.clearRect(0, 0, containerWidth, containerHeight);
            ball.draw(context, true);
            isRunning = false;
            ball = null;
        }

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
            startWidget(currentSesssion);
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined") {

            var imageData = getImages(BannerFlow.settings.image, true);
            image        = (imageData && imageData.length > 0) ? imageData[0] : "";
            
            ballColor    = BannerFlow.settings.ballColor;
            bounceLength = BannerFlow.settings.bounceLength;
            bounceHeight = BannerFlow.settings.bounceHeight;
            bounceType   = BannerFlow.settings.bounceType;
            radius       = BannerFlow.settings.ballRadius;
            speed        = BannerFlow.settings.speed;

        } else {

            image        = "ball.png";
            ballColor    = "#00ffff";
            bounceLength = 200;
            bounceHeight = 500;
            bounceType   = BOUNCE_TYPE_LOWER;
            radius       = 30;
            speed        = 20;

        }

        if(radius <= 0)
            radius = 1;
        if(bounceLength <= 0)
            bounceLength = 1;
        if(bounceHeight <= 0)
            bounceHeight = 1;

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
    //   if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
    //       return;
    //   }

    //   isStartAnimation = true;
      init();
    }


    function onResize(){
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
          return;
      }

      init();
    }

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
    BouncingObject.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        BouncingObject.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        BouncingObject.onSettingChanged();
    });

    // BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    //     BouncingObject.start();
    // });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        BouncingObject.start();
    });
}

