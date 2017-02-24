BannerFlow.addEventListener(BannerFlow.INIT, function () {
	var intensity = BannerFlow.settings.intensity,
        fallTime = BannerFlow.settings.fallTime,
        stacking = BannerFlow.settings.stacking,
        color = BannerFlow.settings.color,
        backgroundColor = BannerFlow.settings.backgroundColor;

    BannerFlow.addEventListener(BannerFlow.RESIZE, resize);

    function resize () {
        restart();
    }

    (function(ns) {
        ns = ns || window;

        function ParticleSystem(ctx, width, height, intensity, particles, drops) {
            this.particles = particles;
            this.drops = drops;
            this.intensity = intensity || 100;
            this.addParticle = function() {
                this.particles.push(new Snow(ctx, width));
            }
            while(this.intensity--) {
                this.addParticle();
            }
            this.render = function() {
                ctx.save();
                ctx.clearRect(0, 0, width, height)
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, width, height);
                for (var i = 0, particle; particle = this.particles[i]; i++) {
                    particle.render();
                }
                for (var i = 0, drop; drop = this.drops[i]; i++) {
                    ctx.globalAlpha = drop.alpha;
                    ctx.fillStyle = drop.color;
                    ctx.beginPath();
                    ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
            this.update = function() {
                for (var i = 0, particle; particle = this.particles[i]; i++) {
                    particle.x += particle.vx;
                    particle.y += particle.vy + fallTime;
                    if (particle.y > height-1) {
                        if (particle.explode) {
                            this.explosion(particle.x, particle.y, particle.color);
                            this.particles.splice(i--,1);
                            this.addParticle();
                        } else {
                            particle.vx = 0;
                            particle.vy = 0;
                            particle.y = height + (!stacking ? 10 : 0);
                            if (particle.killAt && particle.killAt < +new Date) this.particles.splice(i--,1);
                            else if ( ! particle.killAt) {
                                particle.killAt = +new Date + 5000;
                                this.addParticle();
                            }
                        }
                    }
                }
                for (var i = 0, drop; drop = this.drops[i]; i++) {
                    drop.x += drop.vx;
                    drop.y += drop.vy;
                    drop.radius -= 0.075;
                    if(i > 0) {
                        drop.alpha = 0;
                    }
                    else if (drop.alpha > 0) {
                        drop.alpha -= 0.005;
                    } else {
                        drop.alpha = 0;
                    }
                    if (drop.radius < 0) {
                        this.drops.splice(i--, 1);
                    }
                }
            }
            this.explosion = function(x, y, color, amount) {
                amount = amount || 15;
                while (amount--) {
                    this.drops.push(
                        {
                            vx: (Math.random() * 4-2	),
                            vy: (Math.random() * -4 ),
                            x: x,
                            y: y,
                            radius: 0.65 + Math.floor(Math.random() * 1.6),
                            alpha: 1,
                            color: color
                        })
                }
            }
        }

        function Snow(ctx,width) {
            this.vx = ((Math.random() - 0.5) * 5);
            this.vy = (Math.random() * 9) + 1;
            this.x = Math.floor((Math.random()*width));
            this.y = -Math.random() * 30;
            this.alpha = 1;
            this.radius = Math.random() * 4;
            this.color = color;
            this.render = function() {
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
            this.explode = false;
        }

        this.particles = [];
        this.drops = [];

        ns.precCanvas = function() {
            var canvas = document.getElementById('canvas');

            if (canvas == null){
                canvas = document.createElement('canvas');
                canvas.id = 'canvas';
                document.body.appendChild(canvas);
            }

            var ctx = canvas.getContext('2d');
            var width = BannerFlow.getWidth();
            var height = BannerFlow.getHeight();

            canvas.width = width;
            canvas.height = height;

            var particleSystem = new ParticleSystem(ctx, width, height, intensity, this.particles, this.drops);
            (function draw() {
                cancelAnimationFrame(draw);
                requestAnimationFrame(draw);
                particleSystem.update();
                particleSystem.render();
            })();
        }

        this.restarting = false;

        ns.restart = function() {

            if (!this.restarting){

                this.restarting = true;

                if (this.particles != null)
                    for (var i = 0; i < this.particles.length; i++){
                        delete this.particles[i];
                    }

                if (this.drops != null)
                    for (var i = 0; i < this.drops.length; i++){
                        delete this.drops[i];
                    }

                this.particles = [];
                this.drops = [];

                var canvas = document.getElementById('canvas');

                if (canvas != null)
                    document.body.removeChild(canvas);

                canvas = document.createElement('canvas');
                canvas.id = "canvas";
                canvas.width = BannerFlow.getWidth();
                canvas.height = BannerFlow.getHeight();

                document.body.appendChild(canvas);

                precCanvas();

                this.restarting = false;
            }
        }


    })(window);

	precCanvas();

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, reloadSettings);

    function reloadSettings(){

        if (intensity != BannerFlow.settings.intensity || fallTime != BannerFlow.settings.fallTime || stacking != BannerFlow.settings.stacking || color != BannerFlow.settings.color || backgroundColor != BannerFlow.settings.backgroundColor){
            intensity = BannerFlow.settings.intensity;
            fallTime = BannerFlow.settings.fallTime;
            stacking = BannerFlow.settings.stacking;
            color = BannerFlow.settings.color;
            backgroundColor = BannerFlow.settings.backgroundColor;

            restart();
        }
    }
});
