var img = document.getElementById('img');
var noImg = document.getElementById('no-image')
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var w;
var h;
var orgImgW;
var orgImgH;
var imgW;
var imgH;
var scale = 1; 

// Widget has loaded
BannerFlow.addEventListener(BannerFlow.INIT, function () {
    onResize();
    
    // User moves cursor over the widget (or gyro event fired)
	if (isMobile && window.DeviceOrientationEvent)
    	window.addEventListener("deviceorientation", function () { onGyroMove(event.alpha, event.beta, event.gamma);  }, true);
    if (isMobile && window.DeviceMotionEvent)
    	window.addEventListener("devicemotion", function () { onGyroMove(event.alpha, event.rotationRate.beta, event.rotationRate.gamma);  }, true);
	if (!isMobile){
    	BannerFlow.addEventListener(BannerFlow.MOUSE_MOVE, onMouseMove);
    }
});

// Background image URL has changed
BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    loadImage(BannerFlow.text);
});

// Widget settings have changed
BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    scale = 1 + BannerFlow.settings.parallaxScale/100;
    resetParallax();
});

// Designer resizes widget in banner editor
BannerFlow.addEventListener(BannerFlow.RESIZE, onResize);

function onGyroMove(alpha,beta,gamma) {
    //document.getElementById('pos').innerHTML = 'a: ' + Math.round(alpha) + ' b: ' + Math.round(beta) + ' g: ' + Math.round(gamma) + ' o: ' + window.orientation;
    //console.log('onGyroMove', alpha,beta,gamma)
    /*
    if (isIOS) {
        // Translate iOS positions to conventional positions
        beta *= 2;
        gamma /= 2;
    }
    */
    if (!isIOS && (window.orientation == -90 || window.orientation == 90)) {
        // Portrait/landscape orientation
        gamma = Math.abs(gamma);
        var g = gamma;
        gamma = beta;
        beta = g;
    } else {
        
    }
    var y;
    if (beta < 30)
        y = 0;
    else if (beta > 60)
        y = h;
    else
        y = (beta - 30) * h/(60-30);
    var x;
    if (gamma < -20)
        x = 0;
    else if (gamma > 20)
        x = w;
    else
        x = (gamma + 20) * w/(20 -(-20));

    setPosition(x, y);    
}

function onMouseMove() {
    setPosition(BannerFlow.mouseX, BannerFlow.mouseY);
}

// Loads image and determine its original size
function loadImage(url) {
    if (url.indexOf('//') > -1) {
        noImg.style.display = 'none';
        img.style.display = 'block';
        img.style.opacity = 0;
        img.src = url;
        img.onload = function() {
            orgImgW = this.width;
            orgImgH = this.height;
            this.onload = undefined;
            this.style.opacity = 1;
            resetParallax();
        }
    } else if (BannerFlow.editorMode) {
        // Only show no-image help text when in Editor mode
        noImg.style.display = 'block';
        img.style.display = 'none';
    }
}

// Resets the widget
function resetParallax() {
    if (orgImgW/orgImgH > w/h) {
        imgH = h * scale;
        imgW = imgH * (orgImgW/orgImgH);
    } else {
        imgW = w * scale;
        imgH = imgW * (orgImgH/orgImgW);
    }
    img.style.width = imgW + 'px';
    img.style.height = imgH + 'px';
    
    setPosition(0, 0);
}

function setPosition(x, y) {
    if (x == 0 && y == 0) {
        x = w/2;
        y = h/2;
    }
    var posX = -x / h;
    var posY = -y / h;
    if (posX < -1)
        posX = -1;
    if (posY < -1)
        posY = -1;
    var transX = ((imgW-w) * posX);
    var transY = ((imgH-h) * posY);
    img.style.transform = "translate(" + transX + "px," + transY + "px)";    
}

function onResize() {
    w = window.innerWidth;
    h = window.innerHeight;
    resetParallax();
}