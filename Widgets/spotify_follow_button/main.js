
(function() {

  /******************************************/
  
  var BannerFlow = {
    settings: {
        spotifyFollowURI: 'spotify:artist:1vCWHaC5f2uS3yhpwWbIA6',
        spotifyFollowTheme: true,
        spotifyAlbumLayout: true
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
      var my_iframe = document.getElementById('spotify-follow-button');
      var URI = "https://embed.spotify.com/follow/1/?uri=" + BannerFlow.settings.spotifyFollowURI;
      var theme = BannerFlow.settings.spotifyFollowTheme;
      var layout = BannerFlow.settings.spotifyAlbumLayout;
      var my_param, my_value;
      
      // change Spotify Album, Playlist URI
      my_iframe.src = URI;
      
      // change Theme
      my_param = 'theme';
      my_value = theme ? 'dark' : 'light';
      replace_param(my_iframe, my_param, my_value);
      
      // change View
      my_param = 'size';
      my_value = layout ? 'basic' : 'detail';
      replace_param(my_iframe, my_param, my_value);
      if (my_value == 'basic') {
          my_iframe.width = 200;
          my_iframe.height = 25;
      } else {
          my_iframe.width = 300;
          my_iframe.height = 65;
      }
  }

  updateParams();
})();