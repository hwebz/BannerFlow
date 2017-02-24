var PanoramaWidget = (function() {
    
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    var control = ( window.DeviceOrientationEvent && isMobile ? 'gyroscope' : 'mouse'); // mouse or gyroscope
    
    var autoRotate = true;
    var autoRotateSpeed = 1;
    var useBlack360 = true;
    var mouseSpeed = 1;
    var logoColor = "White";

    var LOGO_WHITE = "White";
    var LOGO_BLACK = "Black";

    // var panoramaImage = "./krokus_helicopter_big.jpg";
    var panoramaImage = "https://bannerflow.blob.core.windows.net/resources/panorama-dac410c3-c827-484e-8a4e-b225d300a651.jpg";
    var oldPanoramaImage;
    
    var camera, material, mesh, scene, renderer;

    var isUserInteracting = false,
        onMouseDownMouseX = 0, onMouseDownMouseY = 0,
        lon = 0, onMouseDownLon = 0,
        lat = 0, onMouseDownLat = 0,
        phi = 0, theta = 0;

    var iconPanorama;
    var isInit = false;

    var textWarning = document.getElementById('textWarning');
    var container = document.getElementById('container');
    var widthContainer, heightContainer;

    var isStop = false;
    var isRunning = false;


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

    function initThreeJs() {

    	if(!panoramaImage || panoramaImage.length == 0 || !isSupportWebGL()) {
    		oldPanoramaImage = "";
            return;
        }

        // update icon panorama
        iconPanorama = document.getElementById('panoramaIcon');
        if(heightContainer >= widthContainer) {
        	if( widthContainer/4 < 200 ) {
        		iconPanorama.style.width = widthContainer/4 + 'px';
        		iconPanorama.style.height = widthContainer/4 * 96/200 + 'px';
        	}
        } else {
        	if(heightContainer/4 < 96) {
        		iconPanorama.style.height = heightContainer/4 + 'px';
        		iconPanorama.style.width = heightContainer/4 * 200/96 + 'px';
        	}
        }

        if(!useBlack360) {
        	iconPanorama.setAttribute('class', 'icon-panorama icon-panorama-white');
        } else {
        	iconPanorama.setAttribute('class', 'icon-panorama');
        }

        /*--------------------------*/


        if(isInit) {

        	if(oldPanoramaImage != panoramaImage) {
        		oldPanoramaImage = panoramaImage;

		        material.map = THREE.ImageUtils.loadTexture(panoramaImage);
		        material.needsUpdate = true;
        	}

        	onWindowResize();

            return;
        }

    	oldPanoramaImage = panoramaImage;
        isInit = true;


        THREE.ImageUtils.crossOrigin = "anonymous";
        camera = new THREE.PerspectiveCamera( 75, widthContainer / heightContainer, 1, 1100 );
        camera.target = new THREE.Vector3( 0, 0, 0 );

        scene = new THREE.Scene();

        var geometry = new THREE.SphereGeometry( 500, 60, 40 );
        geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

        material = new THREE.MeshBasicMaterial( {
            map: THREE.ImageUtils.loadTexture(panoramaImage)
        } );

        mesh = new THREE.Mesh(geometry, material );
        scene.add( mesh );

        renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        renderer.preserveDrawingBuffer = true;

        var dpr = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
        renderer.setPixelRatio(dpr);

        renderer.setSize(widthContainer, heightContainer);
        container.appendChild( renderer.domElement );
        
        if (control == "gyroscope" && window.DeviceOrientationEvent) {
            autoRotate = false;
            window.addEventListener('deviceorientation', function (e) {
                lon = 180 - e.alpha ;
                lat = (e.beta - 90) / 2;
            }, false);
            
        } else {
            document.addEventListener( 'mousedown', onDocumentMouseDown, false );
            document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            document.addEventListener( 'mouseup', onDocumentMouseUp, false );
            document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
            document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);
            document.addEventListener( 'keydown', onKeyDown, false);

            iconPanorama.style.display = "block";
        }
    }

    var isSupportWebGLValue = false;
    var isCheckSupportWebGL = false;

    function isSupportWebGL() {
    	if(isCheckSupportWebGL)
    		return isSupportWebGLValue;

    	isCheckSupportWebGL = true;

    	var canvas = document.createElement('canvas');
    	var ctx;
    	try{
    		ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    	}
    	catch(ex) {
    		isSupportWebGLValue = false;
    		return false;
    	}

    	if(ctx){
    		isSupportWebGLValue = true;
    		return true;
    	}

    	isSupportWebGLValue = false;
    	return false;
    }

    function onWindowResize() {
        widthContainer = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
        heightContainer = parseInt(window.getComputedStyle(container).getPropertyValue('height'));   

        camera.aspect = widthContainer / heightContainer;
        camera.updateProjectionMatrix();

        renderer.setSize( widthContainer, heightContainer );

    }

    function onDocumentMouseDown( event ) {

        event.preventDefault();

        isUserInteracting = true;
        if(autoRotate) {
            autoRotate = false;
            iconPanorama.style.display = "none";
        }

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }

    function onDocumentMouseMove( event ) {

        if ( isUserInteracting === true ) {

            lon = ( onPointerDownPointerX - event.clientX ) * mouseSpeed/10 + onPointerDownLon;
            lat = ( event.clientY - onPointerDownPointerY ) * mouseSpeed/10 + onPointerDownLat;

        }

    }

    function onDocumentMouseUp( event ) {

        isUserInteracting = false;

    }

    function onDocumentMouseWheel( event ) {

        // WebKit

        if ( event.wheelDeltaY ) {

            camera.fov -= event.wheelDeltaY * 0.05;

            // Opera / Explorer 9

        } else if ( event.wheelDelta ) {

            camera.fov -= event.wheelDelta * 0.05;

            // Firefox

        } else if ( event.detail ) {

            camera.fov += event.detail * 1.0;

        }

        camera.updateProjectionMatrix();

    }

    function onKeyDown(event) {

    	if(autoRotate) {
            autoRotate = false;
            iconPanorama.style.display = "none";
        }


    	switch(event.which) {
    		case 37: // left
    			lon -= autoRotateSpeed;
    			break;
    		case 38: // up
    			lat += autoRotateSpeed; 
    			break;
			case 39: // right
				lon += autoRotateSpeed;
    			break;
			case 40: // down
				lat -= autoRotateSpeed;
    			break;
    	}
    }

    function animate() {

    	if(isStop) {
    		isRunning = false;
    		return;
    	}

    	if(!panoramaImage || panoramaImage.length == 0 || !isSupportWebGL()) {
            return;
        }

        isRunning = true;
        update();

        requestAnimationFrame( animate );

    }

    function update() {

        if ( isUserInteracting === false && autoRotate) {

            lon += autoRotateSpeed/10;

        }

        lat = Math.max( - 85, Math.min( 85, lat ) );
        phi = THREE.Math.degToRad( 90 - lat );
        theta = THREE.Math.degToRad( lon );

        camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
        camera.target.y = 500 * Math.cos( phi );
        camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

        camera.lookAt( camera.target );
        
        // distortion
        //camera.position.copy( camera.target ).negate();
        

        renderer.render( scene, camera );

    }

    function calculateContainerSize() {
        widthContainer = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
        heightContainer = parseInt(window.getComputedStyle(container).getPropertyValue('height'));
    }
    
    /*---------------------------------------------*/

    var timeoutStart;
    var sessionId = 0;

    function init() {
        if(timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function() {
                getSettingParameter();
                calculateContainerSize();
                startAnimation(++sessionId);
            }, 500);
        } else {
            timeoutStart = setTimeout(function(){
                getSettingParameter();
                calculateContainerSize();
                startAnimation(++sessionId);
            }, 0);
        }
    }

    function startAnimation(sessionId) {
    	stopAnimation(function(){
            if((!panoramaImage || panoramaImage.length == 0) && typeof BannerFlow != "undefined" && BannerFlow.editorMode) {
                textWarning.style.display = "block";
            } else {
                textWarning.style.display = "none";
            }

            if(!widthContainer || !heightContainer)
                return;

    		initThreeJs();
    		animate();
    	});
    }

    function stopAnimation(callback) {

        isStop = true;

		if(isRunning) {
			var timeout = setTimeout(function(){
			  clearTimeout(timeout);
			  stopAnimation(callback);
			}, 200);
		} else {
			isStop = false;
			if(callback)
			  callback();
		}
    }

    /*---- return object ----*/

    function getSettingParameter() {
        if (typeof BannerFlow !== 'undefined') {
            panoramaImage = "";
            var imageData = getImages(BannerFlow.settings.image, true);
            if(imageData && imageData.length > 0)
                panoramaImage = imageData[0];

            autoRotate = BannerFlow.settings.autoRotate;
            autoRotateSpeed = BannerFlow.settings.autoRotateSpeed;
            mouseSpeed = BannerFlow.settings.mouseSpeed > 0 ? BannerFlow.settings.mouseSpeed : 1;
            logoColor = BannerFlow.settings.logoColor;
        }

        if(logoColor.toLowerCase() == LOGO_BLACK.toLowerCase())
            useBlack360 = true;
        else
            useBlack360 = false;
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

if (typeof BannerFlow == 'undefined') {
    PanoramaWidget.start();
}
else {
	BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function () {
	    PanoramaWidget.start();
	});

	BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
	    PanoramaWidget.onResized();
	});

	BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
	    PanoramaWidget.onSettingChanged();
	});
}