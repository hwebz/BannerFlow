

var LineExplosionWidget = (function(){

    var request = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(cb) {
        return setTimeout(cb, 30)
    };

    var container = document.getElementById('lineExplosionContainer');
    var containerWidth, containerHeight;
    containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
    containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

    var animationEvents = ["webkitTransitionEnd", "transitionend", "msTransitionEnd"];
    var animationKeyframeEvents = ["webkitAnimationEnd", "animationend", "MSAnimationEnd"];


    var canvas = document.getElementById('canvas');
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    var ctx = canvas.getContext("2d"),
        pointsObjectArray = [],
        frameCount = 1,
        isStop = false, isRunning = false, frameLimit = 400;

    var pointsNumber = 100;
    var enableClick = true;
    
    var options = {
        maxLineHeight: 50,
        speed: 2,
        color: null
    };

    var mouseCoordinate = [null, null];

    /* check the number of argument to make sure which dimension we want. (onely 1~3)*/
    var bezierLine = function(bezierPointArray, frame) {
        frame = frame / frameLimit;
        minusT = 1 - frame;


        tempCoordinate = [0, 0];
        switch (bezierPointArray.length) {
            case 2:
                tempCoordinate[0] = minusT * bezierPointArray[0][0] + frame * bezierPointArray[1][0];
                tempCoordinate[1] = minusT * bezierPointArray[0][1] + frame * bezierPointArray[1][1];
                return tempCoordinate;
            case 3:
                tempCoordinate[0] = Math.pow(minusT, 2) * bezierPointArray[0][0] + 2 * minusT * frame * bezierPointArray[1][0] + Math.pow(frame, 2) * bezierPointArray[2][0];
                tempCoordinate[1] = Math.pow(minusT, 2) * bezierPointArray[0][1] + 2 * minusT * frame * bezierPointArray[1][1] + Math.pow(frame, 2) * bezierPointArray[2][1];
                return tempCoordinate;
            case 4:
                tempCoordinate[0] = Math.pow(minusT, 3) * bezierPointArray[0][0] + 3 * bezierPointArray[1][0] * frame * Math.pow(minusT, 2) + 3 * bezierPointArray[2][0] * Math.pow(frame, 2) * minusT + bezierPointArray[3][0] * Math.pow(frame, 3);
                tempCoordinate[1] = Math.pow(minusT, 3) * bezierPointArray[0][1] + 3 * bezierPointArray[1][1] * frame * Math.pow(minusT, 2) + 3 * bezierPointArray[2][1] * Math.pow(frame, 2) * minusT + bezierPointArray[3][1] * Math.pow(frame, 3);
                return tempCoordinate;
        }
    }

    var random = function() {
        tempI = arguments[0];
        return Math.random() * tempI;
    }

    /* start from startPoint, end at endPoint. During the animation, use previousPoint and nextPoint to caculate it.
        then use bezierPoint 1 and 2 to make the curve.  */
    var Point = function(options, containerW, containerH, mouseCoordinate) {
        if (mouseCoordinate) {
            this.startPoint = mouseCoordinate;
            this.endPoint = [mouseCoordinate[0]+1, mouseCoordinate[0]+1];
        } else {
            this.startPoint = [containerW / 2, containerH / 2];
            this.endPoint = [containerW / 2 + 2, containerH / 2 + 2];
        }

        this.previousPoint = [null, null];
        this.nextPoint = [null, null];
        this.bezierPoint1 = [null, null];
        this.bezierPoint2 = [null, null] ;
        this.color = options.color ? options.color : null;
        this.lineWidth = random(options.maxLineHeight ? options.maxLineHeight : 200);
        this.cap = "circle";
        this.speed = options.speed ? options.speed : 1;

        this.containerW = containerW;
        this.containerH = containerH;
    }

    Point.prototype.update = function(frame, ctx, isEnd) {
        
        if (frame < 2) {

            frame = frame * this.speed;

            this.previousPoint = this.startPoint;
            this.bezierPoint1 = [random(this.containerW), random(this.containerH)];
            this.bezierPoint2 = [random(this.containerW), random(this.containerH)];

        } else {

            frame = frame * this.speed;

            if(frame > frameLimit)
                frame = frameLimit;


            if (Math.floor(this.previousPoint[0]) != Math.floor(this.endPoint[0]) || Math.floor(this.previousPoint[1]) != Math.floor(this.endPoint[1])) {

                this.nextPoint = bezierLine([this.previousPoint, this.bezierPoint1, this.bezierPoint2, this.endPoint], frame);
                ctx.beginPath();
                ctx.moveTo(this.previousPoint[0], this.previousPoint[1]);
                ctx.lineTo(this.nextPoint[0], this.nextPoint[1]);

                if (this.color) {
                    ctx.strokeStyle = this.color;
                } else {
                    ctx.strokeStyle = 'hsla(' + ((frame) * 3) % 360 + ', ' + "100%" + ', ' + random(100).toString() + "%" + ', 1)';
                }
                ctx.lineWidth = this.lineWidth;
                ctx.lineCap = this.cap;
                ctx.stroke();

                this.previousPoint = this.nextPoint;

            } else if(isEnd){
                frameCount = 0;
            }
        }
    }

    function registerEvent(){
        if(enableClick) {
            function updateMouse(e) {
                var x = e.touches ? e.touches[0].clientX : e.clientX;
                var y = e.touches ? e.touches[0].clientY : e.clientY;

                mouseCoordinate = [x, y];
            
                for (var i = 0; i < pointsNumber; i++) {
                    pointsObjectArray[i] = new Point(options, containerWidth, containerHeight, mouseCoordinate);
                };

                frameCount = 1;
            }

            container.onmousedown = updateMouse;
            container.ontouchstart = updateMouse;
        }
    }

    function createLines(pointsNum) {
        for (var i = 0; i < pointsNum; i++) {
            pointsObjectArray[i] = new Point(options, containerWidth, containerHeight);
        };
    }

    function loop() {

        if(isStop){
            isRunning = false;
            frameCount = 1;
            pointsObjectArray = [];
            return;
        }

        isRunning = true;

        ctx.clearRect(0, 0, containerWidth, containerHeight);
        for (var i = 0; i < pointsObjectArray.length; i++) {
            pointsObjectArray[i].update(frameCount, ctx, i == pointsObjectArray.length - 1);
        };

        frameCount++;
        request(loop);
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
            }, 250);
        } else {
            isStop = false;
            if(callback)
                callback();
        }
    }

    function startAnimation() {
        stopCurrentAnimation(function(){
            registerEvent();
            createLines(pointsNumber);
            loop();
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {

        if(typeof BannerFlow !== "undefined"){

            pointsNumber = BannerFlow.settings.pointsNumber > 0 ? BannerFlow.settings.pointsNumber : 100;

            enableClick = BannerFlow.settings.enableClick;

            options.maxLineHeight = BannerFlow.settings.maxLineHeight > 0 ? BannerFlow.settings.maxLineHeight : 200;
            options.speed = BannerFlow.settings.speed > 0 ? BannerFlow.settings.speed : 1;
            options.color = BannerFlow.settings.color ? BannerFlow.settings.color : null;
        }

    }

    /*====================================================*/  


    var firstTime = true;
    var timeoutStart = null;

    function init() {
        loadSettings();
        reloadGlobalVariables();

        if(timeoutStart)
            clearTimeout(timeoutStart);

        timeoutStart = setTimeout(function(){
            clearTimeout(timeoutStart);
            startAnimation();
        }, firstTime ? 0 : 500);

        firstTime = false;
    }


    function onStart() {
        init();
    }


    function onResize(){
        init();
    }

    function resetParameter(){
        init();
    }

    return {
        start: onStart,

        onResized: onResize,

        onSettingChanged: resetParameter
    };
})();

if(typeof BannerFlow == "undefined"){
    LineExplosionWidget.start();
    LineExplosionWidget.start();
} else {
    BannerFlow.addEventListener(BannerFlow.INIT, function () {
        LineExplosionWidget.start();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        LineExplosionWidget.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        LineExplosionWidget.onSettingChanged();
    });
}