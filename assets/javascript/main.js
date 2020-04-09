var arrayA = ["A"]
var arrayW = ["whimsical", "wasted", "wistful"]
var arrayS = ["screename"]

var rotateBrand = function(index) {
    // reset index if at end
  if(arrayW.length == index)
    index = 0;

  var textWTemp = arrayW[index];
  
  $("#h1HeadingMain").fadeOut(1000).text(textWTemp).fadeIn(1000)
  setTimeout(scrollHeader(index++), 5000);
}

$(document).ready(function() {
    // rotate the main banner
  rotateBrand(0);
});
