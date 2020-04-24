---
layout: post
title: "Parameters - extended"
date: 2020-02-05 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation template/stack Parameters
tags: [cloudformation, parameters, yml, json]
tips:
  - "AWS special params cannot be used for optional parameters"
  - "AWS special params may not be useful for when systems specify values, as they're more for user assistance"
skill: intermediate
---

When using parameters with your template, you're effectively creating placeholders for a user / service to provide the details when an operation is performed (`createStack` / `updateStack`)

1. [AWS Special Parameters](#aws-params)
2. [SSM Parameters](#ssm-params)
3. [Secrets Manager Parameters](#secrets-manager-params)

---

<a name = "aws-params"></a>
#### AWS Special Parameters

---

<a name = "ssm-params"></a>
#### SSM Parameters

---

<a name = "secrets-manager-params"></a>
#### Secrets Manager Parameters
