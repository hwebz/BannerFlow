var txt = [];
var typingEffect = null;

function initialize(options) {
    var id = window.setTimeout(function() {}, 0);
    while (id--) {
        window.clearTimeout(id); 
        window.clearInterval(id);
    }
    
    typingEffect = new TypingText(options);
}

var TypingText = function(options) {

    var _default = {
        ele: null,
        text: [],
        speed: 200,
        delay: 1000
    };

    var configure = options || {};

    for (var opt in _default) {
        if (_default.hasOwnProperty(opt) && !options.hasOwnProperty(opt)) {
            configure[opt] = _default[opt];
        }
    }

    //var text = configure.ele.getAttribute("data-text").toString().split(':');
    var text = configure.text;
    var directionCounter = configure.direction === 'rtl' ? 0 : (text.length > 0 ? text[0].length : 1);
    var line = 0, count = directionCounter, lastPosition = 0;

    var newLine = function() {
        if (line < text.length - 1) ++line;
        else line = 0;
        setTimeout(function() {
            count = directionCounter;
            setTimeout(typing, configure.speed);
        }, configure.delay);
    };

    var typing = function() {
        if (typeof text[line] !== typeof undefined) {
            if (directionCounter === 0) {
                if (count <= text[line].length) {
                    configure.ele.innerHTML = text[line].substring(0, count);
                    count++;
                    setTimeout(typing, configure.speed);
                }else {
                    newLine();
                }
            } else {
                if (count >= 0) {
                    lastPosition = text[line].length;
                    configure.ele.innerHTML = text[line].substring(count, lastPosition);
                    count--;
                    setTimeout(typing, configure.speed);
                }else {
                    newLine();
                }
            }
        }
    };

    typing();
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


function updateTypingText() {  
    var textContent = document.getElementById('content');
    var cursorLeft = document.getElementById('dashLeft');
    var cursorRight = document.getElementById('dashRight');
    var typingText = document.getElementById('typing-text');
    var fontFamily = BannerFlow.settings.fontFamily ? BannerFlow.settings.fontFamily.toLowerCase() : "";
    var links = document.getElementsByTagName("link");
    // Font family
    document.body.style.fontFamily = getFont(fontFamily);
    
    // Font size
    textContent.style.fontSize = BannerFlow.settings.fontSize + "px";
    textContent.style.lineHeight = BannerFlow.settings.lineHeight + "px";
    cursorLeft.style.width = 20/(30/BannerFlow.settings.fontSize) + "px";
    cursorLeft.style.height = 3/(30/BannerFlow.settings.fontSize) + "px";
    cursorRight.style.width = 20/(30/BannerFlow.settings.fontSize) + "px";
    cursorRight.style.height = 3/(30/BannerFlow.settings.fontSize) + "px";
    
    // Color
    textContent.style.color = BannerFlow.settings.color;
    
    // Cursor color
    cursorLeft.style.backgroundColor = BannerFlow.settings.cursorColor;
    cursorRight.style.backgroundColor = BannerFlow.settings.cursorColor;
    
    textContent.innerHTML = "";
    tspeed = 50000/(BannerFlow.settings.speedOfAnimation * 100);
    tdelay = BannerFlow.settings.delayBetweenWords * 1000;
    
    // Direction
    cursorLeft.style.display = BannerFlow.settings.directionText == "Left to Right" ? "none" : "inline-block";
    cursorRight.style.display = BannerFlow.settings.directionText == "Left to Right" ? "inline-block" : "none";
    
    typingText.style.textAlign = BannerFlow.settings.alignText ? BannerFlow.settings.alignText.toLowerCase() : "";
  	initialize({	
        ele: document.getElementById('content'),
        text: txt,
        speed: parseInt(BannerFlow.settings.speedOfAnimation, 10),
        delay: parseInt(BannerFlow.settings.delayBetweenWords)*1000,
        direction: BannerFlow.settings.directionText === "Left to Right" ? 'rtl' : 'ltr'
     });
}

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateTypingText);
BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function() {
    if (BannerFlow.text == "Enter text..." || BannerFlow.text == "") {
        BannerFlow.text = "Text 1:Text 2:Text 3:Text4";
        BannerFlow.lastText = "Text 1:Text 2:Text 3:Text4";
    }
    txt = BannerFlow.text ? BannerFlow.text.split(":") : [];
    initialize({	
        ele: document.getElementById('content'),
        text: txt,
        speed: parseInt(BannerFlow.settings.speedOfAnimation, 10),
        delay: parseInt(BannerFlow.settings.delayBetweenWords)*1000,
        direction: BannerFlow.settings.directionText === "Left to Right" ? 'ltr' : 'rtl'
     });
});
