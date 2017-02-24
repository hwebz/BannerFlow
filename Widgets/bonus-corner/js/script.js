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
	var zoom = document.getElementById('zoom');
	var firstLine = document.getElementById('first-line');
	var unit = document.getElementById('unit');
	var secondLine = document.getElementById('second-line');
	var badgetColor = document.getElementById('badget-color');
	var badgetColorHover = document.getElementById('badget-color-hover');
	var isRight = document.getElementById('isRight');

	var firstLineEle = document.getElementsByClassName('first-line');
	var unitEle = document.getElementsByClassName('unit');
	var secondLineEle = document.getElementsByClassName('second-line');

	addEvent(zoom, 'change', function(e) {
		addStylesheetRules([
		  ['.corner', 
		    ['transform', 'scale(' + zoom.value + ')']
		  ]
		]);
	});

	addEvent(firstLine, 'change', function(e) {
		for (var i = 0; i < firstLineEle.length; i++) {
			firstLineEle[i].innerHTML = firstLine.value + '<span class="unit">'+unit.value+'</span>';
		}
	});

	addEvent(unit, 'change', function(e) {
		for (var i = 0; i < firstLineEle.length; i++) {
			firstLineEle[i].innerHTML = firstLine.value + '<span class="unit">'+unit.value+'</span>';
		}
	});

	addEvent(secondLine, 'change', function(e) {
		for (var i = 0; i < secondLineEle.length; i++) {
			secondLineEle[i].innerHTML = secondLine.value;
		}
	});

	addEvent(badgetColor, 'change', function(e) {
		addStylesheetRules([
		  ['.corner-left', 
		    ['border-top-color', badgetColor.value],
		    ['border-left-color', badgetColor.value]
		  ],
		  ['.corner-right', 
		    ['border-top-color', badgetColor.value],
		    ['border-right-color', badgetColor.value]
		  ]
		]);
	});

	addEvent(badgetColorHover, 'change', function(e) {
		addStylesheetRules([
		  ['.corner-left:hover', 
		    ['border-top-color', badgetColorHover.value],
		    ['border-left-color', badgetColorHover.value]
		  ],
		  ['.corner-right:hover', 
		    ['border-top-color', badgetColorHover.value],
		    ['border-right-color', badgetColorHover.value]
		  ]
		]);
	});

	addEvent(isRight, 'change', function(e) {
		addStylesheetRules([
		  ['.corner-left', 
		    ['display', (isRight.checked) ? 'none' : 'block']
		  ],
		  ['.corner-right', 
		    ['display', (isRight.checked) ? 'block' : 'none']
		  ]
		]);
	});
}

 document.addEventListener("DOMContentLoaded", onLoad);