$(document).ready(function() {
    // rotate the main banner
  for(var i = 0; i < 5; i++) {
    console.log('switching')

    $("#h1HeadingMain").fadeOut(400).delay(1000).fadeIn(400)
  }
});
