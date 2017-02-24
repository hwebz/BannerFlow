
Animation = (function(){
	return function Animation(text, duration, animation, isLoop, textContainer, containerWidth, containerHeight){

		var _animationType = "bounceInUp"; // default
		var _animationDurationALetter = 500; // default

		var _animationDuration = 2000; // changed from out site
		var _delayAnimation = 50; // changed by length of text and _animationDuration
		var _minimumDelayAnimation = 10;
		var _isLoop = false;

		this.text = text;
		_animationDuration = duration;
		_animationType = animation;

		if(isLoop){
			_isLoop = true;
		}

		var splitText = function(text){
			var words = text.split(' ');
			var outputHtml = "<span class='words-wrapper'>";

			for(var i=0;i<words.length; i++){
				outputHtml += "<span class='word"+(i+1)+" word'>";
				for(var j=0;j<words[i].length;j++){
					outputHtml += "<span class='letter"+(j+1)+" letter'>" + words[i][j] + "</span>";
				}
				outputHtml += "</span>";
			}

			outputHtml += "</span>";
			textContainer.html(outputHtml);
		};

		var calculateAnimationParameters = function(){
			var words = text.split(' ');
			var numberLetter = 0;
			for(var i = 0; i < words.length; i++){
				numberLetter += words[i].length;
			}
			
			var lastDelay = _animationDuration - _animationDurationALetter;
			_delayAnimation = numberLetter > 1 ? lastDelay / (numberLetter - 1) : _delayAnimation;
			if(_delayAnimation < _minimumDelayAnimation){
				_delayAnimation = _minimumDelayAnimation;
			}
		};

		this.prepare = function(){
			splitText(this.text);
			calculateAnimationParameters();
		}

		this.start = function(){
			var _self = this;
			var allLetters = textContainer.find('.letter');
			for(var i=0; i < allLetters.length; i++){
				(function(letter, index, allLetters){
					var timeoutOuter = setTimeout(function(){
						clearTimeout(timeoutOuter);

						var isEnd = false;
						var isStart = false;

						letter.on('animationstart animationstart webkitAnimationStart oanimationstart MSAnimationStart', function(){
							if(!isStart){
								isStart = true;
								$(this).css({
									'visibility': 'visible'
								});
							}
							letter.off('animationstart animationstart webkitAnimationStart oanimationstart MSAnimationStart');
						});

						letter.on('oanimationend animationend webkitAnimationEnd', function() { 
							if(!isEnd){
								isEnd = true;
								$(this).removeClass(_animationType);
							}

							letter.off('oanimationend animationend webkitAnimationEnd');

							if(index >= allLetters.length - 1 && _isLoop){
								var timeout = setTimeout(function(){
									clearTimeout(timeout);
									allLetters.css({
										'visibility': 'hidden'
									});

									_self.start();
								}, 2000);
							}
						});

	    				letter.css({
	    					'-webkit-animation-duration': _animationDurationALetter+'ms',
	    					'-moz-animation-duration': _animationDurationALetter+'ms',
	    					'-o-animation-duration': _animationDurationALetter+'ms',
						    'animation-duration': _animationDurationALetter+'ms'
	    				});
						letter.addClass(_animationType);
					}, i * _delayAnimation);
				})(allLetters.eq(i), i, allLetters);
			}
		}

		this.prepare();
	};
})();