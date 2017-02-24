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

var Dropdown = (function(){

    var container = get('widgetContainer');
    var listOptions = get('listOptions');
    var buttonSelect = get('buttonSelect');
    var buttonLink = get('buttonLink');


    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    /*--- settings from banner flow ---*/

    var font;
    var fontSize;
    var dropdownColor, dropdownTextColor;
    var buttonColor, buttonTextColor;
    var layout;

    var languageTexts;

    var LAYOUT_ONE_LINE = "One Line";
    var LAYOUT_TWO_LINE = "Two Line";
    var caretText = "<span class='caret'></span>";
    var styleClass = "style-inline";
    
    var idTemptDiv = "divTempt";
    var idTempSpan = "spanTempt";
    var paddingWidth = 24;
    var spaceCaret = 5 + 8;
   

    function startWidget(currentSesssion){

      if(!containerWidth || !containerHeight)
        return;

      listOptions.style.opacity = "0";
      listOptions.style.height  = "auto";
      listOptions.style.display = "block";
      listOptions.getBoundingClientRect(); // force to apply new style to listOptions

      buildHtml();
      buildCSS();
      registerEvent();

      buttonSelect.getBoundingClientRect(); // force to apply new style to buttonSelect

      var hButton = parseInt(window.getComputedStyle(buttonSelect).getPropertyValue('height'));
      var hOptions = parseInt(window.getComputedStyle(listOptions).getPropertyValue('height'));
      var hSpace = 2;
      if(hButton + hOptions + hSpace > containerHeight) {
        listOptions.style.height = containerHeight - hButton - hSpace + 'px' ;
      }

      listOptions.style.display = "none";
      listOptions.style.opacity = "1";

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

    function buildCSS() {

      var styleOlds = document.querySelectorAll('.'+styleClass);
      if(styleOlds && styleOlds.length > 0) {
        for(var i = 0; i < styleOlds.length; i++) {
          document.head.removeChild(styleOlds[i]);
        }
      }

      var borderColorSelect      = calculateHoverColor(dropdownColor);
      var borderColorLink        = calculateHoverColor(buttonColor);

      var styleNew = document.createElement('style');
      styleNew.setAttribute('class', styleClass);
      styleNew.setAttribute('type', 'text/css');

      styleNew.innerHTML = ".widget-container {\n" +
                            "font-family: " + font + ";\n" +
                            "opacity: 1;\n" +
                          "}\n" +
                          ".dropdown {\n" +
                            "display:" + (layout.toLowerCase() == LAYOUT_ONE_LINE.toLowerCase() ? "inline-block;" : "block;") +
                          "}\n" +
                          ".btn, .dropdown-menu {\n" +
                            "font-family: " + font + ";\n" +
                            "font-size:" + fontSize + "px;\n" +
                          "}\n" +
                          ".btn-select {\n" +
                            "color: " + dropdownTextColor + ";\n" +
                            "background-color:" + dropdownColor + ";\n" +
                            "border-color:" + borderColorSelect + ";\n" +
                          "}\n" +
                          ".btn-select:hover, .btn-select:active {\n" +
                            "color: " + dropdownTextColor + ";\n" +
                            "background-color:"  + borderColorSelect + ";\n" +
                            "border-color: transparent;\n" +
                          "}\n" +
                          ".btn-link {\n" +
                            "color: " + buttonTextColor + ";\n" +
                            "background-color:" + buttonColor + ";\n" +
                            "border-color:" + borderColorLink + ";\n" +
                          "}\n" +
                          ".btn-link:hover, .btn-link:active {\n" +
                            "color: " + buttonTextColor + ";\n" +
                            "background-color:"  + borderColorLink + ";\n" +
                            "border-color: transparent;\n" +
                          "}\n";

      document.head.appendChild(styleNew);

    }

    function buildHtml() {
      if(!languageTexts || languageTexts.length == 0)
        return;

      listOptions.innerHTML = "";

      // Create temp div to calculate the biggest text in options
      var divTempt = document.createElement('div');
      divTempt.setAttribute('id', idTemptDiv);
      divTempt.style.display = "block";
      divTempt.style.visibility = "hidden";

      var spanTempt = document.createElement('span');
      spanTempt.setAttribute('id', idTemptDiv);
      spanTempt.style.fontFamily = font;
      spanTempt.style.fontSize = fontSize + "px";
      spanTempt.style.display = "inline-block";

      divTempt.appendChild(spanTempt);
      document.body.appendChild(divTempt);

      // template: list of options and the last one is the text for the button

      var option;
      var firstOption = true;

      var maxWidth = 0;

      for(var i=0; i<languageTexts.length; i++) {
        option = [];
        var indexSplit = languageTexts[i].indexOf(':');
        if(indexSplit >= 0) {
          option.push(languageTexts[i].substr(0, indexSplit));
          if(indexSplit + 1 < languageTexts[i].length - 1) {
            option.push(languageTexts[i].substr(indexSplit+1));
          }
        } else {
          option.push(languageTexts[i]);
        }

        // Set the default selected option
        if(firstOption && option && option.length > 0) {
          firstOption = false;
          buttonSelect.innerHTML = option[0] + caretText;
          if(option.length >= 2)
            buttonLink.setAttribute('href', option[1]);

          spanTempt.innerHTML = option[0];
          spanTempt.getBoundingClientRect();
          var textWidth =  parseInt(window.getComputedStyle(spanTempt).getPropertyValue('width'));

          if(textWidth > maxWidth)
            maxWidth = textWidth;
        }

        // Create options
        if(option && option.length >= 2) {
          var li = document.createElement('li');
          var a  = document.createElement('a');
          a.innerHTML = option[0];
          a.setAttribute('href', option[1]);
          li.appendChild(a);

          listOptions.appendChild(li);

          spanTempt.innerHTML = option[0];
          spanTempt.getBoundingClientRect();
          var textWidth =  parseInt(window.getComputedStyle(spanTempt).getPropertyValue('width'));

          if(textWidth > maxWidth)
            maxWidth = textWidth;
        }

        buttonSelect.style.width = maxWidth + paddingWidth + spaceCaret + 'px';

        // Set text for the button link
        if(i == languageTexts.length - 1) {
          if(option && option.length == 1)
            buttonLink.innerHTML = option[0];
          else 
            buttonLink.innerHTML = "Enter text";
        }
      }

      // Remove temp div
      document.body.removeChild(divTempt);

    }

    var isRegisterEvent = false;

    function registerEvent() {
      var allOptions = listOptions.getElementsByTagName('a');
      for(var i=0; i<allOptions.length; i++) {
        allOptions[i].onclick = function(event) {
          var text = event.target.innerHTML;
          var link = event.target.getAttribute('href');

          buttonSelect.innerHTML = text + caretText;
          buttonLink.setAttribute('href', link);

          return false;
        }
      }

      if(isRegisterEvent)
        return;

      isRegisterEvent = true;

      document.onclick = function(){
        listOptions.style.display = "none";
      }

      buttonSelect.onclick = function(event){
        event.stopPropagation();
        listOptions.style.display = "block";
      }

      listOptions.onchange = function(event) {
        buttonLink.setAttribute('href', event.target.value);
      }

      buttonLink.onclick = function(event) {
        var href = event.target.getAttribute('href');
        if(!href || href.length == 0)
          return false;
        return true;
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

    var removeTags = ["s","u","i","b"];

    function preProcessLanguageText(text) {

      text = text || "";

      var patt;

      for(var i=0; i<removeTags.length; i++) {
        patt = new RegExp("</?" + removeTags[i] + ">", "g");
        text = text.replace(patt, "");
      }

      var lineTexts = new Array();
      var m;
      patt = new RegExp("<div>([^<]*)</div>", "g");

      lineTexts = new Array();
      while(m = patt.exec(text)) {
        lineTexts.push(m[1]);
      }

      if(lineTexts.length == 0)
        lineTexts.push(text);

      return lineTexts;

    }


    function loadSettings(isLoadText) {

        if(typeof BannerFlow !== "undefined") {

          font     = BannerFlow.settings.font;
          fontSize = BannerFlow.settings.fontSize;
          if(fontSize <= 0)
            fontSize = 14;

          dropdownColor     = BannerFlow.settings.dropdownColor;
          dropdownTextColor = BannerFlow.settings.dropdownTextColor;

          buttonColor     = BannerFlow.settings.buttonColor;
          buttonTextColor = BannerFlow.settings.buttonTextColor;

          layout = BannerFlow.settings.layout;

        } else {
          
          font = "Arial";
          fontSize = 14;

          dropdownColor     = "rgba(0,255,255,1)";
          dropdownTextColor = "rgba(255,0,0,1)";

          buttonColor     = "rgba(255,0,0,1)";
          buttonTextColor = "rgba(0,255,255,1)";

          layout = LAYOUT_TWO_LINE;
          
        }

        font = getFont(font);
        if(isLoadText)
          languageTexts = preProcessLanguageText(languageTexts);

    }

    /*====================================================*/  

    var timeoutStart;
    var sessionId = 0;

    function init(isLoadText) {
        if(timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function() {
                loadSettings(isLoadText);
                reloadGlobalVariables();
                startAnimation(++sessionId);
            }, 500);
        } else {
            timeoutStart = setTimeout(function(){
                loadSettings(isLoadText);
                reloadGlobalVariables();
                startAnimation(++sessionId);
            }, 0);
        }
    }

    function getLanguageText() {
      if(typeof BannerFlow !== "undefined"){
        languageTexts = BannerFlow.text;
      } else { // for testing
        languageTexts = "";
        languageTexts += "<div>Google:https://www.google.com</div>";
        languageTexts += "<div>Facebook:https://www.facebook.com</div>";
        languageTexts += "<div>Microsoft:https://www.microsoft.com</div>";
        languageTexts += "<div>Thegioididong.com:https://www.thegioididong.com</div>";
        languageTexts += "<div>SEE</div>";
      }
    }

    var isStartAnimation = false;

    function onStarted() {
      if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
          return;
      }

      isStartAnimation = true;
      getLanguageText();
      init(true);
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
    Dropdown.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
      Dropdown.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
      Dropdown.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
      Dropdown.start();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
      Dropdown.start();
    });
}

