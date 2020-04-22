---
layout: post
title: Overview
date: 2020-01-01 08:44:38
category: social-series
author: samGordon
short-description: Brief summary of what to expect in the social series
---
<script type = "text/javascript">
  $(document).ready(function() {
    $("#btnGuide").click(function() {
      
      var guide = $.guide({
        actions: [
          {
            element: $('#btnGuide'),
            content: '<p>Welcome, click on the screen at any position to enter the next step</p>',
            offsetX: -140,
            offsetY: 60
          },
          {
            element: $('#divGuideStep1'),
            content: '<p>How to using...</p>',
            offsetX: -140,
            offsetY: 0,
            beforeFunc: function(g) {
              $('#divGuideStep1').fadeIn();
            }
          },
          {
            element: $('#divGuideStep2'),
            content: '<p>Click here to access the project for Github</p>',
            offsetX: 0,
            offsetY: 50,
            isBeforeFuncExec: true,
            beforeFunc: function(g) {
              $('#divGuideStep1').fadeOut();
              $('#divGuideStep2').fadeIn();
            }
          }
        ]
      });

    })
  })  	
</script>

<button id = "btnGuide">start guide test<button>

<div id = "divGuideStep1" style = "display:none;">
  Some testing content
</div>

<div id = "divGuideStep2" style = "display:none;">
  Some testing content 2
</div>
