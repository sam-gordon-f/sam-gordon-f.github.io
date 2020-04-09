var arrayA = ["A."];
var arrayW = ["Whimsical.", "Wasted.", "Wistful."];
var arrayS = ["Screename."];

var rotateBrand = function(index) {
  
    // loop logic
  if(arrayW.length == index)
    indexTemp = 0;
  
  $("#spanW").fadeOut(1000).text(arrayW[index]).fadeIn(1000)
  setTimeout(rotateBrand(indexTemp++), 10000);
}

$(document).ready(function() {
    // rotate the main banner
  rotateBrand(0);
});
