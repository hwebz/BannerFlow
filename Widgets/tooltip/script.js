var tooltipDocument = document.getElementById("tooltip-document");
var tooltipWrapper = document.getElementById("tooltip-wrapper");
var tooltip = document.getElementById("tooltip");
var tooltipContent = document.getElementById("content");
var hoverArea = document.getElementById('hover-area');

var tooltipObject = {
  	width: tooltip.offsetWidth,
    height: tooltip.offsetHeight,
    left: tooltip.offsetLeft,
    top: tooltip.offsetTop
};

function getFont(family) {
  family        = (family || "").replace(/[^A-Za-z]/g, '').toLowerCase();   
  var sans      = 'Helvetica, Arial, "Microsoft YaHei New", "Microsoft Yahei", "微软雅黑", 宋体, SimSun, STXihei, "华文细黑", sans-serif';
  var serif     = 'Georgia, "Times New Roman", "FangSong", "仿宋", STFangSong, "华文仿宋", serif';
  var fonts     = {
      helvetica : sans,
      verdana   : "Verdana, Geneva," + sans,
      lucida    : "Lucida Sans Unicode, Lucida Grande," + sans,
      tahoma    : "Tahoma, Geneva," + sans,
      trebuchet : "Trebuchet MS," + sans,
      impact    : "Impact, Charcoal, Arial Black," + sans,
      comicsans : "Comic Sans MS, Comic Sans, cursive," + sans,
      georgia   : serif,
      palatino  : "Palatino Linotype, Book Antiqua, Palatino," + serif,
      times     : "Times New Roman, Times," + serif,
      courier   : "Courier New, Courier, monospace, Times," + serif
  }
  var font      = fonts[family] || fonts.helvetica;
  return font;
}

function updateTooltipPosition() {
    var hor = BannerFlow.settings.ttHorizontalAlign ? BannerFlow.settings.ttHorizontalAlign.toLowerCase() : "";
    var ver = BannerFlow.settings.ttVerticalAlign? BannerFlow.settings.ttVerticalAlign.toLowerCase() : "";
    
    if (hor == "left" && ver == "top") {
        return {
            "origin": "top left",
            "position": {
                "top": "0",
                "left": "0",
                "right": "initial",
                "bottom": "initial"
            },
            "transform": "translate(0, 0)",
        };
    } else if (hor == "left" && ver == "middle") {
        return {
            "origin": "left center",
            "position": {
                "top": "50%",
                "left": "0",
                "right": "inherit",
                "bottom": "inherit"
            },
            "transform": "translate(0, -50%)"
        };
    } else if (hor == "left" && ver == "bottom") {
        return {
            "origin": "bottom left",
            "position": {
                "top": "inherit",
                "left": "0",
                "right": "inherit",
                "bottom": "0"
            },
            "transform": "translate(0, 0)"
        };
    } else if (hor == "center" && ver == "top") {
        return {
            "origin": "top center",
            "position": {
                "top": "0",
                "left": "50%",
                "right": "inherit",
                "bottom": "inherit"
            },
            "transform": "translate(-50%, 0)"
        };
    } else if (hor == "center" && ver == "middle") {
        return {
            "origin": "left center",
            "position": {
                "top": "50%",
                "left": "50%",
                "right": "inherit",
                "bottom": "inherit"
            },
            "transform": "translate(-50%, -50%)"
        };
    } else if (hor == "center" && ver == "bottom") {
        return {
            "origin": "bottom center",
            "position": {
                "top": "inherit",
                "left": "50%",
                "right": "inherit",
                "bottom": "0"
            },
            "transform": "translate(-50%, 0)"
        };
    } else if (hor == "right" && ver == "top") {
        return {
            "origin": "top right",
            "position": {
                "top": "0",
                "left": "inherit",
                "right": "0",
                "bottom": "inherit"
            },
            "transform": "translate(0, 0)"
        };
    } else if (hor == "right" && ver == "middle") {
        return {
            "origin": "center right",
            "position": {
                "top": "50%",
                "left": "inherit",
                "right": "0",
                "bottom": "inherit"
            },
            "transform": "translate(0, -50%)"
        };
    } else if (hor == "right" && ver == "bottom") {
        return {
            "origin": "bottom right",
            "position": {
                "top": "inherit",
                "left": "inherit",
                "right": "0",
                "bottom": "0"
            },
            "transform": "translate(0, 0)"
        };
    }
}

function detectArrowPosition(pos) {
    var posA = pos % 12;
    switch(posA) {
        case 0:
            return {
                "position": {
                    "top": "inherit",
                    "left": "50%",
                    "right": "inherit",
                    "bottom": "-14px"
                },
                "transform": "translate(-50%, 0)",
                "border": "top"
            };
            break;
        case 1:
            return {
                "position": {
                    "top": "inherit",
                    "left": "inherit",
                    "right": "5px",
                    "bottom": "-14px"
                },
                "transform": "translate(0, 0)",
                "border": "top"
            };
            break;
        case 2:
            return {
                "position": {
                    "top": "inherit",
                    "left": "inherit",
                    "right": "-14px",
                    "bottom": "5px"
                },
                "transform": "translate(0, 0)",
                "border": "left"
            };
            break;
        case 3:
            return {
                "position": {
                    "top": "50%",
                    "left": "inherit",
                    "right": "-14px",
                    "bottom": "inherit"
                },
                "transform": "translate(0, -50%)",
                "border": "left"
            };
            break;
        case 4:
            return {
                "position": {
                    "top": "5px",
                    "left": "inherit",
                    "right": "-14px",
                    "bottom": "inherit"
                },
                "transform": "translate(0, 0)",
                "border": "left"
            };
            break;
        case 5:
            return {
                "position": {
                    "top": "-14px",
                    "left": "inherit",
                    "right": "5px",
                    "bottom": "inherit"
                },
                "transform": "translate(0, 0)",
                "border": "bottom"
            };
            break;
        case 6:
            return {
                "position": {
                    "top": "-14px",
                    "left": "50%",
                    "right": "inherit",
                    "bottom": "inherit"
                },
                "transform": "translate(-50%, 0)",
                "border": "bottom"
            };
            break;
        case 7:
            return {
                "position": {
                    "top": "-14px",
                    "left": "5px",
                    "right": "inherit",
                    "bottom": "inherit"
                },
                "transform": "translate(0, 0)",
                "border": "bottom"
            }
            break;
        case 8:
            return {
                "position": {
                    "top": "5px",
                    "left": "-14px",
                    "right": "inherit",
                    "bottom": "inherit"
                },
                "transform": "translate(0, 0)",
                "border": "right"
            }
            break;
        case 9:
            return {
                "position": {
                    "top": "50%",
                    "left": "-14px",
                    "right": "inherit",
                    "bottom": "inherit"
                },
                "transform": "translate(0, -50%)",
                "border": "right"
            }
            break;
        case 10:
            return {
                "position": {
                    "top": "inherit",
                    "left": "-14px",
                    "right": "inherit",
                    "bottom": "5px"
                },
                "transform": "translate(0, 0)",
                "border": "right"
            }
            break;
        case 11:
            return {
                "position": {
                    "top": "inherit",
                    "left": "5px",
                    "right": "inherit",
                    "bottom": "-14px"
                },
                "transform": "translate(0, 0)",
                "border": "top"
            }
            break;
    }
}

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

function updateSettingsChanged() {
    // Background color
    addStylesheetRules([
        ['#tooltip', 
         ['background', BannerFlow.settings.ttBackground]
        ],
        ['#tooltip:after', 
         ['border-top-color', BannerFlow.settings.ttBackground]
        ]
    ]);
    
    // Border Color
    addStylesheetRules([
        ['#tooltip', 
         ['border-color', BannerFlow.settings.ttBorderColor]
        ],
        ['#tooltip:before', 
         ['border-top-color', BannerFlow.settings.ttBorderColor]
        ]
    ]);
    
    // Text Color
    tooltipContent.style.color = BannerFlow.settings.ttTextColor;
    
    var ttPos = updateTooltipPosition() ? updateTooltipPosition() : "";
    
    // Size
    tooltip.style.transform = "scale("+ ((BannerFlow.settings.ttSize > 0) ? ((BannerFlow.settings.ttSize)/10 + 1) : 1) +")";
    tooltip.style.transformOrigin = ttPos.origin;
    tooltip.style.webkitTransform = "scale("+ ((BannerFlow.settings.ttSize > 0) ? ((BannerFlow.settings.ttSize)/10 + 1) : 1) +")";
    tooltip.style.webkitTransformOrigin = ttPos.origin;
    
    // Position
    tooltipWrapper.style.top = ttPos.position.top;
	tooltipWrapper.style.left = ttPos.position.left;
    tooltipWrapper.style.right = ttPos.position.right;
    tooltipWrapper.style.bottom = ttPos.position.bottom;
    tooltipWrapper.style.transform = ttPos.transform;
    tooltipWrapper.style.webkitTransform = ttPos.transform;
    
    // Arrow Position
    addStylesheetRules([
        ['#tooltip:before, #tooltip:after', 
         ['top', detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.top],
         ['left', detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.left],
         ['right', detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.right],
         ['bottom', detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.bottom],
         ['transform', detectArrowPosition(BannerFlow.settings.ttArrowPosition).transform],
         ['-webkit-transform', detectArrowPosition(BannerFlow.settings.ttArrowPosition).transform],
         ['border-color', 'transparent']
        ],
        ['#tooltip:before',
         ['border-' + detectArrowPosition(BannerFlow.settings.ttArrowPosition).border + '-color', BannerFlow.settings.ttBorderColor]
        ],
        ['#tooltip:after',
         ['border-' + detectArrowPosition(BannerFlow.settings.ttArrowPosition).border + '-color', BannerFlow.settings.ttBackground],
         ['left', ((detectArrowPosition(BannerFlow.settings.ttArrowPosition).border == "top" || detectArrowPosition(BannerFlow.settings.ttArrowPosition).border == "bottom") && detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.left != 0 && detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.left.indexOf("%") == -1) ? (parseInt(detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.left) - 1 + "px") : detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.left],
         ['right', ((detectArrowPosition(BannerFlow.settings.ttArrowPosition).border == "top" || detectArrowPosition(BannerFlow.settings.ttArrowPosition).border == "bottom") && detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.right != 0 && detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.right.indexOf("%") == -1) ? (parseInt(detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.right) - 1 + "px") : detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.right],
         ['top', ((detectArrowPosition(BannerFlow.settings.ttArrowPosition).border == "right" || detectArrowPosition(BannerFlow.settings.ttArrowPosition).border == "left") && detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.top != 0 && detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.top.indexOf("%") == -1) ? (parseInt(detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.top) - 1 + "px") : detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.top],
         ['bottom', ((detectArrowPosition(BannerFlow.settings.ttArrowPosition).border == "right" || detectArrowPosition(BannerFlow.settings.ttArrowPosition).border == "left") && detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.bottom != 0 && detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.bottom.indexOf("%") == -1) ? (parseInt(detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.bottom) - 1 + "px") : detectArrowPosition(BannerFlow.settings.ttArrowPosition).position.bottom]
        ]
    ]);
    
    styleChanged();
    
    updateHoverArea();
    
    // Is Development
    tooltipWrapper.style.opacity = BannerFlow.editorMode ? 1 : 0;
    
    // Animation cases
    var animationOpt = parseInt(BannerFlow.settings.ttAnimation, 10);
    if (!BannerFlow.editorMode) {
        switch(animationOpt) {
            case 0:
            	tooltipWrapper.style.opacity = 0;
                break;
            case 1:
            	tooltipWrapper.style.opacity = 0;
                tooltipWrapper.style.marginTop = "-50px";
                break;
            case 2:
            	tooltipWrapper.style.opacity = 0;
                tooltipWrapper.style.marginLeft = "-50px";
                break;
            case 3:
            	tooltipWrapper.style.opacity = 0;
                tooltipWrapper.style.marginLeft = "50px";
                break;
            case 4:
            	tooltipWrapper.style.opacity = 0;
                tooltipWrapper.style.marginTop = "50px";
                break;
            default:
                tooltipWrapper.style.opacity = 0;
                break;
        }
    }
}

function updateTextChanged() {
    var text = (BannerFlow.text || BannerFlow.text == "") ? BannerFlow.text : "Enter text...";
    tooltipContent.innerHTML = text;
}

function updateHoverArea() {
    
    if (!BannerFlow.editorMode) {
        hoverArea.style.backgroundColor = "transparent";
       	hoverArea.style.textIndent = "-99999px";
    }
    
    var haObject = {
        x : BannerFlow.settings.areaX,
        y : BannerFlow.settings.areaY,
       	width : BannerFlow.settings.haWidth,
        height : BannerFlow.settings.haHeight
    };
    
    hoverArea.style.left = haObject.x + "px";
    hoverArea.style.top = haObject.y + "px";
    hoverArea.style.width = haObject.width + "px";
    hoverArea.style.height = haObject.height + "px";
}

function onMouseOver() {
    var animationOpt = parseInt(BannerFlow.settings.ttAnimation, 10);
    switch(animationOpt) {
            case 0:
            	tooltipWrapper.style.opacity = 1;
                break;
            case 1:
            	tooltipWrapper.style.opacity = 1;
                tooltipWrapper.style.marginTop = 0;
                break;
            case 2:
            	tooltipWrapper.style.opacity = 1;
                tooltipWrapper.style.marginLeft = 0;
                break;
            case 3:
            	tooltipWrapper.style.opacity = 1;
                tooltipWrapper.style.marginLeft = 0;
                break;
            case 4:
            	tooltipWrapper.style.opacity = 1;
                tooltipWrapper.style.marginTop = 0;
                break;
            default:
                tooltipWrapper.style.opacity = 1;
                break;
        }
}

function onMouseOut() {
    var animationOpt = parseInt(BannerFlow.settings.ttAnimation, 10);
    switch(animationOpt) {
            case 0:
            	tooltipWrapper.style.opacity = 0;
                break;
            case 1:
            	tooltipWrapper.style.opacity = 0;
                tooltipWrapper.style.marginTop = "-50px";
                break;
            case 2:
            	tooltipWrapper.style.opacity = 0;
                tooltipWrapper.style.marginLeft = "-50px";
                break;
            case 3:
            	tooltipWrapper.style.opacity = 0;
                tooltipWrapper.style.marginLeft = "50px";
                break;
            case 4:
            	tooltipWrapper.style.opacity = 0;
                tooltipWrapper.style.marginTop = "50px";
                break;
            default:
                tooltipWrapper.style.opacity = 0;
                break;
        }
}

function styleChanged() {
    tooltipContent.style.fontFamily = getFont(BannerFlow.settings.fontFamily ? BannerFlow.settings.fontFamily.toLowerCase() : "");
    tooltipContent.style.fontSize = BannerFlow.getStyle('font-size', '');
}

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateSettingsChanged);
BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, updateTextChanged);
BannerFlow.addEventListener(BannerFlow.STYLE_CHANGED, styleChanged)
BannerFlow.addEventListener(BannerFlow.INIT, function() {
    hoverArea.addEventListener("mouseover", onMouseOver);
    hoverArea.addEventListener("touchstart", onMouseOver);
    hoverArea.addEventListener("MSPointerDown", onMouseOver);
    hoverArea.addEventListener("MSPointerUp", onMouseOut);
    hoverArea.addEventListener("touchend", onMouseOut);
    hoverArea.addEventListener("mouseout", onMouseOut);
});