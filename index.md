## Welcome to GitHub Pages

![blog map](media/images/blog-map.jpg "blog map")
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
