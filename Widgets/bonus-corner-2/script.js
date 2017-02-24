function addStylesheetRules (rules) {
  var styleEl = document.createElement('style'),
      styleSheet;

  // Append style element to head
  document.head.appendChild(styleEl);

  // Grab style sheet
  styleSheet = styleEl.sheet;

  for (var i = 0, rl = rules.length; i < rl; i++) {
    var j = 1, rule = rules[i], selector = rules[i][0], propStr = '';
    // If the second argument of a rule is an array of arrays, correct our variables.
    if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
      rule = rule[1];
      j = 0;
    }

    for (var pl = rule.length; j < pl; j++) {
      var prop = rule[j];
      propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
    }

    // Insert CSS Rule
    styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
  }
}
var corner = document.getElementById("corner");
var leftCorner = document.getElementById("corner-left");
var rightCorner = document.getElementById("corner-right");

function updateCorner() {
    resize();
    // Zooming
    /*addStylesheetRules([
        ['.corner', 
         ['transform', 'scale(' + BannerFlow.settings.zoom / 5 + ')']
        ]
    ]);*/
    
    // Background
    addStylesheetRules([
        ['.bg', 
         ['background-color', BannerFlow.settings.badgetColor]
        ]
    ]);
    
  
    // Background in Hover and active state
    addStylesheetRules([
        ['.corner .bg:hover', 
         ['background-color', BannerFlow.settings.badgetColorHover]
        ],
        ['.active .bg', 
         ['background-color', BannerFlow.settings.downState]
        ]
    ]);
    
    corner.classList.remove('left');
    corner.classList.remove('right');
    corner.classList.add(BannerFlow.settings.isRight ? 'right' : 'left');
    
    corner.addEventListener("mousedown", downState);
    corner.addEventListener("touchstart", downState);
    corner.addEventListener("MSPointerDown", downState);
    corner.addEventListener("mouseup", upState);
    corner.addEventListener("touchend", upState);
    corner.addEventListener("mouseup", upState);
    
    BannerFlow.addEventListener('widget_mouse_click', function () {
        downState();
        setTimeout(upState, 200);
    });
    corner.style.opacity = 1;
}

function downState() {
    corner.classList.add('active');
}

function upState() {
    corner.classList.remove('active');
}

function changeText() {
    var firstLine = document.getElementById('first-line');
	var secondLine = document.getElementById('second-line');
    var txt = (BannerFlow.text && BannerFlow.text != "") ? BannerFlow.text : undefined;
    var txtArr = txt ? txt.split("</div><div>") : [""];
    var firstLineText = txtArr[0].replace("<div>", "");
    var secondLineText = txtArr.length > 1 ? txtArr[1].replace("</div>", "") : "";
    
    var firstFontSize = 30 - (firstLineText.length > 7 ? firstLineText.length*1.5 : firstLineText.length);
    var secondFontSize = 8 - (secondLineText.length > 10 ? (secondLineText.length - 10)/20 : -(10 - secondLineText.length)/5);
    
	
    firstLine.style.fontSize = '25px';
    secondLine.style.fontSize = '15px';
    
    if (secondLineText.length < 20) {
    	secondLine.style.marginTop = "3px";
    } else {
    	secondLine.style.marginTop = "0px";
    }
    
    if (txtArr[0] != undefined && txtArr[1] != "") {
        // Title text
        firstLine.innerHTML = txtArr[0] ? txtArr[0].replace("<div>", "") : "";
    } else {
        firstLine.innerHTML = "";
    }
    
    if (txtArr[1] != undefined && txtArr[1] != "") {
        // Description text
        secondLine.innerHTML = txtArr[1] ? txtArr[1].replace("</div>", "").replace("&lt;br&gt;", "<br>").replace("&lt;br/&gt;", "<br>").replace("&lt;br /&gt;", "<br>").replace("&lt;BR&gt;", "<br>").replace("&lt;BR/&gt;", "<br>").replace("&lt;BR /&gt;", "<br>") : "";
    } else {
        secondLine.innerHTML = "";
    }
    
    if (txtArr[1] || txtArr[1] == "") {
        firstLine.setAttribute("data", "");
    } else {
        firstLine.setAttribute("data", "one-line");
    }
    
    resizeText(firstLine, 35);
    resizeText(secondLine, 25);
}

function resize () {
    var width = BannerFlow.getWidth();
    var height = BannerFlow.getHeight();
    var shadowSize = 4;
    
    var scale = Math.min(width / (120 + shadowSize), height / (63 + shadowSize));
    corner.style.transform = 'scale(' + scale + ')';
}

//Make text smaller until it's on one row
function resizeText(textField, maxHeight) {
    var fontSize = parseInt(textField.style.fontSize);
    
    while(textField.offsetHeight > maxHeight && fontSize > 2) {
        
        fontSize--;
        console.log('resize', fontSize)
        textField.style.fontSize = fontSize + 'px';
    }
    
}

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateCorner);
BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, changeText);
BannerFlow.addEventListener(BannerFlow.resize, resize);