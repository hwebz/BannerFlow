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

function addEvent(selector, eventName, callback) {
	selector.addEventListener(eventName, callback);
}

function onLoad(event) {
	var numberOfRays = document.getElementById('numberOfRays');
	var widthOfRay = document.getElementById('widthOfRay');
	var heightOfRay = document.getElementById('heightOfRay');
	var speedOfRay = document.getElementById('speedOfRays');
	var glowIntensity = document.getElementById('glowIntensity');
	var inverseDirection = document.getElementById('direction');
	var rayBGColor = document.getElementById('colorOfRay');
	var boxBG = document.getElementById('boxBackground');
	var magicRays = document.querySelector('.magic-rays ul');
	var angleToRotate = 90 / numberOfRays.value;
	
	addEvent(numberOfRays, 'change', function(e) {
		angleToRotate = 90 / numberOfRays.value;
		magicRays.innerHTML = '';
		for (var i = 0; i < numberOfRays.value; i++) {
			var newList = document.createElement("li");
			magicRays.appendChild(newList);
		}

		for (var i = 0; i < numberOfRays.value; i++) {
			console.log(i + ", " + angleToRotate * i);
			document.styleSheets[0].addRule('.magic-rays ul li:nth-child('+ (i + 1) +')', 'transform: rotate('+ (angleToRotate * i) +'deg)');
		}
	});

	addEvent(widthOfRay, 'change', function(e) {
		addStylesheetRules([
		  ['.magic-rays ul li, .magic-rays ul li:before', 
		    ['border-left-width', widthOfRay.value+'em'],
		    ['border-right-width', widthOfRay.value+'em'],
		    ['left', -widthOfRay.value+'em']
		  ]
		]);
	});

	addEvent(heightOfRay, 'change', function(e) {
		addStylesheetRules([
		  ['.magic-rays ul li, .magic-rays ul li:before', 
		    ['border-top-width', heightOfRay.value+'em'],
		    ['border-bottom-width', heightOfRay.value+'em']
		  ],
		  ['.magic-rays ul li', 
		    ['margin-top', -heightOfRay.value+'em']
		  ],
		  ['.magic-rays ul li:before', 
		    ['top', -heightOfRay.value+'em']
		  ]
		]);
	});

	addEvent(speedOfRay, 'change', function(e) {
		addStylesheetRules([
		  ['.magic-rays ul', 
		    ['animation-duration', speedOfRay.value+'s']
		  ]
		]);
	});

	addEvent(speedOfRay, 'change', function(e) {
		addStylesheetRules([
		  ['.magic-rays ul', 
		    ['animation-duration', speedOfRay.value+'s']
		  ]
		]);
	});

	addEvent(inverseDirection, 'change', function(e) {
		if (inverseDirection.checked) {
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
	});

	addEvent(glowIntensity, 'change', function(e) {
		addStylesheetRules([
		  ['body', 
		    ['background', 'radial-gradient('+(rayBGColor.value ? rayBGColor.value : 'white')+' 10px, '+(boxBG.value ? boxBG.value : 'hsl(200, 100%, 70%)')+' '+(glowIntensity.value ? glowIntensity.value : 40)+'em)']
		  ]
		]);
	});

	addEvent(boxBG, 'blur', function(e) {
		addStylesheetRules([
		  ['body', 
		    ['background', 'radial-gradient('+(rayBGColor.value ? rayBGColor.value : 'white')+' 10px, '+(boxBG.value ? boxBG.value : 'white')+' 40em)']
		  ]
		]);
	});

	addEvent(rayBGColor, 'blur', function(e) {
		addStylesheetRules([
		  ['.magic-rays ul li, .magic-rays ul li:before', 
		    ['box-shadow', '0 0 2em .5em ' + (rayBGColor.value ? rayBGColor.value : 'white')]
		  ],
		  ['body', 
		    ['background', 'radial-gradient('+(rayBGColor.value ? rayBGColor.value : 'white')+' 10px, hsl(200, 100%, 70%) 40em)']
		  ]
		]);
	});
}

 document.addEventListener("DOMContentLoaded", onLoad);