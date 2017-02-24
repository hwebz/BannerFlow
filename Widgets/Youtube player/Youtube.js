
//Youtube variables
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var ytid;
var youtubeUrl;

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
    if(cfs == false)document.getElementById("overlay").style.display = "none"; url = BannerFlow.getText();
    youtubeUrl = BannerFlow.getText();
    setParams();
});
BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, setParams)
function setParams(){
    autoplay = BannerFlow.settings.autoplay;
    loop = (BannerFlow.settings.loop == "true") ? 1 : 0 ;
    controls = (BannerFlow.settings.controls == "true") ? 1 : 0;
    startTime = (BannerFlow.settings.startTime == 0) ? null : BannerFlow.settings.startTime;
    endTime = (BannerFlow.settings.endTime == 0) ? null : BannerFlow.settings.endTime;
    if(BannerFlow.settings.volume >= 0)volume = BannerFlow.settings.volume; if(BannerFlow.settings.volume >= 100) volume = 100;
    cfs = BannerFlow.settings.cfs;
    hfs = BannerFlow.settings.hfs;

    autoplay = (getParameterByName('autoplay') == "false") ? (autoplay = 0) : autoplay;
    controls = (getParameterByName('controls') == "false") ? (controls = 0) : controls;
    loop = (getParameterByName('loop') == "false") ? (loop = 0) : loop;
    startTime = (getParameterByName('start') !== null|undefined) ? parseInt(getParameterByName('start')) : parseInt(startTime);
    endTime = (getParameterByName('end') !== null|undefined) ? parseInt(getParameterByName('end')) : parseInt(endTime);
    volume = (getParameterByName('volume') !== null|undefined) ? parseInt(getParameterByName('volume')) : volume;
    cfs = (getParameterByName('cfs') == "true") ? (cfs = true) : cfs;
    hfs = (getParameterByName('hfs') == "true") ? (hfs = true) : hfs;
    console.log(autoplay, loop, controls, startTime, endTime, volume)
    updateVideo();
}
function updateVideo(){
    if(BannerFlow.editorMode)document.getElementById("no-value").style.display = "table-cell";
    if(BannerFlow.getText().indexOf("//") != -1 || BannerFlow.getText().indexOf("www") != -1) {
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
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
        onPlayerReady(event);
    }
    else {
        document.getElementById("player").style.opacity = 0;
        document.getElementById("no-value").innerHTML = "<strong>Youtube player</strong>Double-click and enter a Youtube URL.";
        if(BannerFlow.getText() >= 1)
            onError();
    }
    if(isMobile || BannerFlow.imageGeneratorMode){
        document.getElementsByTagName("BODY")[0].innerHTML = '<img src="http://img.youtube.com/vi/'+ytid+'/maxresdefault.jpg" style="width:100%"/>'
    }
}

//Initiates and Loads the YouTube API for Iframes
function onYouTubeIframeAPIReady() {
    if(BannerFlow.getText().indexOf("//") != -1) {
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
    }
}
function onError(){
    document.getElementById("no-value").innerHTML = "<strong>Youtube player</strong>Please enter a valid Youtube URL.";
    document.getElementById("player").style.opacity = 0;
}
//Loads and starts the video
function onPlayerReady(event) {
    try{
        if(autoplay==1)
            player.loadVideoById({'videoId': ytid});
        document.getElementById("msg").innerHTML = "";
        if(loop==1)
            event.target.setLoop(true);
        if(cfs == true)player.setVolume(0); else player.setVolume(volume)
        BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function(){
            player.seekTo(startTime)
        });
    }catch(e){}
}
function onStateChange(event){
    var state = event.data;
    var time, rate, remainingTime;
    console.log(event.data)
    if(event.data == -1 || event.data == 1 || event.data == 3){
        player.seekTo(startTime);
        if(endTime == null || endTime == 0)endTime = event.target.B.duration
        var t = setInterval(function(){
            if (event.data == YT.PlayerState.PLAYING) {
                time = player.getCurrentTime();
                if (time + .4 >= endTime) {
                    rate = player.getPlaybackRate();
                    remainingTime = (startTime - time) / rate;
                    clearInterval(t)
                    player.seekTo(startTime)
                }
            }
        }, 1000);
    }
    /*if(loop == 1 && state == 0){
        player.loadVideoById({'videoId': ytid, 'startSeconds': startTime, 'endSeconds': endTime});
    }*/
    if(cfs == true)player.setVolume(0); else player.setVolume(volume);
    BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function(){
        player.seekTo(startTime)
    });
    return event;
}
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(BannerFlow.getText().replace(/&amp;/g, '&'));
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var vol = false;
document.getElementById("overlay").onclick=function(){
    if(cfs == true){
        if(vol == false){
            player.setVolume(volume)
            vol = true
        }
        else{
            player.setVolume(0)
            vol = false;
        }
    }
}
