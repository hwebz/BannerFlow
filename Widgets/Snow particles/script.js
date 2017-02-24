if (!Node.prototype.empty) {
    Node.prototype.empty = function(){
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
    }
}
if (!HTMLElement.prototype.hasClass) {
    Element.prototype.hasClass = function(c) {
        return (" "+this.className+" ").replace(/[\n\t]/g, " ").indexOf(" "+c+" ") > -1;
    }
}
if (!HTMLElement.prototype.addClass) {
    Element.prototype.addClass = function(c) {
        if (!this.hasClass(c)) this.className += (" " +c);
        return this;
    }
}
if (!HTMLElement.prototype.removeClass) {
    Element.prototype.removeClass = function(c) {
        if (this.hasClass(c)) this.className = (" "+this.className+" ").replace(" "+c+" "," ").trim();
        return this;
    }
}
if (!HTMLElement.prototype.fade) {
    Element.prototype.fade = function(show) {
        var elem = this;
        var opacity = parseFloat(window.getComputedStyle(elem,null).getPropertyValue("opacity"));
        var oJump = show ? 0.1 : -0.1;
        if (show && opacity >=1 || !show && opacity <= 0) return;
        var worker = setInterval(function() {
            opacity += oJump;
            elem.style.opacity = opacity;
            if (show && opacity >=1 || !show && opacity <= 0) clearInterval(worker);
        }, 30);
    }
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}
var Utils = {
    isNumeric : function(n){
        return (typeof n !== undefined) && !isNaN(parseFloat(n)) && isFinite(n);
    },
    rand : function(range1,range2){
        var val = Math.random();
        if (Utils.isNumeric(range1))
            return Utils.isNumeric(range2) ? range1 + val*(range2-range1) : val*range1;
        return val;
    },
    rgb2hsl : function(r,g,b){
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d ; break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
        }
        return [h*60, s*100, l*100];
    },
    getHue : function(rgbColor){
        if (rgbColor && rgbColor.startsWith("rgb")) {
            var rgb = rgbColor.match(/\(([^)]+)\)/)[1].split(",");
            if (rgb[0] == rgb[1] && rgb[1]==rgb[2]) return -1; // return if white/back/gray
            var hsl = this.rgb2hsl(...rgb);
            return hsl[0];
        }
        return -1;
    }
};
//size of container
var globalSettings = {
    quantity : 100,
    height: 600,
    width: 800,
    fallSpeedMin: 1,
    fallSpeedMax : 1.5,
    rotateSpeed : 10,
    sizeMin: 20,
    sizeMax: 40,
    defaultImage : "https://pngimg.com/upload/snowflakes_PNG7578.png",
    images : [
        //"http://www.clker.com/cliparts/7/9/6/7/12924392551792572772snow%20flake%20icon%204.svg.med.png",
        //"http://www.iconsdb.com/icons/preview/white/snowflake-44-xxl.png",
        //"http://pngimg.com/upload/snowflakes_PNG7582.png",
        //"http://dedzima.ru/assets/snowflake.png",
        //"http://pngimg.com/upload/snowflakes_PNG7589.png",
        //"http://pngimg.com/upload/snowflakes_PNG7578.png"
    ]
};
//common settings
var otherSettings = {
    blur : false
};
var requestAnimation = function( callback ){
    window.setTimeout(callback, 40);
};
var ColorParticlesWidget = function(container) {
    var elemArr = [],i;
    var init = function () {
        for (i = 0; i < globalSettings.quantity; i++) {
            var elem = new ColorParticles();
            elemArr.push(elem);
            container.appendChild(elem.toDOM());
        }
    }
    var run = function() {
        for (i = 0; i < globalSettings.quantity; i++) {
            elemArr[i].run();
        }
        requestAnimation(run);
    };
    var reset = function(){
        container.empty();
        elemArr = [];
        init();
    };
    var loadImage = function(){
        var loader = document.createElement("div"),count = 0;
        document.querySelector("body").appendChild(loader);
        container.style.opacity = 0;
        loader.style.border = "1px solid red";
        for(var i=0;i<=globalSettings.images.length;i++) {
            var url = globalSettings.images[i];
            if (/https?:\/\/.*\.(?:png|jpg)/.test(url)) {
                var img = document.createElement("img");
                loader.appendChild(img);
                img.src = url;
                count++;
                img.onload=function(){
                    count--;
                    if (count==0) {
                        container.style.opacity = 1;
                        document.querySelector("body").removeChild(loader);
                    }
                }
            }
        }
    };
    //public
    var public = {
        applySize : function(){
            globalSettings.width = container.offsetWidth ;
            globalSettings.height = container.offsetHeight;
        },
        applySettings : function() {
            if (typeof BannerFlow != 'undefined' && BannerFlow.settings) {
                var settings = BannerFlow.settings;
                if (settings.FallSpeed) {
                    globalSettings.fallSpeedMax = settings.FallSpeed;
                    globalSettings.fallSpeedMin = settings.FallSpeed/2;
                }
                if (settings.MinSize) globalSettings.sizeMin = settings.MinSize;
                if (settings.MaxSize) globalSettings.sizeMax = settings.MaxSize;
                if (settings.RotateSpeed) globalSettings.rotateSpeed = settings.RotateSpeed;
                var tmpImg = [];
                for(var i=1;i<=5;i++){
                    var img = settings["Image"+i];
                    if (img && img.trim()) tmpImg.push(img.trim());
                }
                globalSettings.images = ["https://bannerflow.blob.core.windows.net/resources/snowflakes-png7578-5bbfd44b-1740-4f6f-953d-18eb5bb14ef0-300x300.png"];                
                if (tmpImg.length>0) globalSettings.images = tmpImg;
                if (settings.Quantity && globalSettings.quantity != settings.Quantity) {
                    globalSettings.quantity = settings.Quantity;
                    reset();
                }
                loadImage();
            }
        }
    };
    init();
    run();
    return public;
}
var ColorParticles = function() {
    //private default settings
    //fall speed
    var fallSpeed = {
        min : 0.5,
        max : 1.5
    };
    //size of bokeh
    var size = {
        val : 0
    };
    //opacity settings
    var opacity = {
        val : 0,
        jump : 0.1,
        min : -3,
        max : 3,
        alphaMax : 0.75
    };
    //position of bokeh
    var pos = {
        top : 0,
        left : 0,
        topOffset : 0,
        leftOffset : 0,
        rotateY : 0
    };
    //amplitude of sine function
    var amplitude = {
        val : 10
    };
    var elem = document.createElement("div").addClass("dot");
    var randomImage = function(){
        var bgImage = globalSettings.defaultImage;// default image
        if (globalSettings.images.length != 0) {
            bgImage = globalSettings.images[Utils.rand(globalSettings.images.length) | 0 ];
        }
        return "url('"+bgImage+"') center center no-repeat";
    };
    var blur = function() {
        var val = Utils.rand(-0.5 , 0.5);
        elem.style["-webkit-filter"] = "blur(" + val + "px)";
        elem.style["-moz-filter"] = "blur(" + val + "px)";
        elem.style["-o-filter"] = "blur(" + val + "px)";
        elem.style["-ms-filter"] = "blur(" + val + "px)";
    };
    //reset for particles run
    var reset = function(init) {
        size.val = Utils.rand(globalSettings.sizeMin,globalSettings.sizeMax);
        elem.style.width = elem.style.height = size.val+"px";
        pos.top = init ? Utils.rand(globalSettings.height) : (0 - globalSettings.sizeMax-Utils.rand(20)); // set to top
        pos.topOffset = Utils.rand(globalSettings.fallSpeedMin,globalSettings.fallSpeedMax) ;
        pos.leftOffset = Utils.rand();//% of screen
        pos.rotateY = Utils.rand(360) | 0;
        amplitude.val =  Utils.rand(size.val*0.5,size.val*2);
        elem.style.top = pos.top + "px";
        elem.style.background = randomImage();
        elem.style["background-size"] = "cover";
        opacity.val = opacity.min;
        opacity.jump = Utils.rand(0.03,0.1);
        elem.style.opacity = opacity.val;
        if (otherSettings.blur) blur();
        if (otherSettings.glow) glow();
    };
    var move = function() {
        var outOfHeight = pos.top > (globalSettings.height + globalSettings.sizeMax);
        var fadeout = opacity.jump < 0 && opacity.val <= 0;
        var outOfSize = size.val < globalSettings.sizeMin || size.val > globalSettings.sizeMax;
        if ( ( outOfHeight || outOfSize ) && fadeout ) {
            reset();
        } else {
            pos.top += pos.topOffset;
            pos.left = pos.leftOffset*globalSettings.width + Math.sin(pos.top / 30) * amplitude.val;
            pos.rotateY += globalSettings.rotateSpeed;
        }
        elem.style.transform = "translate(" + pos.left + "px," + pos.top + "px)"
            +" rotateY("+pos.rotateY+"deg)"
            //+" translate3d("+0+","+0+","+ opacity.val +"px)"
            ;
    };
    var blink = function() {
        //if opacity reach limit, reverse, make blink
        opacity.val += opacity.jump;
        if (opacity.val <= opacity.min || opacity.val >= opacity.max) {
            opacity.jump = 0 - opacity.jump;
        }
        elem.style.opacity = Math.min(opacity.val,opacity.alphaMax);
        elem.style.filter = 'alpha(opacity=' + opacity.val * 100 + ")";//convert to percent
    };
    //public
    var public = {
        toDOM : function(){
            return elem;
        },
        run : function() {
            blink();
            move();
        }
    };
    reset(true);
    return public;
}
/*-------------running-------------*/
var widget = null ;
var timer;
if (typeof BannerFlow != 'undefined') {
    BannerFlow.addEventListener(BannerFlow.INIT, function() {
        if (widget == null) widget = new ColorParticlesWidget(document.querySelector("#container"));
        clearTimeout(timer);
        timer = setTimeout(function(){
            widget.applySize();
            widget.applySettings();
        },500);
    });
    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function() {
        if (widget == null) widget = new ColorParticlesWidget(document.querySelector("#container"));
        clearTimeout(timer);
        timer = setTimeout(function(){
            widget.applySize();
            widget.applySettings();
        },500);
    });
    BannerFlow.addEventListener(BannerFlow.RESIZE, function() {
        if (widget == null) widget = new ColorParticlesWidget(document.querySelector("#container"));
        clearTimeout(timer);
        timer = setTimeout(function(){
            widget.applySize();
        },500);
    });
}else {
    document.addEventListener("DOMContentLoaded", function() {
    });
    window.addEventListener('load', function(){
        var container = document.querySelector("#container");
        widget = new ColorParticlesWidget(container);
        widget.applySize();
        widget.applySettings();
    }, false );
    window.addEventListener('resize', function(){
        widget.applySize();
    }, false );
}