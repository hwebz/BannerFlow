/*===================================================*/
/*=====  UTILITIES =====*/
/*===================================================*/

function isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}



var SketchDrawWidget = (function(){

    var strokeColor = 'rgb(85, 85, 85)';
    var LINEWIDTH_DEFAULT = 1;
    var lineWidth = LINEWIDTH_DEFAULT;
    var emailSubmit = "";
    var emailSubject = "Sketch & Draw widget";
    //var cursorImage = "./draw_cursor.png";
    var cursorImage = "";
    
    var hasCustomCursor = false;

    var container = document.getElementById("sketchDrawContainer");
    var cursorContainer = document.getElementById("cursorImage");

    var ctx;
    var resultCanvas;
    var containerWidth;

    /*====================================*/
    /*==========  Drawing Part ===========*/
    /*====================================*/

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

    function startDrawing() {
      if(!cursorImage) {
        container.style.cursor = "default";

        initCanvas();
        registerForControl();
        //registerSubmit();
      }
      else {
        hasCustomCursor = true;
        var image = new Image();
        image.onload = function() {
          var width = this.width;
          var height = this.height;

          if(width >= height && width > 30) {
            var tmp = width;
            width = 30;
            height = width * height/tmp;
          } else if(height > width && height > 30) {
            var tmp = height;
            height = 30;
            width = height * width/tmp;
          }

          cursorContainer.style.width = width + "px";
          cursorContainer.style.height = height + "px";
          cursorContainer.style.background = "url('"+this.src+"') no-repeat center center";
          cursorContainer.style.backgroundSize = "100% auto";
          cursorContainer.style.display = "block";

          initCanvas();
          registerForControl();
          //registerSubmit();
        }

        image.onerror = function() {
          container.style.cursor = "default";

          initCanvas();
          registerForControl();
          //registerSubmit();
        }

        image.src = cursorImage;
      }
    }

    function initCanvas() {
      var canvas = document.getElementById('sketchCanvas');
      canvas.width = parseInt(window.getComputedStyle(canvas).getPropertyValue('width'));
      canvas.height = parseInt(window.getComputedStyle(canvas).getPropertyValue('height'));

      containerWidth = canvas.width;

      resultCanvas = document.getElementById("resultCanvas");
      resultCanvas.width = canvas.width;
      resultCanvas.height = canvas.height;
      var ctxResult = resultCanvas.getContext('2d');

      var isDrawing = false;

      var points = new Array();

      ctx = canvas.getContext('2d');
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = ctx.lineCap = "round";
      ctx.strokeStyle = strokeColor;

      // bind mouse events

      var mouseDown = function(e) {
        isDrawing = true;
        var x = e.pageX;
        var y = e.pageY;
        if(e.touches) {
          x = e.touches[0].pageX;
          y = e.touches[0].pageY;
        }

        points.push({x: x, y: y});
      };

      var mouseMove = function(e) {
        var x = e.pageX;
        var y = e.pageY;
        if(e.touches) {
          x = e.touches[0].pageX;
          y = e.touches[0].pageY;
        }

        cursorContainer.style.top = y + "px";
        cursorContainer.style.left = x + "px";


        if (!isDrawing) {
           return;
        }

        points.push({x: x, y: y});

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();

        var p1 = points[0];
        var p2 = points[1];

        ctx.moveTo(p1.x, p1.y);

        for(var i=1;i<points.length - 2;i++){
          var tmpX = (points[i].x + points[i+1].x)/2;
          var tmpY = (points[i].y + points[i+1].y)/2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, tmpX, tmpY);
        }

        // For the last point

        if(i+1 < points.length) {
          var tmpX = (points[i].x + points[i+1].x)/2;
          var tmpY = (points[i].y + points[i+1].y)/2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, tmpX, tmpY);
        }

        ctx.stroke();
      };

      var mouseUp = function(e) {
        isDrawing = false;
        points.length = 0;
        ctxResult.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      };

      canvas.onmousedown = mouseDown;
      canvas.onmousemove = mouseMove;
      canvas.onmouseup = mouseUp;
      container.onmouseleave = mouseUp;
      
      canvas.ontouchstart = mouseDown;
      canvas.ontouchmove = mouseMove;
      canvas.ontouchend = mouseUp;
      container.ontouchcancel = mouseUp;
        
    }

    /*==============================================*/
    /*===== Settings for pencil size and color =====*/
    /*==============================================*/

    var settings;
    var settingContainer;
    var settingClose;
    var settingSizeInput;
    var eraserIcon;

    function showControlSettings() {
      settingContainer.style.display = "block";
      cursorContainer.style.display = "none";
    }

    function hideControlSettings() {
      settingContainer.style.display = "none";
      cursorContainer.style.display = "block";

      ctx.lineWidth = parseInt(settingSizeInput.value);
      
    }

    function registerForControl() {

      settings = document.getElementById("settings");
      settingContainer = document.getElementById("settingContainer");
      settingClose = document.getElementById("settingClose");
      settingSizeInput = document.getElementById('settingSizeInput');
      eraserIcon = document.getElementById('erasorIcon');

      // on changed of line size
      settingSizeInput.onchange = function() {
        var value = this.value;

        if(isNaN(value) || value <= 0) {
          this.value = LINEWIDTH_DEFAULT;
        } else {
          this.value = parseInt(value);
        }
      }

      // clear canvas 
      if(isTouchDevice()) { // touch device
        eraserIcon.ontouchstart = function() {
          resultCanvas.width = containerWidth;
        }
      } else {
        eraserIcon.onclick = function() {
          resultCanvas.width = containerWidth;
        }
      }

      // on select color
      var selectColorFn = function(){
        for(var x=0;x<colorInputs.length; x++) {
          if(x != i){
            colorInputs[x].setAttribute('class','color-input');
          }
        }
        this.setAttribute('class','color-input active');
        ctx.strokeStyle = this.style.backgroundColor;
      };

      var colorInputs = document.getElementsByClassName('color-input');
      if(colorInputs && colorInputs.length > 0) {
        for(var i=0;i<colorInputs.length; i++) {
          (function(i) {
            if(isTouchDevice()) { // touch device
              colorInputs[i].ontouchstart = selectColorFn;
            } else {
              colorInputs[i].onclick = selectColorFn;
            }
          })(i);
        }
      }

      if(isTouchDevice()) { // touch device
        
        settings.removeEventListener('touchstart', showControlSettings, false);  
        settings.addEventListener('touchstart', showControlSettings, false);

        settingClose.removeEventListener('touchstart', hideControlSettings, false);
        settingClose.addEventListener('touchstart', hideControlSettings, false);

      } else {

        if(settings.addEventListener) { // normal browser

          settings.removeEventListener('click', showControlSettings, false);  
          settings.addEventListener('click', showControlSettings, false);

          settingClose.removeEventListener('click', hideControlSettings, false);
          settingClose.addEventListener('click', hideControlSettings, false);
        }
        else if(settingssettings.attachEvent) { // IE 10

          settings.detachEvent('click', showControlSettings, false);
          settings.attachEvent('click', showControlSettings, false);

          settingClose.detachEvent('click', hideControlSettings, false);
          settingClose.attachEvent('click', hideControlSettings, false);
        }
      }
    }

    
    // function registerSubmit() {
    //   if(!emailSubmit && emailSubmit.length == 0)
    //     return;

    //   var formName = document.getElementById('formName');
    //   var formEmail = document.getElementById('formEmail');

    //   document.getElementById("formSubmit").onclick = function(e){
    //     var name = formName.value.trim();
    //     var email = formEmail.value.trim();

    //     var isError = false;

    //     // validate name
    //     if(name.length == 0) {
    //       formName.setAttribute('class', 'form-input form-input-error');
    //       isError = true;
    //     }
    //     else
    //       formName.setAttribute('class', 'form-input');

    //     // validate email
    //     if(email.length == 0 || !validateEmail(email)) {
    //       formEmail.setAttribute('class', 'form-input form-input-error');
    //       isError = true;
    //     }
    //     else
    //       formEmail.setAttribute('class', 'form-input');

    //     if(isError) {
    //       return false;
    //     }

    //     try {
    //       var dataURL = resultCanvas.toDataURL('image/png');
    //       var htmlBody = "Name: "+name+"<br/>"+"Email: "+email+"<br/><img src='"+dataURL+"' alt=''/>";
    //       ajaxSendMail("thanhnguyentai.vn@gmail.com", emailSubject, htmlBody, emailSubmit);
    //     }
    //     catch(ex) {
    //       console.log('error submit');
    //     }
    //   }
    // }

    // function ajaxSendMail(fromEmail, subject, htmlBody, receiver) {
    //   $.ajax({
    //     type: "POST",
    //     url: "https://mandrillapp.com/api/1.0/messages/send.json",
    //     data: {
    //       key: "Nno4mJ9TxEro2c7mBMK1kA",
    //       message: {
    //         from_email: fromEmail,
    //         to: [
    //             {
    //               email: receiver,
    //               type: 'to'
    //             }
    //         ],
    //         autotext: 'true',
    //         subject: subject,
    //         html: htmlBody
    //       }
    //     }
    //     }).done(function(response) {
    //       console.log(response); // if you're into that sorta thing
    //   });
    // }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {
      if(typeof BannerFlow !== "undefined"){
        var imageData = getImages(BannerFlow.settings.cursorImage, true);
        cursorImage = (imageData && imageData.length > 0) ? imageData[0] : "";
      }
    }
    
    /*====================================================*/  

    function init() {
      loadSettings();
      startDrawing();
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
  SketchDrawWidget.start();
} else {
  BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function () {
      SketchDrawWidget.start();
  });

  BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
      SketchDrawWidget.onResized();
  });

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
      SketchDrawWidget.onSettingChanged();
  });
}
