var arrayA = ["A."];
var arrayW = ["Whimsical.", "Wasted.", "Wistful."];
var arrayS = ["Screename."];

var rotateBrand = function(index) {
  // var textWTemp = textWPrevious = "";
  //
  //   // loop logic
  // if(arrayW.length == index) {
  //   indexTemp = 0;
  //   textWPrevious = arrayW[(arrayW.length - 1)]
  //
  // } else {
  //   indexTemp = index;
  //   textWPrevious = arrayW[indexTemp - 1)]
  // }
  // textWTemp = arrayW[index];
  //
  // $("#h1HeadingMain").fadeOut(1000).text(textWTemp).fadeIn(1000)
  // setTimeout(rotateBrand(indexTemp++), 5000);
}

$(document).ready(function() {
    // rotate the main banner
  rotateBrand(0);
});
