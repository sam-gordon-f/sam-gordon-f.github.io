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
          { element : '#divGuideStep1', tooltip : 'This is the first panel', text: 'With an standard lorem ipsum', position: 'T' },
          { element : '#divGuideStep2', tooltip : 'This is the second panel', text: 'Same as panel 1', position: 'T' }
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

    $('#btnGuide').on('click', function(){
      $.aSimpleTour(tour);
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
