## Welcome to my thought collection / map

![blog map](media/images/blog-map.jpg "blog map")

{% for category in site.categories %}
  <h3>{{ category['categoryLanding'] }}</h3>
  <ul>
    {% for post in category['categoryLanding'] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
