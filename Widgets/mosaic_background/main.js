rand = function(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
};


var MosaicBackgroundWidget = (function(){

    var container = document.getElementById('widgetContainer');
    var containerWidth, containerHeight;

    var textWarning = document.getElementById('textWarning');
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var color, arrColor;
    var showBackgroundPattern = true;

    var listImgSrc = [];
    var listImages = [];
    var movingObjects = [];
    var grids = [];

    var imageWidth = 200;

    var magnet = 2000;

    var mouse = { x: 1, y: 0 };

    var isRunning = false;
    var isStop = false;
    var sessionId = 0;

    //=====================================================================
    // Steps to animate: preload images => pre-process images => run & loop
    //=====================================================================

    function getImages(imageSetting, isOriginal){
        var images = [];

        if(imageSetting && imageSetting.length > 0)
            for(var i=0;i<imageSetting.length;i++){
                var imgArr = imageSetting[i].images
                if(isOriginal)
                    images.push(imgArr[0].url); // get original image
                else
                    images.push(imgArr[imgArr.length-1].url); //get smallest image
            }

        return images;
    }

    function preloadImages(currentSesssionId) {
        var loaded = 0;
        for(var i=0;i<listImgSrc.length;i++) {
            var image = new Image();
            image.onload = function() {
                
                if(++loaded >= listImgSrc.length) {
                    if(currentSesssionId == sessionId){
                        preprocessImages();
                    }
                }
            }
            image.src = listImgSrc[i];
            listImages.push(image);
        }
    }

    function preprocessImages() {
        for(var i=0;i<listImages.length;i++) {
            listImages[i].oriWidth = listImages[i].width;
            listImages[i].oriHeight = listImages[i].height;

            listImages[i].width = imageWidth;
            listImages[i].height = listImages[i].width * listImages[i].oriHeight/listImages[i].oriWidth;
        }

        run();
    }

    function run() {
        var averageHeight = 0;
        for(var i=0;i<listImages.length;i++) {
            averageHeight += listImages[i].height;
        }

        averageHeight = averageHeight/listImages.length;

        var numberRandomPhoto = (Math.ceil(containerWidth / imageWidth)) * (Math.ceil(containerHeight / averageHeight));

        if (showBackgroundPattern) {
            createGrid();
        }

        populateCanvas(numberRandomPhoto * 4);
        canvas.className += ' ready';

        render();

        addListeners();
    };

    function addListeners() {
        container.addEventListener('mousemove', updateMouse);
        container.addEventListener('touchmove', updateMouse);
    };

    function updateMouse(e) {
        mouse.x = e.touches ? e.touches[0].clientX : e.clientX;
        mouse.y = e.touches ? e.touches[0].clientY : e.clientY;
    };

    function createGrid() {

        var numberCols = Math.ceil(containerWidth / imageWidth);
        var numberFullCols = 0;
        var x,y;
        var indexImage = 0;

        var previousRowGridItem = null;
        
        while(true) {
            
            indexImage = rand(0, listImages.length-1);

            if(grids.length >= numberCols) {
                previousRowGridItem = grids[grids.length - numberCols];
            }

            x = imageWidth * (grids.length % numberCols);
            y = previousRowGridItem != null ? (previousRowGridItem.y + previousRowGridItem.image.height) : 0;

            grids.push(new GridItem(x,y, listImages[indexImage]));

            // Check grid be full
            if(x == 0) // the first item in a row
                numberFullCols = 0;

            if(y + listImages[indexImage].height >= containerHeight) { // full the height of the container
                numberFullCols++;
            }

            if(numberFullCols >= numberCols) {
                break;
            }

        }

        for (var i=0; i < grids.length; i++) {
            grids[i].draw();
        }
    };

    function populateCanvas(nb) {

        var i = 0;
        var indexImage = 0;
        while (i <= nb) {
            indexImage = rand(0, listImages.length-1);
            var p = new Photo(listImages[indexImage]);
            movingObjects.push(p);
            i++;
        }
    };

    function GridItem(x, y, image) {
        if (x == null) {
            x = 0;
        }
        if (y == null) {
            y = 0;
        }

        this.x = x;
        this.y = y;

        this.image = image;

        this.draw = function() {

            // ctx.save();
            //ctx.drawImage(image, 0, 0, image.oriWidth, image.oriHeight, x, y, image.width, image.height);
            // ctx.globalCompositeOperation = "multiply";
            // ctx.fillStyle = color;
            // ctx.fillRect(x, y, image.width, image.height);
            //ctx.restore();

            // blend mode - multiply - fix for IE
            if(!this.canvasTemp){
                this.canvasTemp = document.createElement("canvas");
                this.canvasTemp.width = image.width;
                this.canvasTemp.height = image.height;

                var ctxTemp = this.canvasTemp.getContext('2d');
                ctxTemp.drawImage(image, 0, 0, image.oriWidth, image.oriHeight, 0, 0, image.width, image.height);

                var imageData = ctxTemp.getImageData(0, 0, image.width, image.height);

                for(var i=0; i < imageData.data.length ; i+=4) {
                    
                    imageData.data[i] = arrColor[0] * imageData.data[i] / 255;
                    imageData.data[i+1] = arrColor[1] * imageData.data[i+1] / 255;
                    imageData.data[i+2] = arrColor[2] * imageData.data[i+2] / 255;

                }
                ctxTemp.putImageData(imageData, 0, 0);
            }


            ctx.drawImage(this.canvasTemp, x, y);
        };
    };

    function Photo(image) {

        var seed = Math.random() * (2.5 - 0.7) + 0.7;

        var w = image.width / seed;
        var h = image.height / seed;
        var x = containerWidth * Math.random();
        var y = containerHeight * Math.random();

        var finalX = x;
        var finalY = y;

        var r = Math.random() * (180 - (-180)) + (-180);

        var forceX = 0;
        var forceY = 0;

        var TO_RADIANS = Math.PI / 180;

        this.image = image;

        this.update = function() {
            var distance, dx, dy, powerX, powerY, x0, x1, y0, y1;
            x0 = x;
            y0 = y;
            x1 = mouse.x;
            y1 = mouse.y;
            dx = x1 - x0;
            dy = y1 - y0;
            distance = Math.sqrt((dx * dx) + (dy * dy));
            powerX = x0 - (dx / distance) * magnet / distance;
            powerY = y0 - (dy / distance) * magnet / distance;
            forceX = (forceX + (finalX - x0) / 2) / 2.1;
            forceY = (forceY + (finalY - y0) / 2) / 2.2;
            x = powerX + forceX;
            y = powerY + forceY;
        };

        this.draw = function() {
            rotateAndPaintImage(ctx, this, r * TO_RADIANS, x, y, w / 2, h / 2, w, h);
        };
    };

    function rotateAndPaintImage(context, photo, angle, positionX, positionY, axisX, axisY, widthX, widthY) {
        if(!photo.canvasTemp) {
            var canvasTemp = document.createElement('canvas');
            var canvasTemp2  = document.createElement('canvas');
            
            canvasTemp.width = widthX;
            canvasTemp.height = widthY;
            canvasTemp2.width = widthX;
            canvasTemp2.height = widthY;

            var ctxTemp = canvasTemp.getContext('2d');
            var ctxTemp2 = canvasTemp2.getContext('2d');

            ctxTemp2.drawImage(photo.image, 0, 0, photo.image.oriWidth, photo.image.oriHeight, 0, 0, widthX, widthY);

            // ctxTemp2.globalCompositeOperation = "multiply";
            // ctxTemp2.fillStyle = color;
            // ctxTemp2.fillRect(0, 0, widthX, widthY);

            // blend mode - multiply - fix for IE
            var imageData = ctxTemp2.getImageData(0, 0, widthX, widthY);
            for(var i=0; i < imageData.data.length ; i+=4) {
                imageData.data[i] = arrColor[0] * imageData.data[i] / 255;
                imageData.data[i+1] = arrColor[1] * imageData.data[i+1] / 255;
                imageData.data[i+2] = arrColor[2] * imageData.data[i+2] / 255;
            }
            ctxTemp2.putImageData(imageData, 0, 0);

            ctxTemp.drawImage(canvasTemp2, 0, 0);
            ctxTemp.globalCompositeOperation = "destination-in";
            ctxTemp.drawImage(photo.image, 0, 0, photo.image.oriWidth, photo.image.oriHeight, 0, 0, widthX, widthY);

            photo.canvasTemp = canvasTemp;
        }

        // context.save();
        // context.translate(positionX, positionY);
        // context.rotate(angle);
        // context.drawImage(photo.image, 0, 0, photo.image.oriWidth, photo.image.oriHeight, -axisX, -axisY, widthX, widthY);
        // context.globalCompositeOperation = "multiply";
        // context.fillStyle = color;
        // context.fillRect(-axisX, -axisY, widthX, widthY);
        // context.restore();

        context.save();
        context.translate(positionX, positionY);
        context.rotate(angle);
        context.drawImage(photo.canvasTemp, -axisX, -axisY, widthX, widthY);
        context.restore();
    };

    function render() {
        if(isStop){
            isRunning = false;
            grids = [];
            listImages = [];
            movingObjects = [];
            return;
        }

        isRunning = true;

        var x = 0, y = 0;
        ctx.clearRect(0, 0, containerWidth, containerHeight);

        for(var i=0; i<grids.length; i++) {
            grids[i].draw();
        }

        for(var i=0; i<movingObjects.length; i++) {
            movingObjects[i].update();
            movingObjects[i].draw();
        }

        requestAnimationFrame(render);
    };


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

    function startAnimation(currentSesssionId) {
        stopCurrentAnimation(function(){
            if(!listImgSrc || listImgSrc.length == 0){
                if(typeof BannerFlow != "undefined" && BannerFlow.editorMode)
                    textWarning.style.display = "block";

                return;
            }

            textWarning.style.display = "none";

            container.setAttribute('style','background-color:' + color);
            preloadImages(currentSesssionId);
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        listImgSrc = [];

        if(typeof BannerFlow !== "undefined") {
            imageWidth = BannerFlow.settings.imageWidth > 10 ? BannerFlow.settings.imageWidth : 100;
            color = BannerFlow.settings.backgroundColor;
            showBackgroundPattern = BannerFlow.settings.showBackgroundPattern;

            arrColor = color.substring("rgba(".length);
            arrColor = arrColor.substring(0, color.length-1);
            arrColor = arrColor.split(",");

            for(var i=0;i<arrColor.length;i++) {
                arrColor[i] = parseInt(arrColor[i]);
            }

            // for(var i=1;i<=3;i++){
            //     var image = BannerFlow.settings['image'+i];
            //     if(image && image.length > 0) {
            //         listImgSrc.push(image);
            //     }
            // }

            listImgSrc = getImages(BannerFlow.settings.image, true);

        } else {

            imageWidth = 200;
            listImgSrc.push("./image1.jpg");
            listImgSrc.push("./image2.jpg");
            listImgSrc.push("./image3.jpg");
            listImgSrc.push("./rose.png");

            color = "rgba(174, 219, 15, 1)";
            arrColor = color.substring("rgba(".length);
            arrColor = arrColor.substring(0, color.length-1);
            arrColor = arrColor.split(",");
            for(var i=0;i<arrColor.length;i++) {
                arrColor[i] = parseInt(arrColor[i]);
            }
        }

    }

    /*====================================================*/  

    var timeoutStart;

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


    var isStartAnimation = false;

    function onStart() {
        if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
            return;
        }

        isStartAnimation = true;

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
        start: onStart,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    MosaicBackgroundWidget.start();
} else {
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function () {
        MosaicBackgroundWidget.start();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        MosaicBackgroundWidget.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        MosaicBackgroundWidget.onSettingChanged();
    });
}
