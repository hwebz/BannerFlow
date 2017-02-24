App = (function(App){

	return $.extend(App, {
		init: function(){
			var wrapper = $('.banner-wrapper').eq(0);
			var textObject = $('.animate-item').eq(0);
			
			var textPara = Utils.getUrlParameter('text');
			var durationPara = Utils.getUrlParameter('duration');
			var animation = Utils.getUrlParameter('animation');
			var loop = Utils.getUrlParameter('loop');

			if(!textPara || textPara.trim().length == 0){
				textPara = textObject.html();
			}

			if(!durationPara || isNaN(durationPara)) {
				durationPara = 2000;
			} else {
				durationPara = parseInt(durationPara);
				if(durationPara <= 0)
					durationPara = 2000;
			}

			if(!animation){
				animation = "fadeInLeftBig";
			}

			if(!loop){
				loop = false;
			}
			else if(!isNaN(loop)){
				loop = parseInt(loop);
				if(loop == 0){
					loop = false;
				}
				else{
					loop = true;	
				}
			}

			var animationObject = new Animation(textPara.trim(), durationPara, animation, loop, textObject, wrapper.width(), wrapper.height());

			animationObject.start();
		}
	});
})(window.App || {});



$(document).ready(function(){
	App.init();
});

