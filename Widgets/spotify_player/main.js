
(function() {

  /******************************************/
  
  var BannerFlow = {
    settings: {
        spotifyAlbumURI: 'spotify%3Aalbum%3A2rp5riHULWgrXPsDtsp1ir',
        spotifyAlbumTheme: true,
        spotifyAlbumView: true
      }
  };

  /******************************************/

  function replace_param(iframe, param, value) {
    var iframe_src = iframe.src;

    if (!iframe_src.match(/\?/)) {
      return;
    }
    var iframe_src_array = iframe_src.split('?');
    var base_url = iframe_src_array[0];
    var param_array = iframe_src_array[1].split('&');
    var param_count = param_array.length;

    var proxy_array = [];
    if (param_count) {
      for (var i = 0; i < param_count; i++) {
        if (!param_array[i].match(param + '=')) {
          proxy_array.push(param_array[i]);
        }
      }
    }
    if (proxy_array.length) {
      iframe.src = base_url + '?' + proxy_array.join('&') + '&' + param + '=' + value;
    }
    else {
      iframe.src = base_url + '?' + param + '=' + value;
    }
  }

  function updateParams() {
      var my_iframe = document.getElementById('spotify-album-playlist');
      var URI = "https://embed.spotify.com/?uri=" + BannerFlow.settings.spotifyAlbumURI;
      var theme = BannerFlow.settings.spotifyAlbumTheme;
      var view = BannerFlow.settings.spotifyAlbumView;
      var my_param, my_value;
      
      // change Spotify Album, Playlist URI
      my_iframe.src = URI;
      
      // change Theme
      my_param = 'theme';
      my_value = theme ? 'dark' : 'white';
      replace_param(my_iframe, my_param, my_value);
      
      // change View
      my_param = 'view';
      my_value = view ? 'list' : 'coverart';
      replace_param(my_iframe, my_param, my_value);
  }


  updateParams();
})();