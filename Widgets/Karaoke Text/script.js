//Get images from new settings
var getImages = function(imageSetting){
    var images = [];
    for(var i=0;i<imageSetting.length;i++){
        var imgArr = imageSetting[i].images;           
        images.push(imgArr[imgArr.length-1].url);//get smallest image
        //images.push(imgArr[0].url);//get original image
    }       
    return images;
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
if (!Node.prototype.clean) {
  Node.prototype.clean = function() {
    for (var i = 0; i < this.childNodes.length; i++) {
      var child = this.childNodes[i];
      if (child.nodeType === 8 || child.nodeType === 3) {
        this.removeChild(child);
        i--;
      }
    }
  }
}
if (!Node.prototype.empty) {
  Node.prototype.empty = function(query) {
    var children = query ? this.querySelectorAll(query) : this.childNodes;
    for (var i=children.length-1;i>=0;i--) children[i].parentNode.removeChild(children[i]);
  }
}
if (!HTMLElement.prototype.hasClass) {
  Element.prototype.hasClass = function(c) {
    return (" " + this.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + c + " ") > -1;
  }
}
if (!HTMLElement.prototype.addClass) {
  Element.prototype.addClass = function(c) {
    if (!this.hasClass(c)) this.className += (" " + c);
    return this;
  }
}
if (!HTMLElement.prototype.removeClass) {
  Element.prototype.removeClass = function(c) {
    if (this.hasClass(c)) this.className = (" " + this.className + " ").replace(" " + c + " ", " ").trim();
    return this;
  }
}
var BouncingBallWidget = function(window, document, BannerFlow) {
  'use strict';
  var NAME             = "BouncingBall";
  var INTERVAL         = 1000 / 60; //bigger make speed slower
  var COUNT_FRAME      = 0;
  var WORD_FRAME       = 40 //bigger make speed slower
  var SPEED            = 1;
  var JUMP_OFFSET      = 10;
  var PI               = 3.14159265359;
  var ROTATE_SPEED     = 1;
  var ROTATE_DIRECTION = "rotateY";
  var AFTER_IMAGE      = 5;
  var CLASS = {
    container: "container",
    bouncing: "bouncing",
    word: "word",
    hint: "hint",
    ball: "ball",
    customStyle: "custom-style"
  }
  var DEFAULT = {
    text: "Where do I begin. To tell the story of how great a love can be",
    bounceDelay: 1 // frame
  }
  var requestAnimation = function(callback) {
    COUNT_FRAME++;    
    window.setTimeout(callback, INTERVAL * SPEED);
  };
  var resetFrame = function() {
    COUNT_FRAME = 0;
  }

  function BouncingBall() {
    for (var i = 0; i < AFTER_IMAGE; i++) {
      var span = document.createElement("span");
      span.addClass("ball");
      document.querySelector("body").appendChild(span);
    }
    this.container     = document.querySelector("." + CLASS.container);
    this.ball          = document.querySelectorAll("." + CLASS.ball);
    this.text          = DEFAULT.text;
    this.bounceDelay   = DEFAULT.bounceDelay;
    this.count         = 0;
    this.states        = [];
    this.positionFrame = [];
    this.timer         ;
    this.parseText     = this.parseText.bind(this);
    this.parseTime     = this.parseTime.bind(this);
    this.onWindowResize= this.onWindowResize.bind(this);
    this.resetEffect   = this.resetEffect.bind(this);
    this.initialize    = this.initialize.bind(this);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.onChangeSetting  = this.onChangeSetting.bind(this);
    this.firstTime     = true;
  }
  var getDelay = function(word) {
    if (!word || word.length == 0) return 0;
    var delayTime = (1 + word.length / 5) * WORD_FRAME;
    if (/\.|,/.test(word)) delayTime += WORD_FRAME;
    return delayTime;
  }
  var testPosition = function(arr) {
    var test = document.querySelectorAll(".test");
    for (var i=0,t; i<test.length; i++) {
      t = test[i];
      t.parentNode.removeChild(t);
    }
    test = document.createElement("div");
    test.addClass("test");
    document.querySelector("body").appendChild(test);
    
    for (var i = 0; i < arr.length; i++) {
      var span = document.createElement("span");
      span.addClass(CLASS.ball);
      test.appendChild(span);
      span.style.left = arr[i].left + "px";
      span.style.top = arr[i].top + "px";
      span.innerHTML = arr[i].state;
    }
  }
  BouncingBall.prototype.initialize = function(){
    this.parseText();
    this.parseTime();
    this.resetEffect();
    if (this.firstTime) {
      this.onAnimationFrame();  
      this.firstTime = false;
    }    
  }
  BouncingBall.prototype.parseText = function() {
    var arr = this.text.replace(/\s+/g, " ").trim().split(" ");
    //add text
    this.container.empty();
    console.log(this.container);
    this.container.clean();
    for (var i = 0; i < arr.length; i++) {
      var span = document.createElement("span");
      span.innerHTML = arr[i];
      span.addClass(CLASS.word);
      this.container.appendChild(span);
    }
  }
  BouncingBall.prototype.parseTime = function() {
    //calculate time and width
    this.states = [];
    var children = this.container.childNodes;
    var firstWord = children[0];
    var prev = {
      top: firstWord.offsetTop - JUMP_OFFSET,
      left: firstWord.offsetLeft - 40,
      start: 0,
      end: WORD_FRAME
    };
    this.states.push(prev);
    for (var i = 0; i < children.length; i++) {
      var delay = getDelay(children[i].innerHTML) * this.bounceDelay;
      var left = children[i].offsetWidth / 2;
      var current = {
        top: children[i].offsetTop - JUMP_OFFSET,
        left: children[i].offsetLeft + (left > 10 ? left : 2),
        start: prev.end + 1,
        end: prev.end + delay
      }
      this.states.push(current);
      prev = current;
    }
    var lastWord = children[children.length - 1];
    this.states.push({
      top: lastWord.offsetTop - JUMP_OFFSET,
      left: lastWord.offsetLeft + lastWord.offsetWidth + 40,
      start: prev.end + 1,
      end: prev.end + WORD_FRAME
    });
    //calculate position of ball on each frame
    var rotate = 0;
    this.positionFrame = [];
    for (var i = 0; i < this.states.length - 1; i++) {
      var current = this.states[i];
      var next = this.states[i + 1];
      var dLeft = next.left - current.left;
      var dTop = next.top - current.top;
      for (var frame = current.start; frame <= current.end; frame++) {
        var percent = (frame - current.start) / (current.end - current.start);
        var pos = {
          left: current.left + dLeft * percent,
          top: current.top + dTop * percent - Math.sin(PI * percent) * JUMP_OFFSET,
          percent: percent,
          state: i,
          rotate: rotate
        };
        rotate += ROTATE_SPEED;
        this.positionFrame.push(pos);
      }
    }
    //testPosition(this.states);
    //testPosition(this.positionFrame);
  }
  BouncingBall.prototype.resetEffect = function() {
    this.count = 0;
    var children = this.container.childNodes;
    for (var i = 0; i < children.length; i++) {
      children[i].removeClass(CLASS.hint);
    }
    for (var i = 0; i < this.ball.length; i++) {
      this.ball[i].style.opacity = 0;
    }
    resetFrame();
  }
  BouncingBall.prototype.onWindowResize = function() {
    this.parseTime();
    this.resetEffect();
  }
  BouncingBall.prototype.onAnimationFrame = function() {
    var children = this.container.childNodes;
    if (COUNT_FRAME >= this.states[this.count].end) {
      if (this.count < children.length) children[this.count].addClass(CLASS.hint)
      this.count++;
      if (this.count > this.states.length - 1) {
        this.resetEffect();
      }
    }
    for (var i = 0; i < AFTER_IMAGE; i++) {
      var pos = this.positionFrame[COUNT_FRAME - i * 10];
      if (typeof pos != 'undefined') {
        var transform = "translate(" + (pos.left - i * 2) + "px," + (pos.top - i) + "px) " +
          ROTATE_DIRECTION+"(" + (pos.rotate - i * ROTATE_SPEED) + "deg) " +
          "scale(" + (1 - i / AFTER_IMAGE) + ")";
        this.ball[i].style.transform = transform;
        this.ball[i].style.opacity = 1;
      }
    }
    requestAnimation(this.onAnimationFrame);
  }
  BouncingBall.prototype.onEditMode = function() {}
  //remove html from text
  var stripHtml = function(html) {
    html = html.replace(/(<[^>]+>)/ig, " ").trim();
    html = html.replace(/\s{2,}/ig, ", ");
    return html;
  }
  BouncingBall.prototype.onChangeSetting = function() {
    if (typeof BannerFlow === 'undefined') return;
    if (BannerFlow.text) {
      this.text = stripHtml(BannerFlow.text);
      if (this.text.length == 0) this.text = DEFAULT.text;
    }
    if (BannerFlow.settings.Speed && BannerFlow.settings.Speed > 0) {
      SPEED = 1 / +BannerFlow.settings.Speed;
    }
    if (BannerFlow.settings.JumpOffset) {
      JUMP_OFFSET = BannerFlow.settings.JumpOffset;
    }
    if (BannerFlow.settings.AfterImage) {
      AFTER_IMAGE = BannerFlow.settings.AfterImage;
      document.querySelector("body").empty(".ball");
      for (var i = 0; i < AFTER_IMAGE; i++) {
        var span = document.createElement("span");
        span.addClass("ball");
        document.querySelector("body").appendChild(span);
      }
      this.ball = document.querySelectorAll(".ball")
    }
    if (BannerFlow.settings.RotateSpeed != null) {
      ROTATE_SPEED = BannerFlow.settings.RotateSpeed;
    }
    if (BannerFlow.settings.RotateDirection != null) {
      ROTATE_DIRECTION = BannerFlow.settings.RotateDirection;
    }
    var style = "";
    var getStyle = function(selector, styleObj) {
      var newStyle = selector + "{";
      for (var attr in styleObj) {
        if (styleObj[attr]) {
          newStyle += attr + " : " + styleObj[attr] + ";";
        }
      }
      newStyle += "}";
      return newStyle;
    }    
    style += getStyle(".word", {
      "color": (BannerFlow.settings.ShowOnHint ? "transparent" : BannerFlow.settings.FontColor ? BannerFlow.settings.FontColor : ""),
      "font-size": (BannerFlow.settings.FontSize ? BannerFlow.settings.FontSize + "px" : ""),
      "line-height": (BannerFlow.settings.LineHeight ? BannerFlow.settings.LineHeight + "px": ""),
      "font-family": (BannerFlow.settings.FontFamily ? getFont(BannerFlow.settings.FontFamily) : "")
    });
    var imgUrl = getImages(BannerFlow.settings.BallImage)[0];    
    style += getStyle(".ball", {
      "background-color": (BannerFlow.settings.BallColor ? BannerFlow.settings.BallColor : ""),
      "width": (BannerFlow.settings.BallSize ? BannerFlow.settings.BallSize + "px" : ""),
      "height": (BannerFlow.settings.BallSize ? BannerFlow.settings.BallSize + "px" : ""),
      "background": (imgUrl ? "url('" + imgUrl + "') center center no-repeat" : "")      
    });
    style += getStyle(".hint", {
      "color": (BannerFlow.settings.HintColor) ? BannerFlow.settings.HintColor : "",
      "text-shadow": (BannerFlow.settings.HintColor && BannerFlow.settings.HintShadowSize >= 0) ? "0px 0px " + BannerFlow.settings.HintShadowSize + "px " + BannerFlow.settings.HintColor : ""      
    });
    document.querySelector("#" + CLASS.customStyle).innerHTML = style;
    this.initialize();    
  }
  window[NAME] = BouncingBall;
};
var widget = null;
var ball = null;
if (typeof BannerFlow == 'undefined') {
  window.addEventListener("load", function() {
    if (widget == null) widget = BouncingBallWidget(window, document, undefined);
    if (ball == null) ball = new BouncingBall();
    ball.initialize();
    ball.onEditMode();
  });
  window.addEventListener("resize", function() {
    if (ball != null) {
      clearTimeout(this.timer);
      this.timer = setTimeout(function(){ball.onWindowResize();}.bind(this),100);      
    }
  });
} else {
  BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function() {
    if (ball != null) {
      clearTimeout(this.timer);
      this.timer = setTimeout(function(){ball.onChangeSetting();}.bind(this),500);
    }
  });
  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
    if (ball != null) {
      clearTimeout(this.timer);
      this.timer = setTimeout(function(){ball.onChangeSetting();}.bind(this),500);
    }
  });
  BannerFlow.addEventListener(BannerFlow.INIT, function() {
    if (widget == null) widget = BouncingBallWidget(window, document, BannerFlow);
    if (ball == null) ball = new BouncingBall();
    clearTimeout(this.timer);
    this.timer = setTimeout(function(){ball.onChangeSetting();}.bind(this),500);
    if (BannerFlow.editorMode) ball.onEditMode();
  });
}