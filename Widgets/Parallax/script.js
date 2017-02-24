(function(window, document, BannerFlow) {  
	'use strict';
	// Constants
	var NAME              = 'Parallax';	
	var CONTROL_PADDING   = 10;    
    var INTERVAL		  = 150;
	var DEFAULTS          = {    
	};
    var requestAnimation = function( callback ){
    	window.setTimeout(callback, INTERVAL);
    };
	
	function Parallax(element,container, options) {
		if (typeof element == 'undefined' || typeof container == 'undefined') {
			console.log('Element or container is null or undefined. Contructor fail');
			return null;
		}			
		this.element = element;
		this.container = container;
		this.options = options;			
		this.raf = null;
        this.event = null;
        this.originHeight = 1000;
		this.pos = {
			left : 0,
			top : 0,
			leftJump : 0,
			topJump : 0,
			leftMin : 0,
			topMin : 0,
            oldLeft : -1,
            oldTop : -1
		}		
		this.onMouseMove = this.onMouseMove.bind(this);
        this.onBannerFlowMouseMove = this.onBannerFlowMouseMove.bind(this);
		this.onAnimationFrame = this.onAnimationFrame.bind(this);
		this.onDeviceOrientation  = this.onDeviceOrientation.bind(this);
		this.onDeviceMotion  = this.onDeviceMotion.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);
		this.initialise();        
	}	
	Parallax.prototype.motionSupport = !!window.DeviceMotionEvent;
	Parallax.prototype.orientationSupport = !!window.DeviceOrientationEvent;
	Parallax.prototype.isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|webOS|BB10|mobi|tablet|IEMobile|opera mini|nexus 7)/i);
	Parallax.prototype.isIOS = navigator.userAgent.match(/(iPhone|iPod|iPad)/i);
	Parallax.prototype.initialise = function() {
		if (!this.isMobile) {
			window.addEventListener('resize', this.onWindowResize);            
            BannerFlow.addEventListener(BannerFlow.MOUSE_MOVE, this.onBannerFlowMouseMove);    
            window.addEventListener('mousemove', this.onMouseMove);            
		} else {			
			if (this.orientationSupport) {
				window.addEventListener('deviceorientation', this.onDeviceOrientation);
			}
			// else if (this.motionSupport) {
			// 	window.addEventListener('devicemotion', this.onDeviceMotion);
			// } 			
		}
		this.onWindowResize();
		this.onAnimationFrame();		
	};
	Parallax.prototype.onWindowResize = function() {        
		this.pos.leftMin = this.container.offsetWidth - this.element.offsetWidth;
		this.pos.topMin = this.container.offsetHeight - this.element.offsetHeight;
	};
	Parallax.prototype.onAnimationFrame = function() {
		var elem = this.element;
		var pos = this.pos;
        var top,left,style,update;
        update = false;
        if (pos.oldLeft==-1 || Math.abs(pos.left-pos.oldLeft) > 5) {
            pos.oldLeft = pos.left;
            update = true;
        }
        if (pos.oldTop==-1 || Math.abs(pos.top-pos.oldTop) > 5) {
            pos.oldTop = pos.top;
            update = true;
        }
        if (update) {
            top = pos.oldTop*pos.topMin/100;
            left = pos.oldLeft*pos.leftMin/100;
            style = "translate(" + left + "px," + top + "px) "; 
            elem.style.transform = style;
            elem.style["-webkit-transform"] = style;
            elem.style["-moz-transform"] = style;
            elem.style["-o-transform"] = style;
            elem.style["-ms-transform"] = style; 
        }    
        requestAnimation(this.onAnimationFrame);		
	};
	Parallax.prototype.onDeviceOrientation = function(event) {
		var left,top,result=-1;        
        //range 0-1
		var getRange = function(val, start, end){
          //revert dimension if change sign and zero distance > 180
          if(start*end<0 && Math.abs(start)+Math.abs(end) > 180) {
            start = start > 0 ? 180-start : -180-start;
            end = end > 0 ? 180-end : -180-end;
            val = val > 0 ? 180-val : -180-val;
          }                    
          var inRange = (start-val)*(end-val)<=0;
          var ds = Math.abs(start-val);
          var de = Math.abs(end-val);
          var result = inRange ? ds/(ds+de) : ds<5 ? 0 : de<5 ? 1 : -1;          
          return result;   
		}        
        this.pos.leftMin = this.container.offsetWidth - this.element.offsetWidth;
		this.pos.topMin = this.container.offsetHeight - this.element.offsetHeight;
		if (window.orientation == 0) {            
			top = event.beta;
    		left = event.gamma; 
            top = Math.abs(top) < 100 ? getRange(top,30,70) : getRange(top,160,-160);
    		left = getRange(left,-15,15);    		
		} else if (window.orientation == 90){
			left = event.beta;
    		top = event.gamma;
            top = Math.abs(left)<90 ? getRange(top,-10,-40) : getRange(top,15,-15);
    		left = Math.abs(left)<90 ? getRange(left,-15,15) : getRange(left,-165,165);
		} else if (window.orientation == -90){
            left = event.beta;
    		top = event.gamma;
            top = Math.abs(left)<90 ? getRange(top,10,40) : getRange(top,-15,15);
    		left = Math.abs(left)<90 ? getRange(left,-15,15) : getRange(left,-165,165);
        } else if (window.orientation == 180){
            top = event.beta;
    		left = event.gamma;    		
            top = getRange(top,-30,-70);
    		left = getRange(left,-15,15);
        }
        if (left!=-1){
        	this.pos.left = left*100 | 0;
        }
        if (top!=-1) {
            this.pos.top=top*100 | 0;
        }        
    	this.log(
            "o" + window.orientation+
            //",alpha : " + event.alpha +
			",b" + (event.beta | 0) +            
            ",g" + (event.gamma | 0) +
            ",top" + (top*100 | 0) +
    		",left" + (left*100 | 0)
    		//this.pos.left | 0 ,this.pos.top | 0
    	);
	};
	Parallax.prototype.onDeviceMotion = function(event) {		
		var beta = event.rotationRate.beta;
		var gamma = event.rotationRate.gamma;		
    	if (this.isMobile && beta !== null && gamma !== null) {
			this.mobileTransition(beta,gamma);
		}
	};
	Parallax.prototype.onMouseMove = function(event) {
        var x,y;
        var x = event.clientX;
		var y = event.clientY;
		x = (x-CONTROL_PADDING)/(this.container.offsetWidth-2*CONTROL_PADDING);
	    y = (y-CONTROL_PADDING)/(this.container.offsetHeight-2*CONTROL_PADDING);
	    x = x < 0 ? 0 : x > 1 ? 1 : x;
	    y = y < 0 ? 0 : y > 1 ? 1 : y;	    
		this.pos.left = x*100 | 0;
		this.pos.top = y*100 | 0;        
	};
    Parallax.prototype.onBannerFlowMouseMove = function() {
        var x,y;
        x = BannerFlow.mouseX;
        y = BannerFlow.mouseY;
        x = (x-CONTROL_PADDING)/(this.container.offsetWidth-2*CONTROL_PADDING);
	    y = (y-CONTROL_PADDING)/(this.container.offsetHeight-2*CONTROL_PADDING);
	    x = x < 0 ? 0 : x > 1 ? 1 : x;
	    y = y < 0 ? 0 : y > 1 ? 1 : y;	    
		this.pos.left = x*100 | 0;
		this.pos.top = y*100 | 0;
    }
    
    Parallax.prototype.log = function(){
		var log = document.querySelector(".log");
		var text = "";
		for (var i = 0; i < arguments.length; i++) {
			text += (i==0?"":",") + arguments[i] ;
    	}    	
		log.innerHTML = text;
	}
    Parallax.prototype.changeImage = function(){
        var img = document.querySelector(".scene");
        var noImg = document.querySelector("#no-image");
        var url = BannerFlow.text;
        img.style.opacity = 0;
        if (url.indexOf('//') > -1) {
            noImg.style.display = 'none';        	
            img.src = url;
        	img.onload = function() {
                parallax.onWindowResize();
                img.style.opacity = '1';
                noImg.style.display = 'none';
                this.originHeight = img.offsetHeight;
            }
            img.onerror = function(){
                noImg.style.display = 'block';
                img.style.display = 'none';            
            }    
        } else if (BannerFlow.editorMode) {
        	// Only show no-image help text when in Editor mode
        	//noImg.style.display = 'block';
        	//img.style.display = 'none';
		}
    }
    Parallax.prototype.changeScale = function(){
        var scale = BannerFlow.settings.parallaxScale;        
        if (typeof scale != 'undefined' && scale) {
            scale = 1+scale/100;
            var height = this.originHeight * scale;
            this.element.style.height = height+"px";            
        }
    }
	window[NAME] = Parallax;
})(window,document,BannerFlow);
if (typeof BannerFlow == 'undefined') {
	window.addEventListener("load",function(){
        var container = document.querySelector(".container");
        var scene = document.querySelector(".scene");
        var parallax = new Parallax(scene,container);	
    });    
} else {
    var container = document.querySelector(".container");
    var scene = document.querySelector(".scene");
    var parallax = new Parallax(scene,container);
    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        parallax.changeImage();
	});
    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    	parallax.changeScale();
	});
    BannerFlow.addEventListener(BannerFlow.INIT, function () {        
        parallax.changeImage();
        parallax.changeScale();
	});
}
