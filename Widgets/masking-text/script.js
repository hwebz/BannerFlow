var svg = document.getElementById('svg');
var headingClipped = document.getElementById('heading-clipped');
var maskImage = document.getElementById('mask-image');

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

function updateSettings() {
    console.log(BannerFlow.settings.imageSource);
    var settings = {
        imageSrc: (BannerFlow.settings.imageSource != undefined && BannerFlow.settings.imageSource != null) ? BannerFlow.settings.imageSource[0].images[0].url : "http://communications.oregonstate.edu/sites/communications.oregonstate.edu/files/social_background.jpeg",
        fontFamily: BannerFlow.settings.fontFamily,
        fontSize: BannerFlow.settings.fontSize,
        fontWeight: BannerFlow.settings.fontWeight
    }
    
    // change image source
    maskImage.setAttribute('xlink:href', settings.imageSrc);
    
    // change font-family
    if (settings.fontFamily != "Roboto" && settings.fontFamily != "Oswald" && settings.fontFamily != "Montserrat" && settings.fontFamily != "Dosis" && settings.fontFamily != "Passion One") svg.style.fontFamily = getFont(settings.fontFamily.toLowerCase());
    else svg.style.fontFamily = settings.fontFamily;
    
    // change font-size
    headingClipped.setAttribute('font-size', settings.fontSize);
    
    // change font-weight
   if (settings.fontWeight == "Normal") {
       svg.style.fontWeight = settings.fontWeight;
   } else {
       if (settings.fontFamily == "Roboto") {
           svg.style.fontWeight = "900";
       } else if (settings.fontFamily == "Oswald") {
           svg.style.fontWeight = "700";
       } else if (settings.fontFamily == "Montserrat") {
           svg.style.fontWeight = "700";
       } else if (settings.fontFamily == "Dosis") {
           svg.style.fontWeight = "800";
       } else if (settings.fontFamily == "Passion One") {
           svg.style.fontWeight = "900";
       } else {
           svg.style.fontWeight = "bold";
       }
   }
    
  	updateText();
}

function updateText() {
    var txt = (BannerFlow.text || BannerFlow.text != "Enter text...") ? BannerFlow.text : "";
    if (txt.indexOf('<div>')  == -1) {
        headingClipped.innerHTML = txt;
        headingClipped.removeAttribute('transform');
    } else {
        var txtArr = txt.split('</div><div>');
        headingClipped.innerHTML = '';
        headingClipped.setAttribute('transform', 'translate(0 -'+((txtArr.length - 1)*parseInt(headingClipped.getAttribute('font-size')))+')')
        for (var i = 0; i < txtArr.length; i++) {
            headingClipped.innerHTML +='<tspan x="0" dy="'+headingClipped.getAttribute('font-size')+'">'+txtArr[i].replace('<div>', '').replace('</div>', '')+'</tspan>';
        }
    }
}

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateSettings);
BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, updateText);