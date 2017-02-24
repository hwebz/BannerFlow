window.onload = function() {

    var image = document.getElementById('image');
    var url;
    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        url = BannerFlow.getText();
        setImage();
    });
    function setImage(){
        if(BannerFlow.editorMode)document.getElementById("image").style.display = "table-cell";
        try{
            if(BannerFlow.getText().length > 2 && BannerFlow.getText().indexOf('//') != -1){
                document.getElementById('image').style.backgroundImage = 'url('+url+')';
                document.getElementById('image').style.display = 'block';
                document.getElementById('no-image').style.display = 'none';
            }
            else {
                document.getElementById('image').style.backgroundImage = '';
                document.getElementById('image').style.display = 'none';
                if(BannerFlow.editorMode) {
                	document.getElementById('no-image').style.display = 'block';
                }
            }
        }catch(e){}
    }
    BannerFlow.addEventListener(BannerFlow.STYLE_CHANGED, function () {

        if(!BannerFlow.getStyle("backgroundSize"))image.style.backgroundSize = "";
        if(!BannerFlow.getStyle("backgroundRepeatx"))image.style.backgroundRepeat = "";
        if(!BannerFlow.getStyle("backgroundPosition"))image.style.backgroundPosition = "";

        if(BannerFlow.getStyle("backgroundSize") == "100% 100%")
            image.style.backgroundSize = "contain";
        else
            image.style.backgroundSize = BannerFlow.getStyle("backgroundSize");

        var bgrepx = BannerFlow.getStyle("backgroundRepeatx");
        var bgrepy = BannerFlow.getStyle("backgroundRepeaty");

        if(BannerFlow.getStyle("backgroundRepeatx")){
            if(bgrepx.indexOf("repeat") == 0 && bgrepy.indexOf("repeat") != 0)
            {
                image.style.backgroundRepeat = "repeat-x";
            }
            else if(bgrepy.indexOf("repeat") == 0 && bgrepx.indexOf("repeat") != 0)
            {
                image.style.backgroundRepeat = "repeat-y";
            }
            else if(bgrepx == "repeat" && bgrepy == "repeat"){
                image.style.backgroundRepeat = "repeat";
            }
            else{
                image.style.backgroundRepeat = "no-repeat";
            }
        }
        else{
            image.style.backgroundRepeat = "no-repeat";
        }

        var bgpos = BannerFlow.getStyle("backgroundPositionx") + " " + BannerFlow.getStyle("backgroundPositiony");
        image.style.backgroundPosition = bgpos;
        image.style.borderRadius = BannerFlow.getStyle("borderbottomleftradius");

    });
};
