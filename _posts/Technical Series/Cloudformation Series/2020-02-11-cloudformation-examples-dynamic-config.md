---
layout: post
title: Examples - Dynamic Config Store
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: create / reference a custom config store in your cloudformation
tags: [cloudformation, lambda, macro, config]
prevPost:
  text: "Macros - Custom"
  link: "/technical-series/cloudformation-series/cloudformation-macros-custom"
prevPost:
  text: "Examples - Identity Provider"
  link: "/technical-series/cloudformation-series/cloudformation-examples-identity-provider"
skill: expert
---

1. [Lambda code (nodejs) - Advertises the config](#javascript)
2. [Template1 - template that creates / references the custom config](#template1)

---

<a name = "javascript"></a>
##### Lambda code - nodejs (Advertises the custom config)

```javascript
exports.handler = (event, context, callback) => {
  var fragment = event.fragment;

};
```

---

<a name = "template1"></a>
##### template1 (template that creates / references the custom config)

```json

```
```yml
---

```
