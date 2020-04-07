---
layout: post
title:  "Serverless Functions"
categories: [category]
tags: [serverless, functions, lambda]
---

#Serverless Functions

{% for category in site.categories %}
  <ul>
    {% for post in category['serverlessFunctions'] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
