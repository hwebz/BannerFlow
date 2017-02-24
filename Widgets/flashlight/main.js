var FlashlightWidget = (function(){
    var container, canvas, ctx, w, h, mousePosition, flashLightSize, gradient;
    var colorDark = "#000";
    var autoSpeed = 5;
    var isShowFlashAuto = true;

    var gradientColor = {
        first: "rgba(0,255,0, 0.8)",
        second: "rgba(255,0,0, 0)"
    };


    var isCanvasCreated = false;

    function createCanvas() {
        if(isCanvasCreated)
            return;

        isCanvasCreated = true;

        canvas = document.createElement('canvas');
        canvas.setAttribute("style","position: absolute; top: 0px; left: 0px;");
        
        container = document.getElementById('flashLightContainer');
        container.appendChild(canvas);
        
        var widthContainer = window.getComputedStyle(container).getPropertyValue('width');
        var heightContainer = window.getComputedStyle(container).getPropertyValue('height');
        
        canvas.width = parseInt(widthContainer);
        canvas.height = parseInt(heightContainer);
    }

    function resetParameter(){
        if(!ctx)
            return;
        
        w = canvas.width;
        h = canvas.height;

        mousePosition = {
            x: w/2,
            y: h/2
        };

        var sizeCenter = (w > h ? h/5 : w/5);
        var sizeBlur = (w > h ? 2*h/15 : 2*w/15); 
        colorDark = "#000"; 

        if(typeof BannerFlow !== "undefined") {
            if(BannerFlow.settings.flashlightSizeCenter > 0) {
                sizeCenter = BannerFlow.settings.flashlightSizeCenter;
            }

            if(BannerFlow.settings.flashlightSizeBlur > 0){
                sizeBlur = BannerFlow.settings.flashlightSizeBlur;
            }
            else {
                sizeBlur = 0.1;
            }

            if(BannerFlow.settings.colorDarkGray.length > 0){
                colorDark = BannerFlow.settings.colorDarkGray;
            }

            if(BannerFlow.settings.speed > 0){
                autoSpeed = BannerFlow.settings.speed;
            }
        }
        
        flashLightSize = {
            center: sizeCenter,
            outside: sizeCenter + sizeBlur
        };
    }


    function initFlashlight(){
        createCanvas();

        if(canvas.getContext){
            ctx = canvas.getContext('2d');
            resetParameter();
            draw(true);
            container.setAttribute('style','background: none');

            var timeout = setTimeout(function(){
                clearTimeout(timeout);
                showFlashlightAuto();
            }, 1000);

            // BannerFlow.addEventListener(BannerFlow.MOUSE_MOVE, function () { 
            //     isShowFlashAuto = false;

            //     //Mouse position x (related to banner) - Widget position x 
            //     mousePosition.x = BannerFlow.mouseX - BannerFlow.x;
            //     //Mouse position y (related to banner) - Widget position y 
            //     mousePosition.y = BannerFlow.mouseY - BannerFlow.y;

            //     draw();
            // });

            var mouseMove = function(e) {
                var x = e.touches ? e.touches[0].pageX : e.pageX;
                var y = e.touches ? e.touches[0].pageY : e.pageY;

                isShowFlashAuto = false;

                mousePosition.x = x;
                mousePosition.y = y;

                draw();
            };

            container.onmousemove = mouseMove;
            container.ontouchmove = mouseMove;
        }
    }

    function showFlashlightAuto() {
        mousePosition = {
            x: 0,
            y: 0
        };

        var deltaX = autoSpeed;
        var deltaY = flashLightSize.center;
        var directionX = 1;
        var directionY = 1;

        var increasingX = function(){
            if(directionX > 0){
                if(mousePosition.x + deltaX < w + flashLightSize.outside){
                    mousePosition.x = mousePosition.x + deltaX;
                    return true;
                }
                else {
                    directionX = -1;
                    return false;
                }
            }
            else {
                if(mousePosition.x - deltaX > 0 - flashLightSize.outside){
                    mousePosition.x = mousePosition.x - deltaX;
                    return true;
                }
                else {
                    directionX = 1;
                    return false;
                }   
            }
        };

        var increasingY = function(){
            if(directionY > 0){
                if(mousePosition.y + deltaY < h){
                    mousePosition.y = mousePosition.y + deltaY;
                    return true;
                }
                else {
                    directionY = -1;
                    return false;
                }
            }
            else {
                if(mousePosition.y - deltaY > 0){
                    mousePosition.y = mousePosition.y - deltaY;
                    return true;
                }
                else {
                    directionY = 1;
                    return false;
                }
            }
        };

        var reDrawAuto = function(){
            var timeout = window.setTimeout(function() {
                draw();
                clearTimeout(timeout);
                if(isShowFlashAuto) {
                    if(!increasingX()){
                        increasingY();
                    }
                    reDrawAuto();
                }
            }, 1000 / 60);
        };

        reDrawAuto();
    }

    function draw(offFlashlight){
        if(!ctx)
            return;

        ctx.save();
        ctx.clearRect(0, 0, w, h);
        
        ctx.fillStyle = colorDark;
        ctx.fillRect(0, 0, w, h);

        /*flashlight color*/
        gradient = ctx.createRadialGradient(mousePosition.x, mousePosition.y, flashLightSize.center, mousePosition.x, mousePosition.y, flashLightSize.outside);
        gradient.addColorStop(0, gradientColor.first);
        gradient.addColorStop(1, gradientColor.second);

        ctx.globalCompositeOperation = 'destination-out';

        if(!offFlashlight) {
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mousePosition.x, mousePosition.y, flashLightSize.outside, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    function onResize(){
        createCanvas();
        
        var widthContainer = window.getComputedStyle(container).getPropertyValue('width');
        var heightContainer = window.getComputedStyle(container).getPropertyValue('height');
        
        canvas.width = parseInt(widthContainer);
        canvas.height = parseInt(heightContainer);

        draw();
    }


    return {
        start: initFlashlight,

        onResized: onResize,

        onSettingChanged: resetParameter
    };
})();

if(typeof BannerFlow == "undefined"){
    FlashlightWidget.start();
}

BannerFlow.addEventListener(BannerFlow.INIT, function () {
    FlashlightWidget.start();
});

BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    FlashlightWidget.onResized();
});

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    FlashlightWidget.onSettingChanged();
});
