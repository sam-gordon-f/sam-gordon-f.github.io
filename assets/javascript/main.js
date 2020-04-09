$(document).ready(function() {
  // rotate the main banner
  
  while(true) {
    $("#h1HeadingMain")
      .fadeOut(400)
      .delay(1000)
      .fadeIn(function() {
        console.log('switched')
      })
  }
});
