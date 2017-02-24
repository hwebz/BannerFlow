var rollingWallpaper = document.getElementById("rolling-wallpaper");
var imageEle = document.getElementById("imageSize");

function appendStyle(styles) {
  var css = document.createElement('style');
  css.type = 'text/css';

  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));

  document.getElementsByTagName("head")[0].appendChild(css);
}

function setKeyframeAnimation(name, value) {
    appendStyle('@-webkit-keyframes '+name+' {0% {background-position: 0 0;}100% {background-position: '+value+';}}@keyframes '+name+' {0% {background-position: 0 0;}100% {background-position: '+value+';}}');
}

function setAnimationName(animationName) {
    rollingWallpaper.style.animationName = animationName;
    rollingWallpaper.style.WebkitAnimationName = animationName;
}

function setAnimationDirection() {
    var direction = BannerFlow.settings.directionOfAnimation % 8;
    switch(direction) {
        case 0:
            setAnimationName("scrollTopDown");
            break;
        case 1:
            setAnimationName("scrollTopRight");
            break;
        case 2:
            setAnimationName("scrollRightLeft");
            break;
        case 3:
            setAnimationName("scrollBottomRight");
            break;
        case 4:
            setAnimationName("scrollDownTop");
            break;
        case 5:
            setAnimationName("scrollBottomLeft");
            break;
        case 6:
            setAnimationName("scrollLeftRight");
            break;
        case 7:
            setAnimationName("scrollTopLeft");
            break;
    }
}

function setAnimationDuration() {
    var duration = BannerFlow.settings.speedOfAnimation > 200 ? 200 : BannerFlow.settings.speedOfAnimation;
    rollingWallpaper.style.WebkitAnimationDuration = ((205-duration)/10)*100 + "s"; 
    rollingWallpaper.style.animationDuration = ((205-duration)/10)*100 + "s";
}

function updateBackground() {
    var backgroundSize = BannerFlow.settings.backgroundImageSize*50;
    var imgURL = (BannerFlow.text != undefined && BannerFlow.text != "" && BannerFlow.text.indexOf("://") != -1) ? BannerFlow.text : "http://communications.oregonstate.edu/sites/communications.oregonstate.edu/files/social_background.jpeg";
    // background color
    rollingWallpaper.style.backgroundColor = BannerFlow.settings.backgroundColor;
    
    // bacground image size
    rollingWallpaper.style.backgroundSize = backgroundSize + "px";
    
    // update imag size when scale
    var img = new Image();
    img.src = imgURL;
    img.onload = function() {
        imageEle.value = this.width + "," + this.height + "," + (this.width/this.height);
    }
    var imageBox = {
        width: (backgroundSize * 1000),
        height: (backgroundSize * 1000)/(parseFloat(imageEle.value.toString().split(",")[2], 10) ? parseFloat(imageEle.value.toString().split(",")[2], 10) : 1)
    }; 
    
    // re-calculate image size to animate
    setKeyframeAnimation("scrollTopRight", -imageBox.width + "px " + imageBox.height + "px");
    setKeyframeAnimation("scrollRightLeft", -imageBox.width + "px 0");
    setKeyframeAnimation("scrollBottomRight", -imageBox.width + "px " + -imageBox.height + "px");
    setKeyframeAnimation("scrollDownTop", "0 " + -imageBox.height + "px");
    setKeyframeAnimation("scrollBottomLeft", imageBox.width + "px " + -imageBox.height + "px");
    setKeyframeAnimation("scrollLeftRight", imageBox.width + "px 0");
    setKeyframeAnimation("scrollTopLeft", imageBox.width + "px " + imageBox.height + "px");
    setKeyframeAnimation("scrollTopDown", "0 " + imageBox.height + "px");

    // animation direction
    setAnimationDirection();
    
    // animation duration
    setAnimationDuration();
    
    getBackgroundImageURL();
}

function getBackgroundImageURL() {
    var imgURL = (BannerFlow.settings.imgSource != undefined && BannerFlow.settings.imgSource != null) ? BannerFlow.settings.imgSource[0].images[0].url : "http://communications.oregonstate.edu/sites/communications.oregonstate.edu/files/social_background.jpeg";
    rollingWallpaper.style.backgroundImage =  "url("+imgURL+")";
}

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateBackground);