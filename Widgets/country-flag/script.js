function updateFlag() {
	var flagCode = BannerFlow.settings.flagCode;
    var flagSet = BannerFlow.settings.flagSet == "Flat Design" ? 0 : 1;
    var countryFlag = document.getElementById('country-flag');
    var flagURL = "http://bannerflow.blob.core.windows.net/bf-content/Flags/128/"+flagCode.toLowerCase()+".png";
    var countryCodeAutoDetection = BannerFlow.languageCulture != undefined ? BannerFlow.languageCulture.split('-')[0] : false;

    if (BannerFlow.settings.isAutoDetection && countryCodeAutoDetection && countryCodeAutoDetection != "gb") {
        switch (flagSet) {
            case 0:
                flagURL = "http://bannerflow.blob.core.windows.net/bf-content/Flags/128/"+countryCodeAutoDetection.toLowerCase()+".png";
                break;
            case 1:
                flagURL = "http://bannerflow.blob.core.windows.net/bf-content/flags-glossy/128/"+countryCodeAutoDetection.toLowerCase()+".png";
                break;
        }
    } else {
        switch (flagSet) {
            case 0:
                flagURL = "http://bannerflow.blob.core.windows.net/bf-content/Flags/128/"+flagCode.toLowerCase()+".png";
                break;
            case 1:
                flagURL = "http://bannerflow.blob.core.windows.net/bf-content/flags-glossy/128/"+flagCode.toLowerCase()+".png";
                break;
        }
    }
    countryFlag.style.backgroundImage = 'url('+flagURL+')';
}
BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateFlag);

BannerFlow.addEventListener(BannerFlow.INIT, updateFlag);