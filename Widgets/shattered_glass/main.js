
var rand = function(max, min, _int) {
  var max = (max === 0 || max)?max:1, 
      min = min || 0, 
      gen = min + (max - min)*Math.random();
  
  return (_int)?Math.round(gen):gen;
};


function isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}



/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}


var ShatteredGlassWidget = (function($) {

    function renderCrackEffectRefract(cvs, img, p1, p2, line)
    {
        var ctx = cvs.getContext('2d'),

        tx = line.tx,
        ty = line.ty,

        cp = line.cpt,

        ns = 3,
        td = 6,

        x1 = line.bbx1,
        y1 = line.bby1,
        w = line.bbwidth+ns*2,
        h = line.bbheight+ns*2;

        if (80 === 0) {
            return;
        }

        ctx.globalAlpha = 80 || 1;

        ctx.save();

        ctx.beginPath();
        ctx.moveTo(p1.x+ns*tx, p1.y+ns*ty);
        ctx.quadraticCurveTo(cp.x,cp.y,p2.x+ns*tx,p2.y+ns*ty);
        ctx.lineTo(p2.x-ns*tx, p2.y-ns*ty);
        ctx.quadraticCurveTo(cp.x,cp.y,p1.x-ns*tx,p1.y-ns*ty);
        ctx.closePath();
        ctx.clip();

        // Now copy a chunk of the image into the clipped region
        // Shift it slightly to create a minor refraction in the
        // image.

        // Eventually, the bounds will be right and it will stop
        // throwing errors ...

        try
        {
            if (x1+td*tx < 0) {x1 = -td*tx;}
            if (y1+td*ty < 0) {y1 = -td*ty;}
            if (w+x1+td*tx > ctx.canvas.window.innerWidth) {w = ctx.canvas.window.innerWidth - x1+td*tx;}
            if (h+y1+td*ty > ctx.canvas.window.innerHeight) {h = ctx.canvas.window.innerHeight - y1+td*ty;}

            //ctx.drawImage(img, x1+td*tx, y1+td*ty, w, h, x1, y1, w, h);
        }
        catch (e)
        {
            // Bounds debugging
            // console.log('x1:'+x1+',mx:'+td*tx+',y1:'+y1+',my:'+td*ty+',w:'+w+',h:'+h);
        }

        ctx.restore();
    }

    function renderCrackEffectReflect(cvs, img, p1, p2, line)
    {
        var ctx = cvs.getContext('2d'),

        tx = line.tx,
        ty = line.ty,

        cp = line.cpt,

        dd = line.dl / 3, grd;

        if (0.3 === 0) return;

        ctx.globalAlpha = 0.3 || 1;

        try
        {
            grd = ctx.createLinearGradient(p1.x+dd*tx,p1.y+dd*ty,p1.x-dd*tx,p1.y-dd*ty);
        }
        catch (e)
        {
            // Bounds debugging
            console.log('x1:'+(p1.x+dd*tx)+',y1:'+(p1.y+dd*ty)+',x2:'+(p1.x-dd*tx)+',y2:'+(p1.y-dd*ty));
        }

        grd.addColorStop(0, 'rgba(255,255,255, 0)');
        grd.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
        grd.addColorStop(1, 'rgba(255,255,255, 0)');

        ctx.fillStyle = grd;

        ctx.beginPath();
        ctx.moveTo(p1.x+dd*tx, p1.y+dd*ty);
        ctx.lineTo(p2.x+dd*tx, p2.y+dd*ty);
        ctx.lineTo(p2.x-dd*tx, p2.y-dd*ty);
        ctx.lineTo(p1.x-dd*tx, p1.y-dd*ty);
        ctx.closePath();
        ctx.fill();
    }

    function renderCrackEffectFractures(cvs, img, p1, p2, line)
    {
        var ctx = cvs.getContext('2d'),

        tx = line.tx,
        ty = line.ty,

        sx = line.sx,
        sy = line.sy,

        sz = 33,

        dl = line.dl,
        mp = dl / 2,

        mpp = line.mpp,
        cma = line.cma,
        mpl1 = line.mpl1,
        mpl2 = line.mpl2,

        s, p, c, w, h1, h2, t;

        if (0.4 === 0) return;

        ctx.globalAlpha = 0.4 || 1;

        ctx.lineWidth = 1;

        for (s=0;s<dl;s++)
        {

            if (s < mpp*dl)
                c = cma * (1-Math.pow((mpl1-s)/mpl1, 2));
            else
                c = cma * (1-Math.pow((mpl2-(dl-s))/mpl2, 2));

            c /= 2;

            p = Math.pow((s > mp ? dl - s : s)/mp, 2);

            w = Math.random() * 1 + 1;
            h1 = sz - Math.random() * p * sz + 1;
            h2 = sz - Math.random() * p * sz + 1;
            t = Math.random() * 20 - 10;

            if (Math.random() > p-sz/mp) {
                ctx.fillStyle = 'rgba(255,255,255,' + (Math.round(Math.random() * 8 + 4) / 12) + ')';

                ctx.beginPath();
                ctx.moveTo(p1.x + s*sx + c*tx,                 p1.y + s*sy + c*ty);
                ctx.lineTo(p1.x + (t+s+w/2)*sx + h1*tx + c*tx,   p1.y + (-t+s+w/2)*sy + h1*ty + c*ty);
                ctx.lineTo(p1.x + (s+w)*sx + c*tx,             p1.y + (s+w)*sy + c*ty);
                ctx.lineTo(p1.x + (-t+s+w/2)*sx - h2*tx + c*tx,   p1.y + (t+s+w/2)*sy - h2*ty + c*ty);
                ctx.closePath();
                ctx.fill();
            }

            s += mp * (p/2+0.5);
       }
    }

    function renderCrackEffectMainLine(cvs, img, p1, p2, line)
    {
        var ctx = cvs.getContext('2d'),

        tx = line.tx,
        ty = line.ty,

        cp = line.cpt,

        ns = 0.03 || 1,
        st = 0.14 || 1,
        hl = 0.2 || 0,
        tt = Math.random() * (ns*2) - (ns*2)/2;

        //var clr = jQuery.Color('rgb(255,255,255)');
        var nn = 1;//clr.lightness();

        if (65 === 0) return;

        ctx.globalAlpha = 65 || 1;

        ctx.lineWidth = 1;

        while (st > 0)
        {
            
            var hsl = rgbToHsl(255, 255, 255);
            hsl[2] = (nn > 0.5 ? nn : (1-nn)) * (1-hl*Math.random());
            var rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
            ctx.strokeStyle = "rgba("+ rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + (Math.round(Math.random() * 8 + 4) / 12) + ")";
            
            /*
            ctx.strokeStyle = clr.lightness( (nn > 0.5 ? nn : (1-nn)) * (1-hl*Math.random()) )
                .alpha(Math.round(Math.random() * 8 + 4) / 12)
                .toRgbaString();
            */

            ctx.beginPath();
            ctx.moveTo(p1.x+(st+tt)*tx, p1.y+(st-tt)*ty);
            ctx.quadraticCurveTo(cp.x,cp.y,p2.x+(st-tt)*tx,p2.y+(st+tt)*ty);
            ctx.stroke();

            st--;
       }

    }

    function renderCrackEffectNoise(cvs, img, p1, p2, line)
    {
        var ctx = cvs.getContext('2d'),

        tx = line.tx,
        ty = line.ty,

        sx = line.sx,
        sy = line.sy,

        freq = 0.4,

        dl = line.dl,
        mp = dl / 2,

        mpp = line.mpp,
        cma = line.cma,
        mpl1 = line.mpl1,
        mpl2 = line.mpl2,

        dd = dl / 3,
        step = Math.ceil(dd * (1-(freq+0.5)/1.5) + 1),

        c, t, s, pos, cnt, m;

        if (1 === 0) return;

        ctx.globalAlpha = 1 || 1;

        ctx.lineWidth = 1;

        for (s=0;s<dl;s++) {
            if (s < mpp*dl)
                c = cma * (1-Math.pow((mpl1-s)/mpl1, 2));
            else
                c = cma * (1-Math.pow((mpl2-(dl-s))/mpl2, 2));

            c /= 2;

            for (t=-dd;t<dd;t++) {
                if (Math.random() > Math.abs(t) / dd ) {
                    cnt = Math.floor(Math.random()*4+0.5);
                    m = Math.random() * 2 - 1;

                    while (cnt >= 0)
                    {
                       ctx.strokeStyle = 'rgba(255,255,255,' + (Math.round(Math.random() * 10 + 2) / 30) + ')';

                       pos = Math.floor(Math.random()*5+0.5);

                       ctx.beginPath();
                       ctx.moveTo(p1.x + (s-pos)*sx + (m+t)*tx + c*tx, p1.y + (s-pos)*sy + (-m+t)*ty + c*ty);
                       ctx.lineTo(p1.x + (s+pos)*sx + (-m+t)*tx + c*tx, p1.y + (s+pos)*sy + (m+t)*ty + c*ty);
                       ctx.stroke();

                       cnt--;
                       pos++;
                    }
                }

                t += Math.random()*step*2;
            }

            s += Math.random()*step*4;
       }
    }

    function renderCrackEffectDebug(cvs, img, p1, p2, line)
    {
        var ctx = cvs.getContext('2d'),

           tx = line.tx,
           ty = line.ty,

           sx = line.sx,
           sy = line.sy,

           mpp = line.mpp,
           cma = line.cma/2,
           mpl1 = line.mpl1,

           cp = line.cpt;

        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.fillStyle = 'rgba(0,0,0,1)';

        ctx.fillRect(p1.x, p1.y, 3, 3);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0,0,0,1)';

        ctx.beginPath();
        ctx.moveTo(p1.x+mpl1*sx, p1.y+mpl1*sy);
        ctx.lineTo(p1.x+mpl1*sx+cma*tx, p1.y+mpl1*sy+cma*ty);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0,0,0,1)';

        ctx.beginPath();
        ctx.moveTo(p1.x+(mpl1-5)*sx+cma*tx, p1.y+(mpl1-5)*sy+cma*ty);
        ctx.lineTo(p1.x+(mpl1+5)*sx+cma*tx, p1.y+(mpl1+5)*sy+cma*ty);
        ctx.stroke();
    }

    function renderCrackEffectAll($canvas, $image, paths)
    {
        var i, line;

        for (i = 0; i < paths.length; i++)
        {
            line = paths[i];

            //renderCrackEffectRefract($canvas[0], $image[0], line.p1, line.p2, line.desc);
            renderCrackEffectRefract($canvas[0], null, line.p1, line.p2, line.desc);

            //renderCrackEffectReflect($canvas[1], $image[0], line.p1, line.p2, line.desc);
            renderCrackEffectReflect($canvas[1], null, line.p1, line.p2, line.desc);

            //renderCrackEffectFractures($canvas[2], $image[0], line.p1, line.p2, line.desc);
            renderCrackEffectFractures($canvas[2], null, line.p1, line.p2, line.desc);

            //renderCrackEffectMainLine($canvas[3], $image[0], line.p1, line.p2, line.desc);
            renderCrackEffectMainLine($canvas[3], null, line.p1, line.p2, line.desc);

            //renderCrackEffectNoise($canvas[4], $image[0], line.p1, line.p2, line.desc);
            renderCrackEffectNoise($canvas[4], null, line.p1, line.p2, line.desc);

            //renderCrackEffectDebug($canvas[5], $image[0], line.p1, line.p2, line.desc);

       }

    }

    var _RAD = Math.PI / 180;

    function findPointOnCircle(c, r, a)
    {
        return {
           x: c.x + r * Math.cos(a*_RAD) - r * Math.sin(a*_RAD),
           y: c.y + r * Math.sin(a*_RAD) + r * Math.cos(a*_RAD)
        };
    }

    function describeLinePath(p1, p2, cv)
    {
        var o = {},
           ll,
           cv = 5*cv;

        o.dx = (p2.x - p1.x);
        o.dy = (p2.y - p1.y);
        o.dl = Math.sqrt(o.dx*o.dx + o.dy*o.dy);

        // Vectors
        o.sx = o.dx / o.dl;
        o.sy = o.dy / o.dl;

        o.tx = o.dy / o.dl;
        o.ty = -o.dx / o.dl;

        //Curvature
        o.mpp = Math.random() * 0.5 + 0.3;
        o.mpl1 = o.dl * o.mpp;
        o.mpl2 = o.dl - o.mpl1;

        ll = Math.log(o.dl*Math.E);
        o.cma = Math.random() * ll * cv - ll * cv / 2;
        o.cpt = {x: p1.x + o.sx*o.mpl1 + o.tx*o.cma, y: p1.y + o.sy*o.mpl1 + o.ty*o.cma};

        // Bounding box
        o.bbx1 = Math.min(p1.x, p2.x, o.cpt.x);
        o.bby1 = Math.min(p1.y, p2.y, o.cpt.y);
        o.bbx2 = Math.max(p1.x, p2.x, o.cpt.x);
        o.bby2 = Math.max(p1.y, p2.y, o.cpt.y);
        o.bbwidth = o.bbx2 - o.bbx1;
        o.bbheight = o.bby2 - o.bby1;

        return o;
    }

    function findCrackEffectPaths(options, initialSizeCrack)
    {
        var imx = 0,
           imy = 0,
           imw = options.width,
           imh = options.height,
           main = [[]],
           lines = [],
           level = 1,
           r = 15,
           c = options.center,
           pt1, pt2, ang, num, num2;

        var limitedRadius = initialSizeCrack ? initialSizeCrack : 500;

       /*
       * Part 1: Create a table of points that we can use to draw crack segments
       * between.  First, we need to find the number of lines that will run
       * outward from the center of the crack.  Each of these lines will be
       * staggered at various angles.  The points will be placed on these
       * lines at different intervals defined by the concentric circles
       * created by incrementing the starting radius.
       */

        num = 20;
        ang = 360/(num+1);

        while (main[0].length < num)
        {
            num2 = (ang * main[0].length)+10;
            pt2 = findPointOnCircle(c, 5, num2);
            main[0].push({angle: num2, point: pt2});
        }

        while(r < limitedRadius)
        {
            main[level]=[];
            for (num2=0;num2<num;num2++)
            {
                pt1 = main[level-1][num2];
                main[level][num2] = null;

                if (pt1) {
                    if ((pt1.point.x > imx && pt1.point.x < imw) && (pt1.point.y > imy && pt1.point.y < imh)) {
                       
                       ang = pt1.angle + Math.random() * 10 / num - 10 / 2 / num;
                       if (ang > 350) ang = 350;

                       pt2 = findPointOnCircle(c, r + Math.random()*r/level - r/(level*2), ang);

                       main[level][num2] = {angle: ang, point: {x: pt2.x, y: pt2.y}};
                    }
                }
            }

            level++;
            r *= Math.random()*1.5 + (1.5 - 50 / 100);
        }

       /*
       * Part 2: Find the actual cracked lines between the points.
       * There are three lines that can be drawn:
       *
       *   a) The original lines from the center radiating out to the
       *      edges.  These are always drawn
       *   b) Lines connecting two adjacent points on the same circle
       *   c) Lines connecting two adjacent points on different circles
       *
       *   b & c are only drawn based a on random interval.  These
       *   lines create the web effect of the cracking.
       */

        for (var l=1;l<level;l++)
        {
            for (var g=0;g<num;g++)
            {
                pt1 = main[l-1][g];
                pt2 = main[l][g];

                if (pt1 && pt2) {
                    lines.push({
                         p1: {x:pt1.point.x, y:pt1.point.y},
                         p2: {x:pt2.point.x, y:pt2.point.y},
                         desc: describeLinePath(pt1.point, pt2.point, 30 / 100),
                         level: l
                    });

                    if (Math.random() < (60 / 100)) {
                       pt1 = main[l][(g+1)%num];
                       if (pt1)
                       {
                          lines.push({
                               p1: {x:pt2.point.x, y:pt2.point.y},
                               p2: {x:pt1.point.x, y:pt1.point.y},
                               desc: describeLinePath(pt2.point, pt1.point, 30 / 100),
                               level: l
                             });
                       }
                    }

                    if (l < level-1 && Math.random() < (30 / 100)) {
                        pt1 = main[l+1][(g+1)%num];
                        if (pt1) {
                            lines.push({
                               p1: {x:pt2.point.x, y:pt2.point.y},
                               p2: {x:pt1.point.x, y:pt1.point.y},
                               desc: describeLinePath(pt2.point, pt1.point, 30 / 100),
                               level: l
                            });
                        }
                    }
                }
          }
       }

       return lines;
    }

    function clearDrawing($canvas) {
        var lastContext = $canvas[$canvas.length - 1].getContext('2d');
        for(var i=0;i<$canvas.length - 1;i++){
            var ctx = $canvas[i].getContext('2d');
            
            lastContext.drawImage($canvas[i], 0, 0);
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        }

        
        var canvas = document.createElement('canvas');
        canvas.width = lastContext.canvas.width;
        canvas.height = lastContext.canvas.height;
        var tmpContext = canvas.getContext('2d');
        tmpContext.drawImage(lastContext.canvas,0, 0);

        drawFallingGlass(lastContext, canvas);
    }


    function drawFallingGlass(ctx, image) {
        var pieceSize = 8;
        var x = 0, y = 0;
        var ax = 0.1;
        var ay = 0.5;

        var vx = rand(5, 1);
        var vy = rand(1.5, 0.5);
        var alpha = 0;
        var angle_v = rand(-30, 30);

        // Save all locations
        var allLocations = new Array();
        while(x < ctx.canvas.width && y < ctx.canvas.height) {
            var vx = rand(10, 1);
            var vy = rand(1.5, 0.5);
            var type = Math.random();

            vx *= (type > 0.5 ? 1 : -1);

            allLocations.push({
                x: x, y: y,

                location: { x: 0, y: 0 },

                vx: vx, vy: vy,
                ax: ax * (vx > 0 ? 1 : -1), ay: ay,

                isActive: true,
                alpha: 0,
                angle_v: rand(-30, 30)
            });


            x += pieceSize;
            if(x >= ctx.canvas.width && y < ctx.canvas.height) {
                x = 0;
                y += pieceSize;
            }
        }

        var drawFallingOld = function() {
            
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            var count = 0;
        
            for(var index = 0; index < allLocations.length; index++) {

                if(allLocations[index].isActive) {
                    count++;

                    ctx.save();
                    ctx.translate(allLocations[index].x + allLocations[index].location.x, allLocations[index].y + allLocations[index].location.y);
                    ctx.rotate(allLocations[index].alpha * Math.PI / 180);
                    allLocations[index].alpha += allLocations[index].angle_v;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(pieceSize, 0);
                    ctx.lineTo(pieceSize, pieceSize);
                    ctx.lineTo(0, pieceSize);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(image, -allLocations[index].x, -allLocations[index].y);
                    ctx.restore();

                    allLocations[index].location.x += allLocations[index].vx;
                    allLocations[index].location.y += allLocations[index].vy;
                    allLocations[index].vy += allLocations[index].ay;
                    allLocations[index].vx += allLocations[index].ax;

                    if(allLocations[index].location.y >= ctx.canvas.height)
                        allLocations[index].isActive = false;
                    else if(allLocations[index].location.x > 0 && allLocations[index].location.x + allLocations[index].x >= ctx.canvas.width) {
                        allLocations[index].isActive = false;
                    }
                    else if(allLocations[index].location.x < 0 && allLocations[index].x + allLocations[index].location.x <= -pieceSize){
                        allLocations[index].isActive = false;
                    }
                }
            }

            
            if(count > 0)
                requestAnimationFrame(drawFalling);
            
        }

        var opacity = 1;
        var drawFalling = function() {

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalAlpha = opacity;
            ctx.drawImage(image, 0, 0);
            
            opacity -= 0.02;

            y += vy;
            vy += ay;
            
            if(opacity > 0)
                requestAnimationFrame(drawFalling);
        }

        drawFalling();
    }


    /**********************************************************************************
    *   Init
    */

    function startWidget()
    {
        var container = document.getElementById('shatteredGlassWidget');
        var $canvas = container.getElementsByTagName('canvas'),
            $image,options, paths, currentCenter;
        options = {};
        currentCenter = { x: 0, y: 0};

        var startPositionX = 0;
        var startPositionY = 0;
        var numberInteraction = 5;
        var sizeOfInitialCrack = 150;
        var minSizeOfInitialCrack = 16;
        var isInitCrack = true;

        if(typeof BannerFlow !== "undefined") {
            startPositionX = BannerFlow.settings.startingPositionX;
            startPositionY = BannerFlow.settings.startingPositionY;
            numberInteraction = BannerFlow.settings.numberInteraction > 0 ? BannerFlow.settings.numberInteraction : numberInteraction;
            sizeOfInitialCrack = BannerFlow.settings.sizeOfInitialCrack > 0 ? BannerFlow.settings.sizeOfInitialCrack : sizeOfInitialCrack;

            isInitCrack = BannerFlow.settings.isInitCrack;
        }

        if(sizeOfInitialCrack < minSizeOfInitialCrack)
            sizeOfInitialCrack = minSizeOfInitialCrack;

        var widthContainer = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
        var heightContainer = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

        if(!widthContainer || !heightContainer)
            return;

        for(var i=0;i<$canvas.length; i++){
            $canvas[i].width = widthContainer;
            $canvas[i].height = heightContainer;
        }
        
        var widgetContainer = document.getElementById('shatteredGlassWidget');

        var countClick = 0;

        var drawSmallBreak = function(){
            currentCenter = { x: startPositionX, y: startPositionY };

            // Draw effect
            options.width = widthContainer;
            options.height = heightContainer;
            options.center = currentCenter;
            options.debug = true;

            paths = findCrackEffectPaths(options, sizeOfInitialCrack);

            renderCrackEffectAll($canvas, $image, paths, options);
        };

        var drawEffect = function(e) {
            var x = (e.touches ? e.touches[0].pageX : e.pageX) - 5;
            var y = (e.touches ? e.touches[0].pageY : e.pageY) - 5;

            currentCenter = { x: x, y: y };

            // Draw effect
            options.width = widthContainer;
            options.height = heightContainer;
            options.center = currentCenter;
            options.debug = true;

            paths = findCrackEffectPaths(options, sizeOfInitialCrack);

            renderCrackEffectAll($canvas, $image, paths, options);

            countClick++;

            if(countClick >= numberInteraction) {
                if(isTouchDevice()){ // touch device
                    this.removeEventListener('touchstart', drawEffect);
                }
                else {
                    if(this.removeEventListener) { // normal browser
                        this.removeEventListener('click', drawEffect);
                    }
                    else if (this.detachEvent){ // IE 10
                        this.detachEvent('click', drawEffect);
                    }
                }
                
                clearDrawing($canvas);
            }
        };

        if(isInitCrack)
            drawSmallBreak();

        if(isTouchDevice()) { // touch device
            widgetContainer.addEventListener('touchstart', drawEffect);
        } else {
            if(widgetContainer.addEventListener) { // normal browser
                widgetContainer.addEventListener('click', drawEffect);
            }
            else if(widgetContainer.attachEvent) { // IE 10
                widgetContainer.attachEvent('click', drawEffect);
            }
        }

        /* hide the widget in image generator mode */

        if(typeof BannerFlow !== "undefined"){
            if(BannerFlow.imageGeneratorMode) { 
                document.body.setAttribute('style','display:none;');
            }
        }
    }

    var timeoutStart;
    var sessionId = 0;

    function init() {
        if(timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function() {
                startWidget(++sessionId);
            }, 500);
        } else {
            timeoutStart = setTimeout(function(){
                startWidget(++sessionId);
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
        onStart: onStart,
        onResized: onResized,
        onSettingChanged: onSettingChanged
    }
})();

if(typeof BannerFlow == "undefined"){
    ShatteredGlassWidget.onStart();
}
else {
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        ShatteredGlassWidget.onStart();
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        ShatteredGlassWidget.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        ShatteredGlassWidget.onSettingChanged();
    });
}