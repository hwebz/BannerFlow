var text = "";
var textSize = 30;
var textColor = "";
var isEnd = false;
var lastPoint = { x:0, y:0 };
var tolerance = 0.45;
var radius = 15;
var canvas = document.getElementById("canvas");
var canvasOver = document.getElementById("canvas-over");
var context = canvas.getContext('2d');
var contextOver = canvasOver.getContext('2d');
var W = canvas.width = canvasOver.width = window.innerWidth;
var H = canvas.height = canvasOver.height = window.innerHeight;
var totalPixels = W*H;
var stopWhenShowing, pressToScratch;
var coin = document.getElementById("coin");
var coinHalfSize = 50/2;
context.globalCompositeOperation = 'source-over';

var generator = new particleGenerator(W / 2, H / 2, 0, 0, 45);
var mouse = {x: 0, y: 0};
var mouseDown = false,
    touchStart = false;
var lastGrayed = 0;

var color = "";
var bgImage = "";

function addListenerMulti(el, s, fn) {
  var evts = s.split(' ');
  for (var i=0, iLen=evts.length; i<iLen; i++) {
    el.addEventListener(evts[i], fn, false);
  }
}

var rgb2hex = function(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
};

 function getImages(imageSetting, isOriginal){
    var images = [];

    if(imageSetting && imageSetting.length > 0)
        for(var i=0;i<imageSetting.length;i++) {
            var imgArr = imageSetting[i].images
            if(isOriginal)
                images.push(imgArr[0].url); // get original image
            else
                images.push(imgArr[imgArr.length-1].url); //get smallest image
        }

    return images;
}

var renderBackground = function(){
    pressToScratch = false;//BannerFlow.settings.pressToScratch || false;
    stopWhenShowing = BannerFlow.settings.stopWhenShowing || false;
    tolerance = BannerFlow.settings.tolerance ? BannerFlow.settings.tolerance : 0.35;
    radius = BannerFlow.settings.scratchSize ? BannerFlow.settings.scratchSize : 20;
    W = canvas.width = canvasOver.width = window.innerWidth;
    H = canvas.height = canvasOver.height = window.innerHeight;
    
    var cursorImages = getImages(BannerFlow.settings.cursorImage, true);
    var hasCursorImage = cursorImages && cursorImages.length > 0;

    var imageFromSettings = getImages(BannerFlow.settings.image, true);
    bgImage = (imageFromSettings && imageFromSettings.length > 0) ? imageFromSettings[0] : "";

    color = BannerFlow.settings.color ? rgb2hex(BannerFlow.settings.color) : "#CCCCCC";   
    textColor = BannerFlow.settings.textColor ? rgb2hex(BannerFlow.settings.textColor) : "#999999";
    textSize = BannerFlow.settings.textSize ? BannerFlow.settings.textSize : 20;

    canvas.className = "";
    canvasOver.className = hasCursorImage ? "coin" : "";
    
    if(!hasCursorImage) coin.style.display = "none";
    if(BannerFlow.getStyle('pointer-events') != 'none' && !hasCursorImage) canvasOver.style.cursor = "pointer";

    if(hasCursorImage) {
        coin.style.background = "url('"+cursorImages[0]+"') no-repeat center center";
        coin.style.backgroundSize = "contain";
    }

    toDataUrl(bgImage, function(base64Img){
        renderCanvas(base64Img);
    });
};

function renderCanvas(base64URI){
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(0,0,W,H);
    context.fill();
    if(base64URI){
        var img = document.createElement('img');
        img.src = base64URI;
        img.addEventListener('load', function(e) {
            var ratio = Math.min(this.width / BannerFlow.getWidth(), this.height / BannerFlow.getHeight());
            var width = this.width / ratio;
            var height = this.height / ratio;
            if(bgImage.length > 2)context.drawImage(img, 0, 0, width, height);
        }, true);
    }

    context.globalCompositeOperation = "source-over";
    context.fillStyle = textColor;
    context.textAlign = "center";
    context.textBaseline="middle"; 
    context.font = "bold " + textSize + "px Arial";
    context.fillText(text,BannerFlow.getWidth()/2,BannerFlow.getHeight()/2);
}

function toDataUrl(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    if(!url){
        callback();
    }
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        image = dataURL
        canvas = null; 
    };
    img.src = url;
}

BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    if(BannerFlow.editorMode)renderBackground();
});

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    if(BannerFlow.editorMode)renderBackground();
});

BannerFlow.addEventListener(BannerFlow.INIT, function () {
    renderBackground();
});

BannerFlow.addEventListener(BannerFlow.LOOP, function () {
    isEnd = false;
    if(stopWhenShowing){
        renderBackground();
    }
});

BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    text = BannerFlow.text;
    if(BannerFlow.editorMode)renderBackground();
});

BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function () {
    if(stopWhenShowing){
        BannerFlow.pause();
        
        window.setTimeout(function(){
            BannerFlow.play(); 
            
            window.setTimeout(function(){
                BannerFlow.pause(); 
            }, 500);
            
        }, 250);
    }
});

function colorLuminance(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }
    return rgb;
}

function clearArc(x, y) {
    context.lineWidth = radius;
    context.lineJoin = "round";
    context.lineCap = "butt";
    context.strokeStyle = "#000000";
    context.globalAlpha = "1";
    context.globalCompositeOperation = "destination-out";

    if(context.lineWidth >= 5) {
        context.lineWidth -= 0.1;
    }
    var currentPoint = { x: x, y: y };

    for(var i = 0;i < 15;i++){
        context.beginPath();
        context.moveTo(lastPoint.x === 0 ? x : lastPoint.x, lastPoint.y === 0 ? y : lastPoint.y);
        context.lineWidth = randomInt(radius/3, radius/2);
        var offset = randomInt(radius*0.3, radius*0.7);
        context.lineTo(currentPoint.x+randomInt(-offset, offset), currentPoint.y+randomInt(-offset, offset));
        context.closePath();
        context.stroke();
    }


    lastPoint = currentPoint;


    var imageData = context.getImageData(0, 0, W, H),
        pixels = imageData.data,
        result = {},
        i, len;

    for (i = 3, len = pixels.length; i < len; i += 4) {
        result[pixels[i]] || (result[pixels[i]] = 0);
        result[pixels[i]]++;
    }

    var grayed = result[255];
    var erased = result[0];

    if(lastGrayed != grayed) {
        didErase = true;
        var removedCount = lastGrayed - grayed;
        for(var i = 0; i < Math.min(removedCount/100, 10); i++){
            generator.particles.push(new particle(randomInt(mouse.x-10, mouse.x+10),randomInt(mouse.y-10,mouse.y+10),null,Math.max(Math.min(removedCount/50, 10),6)));
        }
    } else {
        didErase = false;
    }
    lastGrayed = grayed;
    if(grayed/totalPixels < tolerance){
        end();
    }

}
var mouseUp = function(e) {
    mouseDown = false;
};

var mouseDown = function (e) {
    var mousePos = e.data || { x: e.clientX, y: e.clientY };
    var x = mousePos.x - (e.data ? BannerFlow.x : 0);
    var y = mousePos.y - (e.data ? BannerFlow.y : 0);
    mouse.x = x;
    mouse.y = y;
    generator.particles = new Array();
    mouseDown = true;
    lastPoint = { x:mouse.x, y: mouse.y};
    clearArc(mouse.x, mouse.y);
}

var mouseMove = function (e) {
    var mousePos = e.data || { x: e.clientX, y: e.clientY };
    var x = mousePos.x - (e.data ? BannerFlow.x : 0);
    var y = mousePos.y - (e.data ? BannerFlow.y : 0);

    coin.style.left = (x-coinHalfSize) + "px";
    coin.style.top = (y-coinHalfSize) + "px";

    if (!mouseDown && pressToScratch)
        return;

    mouse.x = x;
    mouse.y = y;
    
    clearArc(mouse.x, mouse.y);
}

var touchEnd = function(e) {
    touchStart = false;
};

var touchStart = function (e) {
    var mousePos = e.data || { x: e.touches[0].clientX, y: e.touches[0].clientY };
    var x = mousePos.x - (e.data ? BannerFlow.x : 0);
    var y = mousePos.y - (e.data ? BannerFlow.y : 0);
    mouse.x = x;
    mouse.y = y;
    generator.particles = new Array();
    touchStart = true;
    lastPoint = { x:mouse.x, y: mouse.y};
    clearArc(mouse.x, mouse.y);
}

var touchMove = function (e) {
    var mousePos = e.data || { x: e.clientX, y: e.clientY };
    var x = mousePos.x - (e.data ? BannerFlow.x : 0);
    var y = mousePos.y - (e.data ? BannerFlow.y : 0);

    coin.style.left = (x-coinHalfSize) + "px";
    coin.style.top = (y-coinHalfSize) + "px";

    if (!touchStart && pressToScratch)
        return;

    mouse.x = x;
    mouse.y = y;
    
    clearArc(mouse.x, mouse.y);
}

BannerFlow.addEventListener(BannerFlow.MOUSE_MOVE, mouseMove);
BannerFlow.addEventListener(BannerFlow.MOUSE_DOWN, mouseDown);
BannerFlow.addEventListener(BannerFlow.MOUSE_UP, mouseUp);

//For mouseinteraction = on
document.addEventListener("mousemove", mouseMove);
document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);

canvasOver.addEventListener("touchmove", touchMove);
canvasOver.addEventListener("touchstart", touchStart);
canvasOver.addEventListener("touchend", touchEnd);



function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
}
function particle(x, y, type, size) {
    this.radius = size || radius / 5;//randomInt(radius/3, radius/3);
    this.x = x + randomInt(-(radius/3),(radius/3));
    this.y = y + randomInt(-(radius/3),(radius/3));
    this.vx = randomInt(-5,5);
    this.vy = randomInt(0, 0);
    this.type=type;
    this.rotation = 35*Math.PI/180;
    this.color = colorLuminance(color, randomInt( -14, 14 ) / 100 );
}
particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.90;
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.radius -= .25;

    if(this.radius < 0)
        this.radius = 0;

    contextOver.beginPath();
    contextOver.fillStyle = this.color;
    contextOver.beginPath();
    contextOver.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
    //contextOver.fillRect(this.x, this.y, this.radius, this.radius);
    contextOver.closePath();
    contextOver.fill();
}

function particleGenerator(x, y, w, h, number,text) {
    this.x = x || W / 2;
    this.y = y ||H / 2;
    this.w = w;
    this.h = h;
    this.number = number;
    this.particles = [];
    this.text=text;
}

particleGenerator.prototype.animate = function() {
    //if(isEnd)
    //    return;

    for (var i = this.particles.length-1; i > 0 ; i--) {
        p = this.particles[i];
        p.update();

        if(p.radius < .1){
            this.particles.splice(i, 1);
        }
    }
}

update();

function update() {
    //if(isEnd)
    //    reutrn;

    contextOver.clearRect(0, 0, W, H);

    if(mouse.x !==0 && mouse.y !==0){
        generator.x = mouse.x;
        generator.y = mouse.y;
    }
    generator.animate();
    requestAnimationFrame(update);
}

function end(){
    isEnd = true;
    context.clearRect(0, 0, W, H);
    canvas.className = "done";
    
    generator.particles = new Array();
    
     for(var i = 0; i < 100; i++){
         var size = Math.max(W / 40, 5);
         var x = randomInt( 0, W );
         var y = randomInt( 0, H );
         generator.particles.push(new particle(x,y,null, size));
     }
    if(stopWhenShowing){
        BannerFlow.play();
    }
}


    
