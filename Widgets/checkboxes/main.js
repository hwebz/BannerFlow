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

function setStyleCss3(object, key, value) {
  var keyName = key.substr(0,1).toUpperCase() + key.substr(1);
  object.style['webkit' + keyName] = value;
  object.style['moz' + keyName] = value;
  object.style['ms' + keyName] = value;
  object.style[key] = value;
}

function preProcessLanguageText(text) {
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

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}


/*============================================*/

var Checkboxes = (function(){

    var container         = get('widgetContainer');
    var checkboxContainer = get('checkboxContainer');
    var buttonLink        = get('buttonLink');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var DESIGN_ROUND = "Round";
    var DESIGN_SQUARE = "Square";

    var DESIGN_SELECT_O = "O";
    var DESIGN_SELECT_V = "V";

    /*--- settings from banner flow ---*/
    var fontFamily, fontSize, textColor;
    var checkboxDesign, selectedDesign, checkboxColorUncheck, checkboxColorCheck, multiSelection;
    var buttonTextColor, buttonBackground, buttonRadius, buttonFontSize;

    var buttonBackgroundHover;
    
    var text; // contains language text
    var allLines = [];

    var checkboxContainerClass = "checkbox-container";
    var checkboxIconClass = "checkbox-icon";
    var checkboxIconCheckedClass = "checked";
    var checkboxTextClass = "checkbox-text";
    var styleClass = "style-inline";

    var allCheckboxs = [];


    /*-----------------------------------------------------*/

    function Checkbox(options, events) {
      // options: text, container, classContainer, classIcon, classIconChecked, classText, enableToggle
      // events: stateChanged

      var checkboxContainer = document.createElement('div');
      checkboxContainer.setAttribute('class', options.classContainer);

      var checkboxIcon = document.createElement('span');
      checkboxIcon.setAttribute('class', options.classIcon)

      var checkboxText = document.createElement('span');
      checkboxText.setAttribute('class', options.classText);
      checkboxText.innerHTML = options.text;

      checkboxContainer.appendChild(checkboxIcon);
      checkboxContainer.appendChild(checkboxText);

      options.container.appendChild(checkboxContainer);

      this.url = options.url;

      var _self = this;

      checkboxContainer.onclick = function() {

        if(_self.isChecked){
          if(!options.enableToggle)
            return;
          _self.uncheck();
        }
        else
          _self.check();

        _self.isChanged = true;
        _self.stateChanged(_self);
        _self.isChanged = false;
      }

      this.check = function() {
        this.isChecked = true;
        checkboxIcon.setAttribute('class', options.classIcon + " " + options.classIconChecked);
      }

      this.uncheck = function() {
        this.isChecked = false;
        checkboxIcon.setAttribute('class', options.classIcon);
      }

      this.isChecked = false;

      this.stateChanged = events.stateChanged

    }

    /*-----------------------------------------------------*/


    function startWidget(currentSesssion){

      if(!containerWidth || !containerHeight)
        return;

      container.style.opacity = 0;

      resetPreviousState();
      createCheckboxs();

      container.style.opacity = 1;

    }

    function resetPreviousState() {
      checkboxContainer.innerHTML = "";
      allLines = [];
      allCheckboxs = [];

      var styles = document.querySelectorAll('.' + styleClass);
      if(styles && styles.length > 0) {
        for(var i=0;i<styles.length;i++) {
          document.head.removeChild(styles[i]);
        }
      }
    }

    function calculateHoverColor(rgbColor) {

      rgbColor = rgbColor.substr("rgba(".length, rgbColor.length - 1 - "rgba(".length).split(",");


      var hslColor = rgbToHsl(parseInt(rgbColor[0]), parseInt(rgbColor[1]), parseInt(rgbColor[2]));
      var l = hslColor[2];
      l = l- 0.05;
      if(l <= 0)
        l += 0.05;
        
      hslColor[2] = l;


      var newRgbColor = hslToRgb(hslColor[0], hslColor[1], hslColor[2]);

      return "rgba(" + (newRgbColor[0] | 0) + "," + (newRgbColor[1] | 0) + "," + (newRgbColor[2] | 0) + "," + rgbColor[3] + ")"
    }

    function styleCheckbox() {

      var style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.setAttribute('class', styleClass);

      var checkboxSize = fontSize;

      var isRoundDesign  = checkboxDesign.toLowerCase() == DESIGN_ROUND.toLowerCase();
      var isRoundChecked = selectedDesign.toLowerCase() == DESIGN_SELECT_O.toLowerCase();

      var checkRightHeight = checkboxSize/4*2.2;
      var checkWidth       = checkRightHeight/4;
      var checkLeftHeight  = checkWidth * 2.5;

      buttonBackgroundHover = calculateHoverColor(buttonBackground);

      var styleHTML = ".checkbox-wrapper {\n" +
                  "margin-bottom: " + (fontSize) + "px;\n" +
                "}\n" +

                "." + checkboxContainerClass + "{\n" +
                    "cursor: pointer;\n" +
                    "font-family: " + fontFamily + ";\n" +
                    "font-size: 0;\n" +
                    "color: " + textColor + ";\n" +
                    "margin-bottom: " + (fontSize/4) + "px;\n" +
                "}\n" +

                "." + checkboxIconClass + "{\n" +
                  "display: inline-block;\n" +
                  "float: left;\n" +
                  "position: relative;\n" +
                  "width: " + checkboxSize + "px;\n" +
                  "height: " + checkboxSize + "px;\n" +
                  "border: 2px solid " + checkboxColorUncheck + ";\n" +
                  (isRoundDesign ? "-webkit-border-radius: 50%;\n-moz-border-radius: 50%;\nborder-radius: 50%;\n" : "" ) +
                  "-webkit-transition: border 0.1s linear;\n"+
                  "-moz-transition: border 0.1s linear;\n"+
                  "transition: border 0.1s linear;\n"+
                "}\n" +
                "." + checkboxIconClass + "." + checkboxIconCheckedClass + "{\n" +
                  "border: " + (checkboxSize/2) + "px solid " + checkboxColorUncheck + ";\n" +
                "}\n" +

                "." + checkboxIconClass + ":before, ." + checkboxIconClass + ":after{\n" +
                  "content: '';\n" +
                  "position: absolute;\n" +
                  "opacity: 0;" +
                  "background: " + checkboxColorCheck + ";\n" +
                  "-webkit-transition: opacity 0.2s linear;\n"+
                  "-moz-transition: opacity 0.2s linear;\n"+
                  "transition: opacity 0.2s linear;\n"+
                  "-webkit-transform-origin: 50% " + checkWidth/2 + "px;\n"+
                  "-moz-transform-origin: 50% " + checkWidth/2 + "px;\n"+
                  "transform-origin: 50% " + checkWidth/2 + "px;\n"+
                  "-webkit-border-radius: 1px;\n" + 
                  "-moz-border-radius: 1px;\n" + 
                  "border-radius: 1px;\n" + 
                  "margin-left: -" + (checkRightHeight/6) + 'px;\n' +
                  "margin-top: " + (checkRightHeight/10) + 'px;\n' +
                "}" +
                (isRoundChecked ? 
                   "." + checkboxIconClass + "." + checkboxIconCheckedClass + ":before{\n" +
                      "opacity: 1;\n" +
                      "top: 50%; left: 50%;\n" +
                      "-webkit-transform: translate(-50%,-50%);\n" +
                      "-moz-transform: translate(-50%,-50%);\n" +
                      "transform: translate(-50%,-50%);\n" +
                      "width: " + (checkboxSize/2) + "px;\n" +
                      "height: " + (checkboxSize/2) + "px;\n" +
                      "-webkit-border-radius: 50%;\n" + 
                      "-moz-border-radius: 50%;\n" + 
                      "border-radius: 50%;\n" +
                      "margin: 0;\n" +
                   "}\n" 
                   :
                   "." + checkboxIconClass + "." + checkboxIconCheckedClass + ":before{\n" +
                      "opacity: 1;\n" +
                      "width: " + checkWidth + 'px;\n' +
                      "height: " + checkRightHeight + 'px;\n' +
                      "top: 50%; left: 50%;\n" +
                      "-webkit-transform: translate(-50%,0%) rotate(-135deg);\n" +
                      "-moz-transform: translate(-50%,0%) rotate(-135deg);\n" +
                      "transform: translate(-50%,0%) rotate(-135deg);\n" +
                   "}\n"
                ) +
                "." + checkboxIconClass + "." + checkboxIconCheckedClass + ":after{\n" +
                    (isRoundChecked ? "" : "opacity: 1;\n") + 
                    "width: " + checkWidth + 'px;\n' +
                    "height: " + checkLeftHeight + 'px;\n' +
                    "top: 50%; left: 50%;\n" +
                    "-webkit-transform: translate(-50%,0%) rotate(135deg);\n" +
                    "-moz-transform: translate(-50%,0%) rotate(135deg);\n" +
                    "transform: translate(-50%,0%) rotate(135deg);\n" +
                "}\n" +

                "." + checkboxTextClass + "{\n" +
                  "display: block;\n" +
                  "margin-left: " + checkboxSize + "px;\n" + 
                  "padding-left: " + (fontSize/2) + "px;\n" +
                  "font-size: " + fontSize + "px;\n" +
                "}\n" +

                ".btn-link {\n" +
                  "font-family: " + fontFamily + ";\n" +
                  "font-size: " + buttonFontSize + "px;\n" +
                  "background-color:" + buttonBackground + ";\n" +
                  "border-color:" + buttonBackgroundHover + ";\n" +
                  "color:" + buttonTextColor + ";\n" +
                  "-webkit-border-radius:" + buttonRadius + "px;\n" +
                  "-moz-border-radius:" + buttonRadius + "px;\n" +
                  "border-radius:" + buttonRadius + "px;\n" +
                "}\n" +

                ".btn-link:hover {\n" +
                  "color:" + buttonTextColor + ";\n" +
                  "border-color: transparent;\n" +
                  "background-color:" + buttonBackgroundHover + ";\n" +
                "}\n";

      style.innerHTML = styleHTML;
      document.head.appendChild(style);

    }

    function createCheckboxs() {

      styleCheckbox();

      allLines = preProcessLanguageText(text);

      var option;
      for(var i=0;i<allLines.length;i++) {
        option = [];

        var indexSplit = allLines[i].indexOf(':');

        if(indexSplit >= 0) {
          option.push(allLines[i].substr(0, indexSplit));
          if(indexSplit + 1 < allLines[i].length - 1) {
            option.push(allLines[i].substr(indexSplit+1));
          }
        } else {
          option.push(allLines[i]);
        }

        // Create options
        if(option && option.length >= 2) {
          allCheckboxs.push(new Checkbox({
            text: option[0],
            url: option[1],
            container: checkboxContainer,
            classContainer: checkboxContainerClass,
            classIcon: checkboxIconClass,
            classIconChecked: checkboxIconCheckedClass,
            classText: checkboxTextClass,
            enableToggle: multiSelection
          }, {
            stateChanged: stateChanged
          }));
        }

        // Set text for the button link
        if(i == allLines.length - 1) {
          if(option && option.length == 1)
            buttonLink.innerHTML = option[0];
          else 
            buttonLink.innerHTML = "Enter text";
        }

      }
    }

    function stateChanged(checkbox) {
      if(!multiSelection) {
        for(var i=0;i<allCheckboxs.length;i++) {
          if(!allCheckboxs[i].isChanged)
            allCheckboxs[i].uncheck();
        }
      }

      for(var i=0;i<allCheckboxs.length; i++) {
        if(allCheckboxs[i].isChecked) {
          buttonLink.setAttribute('href', allCheckboxs[i].url);
          break;
        }
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
            var timeout = setTimeout(function() {
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

          fontFamily = BannerFlow.settings.fontFamily;
          fontSize   = BannerFlow.settings.fontSize;
          textColor  = BannerFlow.settings.textColor;
          checkboxDesign = BannerFlow.settings.checkboxDesign;
          selectedDesign = BannerFlow.settings.selectedDesign;
          checkboxColorUncheck = BannerFlow.settings.checkboxColorUncheck;
          checkboxColorCheck   = BannerFlow.settings.checkboxColorCheck;
          multiSelection = BannerFlow.settings.multiSelection;

          buttonTextColor  = BannerFlow.settings.buttonTextColor;
          buttonBackground = BannerFlow.settings.buttonBackground;
          buttonRadius     = BannerFlow.settings.buttonRadius;
          buttonFontSize   = BannerFlow.settings.buttonFontSize;

        } else {
          
          fontFamily = "Arial";
          fontSize   = 20;
          textColor  = "#000000";
          checkboxDesign = DESIGN_ROUND;
          selectedDesign = DESIGN_SELECT_V;
          checkboxColorUncheck = "#ff0000";
          checkboxColorCheck   = "#00ff00";
          multiSelection = true;

          buttonTextColor  = "#ff0000";
          buttonBackground = "rgba(0,255,0,1)";
          buttonRadius     = 2;
          buttonFontSize   = 18;

        }

        fontFamily = getFont(fontFamily);

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

    function getLanguageText() {
      if(typeof BannerFlow !== "undefined"){
        text = BannerFlow.text;
      } else {
        text = "<div>Google:http://google.com</div><div>Facebook:http://facebook.com</div><div>Apple:http://apple.com</div><div>Let's go</div>";
      }
    }

    var isStartAnimation = false;

    function onStarted() {
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
          return;
      }

      isStartAnimation = true;
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
        start: onStarted,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    Checkboxes.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        Checkboxes.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        Checkboxes.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        Checkboxes.start();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        Checkboxes.start();
    });
}

