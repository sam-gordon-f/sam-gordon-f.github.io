var arrayA = ["A."];
var arrayW = ["Whimsical.", "Wasted.", "Wistful."];
var arrayS = ["Screename."];

var rotateBrand = function(index) {
  var indexTemp = index;

    // loop logic
  if(arrayW.length == indexTemp)
    indexTemp = 0;
  
  $(".spanW").fadeOut(1000, function() {
    $(".spanW").text(arrayW[indexTemp]).fadeIn(1000, function() {
      setTimeout(function() {
        rotateBrand((indexTemp += 1));
      }, 10000);
    });
  });
}

$(document).ready(function() {

    // change the fancybox overlays so they dont clash
  jQuery.extend(jQuery.fancybox.defaults, {
    overlayColor: 'white'
  });

    // rotate the main banner
  setTimeout(function() {
    rotateBrand(0)
  }, 10000);

    // create pretty back to top animations
  $(".btnBackToTop").click(function(){
      $("html, body").animate({ scrollTop: 0 }, 500);
      return false;
  });
});
