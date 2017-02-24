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

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

var is_iPad = navigator.userAgent.match(/iPad/i) != null;


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

/*============================================*/

var RollingDice = (function(){

    var container = get('widgetContainer');
    var rollButton = get('rollButton');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;
    var languageTexts;
    var size;

    var allSides = ["top", "right", "left", "bottom", "front", "back"];
    var BUTTON_STYLE_RECTANGLE = "Rectangle";
    var BUTTON_STYLE_ELLIPSE = "Ellipse";

    /*--- settings from banner flow ---*/
    var duration;
    var rollingFrom;
    var diceColor;
    var dotColor;
    var numberDice;

    var buttonTextColor;
    var buttonTextSize;
    var buttonTextFont;
    var buttonBackgroundColor;
    var buttonX, buttonY;
    var buttonStyle;
    var buttonBorder;
    var showButton;

    var languageText;

    function configureButton() {
      
      rollButton.innerHTML = languageText;
      rollButton.style.display = showButton ? "block" : "none";
      rollButton.style.left = buttonX + 'px';
      rollButton.style.top = buttonY + 'px';
      rollButton.style.backgroundColor = buttonBackgroundColor;
      rollButton.style.color = buttonTextColor;
      rollButton.style.fontSize = buttonTextSize + "px";
      rollButton.style.fontFamily = buttonTextFont;

      if(buttonStyle.toLowerCase() == BUTTON_STYLE_ELLIPSE.toLowerCase()) {
        buttonBorder = "100%";
      } else {
        buttonBorder = buttonBorder + "px";
      }
      setStyleCss3(rollButton, "borderRadius", buttonBorder);

      
      if(isRegistered)
        return;

      isRegistered = true;

      rollButton.onclick = function() {
        startWidget();
      }
    }

    function resetRolling(){

        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute("class", "inline-style");

        var styleHTML = "";
        for(var i=1;i<=numberDice;i++) {
          for(var j=0;j<allSides.length;j++) {
            styleHTML += (i == 1 ? ".scene" : ".scene.scene" + i) + " ." + allSides[j] + " {" + "-webkit-animation: none; animation: none; } \n";
          }

          styleHTML += (i == 1 ? ".scene" : ".scene.scene" + i) + " {" + "-webkit-animation: none; animation: none; } \n";
          styleHTML += ("#box" + i) + " {" + "-webkit-animation: none; animation: none; } \n";
        }


        style.innerHTML = styleHTML;
        document.head.appendChild(style);
    }
   
    function setBoxProperty() {
        var containerSize = containerWidth > containerHeight ? containerHeight : containerWidth;
        size = parseInt(containerSize/5);

        var dotSize = parseInt(size/5);

        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('class', 'inline-style');

        var originZ = size/2;
        originZ = -parseInt(originZ);

        var styleHTML = ".scene, .box, .side {" +
                            "width: " + size + 'px;' +
                            "height: " + size + 'px;' +
                        "}" +
                        ".scene.scene2 {" +
                          (numberDice < 2 ? "display: none;" : "display: block;") +
                        "}" +
                        ".scene.scene3 {" +
                          (numberDice < 3 ? "display: none;" : "display: block;") +
                        "}" +
                        ".side {" +
                            (!iOS ? "-webkit-transform-origin: 50% 50% " + originZ + "px;" : "") +
                            (!iOS ? "transform-origin: 50% 50% " + originZ + "px;" : "") +
                            "background-color: " + diceColor + ";" +
                        "}" +
                        ".dot {" +
                            "width: " + dotSize + "px;" +
                            "height: " + dotSize + "px;" +
                            "background-color: " + dotColor + ";" + 
                        "}" +
                        ".dot.center {" +
                            "margin-top: -" + parseInt(dotSize/2) + "px;" +
                            "margin-left: -" + parseInt(dotSize/2) + "px;" +
                        "}" +
                        ".dot.dtop {" +
                            "top: " + parseInt(dotSize/3*2) + "px;" +
                            "margin-top: 0;" +
                        "}" +
                        ".dot.dbottom {" +
                            "top: auto;" +
                            "margin-top: 0;" +
                            "bottom: " + parseInt(dotSize/3*2) + "px;" +
                        "}" +
                        ".dot.dleft {" +
                            "left: " + parseInt(dotSize/3*2) + "px;" +
                            "margin-left: 0;" +
                        "}" +
                        ".dot.dright {" +
                            "left: auto;" +
                            "margin-left: 0;" +
                            "right: " + parseInt(dotSize/3*2) + "px;" +
                        "}";

        style.innerHTML = styleHTML;
        document.head.appendChild(style);
    }

    function setPositionOfSides(boxId) {
        var sidesBox = document.querySelectorAll("#" + boxId + " .side");

        var allIndexs = [];
        var indexSides = [];

        for(var i=0;i<allSides.length;i++) {
            allIndexs.push(i);
        }

        while(true) {
            var index = rand(0, allIndexs.length - 1, true);
            indexSides.push(allIndexs[index]);
            allIndexs.splice(index,1);

            if(allIndexs.length == 0)
                break;
        }

        for(var i=0;i<sidesBox.length;i++) {
            sidesBox[i].setAttribute('class', 'side ' + allSides[indexSides[i]]);
        }
    }

    function showBox() {
        container.style.opacity = 1;
    }

    function createCubeForIOS() {
      var style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.setAttribute("class", "inline-style");

      var halfSize = size/2;

      var innerHTML = "";
      innerHTML += ".front {" +
          "-webkit-transform: rotateY(0deg) translateZ(" + halfSize + "px);" +
          "transform: rotateY(0deg) translateZ(" + halfSize + "px);" +
      "}" +

      ".top {" +
          "-webkit-transform: rotateX(90deg) translateZ(" + halfSize + "px);" +
          "transform: rotateX(90deg) translateZ(" + halfSize + "px);" +
      "}" +

      ".right {" +
          "-webkit-transform: rotateY(90deg) translateZ(" + halfSize + "px);" +
          "transform: rotateY(90deg) translateZ(" + halfSize + "px);" +
      "}" +

      ".left {" +
          "-webkit-transform: rotateY(-90deg) translateZ(" + halfSize + "px);" +
          "transform: rotateY(-90deg) translateZ(" + halfSize + "px);" +
      "}" +

      ".bottom {" +
          "-webkit-transform: rotateX(-90deg) translateZ(" + halfSize + "px);" +
          "transform: rotateX(-90deg) translateZ(" + halfSize + "px);" +
      "}" +

      ".back {" +
          "-webkit-transform: rotateX(180deg) translateZ(" + halfSize + "px);" +
          "transform: rotateX(180deg) translateZ(" + halfSize + "px);" +
      "}";

      style.innerHTML = innerHTML;
      document.head.appendChild(style);
    }

    function createRollingDiceFromLeftForIOS() {

        createCubeForIOS();

        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.setAttribute("class", "inline-style");

        var innerHTML = "";

        innerHTML +=".scene {" +
            "top: 50%;" +
            "left: -" + (numberDice >= 2 ? (2*size - size/2) : (2*size + size/4)) + "px;" +
            "margin-top: -" + (numberDice >= 3 ? 5/4*size : (numberDice >= 2 ? size : size/2)) + "px;" +
        "}" +

        ".scene.scene2 {" +
            "top: 50%;" +
            "left: -" + 3*size + "px;" +
            "margin-top: -" + (size/2) + "px;" +
        "}" +

        ".scene.scene3 {" +
            "top: 50%;" +
            "left: -" + (2*size - size/2) + "px;" +
            "margin-top: " + (1/4*size) + "px;" +
        "}" +

        "@-webkit-keyframes scene {" +
          "0% {" +
            "-webkit-transform: translate3d(0,0,0);" +
            "visibility: visible;" +
          "}" +
          "100% {" +
            "-webkit-transform: translate3d("+(2*size - size/4 + containerWidth/2)+"px,0,0);" +
            "visibility: visible;" +
          "}" +
        "}" +

        "@keyframes scene {" +
          "0% {" +
            "transform: translate3d(0,0,0);" +
            "visibility: visible;" +
          "}" +
          "100% {" +
            "transform: translate3d("+(2*size - size/4 + containerWidth/2)+"px,0,0);" +
            "visibility: visible;" +
          "}" +
        "}" +

        "@-webkit-keyframes box {" +
          "0% {" +
            "-webkit-transform: rotateX(50deg) rotateY(0deg);" +
          "}" +
          "100% {" +
            "-webkit-transform: rotateX(50deg) rotateY(360deg);" +
          "}" +
        "}" +

        "@keyframes box {" +
          "0% {" +
            "transform: rotateX(50deg) rotateY(0deg);" +
          "}" +
          "100% {" +
            "transform: rotateX(50deg) rotateY(360deg);" +
          "}" +
        "}";


        style.innerHTML = innerHTML;
        document.head.appendChild(style);
    }

    function createRollingDiceFromLeft() {

        if(iOS)
          return createRollingDiceFromLeftForIOS();

        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.setAttribute("class", "inline-style");

        var innerHTML = "";

        var createRollingKeyframe = function(extraName) {
            var startAngle = 0;

            return "@-webkit-keyframes front" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+startAngle+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+180)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +  
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+360)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes top" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle+180)+"deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle+360)+"deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes right" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+90)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+270)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+450)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes left" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+270)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+450)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+630)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes bottom" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle+180)+"deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle+360)+"deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes back" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+180)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+360)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+540)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            /* for Firefox and IE10 */
            "@keyframes front" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+180)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+360)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@keyframes top" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle+180)+"deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle+360)+"deg);" +
              "}" +
            "}" +

            "@keyframes right" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+90)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+270)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+450)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@keyframes left" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+270)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+450)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+630)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@keyframes bottom" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle+180)+"deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle+360)+"deg);" +
              "}" +
            "}" +

            "@keyframes back" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+180)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+360)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle+540)+"deg) rotateZ(0deg);" +
              "}" +
            "}";
        };
        
        innerHTML += createRollingKeyframe("");

        innerHTML +=".scene {" +
            "top: 50%;" +
            "left: -" + (numberDice >= 2 ? (2*size - size/2) : (2*size + size/4)) + "px;" +
            "margin-top: -" + (numberDice >= 3 ? 5/4*size : (numberDice >= 2 ? size : size/2)) + "px;" +
        "}" +

        ".scene.scene2 {" +
            "top: 50%;" +
            "left: -" + 3*size + "px;" +
            "margin-top: -" + (size/2) + "px;" +
        "}" +

        ".scene.scene3 {" +
            "top: 50%;" +
            "left: -" + (2*size - size/2) + "px;" +
            "margin-top: " + (1/4*size) + "px;" +
        "}" +

        "@-webkit-keyframes scene {" +
          "0% {" +
            "-webkit-transform: translate3d(0,0,0);" +
            "visibility: visible;" +
          "}" +
          "100% {" +
            "-webkit-transform: translate3d("+(2*size - size/4 + containerWidth/2)+"px,0,0);" +
            "visibility: visible;" +
          "}" +
        "}" +

        "@keyframes scene {" +
          "0% {" +
            "transform: translate3d(0,0,0);" +
            "visibility: visible;" +
          "}" +
          "100% {" +
            "transform: translate3d("+(2*size - size/4 + containerWidth/2)+"px,0,0);" +
            "visibility: visible;" +
          "}" +
        "}";

        style.innerHTML = innerHTML;
        document.head.appendChild(style);
    }

    function createRollingDiceFromRightForIOS() {

      createCubeForIOS();

      var style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.setAttribute("class", "inline-style");

      var innerHTML = "";
      innerHTML += ".scene {" +
          "top: 50%;" +
          "right: -" + (numberDice >=2 ? (2*size - size/2) : (2*size + size/4)) + "px;" +
          "margin-top: -" + (numberDice >= 3 ? 5/4*size : (numberDice >= 2 ? size : size/2)) + "px;" +
      "}" +

      ".scene.scene2 {" +
          "top: 50%;" +
          "right: -" + 3*size + "px;" +
          "margin-top: -" + (size/2) + "px;" +
      "}" +

      ".scene.scene3 {" +
          "top: 50%;" +
          "right: -" + (2*size - size/2) + "px;" +
          "margin-top: " + (1/4*size) + "px;" +
      "}" +

      "@-webkit-keyframes scene {" +
        "0% {" +
          "-webkit-transform: translate3d(0,0,0);" +
          "visibility: visible;" +
        "}" +
        "100% {" +
          "-webkit-transform: translate3d(-"+(2*size - size/4 + containerWidth/2)+"px,0,0);" +
          "visibility: visible;" +
        "}" +
      "}" +

      "@keyframes scene {" +
        "0% {" +
          "transform: translate3d(0,0,0);" +
          "visibility: visible;" +
        "}" +
        "100% {" +
          "transform: translate3d(-"+(2*size - size/4 + containerWidth/2)+"px,0,0);" +
          "visibility: visible;" +
        "}" +
      "}" + 

      "@-webkit-keyframes box {" +
          "0% {" +
            "-webkit-transform: rotateX(50deg) rotateY(0deg);" +
          "}" +
          "100% {" +
            "-webkit-transform: rotateX(50deg) rotateY(-360deg);" +
          "}" +
        "}" +

        "@keyframes box {" +
          "0% {" +
            "transform: rotateX(50deg) rotateY(0deg);" +
          "}" +
          "100% {" +
            "transform: rotateX(50deg) rotateY(-360deg);" +
          "}" +
        "}";

      style.innerHTML = innerHTML;
      document.head.appendChild(style);
    }

    function createRollingDiceFromRight() {

        if(iOS)
          return createRollingDiceFromRightForIOS();

        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.setAttribute("class", "inline-style");

        var innerHTML = "";
        
        var createRollingKeyframe = function(extraName){
            var startAngle = rand(0, 4, true) * 90;

            return "@-webkit-keyframes front" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+startAngle+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-180)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-360)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes top" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle-180)+"deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle-360)+"deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes right" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-90)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-270)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-450)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes left" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-270)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-450)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-630)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes bottom" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle-180)+"deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle-360)+"deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes back" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-180)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-360)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-540)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            /* for Firefox and IE10 */
            "@keyframes front" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-180)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-360)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@keyframes top" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle-180)+"deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(140deg) rotateY(0deg) rotateZ("+(startAngle-360)+"deg);" +
              "}" +
            "}" +

            "@keyframes right" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-90)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-270)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-450)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@keyframes left" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-270)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-450)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-630)+"deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@keyframes bottom" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle-180)+"deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(-40deg) rotateY(0deg) rotateZ("+(startAngle-360)+"deg);" +
              "}" +
            "}" +

            "@keyframes back" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-180)+"deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-360)+"deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY("+(startAngle-540)+"deg) rotateZ(0deg);" +
              "}" +
            "}";
        }

        innerHTML += createRollingKeyframe("");

        innerHTML += ".scene {" +
            "top: 50%;" +
            "right: -" + (numberDice >=2 ? (2*size - size/2) : (2*size + size/4)) + "px;" +
            "margin-top: -" + (numberDice >= 3 ? 5/4*size : (numberDice >= 2 ? size : size/2)) + "px;" +
        "}" +

        ".scene.scene2 {" +
            "top: 50%;" +
            "right: -" + 3*size + "px;" +
            "margin-top: -" + (size/2) + "px;" +
        "}" +

        ".scene.scene3 {" +
            "top: 50%;" +
            "right: -" + (2*size - size/2) + "px;" +
            "margin-top: " + (1/4*size) + "px;" +
        "}" +

        "@-webkit-keyframes scene {" +
          "0% {" +
            "-webkit-transform: translate3d(0,0,0);" +
            "visibility: visible;" +
          "}" +
          "100% {" +
            "-webkit-transform: translate3d(-"+(2*size - size/4 + containerWidth/2)+"px,0,0);" +
            "visibility: visible;" +
          "}" +
        "}" +

        "@keyframes scene {" +
          "0% {" +
            "transform: translate3d(0,0,0);" +
            "visibility: visible;" +
          "}" +
          "100% {" +
            "transform: translate3d(-"+(2*size - size/4 + containerWidth/2)+"px,0,0);" +
            "visibility: visible;" +
          "}" +
        "}";

        style.innerHTML = innerHTML;
        document.head.appendChild(style);
    }

    function createRollingDiceFromTopForIOS() {
      
      createCubeForIOS();

      var style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.setAttribute("class", "inline-style");

      var innerHTML = "";
      innerHTML +=".scene {" +
          "top: -" + (numberDice >= 3 ? (2*size - 3/4*size) : ( numberDice >= 2 ? (2*size - size/4) : 2*size)) + "px;" +
          "left: " + (numberDice >= 2 ? (containerWidth/2 + size/4) : (containerWidth/2 - size/2)) + "px;" +
          "margin-top: 0;" +
      "}" +

      ".scene.scene2 {" +
          "top: -" + (3*size - 3/4*size) + "px;" +
          "left: " + (containerWidth/2 - size - size/4) + "px;" +
          "margin-top: 0;"+
      "}" +

      ".scene.scene3 {" +
          "top: -" + (2*size + 3/4*size) + "px;" +
          "left: " + (containerWidth/2 + size/4) + "px;" +
          "margin-top: 0;"+
      "}" +

      "@-webkit-keyframes scene {" +
        "0% {" +
          "-webkit-transform: translate3d(0,0,0);" +
        "}" +
        "100% {" +
          "-webkit-transform: translate3d(0," + ( 2*size - size/2 + containerHeight/2) + "px,0);" +
        "}" +
      "}" +

      "@keyframes scene {" +
        "0% {" +
          "transform: translate3d(0,0,0);" +
          "visibility: visible;" +
        "}" +
        "100% {" +
          "transform: translate3d(0," + ( 2*size - size/2 + containerHeight/2) + "px,0);" +
          "visibility: visible;" +
        "}" +
      "}" +

      "@-webkit-keyframes box {" +
          "0% {" +
            "-webkit-transform: rotateX(50deg);" +
          "}" +
          "100% {" +
            "-webkit-transform: rotateX(-310deg);" +
          "}" +
        "}" +

        "@keyframes box {" +
          "0% {" +
            "transform: rotateX(50deg);" +
          "}" +
          "100% {" +
            "transform: rotateX(-310deg);" +
          "}" +
        "}";

      style.innerHTML = innerHTML;
      document.head.appendChild(style);
    }

    function createRollingDiceFromTop() {

        if(iOS)
          return createRollingDiceFromTopForIOS();

        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.setAttribute("class", "inline-style");

        var innerHTML = "";

        var createRollingKeyframe = function(extraName) {
            var startAngle = rand(0, 4, true) * 90;

            return "@-webkit-keyframes front" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle + 50)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle - 130)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle - 310)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes top" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle + 140)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle - 40)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle - 220)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes right" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY(90deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY(90deg) rotateZ("+(startAngle - 180)+"deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY(90deg) rotateZ("+(startAngle - 360)+"deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes left" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY(270deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY(270deg) rotateZ("+(startAngle - 180)+"deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX(50deg) rotateY(270deg) rotateZ("+(startAngle - 360)+"deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes bottom" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle - 40)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle - 220)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle - 400)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@-webkit-keyframes back" + extraName + " {" +
              "0% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle + 50)+"deg) rotateY(180deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle - 130)+"deg) rotateY(180deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "-webkit-transform: perspective(600px) rotateX("+(startAngle - 310)+"deg) rotateY(180deg) rotateZ(0deg);" +
              "}" +
            "}" +

            /* for Firefox and IE10 */
            "@keyframes front" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX("+(startAngle + 50)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX("+(startAngle - 130)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX("+(startAngle - 310)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@keyframes top" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX("+(startAngle + 140)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX("+(startAngle - 40)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX("+(startAngle - 220)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@keyframes right" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY(90deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY(90deg) rotateZ("+(startAngle - 180)+"deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY(90deg) rotateZ("+(startAngle - 360)+"deg);" +
              "}" +
            "}" +

            "@keyframes left" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY(270deg) rotateZ("+(startAngle)+"deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY(270deg) rotateZ("+(startAngle - 180)+"deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX(50deg) rotateY(270deg) rotateZ("+(startAngle - 360)+"deg);" +
              "}" +
            "}" +

            "@keyframes bottom" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX("+(startAngle - 40)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX("+(startAngle - 220)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX("+(startAngle - 400)+"deg) rotateY(0deg) rotateZ(0deg);" +
              "}" +
            "}" +

            "@keyframes back" + extraName + " {" +
              "0% {" +
                "transform: perspective(600px) rotateX("+(startAngle + 50)+"deg) rotateY(180deg) rotateZ(0deg);" +
              "}" +
              "50% {" +
                "transform: perspective(600px) rotateX("+(startAngle - 130)+"deg) rotateY(180deg) rotateZ(0deg);" +
              "}" +
              "100% {" +
                "transform: perspective(600px) rotateX("+(startAngle - 310)+"deg) rotateY(180deg) rotateZ(0deg);" +
              "}" +
            "}";
        };
        
        innerHTML += createRollingKeyframe("");

        innerHTML +=".scene {" +
            "top: -" + (numberDice >= 3 ? (2*size - 3/4*size) : ( numberDice >= 2 ? (2*size - size/4) : 2*size)) + "px;" +
            "left: " + (numberDice >= 2 ? (containerWidth/2 + size/4) : (containerWidth/2 - size/2)) + "px;" +
            "margin-top: 0;" +
        "}" +

        ".scene.scene2 {" +
            "top: -" + (3*size - 3/4*size) + "px;" +
            "left: " + (containerWidth/2 - size - size/4) + "px;" +
            "margin-top: 0;"+
        "}" +

        ".scene.scene3 {" +
            "top: -" + (2*size + 3/4*size) + "px;" +
            "left: " + (containerWidth/2 + size/4) + "px;" +
            "margin-top: 0;"+
        "}" +

        "@-webkit-keyframes scene {" +
          "0% {" +
            "-webkit-transform: translate3d(0,0,0);" +
            "visibility: visible;" +
          "}" +
          "100% {" +
            "-webkit-transform: translate3d(0," + ( 2*size - size/2 + containerHeight/2) + "px,0);" +
            "visibility: visible;" +
          "}" +
        "}" +

        "@keyframes scene {" +
          "0% {" +
            "transform: translate3d(0,0,0);" +
            "visibility: visible;" +
          "}" +
          "100% {" +
            "transform: translate3d(0," + ( 2*size - size/2 + containerHeight/2) + "px,0);" +
            "visibility: visible;" +
          "}" +
        "}";

        style.innerHTML = innerHTML;
        document.head.appendChild(style);
    }

    function startRolling() {
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute("class", "inline-style");        

        var delay = 100;

        var styleHTML = "";
        for(var i=1;i<=numberDice;i++) {
          for(var j=0;j<allSides.length;j++) {
            styleHTML += ".scene" + (i != 1 ? ".scene"+i : "") + " ." + allSides[j] + " {" +
                          "-webkit-animation: " + allSides[j] + " " + durationRotate + "ms " + (delay * (i-1) + 10) + "ms " + repeatRotation + " forwards linear;" +
                          "animation: " + allSides[j] + " " + durationRotate + "ms " + (delay * (i-1) + 10) + "ms " + repeatRotation + " forwards linear;" +
                      "}";
          }

          
          styleHTML += ".scene" + (i != 1 ? ".scene"+i : "") + " {"  +
              "-webkit-animation: scene " + (durationRotate * repeatRotation) + "ms " + (delay * (i-1) + 10) + "ms forwards linear;" +
              "animation: scene " + (durationRotate * repeatRotation) + "ms " + (delay * (i-1) + 10) + "ms forwards linear;" +
          "}";
          if(iOS) {
            styleHTML += "#box" + i + " {"  +
              "-webkit-animation: box " + " " + durationRotate + "ms " + (delay * (i-1) + 10) + "ms " + repeatRotation + " forwards linear;" +
              "animation: box " + " " + durationRotate + "ms " + (delay * (i-1) + 10) + "ms " + repeatRotation + " forwards linear;" +
            "}";
          }
        }

        style.innerHTML = styleHTML;
        document.head.appendChild(style);
    }

    var isRegistered = false;
    var repeatRotation = 1;
    var durationRotate = 1;

    function calculateDurationRotation() {
      var lengthOneRound = 5 * size;
      var distanceVertical = 2*size - size/2 + containerHeight/2;
      var distanceHorizontal = 2*size - size/4 + containerWidth/2;

      if(rollingFrom.toLowerCase() === "left" || rollingFrom.toLowerCase() === "right") {
          repeatRotation = parseInt(distanceHorizontal/lengthOneRound);
      }
      else if(rollingFrom.toLowerCase() === "top") {
          repeatRotation = parseInt(distanceVertical/lengthOneRound);
      }

      if(repeatRotation == 0)
          repeatRotation = 1;

      durationRotate = duration/repeatRotation;
    }

    function startWidget(currentSesssion){

        if(!containerWidth || !containerHeight)
          return;

        configureButton();

        resetRolling();

        setTimeout(function(){
            // Remove old style
            var styles = document.querySelectorAll('.inline-style');
            if(styles && styles.length > 0) {
                for(var i=0;i<styles.length;i++) {
                    document.head.removeChild(styles[i]);
                }
            }

            setBoxProperty();

            // Prepare data for calculating
            numberDice = parseInt(numberDice);
            calculateDurationRotation();

            setPositionOfSides('box1');
            setPositionOfSides('box2');
            setPositionOfSides('box3');

            
            if(rollingFrom.toLowerCase() === "left")
                createRollingDiceFromLeft();
            else if(rollingFrom.toLowerCase() === "right")
                createRollingDiceFromRight();

            else if(rollingFrom.toLowerCase() === "top")
                createRollingDiceFromTop();

            showBox();
            startRolling();
        }, 250);

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

            rollingFrom = BannerFlow.settings.rollingFrom;
            diceColor = BannerFlow.settings.diceColor;
            dotColor = BannerFlow.settings.dotColor;
            duration = BannerFlow.settings.duration * 1000 / 2;
            numberDice = BannerFlow.settings.numberDice;

            buttonTextColor = BannerFlow.settings.buttonTextColor;
            buttonTextSize = BannerFlow.settings.buttonTextSize;
            if(buttonTextSize <= 0)
              buttonTextSize = 14;
            buttonTextFont = BannerFlow.settings.buttonTextFont;
            buttonBackgroundColor = BannerFlow.settings.buttonBackgroundColor;
            buttonX = BannerFlow.settings.buttonX;
            buttonY = BannerFlow.settings.buttonY;
            buttonStyle = BannerFlow.settings.buttonStyle;
            buttonBorder = BannerFlow.settings.buttonBorder;
            showButton = BannerFlow.settings.showButton;

        } else {

            rollingFrom = "left";
            diceColor = "#ffffff";
            dotColor = "#000000";
            duration = 500;
            numberDice = 3;

            buttonTextColor = "#fff";
            buttonTextSize = 14;
            buttonTextFont = "Arial";
            buttonBackgroundColor = "#acacac";
            buttonX = 10;
            buttonY = 10;
            buttonStyle = BUTTON_STYLE_RECTANGLE;
            buttonBorder = 10;
            showButton = true;
        }

        buttonTextFont = getFont(buttonTextFont);
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

    function getLanguageText() {

        languageText = "";

        if(typeof BannerFlow !== "undefined")
          languageText = BannerFlow.text;
        else
          languageText = "Roll dice";

    }

    return {
        start: onStart,

        onResized: onResize,

        onSettingChanged: resetParameter
    };
})();

if(typeof BannerFlow == "undefined"){
    RollingDice.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        RollingDice.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        RollingDice.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        RollingDice.start();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        RollingDice.start();
    });
}

