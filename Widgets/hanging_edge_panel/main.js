var front = document.getElementById("button-face");
var screw = document.getElementById("screw");
var back = document.getElementById("handle");
var faIcon = document.getElementById("fa-icon");
var handleText = document.getElementById("handleText");
var hangingEdgePanel = document.getElementById("hangingEdgePanel");

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

function updateHangingEdge() {
    // BannerFlow values
  var hangingDirection = BannerFlow.settings.hangingDirection;
    var hangingSpeed = BannerFlow.settings.hangingSpeed;
    var frontBackground = BannerFlow.settings.frontBackground;
    var frontIcon = BannerFlow.settings.frontIcon;
    var backBackground = BannerFlow.settings.backBackground;
    var backText = BannerFlow.settings.backText;
    var backFontSize = BannerFlow.settings.backTextFontSize;
    var backFontFamily = BannerFlow.settings.fontFamily;
    
    // Direction
    if (hangingDirection.toLowerCase() == "left") {
        front.setAttribute("class", "button-face left");
        screw.setAttribute("class", "screw left");
    } else {
        front.setAttribute("class", "button-face");
        screw.setAttribute("class", "screw");
    }
    
    // Speed
    front.style.animationDuration = hangingSpeed + "s";
    
    // Front background
    front.style.backgroundColor = frontBackground;
    
    // Front icon
    faIcon.setAttribute("class", "fa " + frontIcon);
    
    // Back background
    back.style.backgroundColor = backBackground;
    
    // Back text
    handleText.innerHTML = backText;
    handleText.style.fontSize = backFontSize + "px";
    
    // change font
    handleText.style.fontFamily = getFont(backFontFamily.toLowerCase());
    
    // Anchor link
    hangingEdgePanel.href = BannerFlow.settings.anchorLink;
    
    // Size of panel
    hangingEdgePanel.style.transform = "scale("+((BannerFlow.settings.sizeOfPanel - 1)/5 + 1)+")";
    hangingEdgePanel.style.webkitTransform = "scale("+((BannerFlow.settings.sizeOfPanel - 1)/5 + 1)+")";
}
BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateHangingEdge);