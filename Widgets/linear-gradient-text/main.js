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

function text() {
    var text = document.getElementById('textid');
       var textStr =  BannerFlow.text.toString().replace(/&nbsp;/g, " ") //Remove all no breaks spaces
        .replace(/(<\/div><div>)/ig, " ") //Make sure enter strokes from text editor looks ok
        .replace(/(<([^>]+)>)/ig, "") //Remove all tags
        .replace(/\s+/g, " ").toString(); 

    document.getElementById('textid').textContent = textStr;

    //Do fancy viewbox settings
    var w = BannerFlow.getWidth();
    var h = BannerFlow.getHeight();
    var wrapper = document.getElementById('svg-wrapper-id');

    var svg = document.getElementById('svgid');

    var bbox = text.getBBox();

    svg.setAttribute('viewBox', 
                     [bbox.x,
                      bbox.y,
                      bbox.width,
                      bbox.height].join(' '));
    wrapper.setAttribute('padding-top', (bbox.height/bbox.width)*100+'%');
}

function color() {
    var linear = document.getElementById("gr-lin");
    //Direction
    if(BannerFlow.settings.horisontal) {
        linear.setAttribute("x1", "0%")
        linear.setAttribute("x2", "100%")
        linear.setAttribute("y1", "0%")
        linear.setAttribute("y2", "0%")
    }
    else {
        linear.setAttribute("x1", "0%")
        linear.setAttribute("x2", "0%")
        linear.setAttribute("y1", "0%")
        linear.setAttribute("y2", "100%")
    }
    
    //Set colors
    var stop0 = document.getElementById('stop0');
    stop0.style.stopColor = BannerFlow.settings.startcolor;
    var stop100 = document.getElementById('stop100');
    stop100.style.stopColor = BannerFlow.settings.endcolor;
    
}

function font() {
    var font = BannerFlow.settings.font;
    font = getFont(font);

    var fontWeight = BannerFlow.settings.fontWeight;
    if(fontWeight)
        fontWeight = fontWeight.toLowerCase();

    document.body.style.fontFamily = font;
    document.body.style.fontWeight = fontWeight;
}

BannerFlow.addEventListener(BannerFlow.INIT, function ()  {   
    font();
    color();
    text();
});

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
    font();
    color();
});
BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
    text();
});
BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
    text();  
});