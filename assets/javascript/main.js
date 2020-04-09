var rotateBrand = function(index) {
  $("#h1HeadingMain").fadeOut(1000).text('test').fadeIn(1000)
  setTimeout(scrollHeader(0), 5000);
}

$(document).ready(function() {
    // rotate the main banner
  rotateBrand(0);
});
