//var canvas = document.getElementById('fireflies');
//var ctx = canvas.getContext('2d');
var stack;
var particles;
var w;
var h;
var sketch;
var particleCount;
var size;


var init = function () {
    w = BannerFlow.getWidth();
    h = BannerFlow.getHeight();
    size = Math.max(BannerFlow.settings.size, 1) || 1;
    stack = [];
    particles = [];

    if(sketch) sketch.destroy();

    //number of particles
    particleCount = BannerFlow.settings.count || 30;

    settings = {
        interval: 2,
        setup: function() {
            var i = particleCount;
            while(i--) {
                var p = new Particle(random(0, this.width),random(0, this.height));
                particles.push(p);
                p.update(this);
                p.draw(this);
            }
        },
        update: function() {
            var i = particleCount;
            while(i--) {
                particles[i].update(this);
            }
        },
        draw: function() {
            var i = particleCount;
            while(i--) {
                particles[i].draw(this);
            }
        }
    }
    sketch = Sketch.create(settings);

    if(BannerFlow.imageGeneratorMode) sketch.stop();
}

var Particle = function(x,y) {
    this.x = x;
    this.y = y;
    //size of particles
    this.radius = random(0.5 * size, 1.5 * size);
    //colors red,green,blue,transparancy
    this.rgba = 'rgba(255,255,255,'+random(.1,.8)+')';
    //changes speed of particle
    this.vx = random(-.5,.5);
    this.vy = random(-.5,.5);
    // Draw our particle to the canvas.
    this.draw = function(ctx) {
        ctx.fillStyle = this.rgba;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,TWO_PI);
        ctx.fill();
    };
    // Update our position.
    this.update = function(ctx) {
        this.x += this.vx;
        this.y += this.vy;
        // Bounce off edges.
        if(this.x + this.radius > ctx.width) {
            this.vx *= -1;
            this.x = ctx.width - this.radius;
        }
        if(this.x - this.radius < 0) {
            this.vx *= -1;
            this.x = this.radius;
        }
        if(this.y + this.radius > ctx.height) {
            this.vy *= -1;
            this.y = ctx.height - this.radius;
        }
        if(this.y - this.radius < 0) {
            this.vy *= -1;
            this.y = this.radius;
        }
    }
};

BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, init);
