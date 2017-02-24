
//Youtube variables
var tag = document.getElementById("youtube-script");//document.createElement('script');
//tag.src = "https://www.youtube.com/iframe_api";
var ytid;
var youtubeUrl;
var player;
var endInterval;
var isPlaying = false;

//Youtube player parameters
var controls, loop, autoplay, volume, startTime, endTime, cfs, hfs;

var stopPlayTimer;
var loops = 0;

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

BannerFlow.addEventListener(BannerFlow.INIT, function(){
    if(BannerFlow.imageGeneratorMode)document.getElementById("player").style.display = "none";
});

BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function(){
    if(BannerFlow.editorMode)document.getElementById("no-value").style.display = "table-cell";
    if(cfs == false)document.getElementById("overlay").style.display = "none";
    youtubeUrl = BannerFlow.getText().toString();
    setParams();
});
BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, setParams)
function setParams(){
    autoplay = BannerFlow.settings.autoplay;
    loop = (BannerFlow.settings.loop == true) ? 1 : 0 ;
    controls = (BannerFlow.settings.controls == true) ? 1 : 0;
    startTime = (BannerFlow.settings.startTime == 0) ? null : BannerFlow.settings.startTime;
    endTime = (BannerFlow.settings.endTime == 0) ? null : BannerFlow.settings.endTime;
    if(BannerFlow.settings.volume >= 0)volume = BannerFlow.settings.volume; if(BannerFlow.settings.volume >= 100) volume = 100;
    cfs = BannerFlow.settings.cfs;
    hfs = BannerFlow.settings.hfs;
    hideOnMobile = BannerFlow.settings.hideOnMobile;

    autoplay = (getParameterByName('autoplay') == "false") ? (autoplay = 0) : autoplay;
    controls = (getParameterByName('controls') == "false") ? (controls = 0) : controls;
    loop = (getParameterByName('loop') == "false") ? (loop = 0) : loop;
    startTime = (getParameterByName('start') !== null|undefined) ? parseInt(getParameterByName('start')) : parseInt(startTime);
    endTime = (getParameterByName('end') !== null|undefined) ? parseInt(getParameterByName('end')) : parseInt(endTime);
    volume = (getParameterByName('volume') !== null|undefined) ? parseInt(getParameterByName('volume')) : volume;
    cfs = (getParameterByName('cfs') == "true") ? (cfs = true) : cfs;
    hfs = (getParameterByName('hfs') == "true") ? (hfs = true) : hfs;

    if(BannerFlow.editorMode) {
        volume = 0;
        if(BannerFlow.editorMode) {
            onYouTubeIframeAPIReady();
        }
    }
    updateVideo();
}
function updateVideo(){
    if(BannerFlow.editorMode) document.getElementById("no-value").style.display = "table-cell";
    if(youtubeUrl && (youtubeUrl.indexOf("//") != -1 || youtubeUrl.indexOf("www") != -1)) {
        document.getElementById("player").style.opacity = 1;
        if(youtubeUrl.indexOf("youtu.be") != -1){
            ytid = youtubeUrl.split("/");
            ytid = ytid[ytid.length - 1];
            ytid = ytid.split(/[\&?\s]/)[0];
        }
        else{
            if(youtubeUrl.indexOf("v=") != -1){
                ytid = youtubeUrl.split("v=")[1];
                ytid = ytid.split(/[\&?\s]/)[0];
            }
        }
        if(controls) document.getElementById("overlay").style.display = "none";
        //onPlayerReady(event);
    }
    else {
        document.getElementById("player").style.opacity = 0;
        document.getElementById("no-value").innerHTML = "<strong>Youtube player</strong>Double-click and enter a Youtube URL.";
        if(youtubeUrl)
            onError();
    }
    if(isMobile || BannerFlow.imageGeneratorMode){
        if(hideOnMobile)
            document.getElementsByTagName("BODY")[0].style.display = "none";
        else
            document.getElementsByTagName("BODY")[0].innerHTML = '<img src="http://img.youtube.com/vi/'+ytid+'/maxresdefault.jpg" style="width:100%"/>';
    }
}

//Initiates and Loads the YouTube API for Iframes
function onYouTubeIframeAPIReady(e) {
    if(!YT) return;
    if(player) {
        try {
            player.removeEventListener('onReady', onPlayerReady)
            player.removeEventListener('onError', onError)
            player.removeEventListener('onStateChange', onStateChange)
            player.destroy();
            player = null;
        } catch (e) {}
    }
    //if(!player) {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: ytid,
        playerVars: {'modestbranding':1,'showinfo':0,'controls':controls,'html5': 1,'rel': 0,'iv_load_policy':3},
        events: {
            'onReady': onPlayerReady,
            'onError': onError,
            'onStateChange': onStateChange
        }
    });
    //}
}
function onError(){
    document.getElementById("no-value").innerHTML = "<strong>Youtube player</strong>Please enter a valid Youtube URL.";
    document.getElementById("player").style.opacity = 0;
}
//Loads and starts the video
function onPlayerReady(event) {
    if(!player) return;
    //player = event.target;

    //player.setLoop(loop ? true : false);
    if(player.setVolume)
    	player.setVolume(cfs ? 0 : volume);

    if(ytid) {
        if(autoplay)
        	player.loadVideoById({'videoId': ytid});
        else
            player.cueVideoById({'videoId': ytid});
    }

    if(!isPlaying)
    	player.pauseVideo();
}

BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function(){
    isPlaying = true;
    if(player) {
        player.seekTo(startTime);
        if(autoplay)
            player.playVideo();
        else
            player.pauseVideo();
    }
});

//Animation in banner ended
BannerFlow.addEventListener(BannerFlow.END_ANIMATION, function(){
    isPlaying = false;
    if(player)
        player.pauseVideo();
});

//Player state changed
function onStateChange(event){
    if(!player) return;
    var state = event.data;
    //var time, rate, remainingTime;
    if(state == 0) { //Ended
        loops++
        if(loop) {
        	player.seekTo(startTime);
        }
    }
    if(state == -1 && loops > 0)player.seekTo(startTime); //Unstarted
    if(state == 1){ //Playing
        if(!endTime) endTime = event.target.B.duration;
        if(endInterval) clearInterval(endInterval)

        endInterval = setInterval(function(){
            var time = player.getCurrentTime();
            if (time > endTime) {
                //rate = player.getPlaybackRate();
                //remainingTime = (startTime - time) / rate;
                if(loop)
                	player.seekTo(startTime)
                else
                    player.pauseVideo();
            }
        }, 300);
    }
    if(loops == 0)
        player.setVolume(cfs ? 0 : volume);


    return event;
}

//Get query-parameters
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(BannerFlow.getText().replace(/&amp;/g, '&'));
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var vol = false, playing = false;

//Sound on click
document.getElementById("overlay").onclick = function (){
    if(cfs){
        vol = !vol;
        if(player) {
            player.setVolume(vol ? volume : 0)
        }
    }
}
