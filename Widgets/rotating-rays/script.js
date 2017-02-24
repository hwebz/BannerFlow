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

function update() {
    // Number of Rays
    var magicRays = document.querySelector('.magic-rays ul');
    angleToRotate = 90 / BannerFlow.settings.numberOfRays;
    magicRays.innerHTML = '';
    for (var i = 0; i < BannerFlow.settings.numberOfRays; i++) {
        var newList = document.createElement("li");
        magicRays.appendChild(newList);
    }

    for (var i = 0; i < BannerFlow.settings.numberOfRays; i++) {
        document.styleSheets[0].addRule('.magic-rays ul li:nth-child('+ (i + 1) +')', 'transform: rotate('+ (angleToRotate * i) +'deg)');
    }
    
    // Width of Rays
    addStylesheetRules([
        ['.magic-rays ul li, .magic-rays ul li:before', 
         ['border-left-width', BannerFlow.settings.widthOfRays+'em'],
         ['border-right-width', BannerFlow.settings.widthOfRays+'em'],
         ['left', -BannerFlow.settings.widthOfRays+'em']
        ]
    ]);
    
    // Height of Rays
    addStylesheetRules([
        ['.magic-rays ul li, .magic-rays ul li:before', 
         ['border-top-width', BannerFlow.settings.heightOfRays+'em'],
         ['border-bottom-width', BannerFlow.settings.heightOfRays+'em']
        ],
        ['.magic-rays ul li', 
         ['margin-top', -BannerFlow.settings.heightOfRays+'em']
        ],
        ['.magic-rays ul li:before', 
         ['top', -BannerFlow.settings.heightOfRays+'em']
        ]
    ]);
    
    if (BannerFlow.settings.speedOfRays > 20) BannerFlow.settings.speedOfRays = 20;
    // Speed of Rays
    addStylesheetRules([
        ['.magic-rays ul', 
         ['animation-duration', (21 - BannerFlow.settings.speedOfRays)+'s']
        ]
    ]);
    
    // Direction Inversion
    if (!BannerFlow.settings.direction) {
        addStylesheetRules([
            ['.magic-rays ul', 
             ['animation-name', 'rotate-inverse']
            ]
        ]);
    } else {
        addStylesheetRules([
            ['.magic-rays ul', 
             ['animation-name', 'rotate']
            ]
        ]);
    }
    

    // Color of Rays, Glow Intensity, Background
    addStylesheetRules([
        ['.magic-rays ul li, .magic-rays ul li:before', 
         ['box-shadow', '0 0 2em .5em ' + BannerFlow.settings.colorOfRays]
        ],
        ['.wrapper', 
         ['background', 'radial-gradient('+BannerFlow.settings.colorOfRays+' 15px, '+BannerFlow.settings.boxBG+' '+ BannerFlow.settings.glowIntensity+'em)']
        ]
    ]);
}

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {    
    update();
});

BannerFlow.addEventListener(BannerFlow.INIT, function () {
	//Add your javascript here
});