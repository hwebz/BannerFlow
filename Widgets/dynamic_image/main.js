// source - http://codepen.io/Zeaklous/pen/raltF


var Delaunay;

(function() {
    "use strict";

    var EPSILON = 1.0 / 1048576.0;

    function supertriangle(vertices) {
        var xmin = Number.POSITIVE_INFINITY,
            ymin = Number.POSITIVE_INFINITY,
            xmax = Number.NEGATIVE_INFINITY,
            ymax = Number.NEGATIVE_INFINITY,
            i, dx, dy, dmax, xmid, ymid;

        for(i = vertices.length; i--; ) {
            if(vertices[i][0] < xmin) xmin = vertices[i][0];
            if(vertices[i][0] > xmax) xmax = vertices[i][0];
            if(vertices[i][1] < ymin) ymin = vertices[i][1];
            if(vertices[i][1] > ymax) ymax = vertices[i][1];
        }

        dx = xmax - xmin;
        dy = ymax - ymin;
        dmax = Math.max(dx, dy);
        xmid = xmin + dx * 0.5;
        ymid = ymin + dy * 0.5;

        return [
            [xmid - 20 * dmax, ymid -      dmax],
            [xmid            , ymid + 20 * dmax],
            [xmid + 20 * dmax, ymid -      dmax]
        ];
    }

    function circumcircle(vertices, i, j, k) {
        var x1 = vertices[i][0],
            y1 = vertices[i][1],
            x2 = vertices[j][0],
            y2 = vertices[j][1],
            x3 = vertices[k][0],
            y3 = vertices[k][1],
            fabsy1y2 = Math.abs(y1 - y2),
            fabsy2y3 = Math.abs(y2 - y3),
            xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

        /* Check for coincident points */
        if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
            throw new Error("Eek! Coincident points!");

        if(fabsy1y2 < EPSILON) {
            m2  = -((x3 - x2) / (y3 - y2));
            mx2 = (x2 + x3) / 2.0;
            my2 = (y2 + y3) / 2.0;
            xc  = (x2 + x1) / 2.0;
            yc  = m2 * (xc - mx2) + my2;
        }

        else if(fabsy2y3 < EPSILON) {
            m1  = -((x2 - x1) / (y2 - y1));
            mx1 = (x1 + x2) / 2.0;
            my1 = (y1 + y2) / 2.0;
            xc  = (x3 + x2) / 2.0;
            yc  = m1 * (xc - mx1) + my1;
        }

        else {
            m1  = -((x2 - x1) / (y2 - y1));
            m2  = -((x3 - x2) / (y3 - y2));
            mx1 = (x1 + x2) / 2.0;
            mx2 = (x2 + x3) / 2.0;
            my1 = (y1 + y2) / 2.0;
            my2 = (y2 + y3) / 2.0;
            xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
            yc  = (fabsy1y2 > fabsy2y3) ?
                m1 * (xc - mx1) + my1 :
                m2 * (xc - mx2) + my2;
        }

        dx = x2 - xc;
        dy = y2 - yc;
        return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
    }

    function dedup(edges) {
        var i, j, a, b, m, n;

        for(j = edges.length; j; ) {
            b = edges[--j];
            a = edges[--j];

            for(i = j; i; ) {
                n = edges[--i];
                m = edges[--i];

                if((a === m && b === n) || (a === n && b === m)) {
                    edges.splice(j, 2);
                    edges.splice(i, 2);
                    break;
                }
            }
        }
    }

    Delaunay = {
        triangulate: function(vertices, key) {
            var n = vertices.length,
                i, j, indices, st, open, closed, edges, dx, dy, a, b, c;

            /* Bail if there aren't enough vertices to form any triangles. */
            if(n < 3)
                return [];

            /* Slice out the actual vertices from the passed objects. (Duplicate the
             * array even if we don't, though, since we need to make a supertriangle
             * later on!) */
            vertices = vertices.slice(0);

            if(key)
                for(i = n; i--; )
                    vertices[i] = vertices[i][key];

            /* Make an array of indices into the vertex array, sorted by the
             * vertices' x-position. */
            indices = new Array(n);

            for(i = n; i--; )
                indices[i] = i;

            indices.sort(function(i, j) {
                return vertices[j][0] - vertices[i][0];
            });

            /* Next, find the vertices of the supertriangle (which contains all other
             * triangles), and append them onto the end of a (copy of) the vertex
             * array. */
            st = supertriangle(vertices);
            vertices.push(st[0], st[1], st[2]);

            /* Initialize the open list (containing the supertriangle and nothing
             * else) and the closed list (which is empty since we havn't processed
             * any triangles yet). */
            open   = [circumcircle(vertices, n + 0, n + 1, n + 2)];
            closed = [];
            edges  = [];

            /* Incrementally add each vertex to the mesh. */
            for(i = indices.length; i--; edges.length = 0) {
                c = indices[i];

                /* For each open triangle, check to see if the current point is
                 * inside it's circumcircle. If it is, remove the triangle and add
                 * it's edges to an edge list. */
                for(j = open.length; j--; ) {
                    /* If this point is to the right of this triangle's circumcircle,
                     * then this triangle should never get checked again. Remove it
                     * from the open list, add it to the closed list, and skip. */
                    dx = vertices[c][0] - open[j].x;
                    if(dx > 0.0 && dx * dx > open[j].r) {
                        closed.push(open[j]);
                        open.splice(j, 1);
                        continue;
                    }

                    /* If we're outside the circumcircle, skip this triangle. */
                    dy = vertices[c][1] - open[j].y;
                    if(dx * dx + dy * dy - open[j].r > EPSILON)
                        continue;

                    /* Remove the triangle and add it's edges to the edge list. */
                    edges.push(
                        open[j].i, open[j].j,
                        open[j].j, open[j].k,
                        open[j].k, open[j].i
                    );
                    open.splice(j, 1);
                }

                /* Remove any doubled edges. */
                dedup(edges);

                /* Add a new triangle for each edge. */
                for(j = edges.length; j; ) {
                    b = edges[--j];
                    a = edges[--j];
                    open.push(circumcircle(vertices, a, b, c));
                }
            }

            /* Copy any remaining open triangles to the closed list, and then
             * remove any triangles that share a vertex with the supertriangle,
             * building a list of triplets that represent triangles. */
            for(i = open.length; i--; )
                closed.push(open[i]);
            open.length = 0;

            for(i = closed.length; i--; )
                if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
                    open.push(closed[i].i, closed[i].j, closed[i].k);

            /* Yay, we're done! */
            return open;
        },
        contains: function(tri, p) {
            /* Bounding box test first, for quick rejections. */
            if((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
                (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
                (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
                (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]))
                return null;

            var a = tri[1][0] - tri[0][0],
                b = tri[2][0] - tri[0][0],
                c = tri[1][1] - tri[0][1],
                d = tri[2][1] - tri[0][1],
                i = a * d - b * c;

            /* Degenerate tri. */
            if(i === 0.0)
                return null;

            var u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
                v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;

            /* If we're outside the tri, fail. */
            if(u < 0.0 || v < 0.0 || (u + v) > 1.0)
                return null;

            return [u, v];
        }
    };
})();


//////////////
// MATH UTILS
//////////////

function randomRange(min, max) {
    return min + (max - min) * Math.random();
}

function clamp(x, min, max) {
    return x < min ? min : (x > max ? max : x);
}

function sign(x) {
    return x < 0 ? -1 : 1;
}

function setStyleCss3(element, property, value) {
    var upperProperty = property.substring(0,1).toUpperCase() + property.substring(1).toLowerCase();
    element.style["webkit"+upperProperty] = value;
    element.style["moz"+upperProperty] = value;
    element.style["ms"+upperProperty] = value;
    element.style[property] = value;
}

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



var DynamicImageTransitionWidget = (function(){

    var container = document.getElementById('dynamicImageContainer');
    var textWarning = document.getElementById('textWarning');
    var containerWidth, containerHeight;

    var animationEvents = ["webkitTransitionEnd", "transitionend", "msTransitionEnd"];
    var animationKeyframeEvents = ["webkitAnimationEnd", "animationend", "MSAnimationEnd"];

    var imageUrls = [];
    var isUseFeed = false;
    var isLoop = true;
    var duration = 1000;
    var animation;
    var backgroundSize;

    var BACKGROUND_CONTAIN = "Contain";
    var BACKGROUND_COVER   = "Cover";
    var isBackgroundContain = true;

    var ANIMATION_BREAK = "Break down";
    var ANIMATION_BUILD = "Build up";
    var useBreakAnimation = false;

    var image, imageWidth = 0, imageHeight = 0, top = 0, left = 0;
    var previousImage, previousImageWidth = 0, previousImageHeight = 0, previousImageTop = 0, previousImageLeft = 0;
    var images = [], imageIndex = 0;

     
    var vertices = [],
        indices = [],
        prevfrag = [],
        fragments = [];

    var margin = 50;

    var clickPosition = [imageWidth * 0.5, imageHeight * 0.5];

    var firstTimeAnimation = true;
    var isRunning = false;
    var isStop = false;
    var timeoutAnimation = null;

    function resetDataAnimation() {
        container.innerHTML = "";
        vertices = [];
        indices = [];
        prevfrag = [];
        fragments = [];
        images = [];
        imageIndex = 0;
        if(timeoutAnimation) {
            clearTimeout(timeoutAnimation);
            timeoutAnimation = null;
            isRunning = false;            
            image = null;
            previousImage = null;
        }
    }

    function placeImage(isFirst) {
        if (imageIndex === images.length) {
            imageIndex = 0;
            // isRunning = false;
            // return;
        }

        if(isStop) {
            isRunning = false;            
            image = null;
            previousImage = null;

            return;
        }

        isRunning = true;

        if(image){
            previousImage = image;
            previousImageWidth = imageWidth;
            previousImageHeight = imageHeight;
            previousImageTop = top;
            previousImageLeft = left;
        }

        image = images[imageIndex++];

        if(image.oriWidth)
            image.width = image.oriWidth;
        else 
            image.oriWidth = image.width;

        if(image.oriHeight)
            image.height = image.oriHeight;
        else 
            image.oriHeight = image.height;

        if(containerWidth/containerHeight >= image.width/image.height) {
            if(isBackgroundContain) {
                imageHeight = containerHeight;
                imageWidth = image.width/image.height * imageHeight;
            } else {
                imageWidth = containerWidth;
                imageHeight = image.height/image.width * imageWidth;
            }
        } else {
            if(isBackgroundContain) {
                imageWidth = containerWidth;
                imageHeight = image.height/image.width * imageWidth;
            } else {
                imageHeight = containerHeight;
                imageWidth = image.width/image.height * imageHeight;
            }
        }

        left = parseInt((containerWidth - imageWidth)/2);
        top = parseInt((containerHeight - imageHeight)/2);

        clickPosition = [left + imageWidth * 0.5, top + imageHeight * 0.5];
      
        var num = Math.random();
        if(num < .25) {
          image.direction = "left";
        } else if(num < .5) {
          image.direction = "top";
        } else if(num < .75) {
          image.direction = "bottom";
        } else {
          image.direction = "right";
        }

        image.style.opacity = 0;
        if(isFirst) {
            image.style.opacity = 1;
            isRunning = false;
        }
        image.style.top = top + 'px';
        image.style.left = left + 'px';
        image.style.width = imageWidth + 'px';
        image.style.height = imageHeight + 'px';

        container.appendChild(image);
      
        if (!isFirst) {
            triangulateIn(!useBreakAnimation || firstTimeAnimation);
            firstTimeAnimation = false;
        }
    }

    function triangulateIn(isBuild) {
        var box = image.getBoundingClientRect(),
            top = box.top,
            left = box.left;
      
        if(image.direction == "left") {
          clickPosition[0] = isBuild ? left : previousImageLeft; 
          clickPosition[1] = isBuild ? top : previousImageTop + imageHeight / 2;
        } else if(image.direction == "top") {
          clickPosition[0] = isBuild ? left : previousImageLeft + imageWidth / 2;
          clickPosition[1] = isBuild ? top : previousImageTop;
        } else if(image.direction == "bottom") {
          clickPosition[0] = isBuild ? left : previousImageLeft + imageWidth / 2;
          clickPosition[1] = isBuild ? top : previousImageTop + imageHeight;
        } else if(image.direction == "right") {
          clickPosition[0] = isBuild ? left : previousImageLeft + imageWidth;
          clickPosition[1] = isBuild ? top : previousImageTop + imageHeight / 2;
        } 
        
        if(isBuild)
            triangulate();
        else 
            triangulateForBreak();

        build();
    }

    function triangulate() {
        
        for(var i = 0; i < 40; i++) {      
          x = left + -margin + Math.random() * (imageWidth + margin * 2);
          y = top + -margin + Math.random() * (imageHeight + margin * 2);
          vertices.push([x, y]);
        }

        vertices.push([left, top]);
        vertices.push([left + imageWidth, top]);
        vertices.push([left + imageWidth, top + imageHeight]);
        vertices.push([left, top + imageHeight]);
      
        vertices.forEach(function(v) {
            v[0] = clamp(v[0], left, left + imageWidth);
            v[1] = clamp(v[1], top, top + imageHeight);
        });
      
        indices = Delaunay.triangulate(vertices);

    }

    function triangulateForBreak() {
        for(var i = 0; i < 40; i++) {      
          x = previousImageLeft + -margin + Math.random() * (previousImageWidth + margin * 2);
          y = previousImageTop + -margin + Math.random() * (previousImageHeight + margin * 2);
          vertices.push([x, y]);
        }

        vertices.push([previousImageLeft, previousImageTop]);
        vertices.push([previousImageLeft + previousImageWidth, previousImageTop]);
        vertices.push([previousImageLeft + previousImageWidth, previousImageTop + previousImageHeight]);
        vertices.push([previousImageLeft, previousImageTop + previousImageHeight]);
      
        vertices.forEach(function(v) {
            v[0] = clamp(v[0], previousImageLeft, previousImageLeft + previousImageWidth);
            v[1] = clamp(v[1], previousImageTop, previousImageTop + previousImageHeight);
        });
      
        indices = Delaunay.triangulate(vertices);        
    }


    // Start to build animation
    //=============================================================================================================
    function build() {
        
        if(useBreakAnimation) {
            buildForBreak();
            return;
        }

        var p0, p1, p2,fragment;
        var timeoutEnd = 0;

        for (var i = 0; i < indices.length; i += 3) {
            p0 = vertices[indices[i + 0]];
            p1 = vertices[indices[i + 1]];
            p2 = vertices[indices[i + 2]];

            fragment = new Fragment(p0, p1, p2, left, top, imageWidth, imageHeight, image, true);

            var dx = fragment.centroid[0] - clickPosition[0],
                dy = fragment.centroid[1] - clickPosition[1],
                d = Math.sqrt(dx * dx + dy * dy),
                rx = 30 * sign(dy),
                ry = 90 * -sign(dx),
                delay = d * 0.003 * randomRange(0.9, 1.1) * 1000;
            fragment.canvas.style.zIndex = Math.floor(d).toString();

            if(image.direction == "left") {
              rx = Math.abs(rx); 
              ry = 0;          
            } else if(image.direction == "top") {
              rx = 0;
              ry = Math.abs(ry);
            } else if(image.direction == "bottom") {
              rx = 0;
              ry = - Math.abs(ry);
            } else if(image.direction == "right") {
              rx = - Math.abs(rx);
              ry = 0;
            }

            //buildUpAnimation(fragment.canvas, rx, ry, delay < duration ? delay : duration/2, duration > delay ? duration - delay : duration/2);
            buildUpAnimation(fragment.canvas, rx, ry, delay, duration);
          
            if(delay > timeoutEnd) {
                timeoutEnd = delay;
            }

            fragments.push(fragment);
            container.appendChild(fragment.canvas);
        }
        
        timeoutAnimation = setTimeout(function() {
            
            clearTimeout(timeoutAnimation);
            buildUpCompleteHandler();

        }, timeoutEnd + duration);

    }

    function buildForBreak() {

        var p0, p1, p2,fragment;
        var timeoutEnd = 0;

        for (var i = 0; i < indices.length; i += 3) {
            p0 = vertices[indices[i + 0]];
            p1 = vertices[indices[i + 1]];
            p2 = vertices[indices[i + 2]];

            fragment = new Fragment(p0, p1, p2, previousImageLeft, previousImageTop, previousImageWidth, previousImageHeight, previousImage, false);

            var dx = fragment.centroid[0] - clickPosition[0],
                dy = fragment.centroid[1] - clickPosition[1],
                d = Math.sqrt(dx * dx + dy * dy),
                rx = 30 * sign(dy),
                ry = 90 * -sign(dx),
                delay = d * 0.003 * randomRange(0.9, 1.1) * 1000;
            fragment.canvas.style.zIndex = Math.floor(d).toString();


            if(image.direction == "left") {
              rx = Math.abs(rx); 
              ry = 0;          
            } else if(image.direction == "top") {
              rx = 0;
              ry = Math.abs(ry);
            } else if(image.direction == "bottom") {
              rx = 0;
              ry = - Math.abs(ry);
            } else if(image.direction == "right") {
              rx = - Math.abs(rx);
              ry = 0;
            }

            breakingAnimation(fragment.canvas, rx, ry, delay, duration);
          
            if(delay > timeoutEnd) {
                timeoutEnd = delay;
            }

            fragments.push(fragment);
            container.appendChild(fragment.canvas);
        }

        image.style.opacity = 1;
        previousImage.style.opacity = 0;

        timeoutAnimation = setTimeout(function() {
            
            clearTimeout(timeoutAnimation);
            breakCompleteHandler();

        }, timeoutEnd + duration);
    }

    // Play build up animation
    //=============================================================================================================
    function buildUpAnimation(canvas, rx, ry, delay, duration) {

        setStyleCss3(canvas, 'transform', "translate3d(0,0,-50px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale3d(0,0,1)");
        setStyleCss3(canvas, 'transition', "transform "+duration+"ms cubic-bezier(0.550, 0.055, 0.675, 0.190)");
        
        (function(canvas, delay){
            
            var timeout1 = setTimeout(function(){

                clearTimeout(timeout1);

                setStyleCss3(canvas, 'transform', "translate3d(0,0,0) rotateX(0) rotateY(0) scale3d(1,1,1)");

                var timeout2 = setTimeout(function(){

                    clearTimeout(timeout2);

                    setStyleCss3(canvas, 'transition', "transform "+duration+"ms cubic-bezier(0.550, 0.055, 0.675, 0.190), opacity " + (duration * 0.5) + " cubic-bezier(0.550, 0.055, 0.675, 0.190)");

                    var timeout3 = setTimeout(function() {
                        clearTimeout(timeout3);
                        canvas.style.opacity = "1";
                    }, 0);

                }, duration * 0.5);

            }, delay);

        })(canvas, delay);
    }

    // Play brearking animaition
    //=============================================================================================================
    function breakingAnimation(canvas, rx, ry, delay, duration) {

        setStyleCss3(canvas, 'transform', "translate3d(0,0,0) rotateX(0) rotateY(0) scale3d(1,1,1)");
        setStyleCss3(canvas, 'transition', "transform "+duration+"ms cubic-bezier(0.550, 0.055, 0.675, 0.190)");
        
        (function(canvas, delay){
            
            var timeout1 = setTimeout(function(){

                clearTimeout(timeout1);

                setStyleCss3(canvas, 'transform', "translate3d(0,0,-50px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale3d(0,0,1)");

                var timeout2 = setTimeout(function(){

                    clearTimeout(timeout2);

                    setStyleCss3(canvas, 'transition', "transform "+duration+"ms cubic-bezier(0.550, 0.055, 0.675, 0.190), opacity " + (duration * 0.5) + " cubic-bezier(0.550, 0.055, 0.675, 0.190)");

                }, duration * 0.5);

            }, delay);

        })(canvas, delay);
    }

    // Callback after completing build up animation
    //=============================================================================================================
    function buildUpCompleteHandler() {

        var isEndAnimation = false;

        var callbackTransitionEnd = function() {
            if(isEndAnimation)
                return;
            isEndAnimation = true;

            fragments.forEach(function(f) {
                container.removeChild(f.canvas);
            });

            fragments.length = 0;
            vertices.length = 0;
            indices.length = 0;

            placeImage();

            if(this.removeEventListener) {
                for(var i = 0; i < animationEvents.length; i++) {
                    this.removeEventListener(animationEvents[i], callbackTransitionEnd, false);
                }
            } else if(this.detachEvent) {
                for(var i = 0; i < animationEvents.length; i++) {
                    this.detachEvent(animationEvents[i], callbackTransitionEnd, false);
                }
            }
        };

        if(image.addEventListener) {
            for(var i = 0; i < animationEvents.length; i++) {
                image.addEventListener(animationEvents[i], callbackTransitionEnd, false);
            }
        } else if(image.attachEvent) {
            for(var i = 0; i < animationEvents.length; i++) {
                image.attachEvent(animationEvents[i], callbackTransitionEnd, false);
            }
        }

        if(previousImage)
            previousImage.style.opacity = 0;

        image.style.opacity = 1;
        
    }

    // Before starting break animation
    //=============================================================================================================

    function breakStartHandler(callback) {
        var isEndAnimation = false;

        var callbackTransitionEnd = function() {
            if(isEndAnimation)
                return;
            isEndAnimation = true;

            if(callback)
                callback();
        };

        if(image.addEventListener) {
            for(var i = 0; i < animationEvents.length; i++) {
                image.addEventListener(animationEvents[i], callbackTransitionEnd, false);
            }
        } else if(image.attachEvent) {
            for(var i = 0; i < animationEvents.length; i++) {
                image.attachEvent(animationEvents[i], callbackTransitionEnd, false);
            }
        }

        image.style.opacity = 1;
    }

    // Callback after completing break animation
    //=============================================================================================================
    function breakCompleteHandler() {
        fragments.forEach(function(f) {
            container.removeChild(f.canvas);
        });

        fragments.length = 0;
        vertices.length = 0;
        indices.length = 0;

        placeImage();
    }

    //////////////
    // FRAGMENT
    //////////////

    Fragment = function(v0, v1, v2, left, top, imageWidth, imageHeight, image, hidden) {
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
        this.left = left;
        this.top = top;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.image = image;

        this.hidden = hidden;

        this.computeBoundingBox();
        this.computeCentroid();
        this.createCanvas();
        this.clip();
    };

    Fragment.prototype = {
        computeBoundingBox:function() {
            var xMin = Math.min(this.v0[0], this.v1[0], this.v2[0]),
                xMax = Math.max(this.v0[0], this.v1[0], this.v2[0]),
                yMin = Math.min(this.v0[1], this.v1[1], this.v2[1]),
                yMax = Math.max(this.v0[1], this.v1[1], this.v2[1]);

             this.box = {
                x:Math.round(xMin),
                y:Math.round(yMin),
                w:Math.round(xMax - xMin),
                h:Math.round(yMax - yMin)
            };

        },
        computeCentroid:function() {
            var x = (this.v0[0] + this.v1[0] + this.v2[0]) / 3,
                y = (this.v0[1] + this.v1[1] + this.v2[1]) / 3;

            this.centroid = [x, y];
        },
        createCanvas:function() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.box.w;
            this.canvas.height = this.box.h;
            this.canvas.style.width = this.box.w + 'px';
            this.canvas.style.height = this.box.h + 'px';
            this.canvas.style.left = this.box.x + 'px';
            this.canvas.style.top = this.box.y + 'px';
            this.canvas.style.opacity = this.hidden ? 0 : 1;
            this.ctx = this.canvas.getContext('2d');
        },
        clip:function() {
            this.ctx.save();
            this.ctx.translate(-this.box.x, -this.box.y);
            this.ctx.beginPath();
            this.ctx.moveTo(this.v0[0], this.v0[1]);
            this.ctx.lineTo(this.v1[0], this.v1[1]);
            this.ctx.lineTo(this.v2[0], this.v2[1]);
            this.ctx.closePath();
            this.ctx.clip();
            this.ctx.drawImage(this.image, 0, 0, this.image.oriWidth, this.image.oriHeight, this.left, this.top, this.imageWidth, this.imageHeight);

            this.ctx.restore();
        }
    };


    /*==============================================*/
    /*===== Start point of animation  =====*/
    /*==============================================*/

    function reloadGlobalVariables() {

        containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
        containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

    }

    function stopCurrentAnimation(callback) {

        resetDataAnimation();
        isStop = true;

        if(isRunning) {
            var timeout = setTimeout(function(){
                clearTimeout(timeout);
                stopCurrentAnimation(callback);
            }, 200);
        } else {        
            isStop = false;

            if(callback)
                callback();
        }
    }


    var session = 0; // use to sure that there is only one running animation

    function startAnimation(currentSession) {

        stopCurrentAnimation(function() {

            if(!imageUrls || imageUrls.length == 0)
                return;

            (function(){

                if(session != currentSession)
                    return;

                var loaded = 0;

                var image = new Image();

                image.onload = function() {
                    loaded++;
                    for (var i = 1; i < imageUrls.length; i++) {
                        
                        var image = new Image();
                        image.onload = function() {
                            loaded++;
                            if(session == currentSession && loaded == imageUrls.length) {
                                imageIndex = 1;
                                placeImage();

                            }

                        }

                        image.src = imageUrls[i];
                        images[i] = image;
                    }

                    if(session == currentSession) {
                        placeImage(true);
                    }
                };

                image.src = imageUrls[0]; 
                images[0] = image;

            })();
        });
    
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {
        if(typeof BannerFlow !== "undefined"){
            isUseFeed = BannerFlow.settings.isUseFeed;
            animation = BannerFlow.settings.animation;

            if(animation.toLowerCase() == ANIMATION_BREAK.toLowerCase())
                useBreakAnimation = true;
            else
                useBreakAnimation = false;

            if(!isUseFeed) {

                imageUrls = getImages(BannerFlow.settings.images, true);

            }

            duration = BannerFlow.settings.duration > 0 ? BannerFlow.settings.duration : 500;
            backgroundSize = BannerFlow.settings.backgroundSize;

        } else {
            // Test data for local
            imageUrls = [];
            imageUrls.push("http://www.hdwallpapers.in/walls/corona_del_mar_newport_beach-wide.jpg");
            imageUrls.push("http://www.hdwallpapers.in/walls/emma_stone_vogue_2016-wide.jpg");
            imageUrls.push("http://www.hdwallpapers.in/walls/space_orcus_4k-wide.jpg");
            imageUrls.push("http://www.hdwallpapers.in/walls/the_legend_of_tarzan_alexander_skarsgard_margot_robbie-HD.jpg");
            imageUrls.push("http://www.hdwallpapers.in/walls/lykan_hypersport_hypercar-wide.jpg");
            imageUrls.push("http://www.hdwallpapers.in/walls/zoe_saldana_star_trek_beyond-wide.jpg");
            backgroundSize = BACKGROUND_COVER;
        }

        if(backgroundSize.toLowerCase() == BACKGROUND_CONTAIN.toLowerCase())
            isBackgroundContain = true;
        else
            isBackgroundContain = false;
    }
  
    /*====================================================*/  

    function init() {
        loadSettings();
        reloadGlobalVariables();

        if(!containerWidth || !containerHeight)
            return;

        if(!imageUrls || imageUrls.length == 0){
            if(typeof BannerFlow != "undefined" && BannerFlow.editorMode)
                textWarning.style.display = "block";
        }
        else
            textWarning.style.display = "none";

        startAnimation(++session);
    }

    var isStartAnimation = false;

    function onStart() {
        if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
            return;
        }

        isStartAnimation = true;
        loadSettings();
        getFeedData();
        init();
    }

    function onResize() {
        if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
            return;
        }

        onStart();
    }

    function resetParameter() {
        if(typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
            return;
        }

        onStart();
    }

    function textChanged() {
        if(typeof BannerFlow != "undefined" && BannerFlow.editorMode)
            onStart();
    }

    function getFeedData() {
        if(!isUseFeed)
            return;

        imageUrls = [];
        var selectedKey = BannerFlow.getStyle('feed-field');

        if(selectedKey && selectedKey.length > 0) {
            for(var i=0;i<BannerFlow.feed.length;i++){
                if(selectedKey === BannerFlow.feed[i].name) {
                    for(var j=0;j<BannerFlow.feed[i].values.length;j++){
                        imageUrls.push(BannerFlow.feed[i].values[j]);
                    }
                    break;
                }
            }
        }

        if(BannerFlow.editorMode) {
            var languageText = BannerFlow.text;
            if(languageText && languageText.indexOf("://") >= 0) {
                imageUrls.push(languageText);
            }
        }

    }


    return {
        start: onStart,

        onResized: onResize,

        onSettingChanged: resetParameter,

        onTextChanged: textChanged
    };
})();

if(typeof BannerFlow == "undefined"){
    DynamicImageTransitionWidget.start();
} else {
    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        DynamicImageTransitionWidget.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        DynamicImageTransitionWidget.onSettingChanged();
    });

    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        DynamicImageTransitionWidget.start();
    });

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        DynamicImageTransitionWidget.onTextChanged();
    });
}
