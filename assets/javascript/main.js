var arrayA = ["A."];
var arrayW = ["Whimsical.", "Wasted.", "Wistful."];
var arrayS = ["Screename."];

var rotateBrand = function(index) {
  var indexTemp = index;

    // loop logic
  if(arrayW.length == indexTemp)
    indexTemp = 0;
  
  setTimeout(function() {
    $("#spanW").fadeOut(1000, function() {
      $("#spanW").text(arrayW[indexTemp], function() {
        $("#spanW").fadeIn(1000);
        rotateBrand((indexTemp += 1));
      })
    });
  }, 10000);
}

$(document).ready(function() {
    // rotate the main banner
  rotateBrand(0);
});
