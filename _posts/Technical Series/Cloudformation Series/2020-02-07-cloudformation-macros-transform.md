---
layout: post
title: Macro - Transform
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Lambda transforms for cloudformation templates
tags: [cloudformation, transform, lambda, macro]
---

<div class="card official-docs">
  <div class="card-body">
    <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html">AWS docs on cloudformation Transforms</a>
  </div>
</div>

Cloudformation Transforms are a way to define lambda backed functionality to run against your cloudformation templates. They can be used to model all sorts of crazy scenarios, and remove the previous imposed limits.

They can be defined at a header level (which will run against the entirity of your template),<br>
or<br>
they can be defined at specific points within your template.
<br><br>
example 1 - defined at heading level
example 2 - defined at specific point

<div class="container grid-xl">
  <div class="columns">
    <div class = "column col-3 col-md-4 col-sm-12 col-xs-12">
      <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-custom-resources">Custom Resources</a>
    </div>
    <div class = "column col-6 col-md-4 col-sm-12 col-xs-12">
      
    </div>
    <div class="column col-3 col-md-4 col-sm-12 col-xs-12">
      <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros-transform-include">Macros - Transform - Include</a>
    </div>
  </div>
</div>
