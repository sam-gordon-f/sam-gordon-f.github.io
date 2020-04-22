---
layout: post
title: Guide test
date: 2020-01-01 08:44:38
category: social-series
author: samGordon
short-description: guide test
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.js"></script>
<script type = "text/javascript" src = "{{ site.baseurl }}/assets/javascript/jquery.tour.js"></script>

<script type = "text/javascript">
  $(document).ready(function() {
    var tour = {
      autoStart: false,
      data : [
          { element : '#panel-1', tooltip : 'This is the first panel', text: 'With an standard lorem ipsum', position: 'T' },
          { element : '#panel-2', tooltip : 'This is the second panel', text: 'Same as panel 1', position: 'T' },
          { element: '.download', tooltip : 'Download some files', text: 'This option has 2 files', files: [{ url : 'https://github.com/alvaroveliz/aSimpleTour/archive/1.0.6.zip', name : 'v1.0.6' }, { url : 'https://github.com/alvaroveliz/aSimpleTour/archive/1.0.5.zip', name : 'v1.0.5' }, { url : 'https://github.com/alvaroveliz/aSimpleTour/archive/1.0.4.zip', name : 'v1.0.4' }] },
          { element : '#panel-3', tooltip : 'This is the last panel', text: 'Now, we are getting close to the next button', position: 'T' },
          { element : '#next-3', tooltip : 'And…what if we click here?', text: 'We are leaving this page into a new page', position: 'R', location: 'next.html#tour=2' }
      ],
      welcomeMessage: 'Welcome to the Demo #1',
      controlsPosition : 'TR',
      buttons: {
          next  : { text : 'Next &rarr;', class : 'btn btn-default'},
          prev  : { text : '&larr; Previous', class: 'btn btn-default' },
          start : { text : 'Start', class: 'btn btn-primary' },
          end   : { text : 'End', class: 'btn btn-primary' }
      },
      controlsCss: {
          background: 'rgba(124, 124, 124, 0.9)',
          color: '#fff',
          width: '400px',
          'border-radius': 0
      }
    };

    $(document).ready(function(){
      $('#btnGuide').on('click', function(){
        $.aSimpleTour(tour);
      });
    });
  })  	
</script>

<input type = "button" value = "start guide" id = "btnGuide">

<div id = "divGuideStep1" style = "background:orange;">
  Some testing content
</div>

<div id = "divGuideStep2" style = "background:green; color:white">
  Some testing content 2
</div>
