
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
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

function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}



/*============================================*/

var DiscoBall = (function(){

    var container = get('widgetContainer');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    /*--- settings from banner flow ---*/
    var color = "rgba(255, 184, 0, 1)";
    var speed = 5;
    var isReflect = true;
    var ropeLength = 10;
    var radius = 50;
    var squareSize = 10;
    var ropeColor;

    var timeout;
    var hslColor;
    var sphere;
    var rotation = 0;
    var distance = 0;
    var maxL = 90;
    var middleL = 70;
    var minL = 25;
    var increaseValue = 0.5;
    var numberDarkL = 0;
    var percentDarkL = 2;

    var canvas = get("sphere3d");
    var ctx = canvas.getContext('2d');

    var rope = get("rope");

    function startWidget(currentSesssion) {
      rope.style.height = ropeLength + 'px';
      rope.style.background = ropeColor;

      hslColor = color.substr("rgba(".length);
      hslColor = hslColor.split(",");

      hslColor = rgbToHsl(hslColor[0], hslColor[1], hslColor[2]);

      minL = hslColor[2]*100 - 25;
      minL = minL < 0 ? 0 : minL;

      maxL = hslColor[2]*100 + 25;
      maxL = maxL > 100 ? 100 : maxL;

      middleL = hslColor[2]*100;

      sphere = new Sphere3D(radius);

      render();
    }

    function Point3D() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.color = "hsla(100,100%,100%,1)";
    }

    function createColor() {
      var l;
      if(numberDarkL < percentDarkL){
        l = rand(middleL,minL,true);
        numberDarkL++;
      } else {
        numberDarkL = 0;
        l = rand(maxL,middleL,true);
      }

      var d = rand(1,0,true);

      return { 
        h: hslColor[0] * 360,
        s: hslColor[1] * 100,
        l: l,
        d: d == 0? 1 : -1,
        minL: numberDarkL > 0 ? minL : middleL,
        maxL: numberDarkL > 0 ? middleL : maxL
      };
    }

    function increaseLightColor(color) {
      if(!isReflect)
        return color;

      if(color.d > 0) {
        if(color.l < color.maxL)
          color.l += increaseValue;
        else {
          color.d = -1;
          color.l -= increaseValue;
        }
      } else {
        if(color.l > color.minL)
          color.l -= increaseValue;
        else {
          color.d = 1;
          color.l += increaseValue;
        }
      }

      return color;
    }
    
    function Sphere3D(radius) {
        this.point = new Array();
        this.color = "rgb(100,0,255)"
        this.radius = (typeof(radius) == "undefined") ? 100.0 : radius;
        this.radius = (typeof(radius) != "number") ? 100.0 : radius;
        this.numberOfVertexes = 0;
        this.numberPointInCircle = 0;

        var angleSquare = parseFloat((Math.PI / 180 * squareSize).toFixed(2));


        // Loop from 0 to 360 degrees with a pitch of 10 degrees ... 
        for(alpha = 0; alpha <= 6.28; alpha += angleSquare) {
            p = this.point[this.numberOfVertexes] = new Point3D();
            
            p.x = Math.cos(alpha) * this.radius;
            p.y = 0;
            p.z = Math.sin(alpha) * this.radius;
            p.color = createColor();

            this.numberOfVertexes++;
        }
        this.numberPointInCircle = this.numberOfVertexes;

        // Loop from 0 to 90 degrees with a pitch of 10 degrees ... 
        // (direction = 1)
         
        // Loop from 0 to 90 degrees with a pitch of 10 degrees ...
        // (direction = -1)

        for(var direction = 1; direction >= -1; direction -= 2) {

            for(var beta = angleSquare; beta < 1.57; beta += angleSquare) {
                var radius = Math.cos(beta) * this.radius;
                var fixedY = Math.sin(beta) * this.radius * direction;

                for(var alpha = 0; alpha < 6.28; alpha += angleSquare) {
                    p = this.point[this.numberOfVertexes] = new Point3D();

                    p.x = Math.cos(alpha) * radius;
                    p.y = fixedY;
                    p.z = Math.sin(alpha) * radius;
                    p.color = createColor();

                    this.numberOfVertexes++;
                }
            }

            if(direction > 0)
              for(alpha = 0; alpha <= 6.28; alpha += angleSquare) {
                p = this.point[this.numberOfVertexes] = new Point3D();
                
                p.x = Math.cos(alpha) * this.radius;
                p.y = -0.1;
                p.z = Math.sin(alpha) * this.radius;
                p.color = createColor();

                this.numberOfVertexes++;
              }
        }

    }

    function rotateX(point, radians) {
        var y = point.y;
        point.y = (y * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
        point.z = (y * Math.sin(radians)) + (point.z * Math.cos(radians));
    }
    
    function rotateY(point, radians) {
        var x = point.x;
        point.x = (x * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
        point.z = (x * Math.sin(radians)) + (point.z * Math.cos(radians));
    }

    function rotateZ(point, radians) {
        var x = point.x;
        point.x = (x * Math.cos(radians)) + (point.y * Math.sin(radians) * -1.0);
        point.y = (x * Math.sin(radians)) + (point.y * Math.cos(radians));
    }

    function projection(xy, z, xyOffset, zOffset, distance) {
        //return ((distance * xy) / (z - zOffset)) + xyOffset;
        return xy + xyOffset;            
    }

    function render() {
        if(isStop) {
            isRunning = false;
            if(timeout)
              clearTimeout(timeout);

            return;
        }

        isRunning = true;

        ctx.save();
        ctx.clearRect(0, 0, containerWidth, containerHeight);

        //ctx.globalCompositeOperation = "lighter";
        
        for(i = 0; i < sphere.numberOfVertexes; i++) {
            
            // check the last round
            if(i + sphere.numberPointInCircle >= sphere.numberOfVertexes)
              break;

            // point 1
            var p1 = new Point3D();
            p1.x = sphere.point[i].x;
            p1.y = sphere.point[i].y;
            p1.z = sphere.point[i].z;
            p1.color = increaseLightColor(sphere.point[i].color);

            rotateY(p1, rotation);

            // point 2
            var p2 = new Point3D();
            if(i%sphere.numberPointInCircle != sphere.numberPointInCircle - 1) {
              p2.x = sphere.point[i + 1].x;
              p2.y = sphere.point[i + 1].y;
              p2.z = sphere.point[i + 1].z;
            } else {
              p2.x = sphere.point[i - sphere.numberPointInCircle + 1].x;
              p2.y = sphere.point[i - sphere.numberPointInCircle + 1].y;
              p2.z = sphere.point[i - sphere.numberPointInCircle + 1].z;
            }

            rotateY(p2, rotation);

            // point 3
            var p3 = new Point3D();
            if(i%sphere.numberPointInCircle != sphere.numberPointInCircle - 1) {
              p3.x = sphere.point[i + sphere.numberPointInCircle + 1].x;
              p3.y = sphere.point[i + sphere.numberPointInCircle + 1].y;
              p3.z = sphere.point[i + sphere.numberPointInCircle + 1].z;
            } else {
              p3.x = sphere.point[i + 1].x;
              p3.y = sphere.point[i + 1].y;
              p3.z = sphere.point[i + 1].z;
            }

            rotateY(p3, rotation);

            // point 4
            var p4 = new Point3D();
            p4.x = sphere.point[i + sphere.numberPointInCircle].x;
            p4.y = sphere.point[i + sphere.numberPointInCircle].y;
            p4.z = sphere.point[i + sphere.numberPointInCircle].z;

            rotateY(p4, rotation);

            if(p1.y * p4.y < 0) {
              continue;
            }

            // Transform points

            p1.x = projection(p1.x, p1.z, containerWidth/2.0, 100.0, distance);
            p1.y = projection(p1.y, p1.z, ropeLength + radius, 100.0, distance);

            p2.x = projection(p2.x, p2.z, containerWidth/2.0, 100.0, distance);
            p2.y = projection(p2.y, p2.z, ropeLength + radius, 100.0, distance);

            p3.x = projection(p3.x, p3.z, containerWidth/2.0, 100.0, distance);
            p3.y = projection(p3.y, p3.z, ropeLength + radius, 100.0, distance);

            p4.x = projection(p4.x, p4.z, containerWidth/2.0, 100.0, distance);
            p4.y = projection(p4.y, p4.z, ropeLength + radius, 100.0, distance);

            /*---------------------------------------------------------*/

            if((p1.x >= 0) && (p1.x < containerWidth)) {
                if((p1.y >= 0) && (p1.y < containerHeight)) {
                    if(p1.z > 0 || p2.z > 0 || p3.z > 0 || p4.z > 0) {
                        drawRect(ctx, p1, p2, p3, p4);
                    }
                }
            } 
        }
        ctx.restore();
        rotation += Math.PI/720 * speed;

        if(distance < 1000) {
            distance += 10;
        }

      timeout = setTimeout(render, 1000/60);
    }

    function drawRect(ctx, p1, p2, p3, p4) {
      ctx.fillStyle = "hsla(" + p1.color.h + "," + p1.color.s + "%," + p1.color.l + "%, 1)";
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fill();
    }
    
    /*==============================================*/
    /*===== Start point of animation  =====*/
    /*==============================================*/

    function reloadGlobalVariables() {

      containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
      containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

      canvas.width = containerWidth;
      canvas.height = containerHeight;

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

        color = BannerFlow.settings.color;
        speed = BannerFlow.settings.speed;
        if(speed <= 0)
          speed = 1;
        isReflect = BannerFlow.settings.isReflect;
        ropeLength = BannerFlow.settings.ropeLength;
        radius = BannerFlow.settings.radius;
        if(radius <= 0)
          radius = 50;

        squareSize = BannerFlow.settings.squareSize;
        if(squareSize <= 0)
          squareSize = 1;
        if(squareSize >= 90)
          squareSize = 89;

        ropeColor = BannerFlow.settings.ropeColor;

      } else {

        color = "rgba(232, 205, 21, 1)";
        speed = 5;
        isReflect = true;
        ropeLength = 50;
        radius = 50;
        squareSize = 10;
        ropeColor = "rgba(255, 0, 0, 1)";

      }
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


    function onStart() {
      init();
    }

    function onResize(){
      onStart();
    }

    function resetParameter(){
      onStart();
    }

    return {
      start: onStart,

      onResized: onResize,

      onSettingChanged: resetParameter

    };
})();

if(typeof BannerFlow == "undefined"){
  DiscoBall.start();
} else {
  BannerFlow.addEventListener(BannerFlow.INIT, function () {
    DiscoBall.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    DiscoBall.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    DiscoBall.onSettingChanged();
  });

  BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    DiscoBall.start();
  });
}

