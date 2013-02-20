// modified from http://stackoverflow.com/questions/4898203/jquery-focus-without-scroll
$.fn.focusWithoutScrolling = function(viewport){
  var x = viewport.scrollLeft(), y = viewport.scrollTop();
  this.focus();
  viewport.scrollTop(y);
  viewport.scrollLeft(x);
};