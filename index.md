## Welcome to my thought collection / map

![blog map](media/images/blog-map.jpg "blog map")

{% for category in site.categories %}
  <h3>{{ category['category-landing'] }}</h3>
  <ul>
    {% for post in category['category-landing'] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
