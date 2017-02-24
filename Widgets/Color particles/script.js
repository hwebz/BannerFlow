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
			var hsl = this.rgb2hsl(rgb[0],rgb[1],rgb[2]);
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
	sizeMin: 10,
	sizeMax: 60,
	hueLimit : []
}
//common settings
var otherSettings = {
	blur : true,
	glow : false	
}
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
		window.requestAnimationFrame(run);
	};
	var reset = function(){		
		container.empty();
		elemArr = [];		
		init();
	}

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
				var tones = [],h;
				if (( h = Utils.getHue(settings.Tone1))!=-1) tones.push(h);
				if (( h = Utils.getHue(settings.Tone2))!=-1) tones.push(h);
				if (( h = Utils.getHue(settings.Tone3))!=-1) tones.push(h);
				if (( h = Utils.getHue(settings.Tone4))!=-1) tones.push(h);
				if (( h = Utils.getHue(settings.Tone5))!=-1) tones.push(h);
				globalSettings.hueLimit = tones;
				if (settings.Quantity && globalSettings.quantity != settings.Quantity) {
					globalSettings.quantity = settings.Quantity;
					reset();
				}
			}			
		}
	};
	init();
	window.requestAnimationFrame(run);
	return public;
}
var ColorParticles = function() {
	//private default settings
	//fall speed
	var fallSpeed = {
		min : 0.5,
		max : 1.5
	}
	//size of bokeh
	var size = {		
		val : 0
	};
	//opacity settings
	var opacity = {
		val : 0,
		jump : 0.1,
		min : -2,
		max : 4
	};
	//position of bokeh
	var pos = {
		top : 0,
		left : 0,
		topOffset : 0,
		leftOffset : 0
	};
	//amplitude of sine function
	var amplitude = {
		val : 10
	};
	//colors settings, we using hsla color system
	var colors = {
		h : 0,
		s : 0,
		l : 0,
		a : 0,		
		getDarker : function() {
			return "hsla(" + this.h + "," + (this.s+20) + "%," + (this.l-20) + "%," + (this.a+0.1) + ")"
		},
		getLighter : function() {
			return "hsla(" + this.h + "," + (this.s-10) + "%," + (this.l+20) + "%," + (this.a+0.1) + ")"
		},
		getOriginal : function() {
			return "hsla(" + this.h + "," + this.s + "%," + this.l + "%," + this.a + ")"
		},
		saturation : {
			min : 40,
			max : 100
		},
		light : {
			min : 50,
			max : 90
		},
		alpha : {
			min : 0.5,
			max : 0.8	
		}
	}
	var elem = document.createElement("div").addClass("dot");
	
	var randomColor = function() {		
		if (globalSettings.hueLimit.length == 0) {
			colors.h = Utils.rand(360) | 0;			
		} else {			
			colors.h = globalSettings.hueLimit[Utils.rand(globalSettings.hueLimit.length)| 0 ];
		}		
		colors.s = Utils.rand(colors.saturation.min,colors.saturation.max) | 0;
		colors.l = Utils.rand(colors.light.min,colors.light.max) | 0;
		colors.a = Utils.rand(colors.alpha.min,colors.alpha.max) ;
	};
	var blur = function() {		
		var val = Utils.rand(-0.5 , 0.5);		
		elem.style["-webkit-filter"] = "blur(" + val + "px)";
		elem.style["-moz-filter"] = "blur(" + val + "px)";
		elem.style["-o-filter"] = "blur(" + val + "px)";
		elem.style["-ms-filter"] = "blur(" + val + "px)";				
	};
	var glow = function() {
		//glow 20%
		if (Utils.rand() > 0.8)	elem.style["box-shadow"] = "0 0 5px "+colors.lighter+",0 0 10px "+colors.lighter+"";		
		//elem.style.border = "1px solid "+colors.lighter;
	}
	//reset for particles run
	var reset = function(init) {
		size.val = Utils.rand(globalSettings.sizeMin,globalSettings.sizeMax);		
		elem.style.width = elem.style.height = size.val+"px";

		pos.top = init ? Utils.rand(globalSettings.height) : (0 - globalSettings.sizeMax-Utils.rand(20)); // set to top
		pos.topOffset = Utils.rand(globalSettings.fallSpeedMin,globalSettings.fallSpeedMax) ;
		pos.leftOffset = Utils.rand();//% of screen
		amplitude.val =  Utils.rand(size.val*0.5,size.val*2);
		elem.style.top = pos.top + "px";		

		randomColor();
		elem.style["background-color"] = colors.getOriginal();

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
			pos.left = pos.leftOffset*globalSettings.width + Math.sin(pos.top / size.val) * amplitude.val;
		}
		elem.style.transform = "translate(" + pos.left + "px," + pos.top + "px)";
	};
	var blink = function() {
		//if opacity reach limit, reverse, make blink
		opacity.val += opacity.jump;
		if (opacity.val <= opacity.min || opacity.val >= opacity.max) {
			opacity.jump = 0 - opacity.jump;
		}		
		//change color
		if (globalSettings.hueLimit.length == 0) {
			colors.h += 1;
			elem.style["background-color"] = colors.getOriginal();
		}		
		elem.style.opacity = opacity.val;
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