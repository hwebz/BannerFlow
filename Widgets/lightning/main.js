/*
 * A fast javascript implementation of simplex noise by Jonas Wagner
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 *
 *
 * Copyright (C) 2012 Jonas Wagner
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
(function () {
"use strict";

var F2 = 0.5 * (Math.sqrt(3.0) - 1.0),
    G2 = (3.0 - Math.sqrt(3.0)) / 6.0,
    F3 = 1.0 / 3.0,
    G3 = 1.0 / 6.0,
    F4 = (Math.sqrt(5.0) - 1.0) / 4.0,
    G4 = (5.0 - Math.sqrt(5.0)) / 20.0;


function SimplexNoise(random) {
    if (!random) random = Math.random;
    this.p = new Uint8Array(256);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (var i = 0; i < 256; i++) {
        this.p[i] = random() * 256;
    }
    for (i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
        this.permMod12[i] = this.perm[i] % 12;
    }

}
SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0,
                            - 1, 1, 0,
                            1, - 1, 0,

                            - 1, - 1, 0,
                            1, 0, 1,
                            - 1, 0, 1,

                            1, 0, - 1,
                            - 1, 0, - 1,
                            0, 1, 1,

                            0, - 1, 1,
                            0, 1, - 1,
                            0, - 1, - 1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, - 1, 0, 1, - 1, 1, 0, 1, - 1, - 1,
                            0, - 1, 1, 1, 0, - 1, 1, - 1, 0, - 1, - 1, 1, 0, - 1, - 1, - 1,
                            1, 0, 1, 1, 1, 0, 1, - 1, 1, 0, - 1, 1, 1, 0, - 1, - 1,
                            - 1, 0, 1, 1, - 1, 0, 1, - 1, - 1, 0, - 1, 1, - 1, 0, - 1, - 1,
                            1, 1, 0, 1, 1, 1, 0, - 1, 1, - 1, 0, 1, 1, - 1, 0, - 1,
                            - 1, 1, 0, 1, - 1, 1, 0, - 1, - 1, - 1, 0, 1, - 1, - 1, 0, - 1,
                            1, 1, 1, 0, 1, 1, - 1, 0, 1, - 1, 1, 0, 1, - 1, - 1, 0,
                            - 1, 1, 1, 0, - 1, 1, - 1, 0, - 1, - 1, 1, 0, - 1, - 1, - 1, 0]),
    noise2D: function (xin, yin) {
        var permMod12 = this.permMod12,
            perm = this.perm,
            grad3 = this.grad3;
        var n0=0, n1=0, n2=0; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin) * F2; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var t = (i + j) * G2;
        var X0 = i - t; // Unskew the cell origin back to (x,y) space
        var Y0 = j - t;
        var x0 = xin - X0; // The x,y distances from the cell origin
        var y0 = yin - Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        else {
            i1 = 0;
            j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        var y1 = y0 - j1 + G2;
        var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
        var y2 = y0 - 1.0 + 2.0 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        var ii = i & 255;
        var jj = j & 255;
        // Calculate the contribution from the three corners
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            var gi0 = permMod12[ii + perm[jj]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70.0 * (n0 + n1 + n2);
    },
    // 3D simplex noise
    noise3D: function (xin, yin, zin) {
        var permMod12 = this.permMod12,
            perm = this.perm,
            grad3 = this.grad3;
        var n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var t = (i + j + k) * G3;
        var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
        var Y0 = j - t;
        var Z0 = k - t;
        var x0 = xin - X0; // The x,y,z distances from the cell origin
        var y0 = yin - Y0;
        var z0 = zin - Z0;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } // X Y Z order
            else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } // X Z Y order
            else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } // Z X Y order
        }
        else { // x0<y0
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } // Z Y X order
            else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } // Y Z X order
            else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } // Y X Z order
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
        var y2 = y0 - j2 + 2.0 * G3;
        var z2 = z0 - k2 + 2.0 * G3;
        var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
        var y3 = y0 - 1.0 + 3.0 * G3;
        var z3 = z0 - 1.0 + 3.0 * G3;
        // Work out the hashed gradient indices of the four simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        // Calculate the contribution from the four corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
            var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
            var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
            var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
            var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
            t3 *= t3;
            n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to stay just inside [-1,1]
        return 32.0 * (n0 + n1 + n2 + n3);
    },
    // 4D simplex noise, better simplex rank ordering method 2012-03-09
    noise4D: function (x, y, z, w) {
        var permMod12 = this.permMod12,
            perm = this.perm,
            grad4 = this.grad4;

        var n0, n1, n2, n3, n4; // Noise contributions from the five corners
        // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
        var s = (x + y + z + w) * F4; // Factor for 4D skewing
        var i = Math.floor(x + s);
        var j = Math.floor(y + s);
        var k = Math.floor(z + s);
        var l = Math.floor(w + s);
        var t = (i + j + k + l) * G4; // Factor for 4D unskewing
        var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
        var Y0 = j - t;
        var Z0 = k - t;
        var W0 = l - t;
        var x0 = x - X0; // The x,y,z,w distances from the cell origin
        var y0 = y - Y0;
        var z0 = z - Z0;
        var w0 = w - W0;
        // For the 4D case, the simplex is a 4D shape I won't even try to describe.
        // To find out which of the 24 possible simplices we're in, we need to
        // determine the magnitude ordering of x0, y0, z0 and w0.
        // Six pair-wise comparisons are performed between each possible pair
        // of the four coordinates, and the results are used to rank the numbers.
        var rankx = 0;
        var ranky = 0;
        var rankz = 0;
        var rankw = 0;
        if (x0 > y0) rankx++;
        else ranky++;
        if (x0 > z0) rankx++;
        else rankz++;
        if (x0 > w0) rankx++;
        else rankw++;
        if (y0 > z0) ranky++;
        else rankz++;
        if (y0 > w0) ranky++;
        else rankw++;
        if (z0 > w0) rankz++;
        else rankw++;
        var i1, j1, k1, l1; // The integer offsets for the second simplex corner
        var i2, j2, k2, l2; // The integer offsets for the third simplex corner
        var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
        // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
        // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
        // impossible. Only the 24 indices which have non-zero entries make any sense.
        // We use a thresholding to set the coordinates in turn from the largest magnitude.
        // Rank 3 denotes the largest coordinate.
        i1 = rankx >= 3 ? 1 : 0;
        j1 = ranky >= 3 ? 1 : 0;
        k1 = rankz >= 3 ? 1 : 0;
        l1 = rankw >= 3 ? 1 : 0;
        // Rank 2 denotes the second largest coordinate.
        i2 = rankx >= 2 ? 1 : 0;
        j2 = ranky >= 2 ? 1 : 0;
        k2 = rankz >= 2 ? 1 : 0;
        l2 = rankw >= 2 ? 1 : 0;
        // Rank 1 denotes the second smallest coordinate.
        i3 = rankx >= 1 ? 1 : 0;
        j3 = ranky >= 1 ? 1 : 0;
        k3 = rankz >= 1 ? 1 : 0;
        l3 = rankw >= 1 ? 1 : 0;
        // The fifth corner has all coordinate offsets = 1, so no need to compute that.
        var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
        var y1 = y0 - j1 + G4;
        var z1 = z0 - k1 + G4;
        var w1 = w0 - l1 + G4;
        var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
        var y2 = y0 - j2 + 2.0 * G4;
        var z2 = z0 - k2 + 2.0 * G4;
        var w2 = w0 - l2 + 2.0 * G4;
        var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
        var y3 = y0 - j3 + 3.0 * G4;
        var z3 = z0 - k3 + 3.0 * G4;
        var w3 = w0 - l3 + 3.0 * G4;
        var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
        var y4 = y0 - 1.0 + 4.0 * G4;
        var z4 = z0 - 1.0 + 4.0 * G4;
        var w4 = w0 - 1.0 + 4.0 * G4;
        // Work out the hashed gradient indices of the five simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        var ll = l & 255;
        // Calculate the contribution from the five corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) n0 = 0.0;
        else {
            var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
            t0 *= t0;
            n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) n1 = 0.0;
        else {
            var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
            t1 *= t1;
            n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) n2 = 0.0;
        else {
            var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
            t2 *= t2;
            n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) n3 = 0.0;
        else {
            var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
            t3 *= t3;
            n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
        }
        var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        if (t4 < 0) n4 = 0.0;
        else {
            var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
            t4 *= t4;
            n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
        }
        // Sum up and scale the result to cover the range [-1,1]
        return 27.0 * (n0 + n1 + n2 + n3 + n4);
    }


};

window.SimplexNoise = SimplexNoise;

})();


/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/



window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

/*** Vector*/
function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.add = function(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
};

Vector.sub = function(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
};

Vector.prototype = {
    set: function(x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.x = x || 0;
        this.y = y || 0;
        return this;
    },

    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    scale: function(s) {
        this.x *= s;
        this.y *= s;
        return this;
    },

    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    normalize: function() {
        var len = Math.sqrt(this.x * this.x + this.y * this.y);
        if (len) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    },

    angle: function() {
        return Math.atan2(this.y, this.x);
    },

    distanceTo: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceToSq: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return dx * dx + dy * dy;
    },

    clone: function() {
        return new Vector(this.x, this.y);
    }
};

/*** Point*/
function Point(x, y, radius) {
    Vector.call(this, x, y);

    this.radius = radius || 7;

    this.vec = new Vector(random(1, -1), random(1, -1)).normalize();
    this._easeRadius    = this.radius;
    this._currentRadius = this.radius;
}

Point.prototype = (function(o) {
    var s = new Vector(0, 0), p;
    for (p in o) {
        s[p] = o[p];
    }
    return s;
})({
    color:       'rgb(255, 255, 255)',
    dragging:    false,
    _latestDrag: null,

    update: function(points, bounds, isStaticPoint) {
        this._currentRadius = random(this._easeRadius, this._easeRadius * 0.35);
        this._easeRadius += (this.radius - this._easeRadius) * 0.1;

        if (this.dragging) return;

        var vec = this.vec,
            i, len, p, d;

        for (i = 0, len = points.length; i < len; i++) {
            p = points[i];
            if (p !== this) {
                d = this.distanceToSq(p);
                if (d < 90000) {
                    vec.add(Vector.sub(this, p).normalize().scale(0.03));
                } else if (d > 250000) {
                    vec.add(Vector.sub(p, this).normalize().scale(0.015));
                }
            }
        }

        if (vec.length() > 3) vec.normalize().scale(3);

        if(!isStaticPoint)
            this.add(vec);

        if (this.x < bounds.x) {
            this.x = bounds.x;
            if (vec.x < 0) vec.x *= -1;

        } else if (this.x > bounds.right) {
            this.x = bounds.right;
            if (vec.x > 0) vec.x *= -1;
        }

        if (this.y < bounds.y) {
            this.y = bounds.y;
            if (vec.y < 0) vec.y *= -1;

        } else if (this.y > bounds.bottom) {
            this.y = bounds.bottom;
            if (vec.y > 0) vec.y *= -1;
        }
    },

    hitTest: function(p) {
        if (this.distanceToSq(p) < 900) {
            this._easeRadius = this.radius * 2.5;
            return true;
        }
        return false;
    },

    startDrag: function() {
        this.dragging = true;
        this.vec.set(0, 0);
        this._latestDrag = new Vector().set(this);
    },

    drag: function(p) {
        this._latestDrag.set(this);
        this.set(p);
    },

    endDrag: function() {
        this.vec = Vector.sub(this, this._latestDrag);
        this.dragging = false;
    },

    draw: function(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this._currentRadius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.shadowBlur  = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle   = 'rgba(0, 0, 0, 1)';
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this._currentRadius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
    }
});


/*** Lightning*/
function Lightning(startPoint, endPoint, step) {
    this.startPoint = startPoint || new Vector();
    this.endPoint   = endPoint || new Vector();
    this.step       = step || 45;

    this.children = [];
}

Lightning.prototype = {
    color:         'rgba(255, 255, 255, 1)',
    background:    '#0b5693',
    speed:         0.025,
    amplitude:     1,
    lineWidth:     5,
    blur :         50,
    blurColor:     'rgba(255, 255, 255, 0.5)',
    points:        null,
    off:           0,
    _simplexNoise: new SimplexNoise(),
    // Case by child
    parent:        null,
    startStep:     0,
    endStep:       0,

    length: function() {
        return this.startPoint.distanceTo(this.endPoint);
    },

    getChildNum: function() {
        return children.length;
    },

    setChildNum: function(num) {
        var children = this.children, child,
            i, len;

        len = this.children.length;

        if (len > num) {
            for (i = num; i < len; i++) {
                children[i].dispose();
            }
            children.splice(num, len - num);

        } else {
            for (i = len; i < num; i++) {
                child = new Lightning();
                child._setAsChild(this);
                children.push(child);
            }
        }
    },

    update: function() {
        var startPoint = this.startPoint,
            endPoint   = this.endPoint,
            length, normal, radian, sinv, cosv,
            points, off, waveWidth, n, av, ax, ay, bv, bx, by, m, x, y,
            children, child,
            i, len;

        if (this.parent) {
            if (this.endStep > this.parent.step) {
                this._updateStepsByParent();
            }

            startPoint.set(this.parent.points[this.startStep]);
            endPoint.set(this.parent.points[this.endStep]);
        }

        length = this.length();
        normal = Vector.sub(endPoint, startPoint).normalize().scale(length / this.step);
        radian = normal.angle();
        sinv   = Math.sin(radian);
        cosv   = Math.cos(radian);

        points    = this.points = [];
        off       = this.off += random(this.speed, this.speed * 0.2);
        waveWidth = (this.parent ? length * 1.5 : length) * this.amplitude;
        if (waveWidth > 750) waveWidth = 750;

        for (i = 0, len = this.step + 1; i < len; i++) {
            n = i / 60;
            av = waveWidth * this._noise(n - off, 0) * 0.5;
            ax = sinv * av;
            ay = cosv * av;

            bv = waveWidth * this._noise(n + off, 0) * 0.5;
            bx = sinv * bv;
            by = cosv * bv;

            m = Math.sin((Math.PI * (i / (len - 1))));

            x = startPoint.x + normal.x * i + (ax - bx) * m;
            y = startPoint.y + normal.y * i - (ay - by) * m;

            points.push(new Vector(x, y));
        }

        children = this.children;

        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            child.baseColor     = this.baseColor;
            child.color         = this.color;
            child.background    = this.background;
            child.speed         = this.speed * 1.35;
            child.amplitude     = this.amplitude;
            child.lineWidth     = this.lineWidth * 0.75;
            child.blur          = this.blur;
            child.blurColor     = this.blurColor;
            children[i].update();
        }
    },

    draw: function(ctx) {

        var points = this.points,
            children = this.children,
            i, len, p, d;

        var lineWidth = random(this.lineWidth, 0.5);

        // Blur
        if (this.blur) {

            var tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = lineWidth + this.blur;
            tmpCanvas.height = lineWidth + this.blur;
            var tmpCtx = tmpCanvas.getContext('2d');

            var radius = tmpCanvas.width/2;
            var grad = tmpCtx.createRadialGradient(tmpCanvas.width/2, tmpCanvas.height/2, 0, tmpCanvas.width/2, tmpCanvas.height/2, radius);
            grad.addColorStop(0, this.blurColor);
            grad.addColorStop(lineWidth/radius, this.blurColor);
            grad.addColorStop(1, 'rgba(' + this.baseColor.red + ', ' + this.baseColor.green + ', ' + this.baseColor.blue + ', 0)');

            tmpCtx.fillStyle = grad;
            tmpCtx.arc(tmpCanvas.width/2, tmpCanvas.height/2, radius, 0, 2 * Math.PI);
            tmpCtx.fill();

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (i = 0; i < points.length; i++) {
                ctx.drawImage(tmpCanvas, 0, 0, tmpCanvas.width, tmpCanvas.height, points[i].x - (tmpCanvas.width)/2, points[i].y - (tmpCanvas.height)/2, tmpCanvas.width, tmpCanvas.height);
            }
            ctx.restore();

        }
        
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        for (i = 0, len = points.length; i < len; i++) {
            p = points[i];
            ctx[(i === 0 ? "moveTo" : "lineTo")](p.x, p.y);
        }
        ctx.stroke();
        ctx.restore();

        // Draw children
        for (i = 0, len = this.children.length; i < len; i++) {
            if(children[i].startStep != children[i].endStep)
                children[i].draw(ctx);
        }
        
    },

    dispose: function() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }
        this._simplexNoise = null;
    },

    _noise: function(v) {
        var octaves = 6,
            fallout = 0.5,
            amp = 1, f = 1, sum = 0,
            i;

        for (i = 0; i < octaves; ++i) {
            amp *= fallout;
            sum += amp * (this._simplexNoise.noise2D(v * f, 0) + 1) * 0.5;
            f *= 2;
        }

        return sum;
    },

    _setAsChild: function(lightning) {
        if (!(lightning instanceof Lightning)) return;
        this.parent = lightning;

        var self = this,
            setTimer = function() {
                self._updateStepsByParent();
                self._timeoutId = setTimeout(setTimer, randint(1500));
            };

        self._timeoutId = setTimeout(setTimer, randint(1500));
    },

    _updateStepsByParent: function() {
        if (!this.parent) return;
        var parentStep = this.parent.step;
        this.startStep = randint(parentStep - 2);
        this.endStep   = this.startStep + randint(parentStep - this.startStep - 2) + 2;
        this.step = this.endStep - this.startStep;
    }
};


/*** Rect*/
function Rect(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width  = width || 0;
    this.height = height || 0;
    this.right  = this.x + this.width;
    this.bottom = this.y + this.height;
}


// Helpers

function random(max, min) {
    if (typeof max !== 'number') {
        return Math.random();
    } else if (typeof min !== 'number') {
        min = 0;
    }
    return Math.random() * (max - min) + min;
}


function randint(max, min) {
    if (!max) return 0;
    return random(max + 1, min) | 0;
}




var LightningWidget = (function(){

    // Vars

    var centerX, centerY, grad,
        mouse,
        bounds,
        points,
        lightning,
        control;

    var container = document.getElementById('lightningContainer');
    var canvas = document.getElementById('lightning');
    var context = canvas.getContext('2d');
    var containerWidth, containerHeight;

    
    function rgbaToObject(rgba) {
        var colorString = rgba,
        colorsOnly = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/);
        return {
            red: colorsOnly[0],
            green: colorsOnly[1],
            blue: colorsOnly[2],
            opacity: parseFloat(colorsOnly[3])
        };
    }

    function initWidget() {

        // default settings
        control = {
            childNum: 5,
            color: 'rgba(255,255,255,1)',
            backgroundColor: '#0b5693',
            speed: 0.025,
            amplitude: 1,
            lineWidth: 5,
            blur: 70,
            isStaticPoint: true,
            startPointX: 0,
            startPointY: 0,
            endPointX: 250,
            endPointY: 250
        };


        // parameters from setting
        if (typeof BannerFlow !== 'undefined') {
            
            control.childNum = BannerFlow.settings.numberChild > 0 ? BannerFlow.settings.numberChild : control.childNum;
            control.color = BannerFlow.settings.color;
            control.backgroundColor = BannerFlow.settings.backgroundColor;
            control.speed = BannerFlow.settings.speed > 0 ? BannerFlow.settings.speed/1000 : control.speed;
            control.amplitude = BannerFlow.settings.amplitude > 0 ? BannerFlow.settings.amplitude/10 : control.amplitude;
            control.lineWidth = BannerFlow.settings.lineWidth > 0 ? BannerFlow.settings.lineWidth : control.lineWidth;
            control.blur = BannerFlow.settings.blurWidth > 0 ? BannerFlow.settings.blurWidth : control.blur;
            control.isStaticPoint = !BannerFlow.settings.isMoving;
            control.startPointX = BannerFlow.settings.startPointX;
            control.startPointY = BannerFlow.settings.startPointY;
            control.endPointX = BannerFlow.settings.endPointX;
            control.endPointY = BannerFlow.settings.endPointY;
        }

        // Init
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        centerX = canvas.width * 0.5;
        centerY = canvas.height * 0.5;

        // grad = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.sqrt(centerX * centerX + centerY * centerY));
        // grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        // grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

        bounds = new Rect(0, 0, canvas.width, canvas.height);
        mouse  = new Vector();

        lightning = new Lightning();
        lightning.setChildNum(control.childNum);
        lightning.speed = control.speed;
        lightning.amplitude = control.amplitude;
        lightning.lineWidth = control.lineWidth;
        lightning.blur = control.blur;

        var objColor = rgbaToObject(control.color);
        lightning.baseColor = objColor;
        lightning.color = control.color;
        lightning.blurColor = 'rgba(' + objColor.red + ',' + objColor.green + ',' + objColor.blue + ',0.1)';

        if(!control.isStaticPoint)
            points = [
                new Point(centerX - 200, centerY, lightning.lineWidth * 1.25),
                new Point(centerX + 200, centerY, lightning.lineWidth * 1.25)
            ];
        else 
            points = [
                new Point(control.startPointX, control.startPointY, lightning.lineWidth * 1.25),
                new Point(control.endPointX, control.endPointY, lightning.lineWidth * 1.25)
            ];

        for (i = 0; i < points.length; i++) {
            points[i].color = lightning.color;
        }

        lightning.startPoint.set(points[0]);
        lightning.endPoint.set(points[points.length-1]);
    }

    var isStop = false;
    var isRunning = false;

    function playAnimation() {

        if(isStop) {
            isRunning = false;
            return;
        }

        isRunning = true;
        
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();

        lightning.startPoint.set(points[0]);
        lightning.endPoint.set(points[1]);
        lightning.step = Math.ceil(lightning.length() / 10);
        if (lightning.step < 5) lightning.step = 5;

        lightning.update();
        lightning.draw(context);

        var i, p;

        for (i = 0; i < 2; i++) {
            p = points[i];
            if (p.dragging) p.drag(mouse);
            p.update(points, bounds, control.isStaticPoint);
            p.draw(context);
        }

        requestAnimationFrame(playAnimation);
    }

    var timeoutStart;
    var sessionId = 0;

    function init() {
        if(timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function() {
                startAnimation(++sessionId);
            }, 500);
        } else {
            timeoutStart = setTimeout(function(){
                startAnimation(++sessionId);
            }, 0);
        }
    }

    function startAnimation(currentSesssion) {
        stopCurrentAnimation(function(){
            containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
            containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

            if(!containerWidth || !containerHeight)
                return;

            initWidget();
            playAnimation(currentSesssion);
        });
    }

    function stopCurrentAnimation(callback) {
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

    var isStartAnimation = false;

    function onStarted() {
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
        onStarted: onStarted,

        onResized: onResized,

        onSettingChanged: onSettingChanged
    };
})();

if (typeof BannerFlow == 'undefined') {
    LightningWidget.onStarted();
} else {
    BannerFlow.addEventListener(BannerFlow.INIT, function () {
        if(BannerFlow.imageGeneratorMode) { 
            document.body.setAttribute('style','display:none;');
        }
    });

    BannerFlow.addEventListener(BannerFlow.RESIZE, function () {
        LightningWidget.onResized();
    });

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function () {
        LightningWidget.onSettingChanged();
    });
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function() {
        LightningWidget.onStarted();
    });
}

