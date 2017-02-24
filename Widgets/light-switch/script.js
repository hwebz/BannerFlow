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

function appendStyle(styles) {
  var css = document.createElement('style');
  css.type = 'text/css';

  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));

  document.getElementsByTagName("head")[0].appendChild(css);
}

function setGrad() {
    appendStyle('.on #grad {background: radial-gradient(circle at '+(BannerFlow.settings.lightX + 5)+'% '+(BannerFlow.settings.lightY + 14)+'%, transparent 2%, '+BannerFlow.settings.lightColor1+' 100%);background: -webkit-radial-gradient(circle at '+(BannerFlow.settings.lightX + 5)+'% '+(BannerFlow.settings.lightY + 14)+'%, '+(BannerFlow.settings.lightY + 14)+'%, transparent 2%, '+BannerFlow.settings.lightColor1+' 100%);}');
}

function setGradBackground() {
    appendStyle('#grad {background: '+BannerFlow.settings.backgroundColor+' radial-gradient(circle at '+(BannerFlow.settings.lightX + 5)+'% '+(BannerFlow.settings.lightY + 14)+'%, transparent 2%, '+BannerFlow.settings.backgroundColor+' 100%);');
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
var utility = document.getElementById('utility');
var switcher = document.getElementById('switch');
var light = document.getElementById('light');
var grad = document.getElementById('grad');
var bulb = document.getElementById('fa-lightbulb-o');
var room = document.getElementById('room');
var toggleOffClone = document.getElementById('toggle-off').cloneNode(true);
var toggleOnClone = document.getElementById('toggle-on').cloneNode(true);
var message = document.getElementById('message');

function resizeSwitcher() {
    switcher.style.transform = "scale("+(BannerFlow.settings.switcherSize > 0 ? BannerFlow.settings.switcherSize/10 : 0.1)+")";
    switcher.style.webkitTransform = "scale("+(BannerFlow.settings.switcherSize > 0 ? BannerFlow.settings.switcherSize/10 : 0.1)+")";
}

function resizeBulb() {
    light.style.transform = "scale("+(BannerFlow.settings.bulbSize > 0 ? BannerFlow.settings.bulbSize/10 : 0.1)+")";
    light.style.webkitTransform = "scale("+(BannerFlow.settings.bulbSize > 0 ? BannerFlow.settings.bulbSize/10 : 0.1)+")";
}

function switcherPosition() {
    utility.style.top = BannerFlow.settings.switcherY+ "%";
    utility.style.left = BannerFlow.settings.switcherX + "%";
}

function setIconColor() {
    document.getElementById('toggle-off').style.color = BannerFlow.settings.iconOffColor;
    document.getElementById('toggle-on').style.color = BannerFlow.settings.iconOnColor;
    bulb.style.color = BannerFlow.settings.iconOffColor;
}

function lightPosition() {
    light.style.top = (BannerFlow.settings.lightY - 3) + "%";
    light.style.left = BannerFlow.settings.lightX + "%";
    
    // update grad position
   setGrad();
}

function bulbIconOnOff() {
    bulb.style.display = BannerFlow.settings.showHideBulb ? "block" : 'none';
}


function setBulbDirection() {
    var bulbDirection = BannerFlow.settings.bulbDirection % 4;
    switch (bulbDirection) {
        case 0:
            bulb.style.transform = "rotate(-180deg)";
            bulb.style.webkitTransform = "rotate(-180deg)";
            break;
        case 1:
            bulb.style.transform = "rotate(-90deg)";
            bulb.style.webkitTransform = "rotate(-90deg)";
            light.style.top = (BannerFlow.settings.lightY + 2) + "%";
    		light.style.left = (BannerFlow.settings.lightX + 3) + "%";
            break;
        case 2:
            bulb.style.transform = "rotate(0deg)";
            bulb.style.webkitTransform = "rotate(0deg)";
            light.style.top = (BannerFlow.settings.lightY + 5) + "%";
            break;
        case 3:
            bulb.style.transform = "rotate(90deg)";
            bulb.style.webkitTransform = "rotate(90deg)";
            light.style.top = (BannerFlow.settings.lightY + 2) + "%";
    		light.style.left = (BannerFlow.settings.lightX - 2) + "%";
            break;
    }
}

function setTextPosition() {
    message.style.top = (BannerFlow.settings.textY + 3) + "%";
    message.style.left = (BannerFlow.settings.textX + 1) + "%";
}

function setTextStyle() {
    var settings = {
        fontFamily: BannerFlow.settings.fontFamily,
        fontSize: BannerFlow.settings.fontSize,
        fontWeight: BannerFlow.settings.fontWeight
    };
    
    if (settings.fontFamily != "Roboto" && settings.fontFamily != "Oswald" && settings.fontFamily != "Montserrat" && settings.fontFamily != "Dosis" && settings.fontFamily != "Passion One") message.style.fontFamily = getFont(settings.fontFamily.toLowerCase());
    else message.style.fontFamily = settings.fontFamily;
    message.style.fontSize = settings.fontSize + "px";
    
    if (settings.fontWeight == "Normal") {
       message.style.fontWeight = settings.fontWeight;
   	} else {
       if (settings.fontFamily == "Roboto") {
           message.style.fontWeight = "900";
       } else if (settings.fontFamily == "Oswald") {
           message.style.fontWeight = "700";
       } else if (settings.fontFamily == "Montserrat") {
           message.style.fontWeight = "700";
       } else if (settings.fontFamily == "Dosis") {
           message.style.fontWeight = "800";
       } else if (settings.fontFamily == "Passion One") {
           message.style.fontWeight = "900";
       } else {
           message.style.fontWeight = "bold";
       }
   }
}

function updateParams() {
    var isStatic = BannerFlow.settings.switcher == "Always visible" ? true : false;

    switcher.addEventListener('click', function() {
        var toggleOff = document.getElementById('toggle-off');
		var toggleOn = document.getElementById('toggle-on');
        switcher.removeChild(toggleOff);
        switcher.removeChild(toggleOn);

        if (hasClass(room, 'on')) {
            room.className = "room";
            switcher.appendChild(toggleOffClone);
            switcher.appendChild(toggleOnClone);
            setIconColor();
            message.className = "";
        }
        else {
            room.className = "room on";
            switcher.appendChild(toggleOnClone);
            switcher.appendChild(toggleOffClone);
            setIconColor();
            bulb.style.color = BannerFlow.settings.iconOnColor;
            message.className = "on";
            
            if (!isStatic) {
                switcher.className = 'on';
            }
        }
        return false;
    });
    
    resizeSwitcher();
    resizeBulb();
    switcherPosition();
    setIconColor();
    lightPosition();
    setBulbDirection();
    bulbIconOnOff();
    setGradBackground();
    setTextPosition();
    setTextStyle();
}

function updateText() {
    var txt = BannerFlow.text;
    message.innerHTML = txt;
}

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateParams);
BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, updateText);