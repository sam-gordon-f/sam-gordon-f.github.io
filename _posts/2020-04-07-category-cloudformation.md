---
layout: post
title:  "Cloudformation"
categories: [category]
tags: [cloudformation]
---

#Cloudformation

{% for category in site.categories %}
  <ul>
    {% for post in category['cloudformation'] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
