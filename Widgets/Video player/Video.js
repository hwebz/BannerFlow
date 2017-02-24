var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var video, volume, loop, autoplay, controls, muted, startTime, endTime, hfs, cfs;
var videoHolder = document.getElementById("video-holder")

BannerFlow.addEventListener(BannerFlow.INIT,function(){
    if(BannerFlow.imageGeneratorMode)document.getElementsByTagName("BODY")[0].style.display = "none";
    if(!BannerFlow.editorMode){
        //setParams();
    }
    if(!BannerFlow.editorMode)document.getElementById("no-value").style.display = "none";
})
BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, setParams);
BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, setParams);

function setParams(){
    if(BannerFlow.settings) {
        autoplay = BannerFlow.settings.autoplay;
        loop = BannerFlow.settings.loop;
        controls = BannerFlow.settings.controls;
        startTime = BannerFlow.settings.startTime;
        endTime = BannerFlow.settings.endTime;
        if(BannerFlow.settings.volume >= 0)volume = BannerFlow.settings.volume/100; if(BannerFlow.settings.volume >= 100) volume = 1;
        muted = BannerFlow.settings.muted;
        cfs = BannerFlow.settings.cfs;
        hfs = BannerFlow.settings.hfs;
    }

    volume = (getParameterByName('volume') !== null|undefined) ? parseInt(getParameterByName('volume'))/100 : volume;
    loop = (getParameterByName('loop') == "false") ? (loop == getParameterByName('loop')) : loop;
    startTime = parseInt(getParameterByName('start') || startTime || 0);
    endTime = (getParameterByName('end') !== null|undefined) ? parseInt(getParameterByName('end')) : parseInt(endTime);
    autoplay = (getParameterByName('autoplay') == "false") ? (autoplay == getParameterByName('autoplay')) : autoplay;
    controls = (getParameterByName('controls') == "false") ? (controls == getParameterByName('controls')) : controls;
    cfs = (getParameterByName('cfs') == "true") ? (cfs = true) : cfs;
    hfs = (getParameterByName('hfs') == "true") ? (hfs = true) : hfs;
    muted = (getParameterByName('muted') == "false") ? (muted == getParameterByName('muted')) : muted;

    updateVideo();
}
function updateVideo(){
    //Remove old video player
    while(document.getElementsByTagName("video").length > 0) {
        var element = document.getElementsByTagName("video")[0];
        element.pause();
        element.parentNode.removeChild(element);
    }
    if(BannerFlow.getText().indexOf("//") != -1 && BannerFlow.getText().indexOf(".") != -1) {
        document.getElementById("no-value").style.display = "none";
        var url = BannerFlow.getText().substring(0,BannerFlow.getText().lastIndexOf("."));
        video = document.createElement('video');
        var s1 = document.createElement("source");
        var s2 = document.createElement("source");
        if((volume % 1) > 0)muted = false;
        s1.setAttribute("type", "video/mp4");
        s2.setAttribute("type", "video/ogg");
        s1.setAttribute("src", url + ".mp4");
        s2.setAttribute("src", url + ".ogg");
        video.appendChild(s1);
        video.appendChild(s2);

        video.muted = muted;
        video.loop = loop;
        video.currentTime = startTime;

        if(BannerFlow.imageGeneratorMode || (BannerFlow.editorMode && autoplay)) {
            video.play()
        }

        if(((volume % 1) <= 1) && ((volume % 1) >= 0))video.volume = volume;
        video.controls = controls;
        document.getElementsByClassName('video-holder')[0].appendChild(video);
        video.addEventListener("timeupdate", function(){
            if(endTime >= 1 && this.currentTime >= endTime * 60 * 1000) {
                this.pause();
            }
        });
        video.addEventListener('ended',function() {
            if(loop)video.currentTime = startTime;
        })
        if(isMobile){
            var element = document.getElementsByTagName("video")[0];
            element.parentNode.removeChild(element);
        }
    }
    else{
        document.getElementById("no-value").style.display = "table-cell";
        document.getElementById("no-value").innerHTML = "<strong>Video player</strong>Double-click and enter the URL to a video."
    }
}
BannerFlow.addEventListener(BannerFlow.START_ANIMATION, function(){
    video.autoplay = false;
    if(video.readyState != 4) {
        video.autoplay = autoplay;
    }
    else if (autoplay) {
        video.currentTime = startTime;
        video.play()
    }
    if(cfs == true || hfs == true)video.volume = 0;
    /*if(video.readyState == 4 && video.loop == true){
        video.currentTime = startTime;
        video.play();
    }
    else if(video.readyState == 4 && video.loop == false){
        video.pause();
    }
    if(autoplay) {
        video.play();
    }*/
});
var vol = false;
document.addEventListener("click", function(){
    if(cfs == true){
        if(vol == false){
            video.volume = volume
            vol = true
        }
        else{
            video.volume = 0
            vol = false;
        }
    }
});
document.addEventListener("mouseover", function(){
    if(hfs == true){
        video.volume = volume
    }
});
document.addEventListener("mouseout", function(){
    if(cfs == true || hfs == true)video.volume = 0;
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(BannerFlow.getText().replace(/&amp;/g, '&'));
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
