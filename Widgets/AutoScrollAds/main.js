function setStyleCss3(object, key, value) {
  object.style['-webkit-'+ key] = value;
  object.style['-moz-'+key] = value;
  object.style['-ms-'+key] = value;
  object.style[key] = value;
}
document.addEventListener("scroll",function(e){
  var scrollTop       = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
  var scrollBottom    = scrollTop + window.innerHeight;
  // com.onScroll(e); 
  $(".auto-scroll").each(function(index,element){
    var transition    = +(element.style.cssText.match(/\d+/g) || [0])[0];
    var height        = +element.offsetHeight;
    if (scrollBottom > transition+height) transition = scrollBottom - height;
    if (scrollTop < transition) transition = scrollTop;
    setStyleCss3(element,"transform","translateY("+transition+"px)");
  });
});