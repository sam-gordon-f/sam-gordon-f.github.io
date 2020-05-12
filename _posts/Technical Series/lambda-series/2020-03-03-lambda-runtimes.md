---
layout: post
title: "Runtimes"
date: 2020-03-03 08:44:38
category: [technical-series, lambda-series]
author: samGordon
short-description: information on available lamnda runtimes
tags: [lambda, runtime]
skill: beginner
---

##### Different native supported runtimes (version inspecific)
1. [NodeJS](#nodejs)
  a. [Example](#nodejs-example)
  b. [Dependencies](#nodejs-depencies)
  c. [Build instructions](#nodejs-build)
2. [Python](#python)
  a. [Example](#python-example)
  b. [Build instructions](#python-build)
3. Golang
  a. [Example](#go-example)
  b. [Build instructions](#go-build)

##### NodeJS

<a name = "nodejs-example"></a>
Example

./index.js
```javascript
  // sample module include
require('cfn-response')

  // code entry point
exports.handler = (event, context, callback) => {
  
    // code return point
  callback(null, {
    status: true
  });
};
```

<br>

<a name = "nodejs-build"></a>
Dependencies

```sh
# start project
npm init
# will generate a skeleton like the following that you can add to (like i have with the dependencies)
```

./package.json
```json
{
  "name": "lambda-nodejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "print 'test'"
  },
  "author": "sam gordon",
  "license": "ISC",
  "packages": {
    "cfn-response": "1.0.1"
  }
}
```

<br>

<a name = "nodejs-build"></a>
Build

```
npm install
npm build
zip -r function.zip index.js node_modules
```

##### Python

<a name = "python-example"></a>
Example

./index.py
```python
  # sample import
import PyYAML

def my_handler(event, context):
    message = 'hello world'    
    return {
        'message' : message
    }  
```

<br>

<a name = "python-dependencies"></a>
Dependencies

./requirements.txt
```sh
PyYAML
```

<a name = "python-build"></a>
Build

```sh
pip install -r requirements.txt --target=./site-packages
zip -r function.zip index.py site-packages
```

##### Go

<a name = "go-example"></a>
Example

```go
package main

import (
  "fmt"
  "context"
  "github.com/aws/aws-lambda-go/lambda"
)

type MyEvent struct {
  Name string `json:"name"`
}

func Handler(ctx context.Context, name MyEvent) (string, error) {
  return fmt.Sprintf("Hello %s!", name.Name ), nil
}

func main() {
  lambda.Start(Handler)
}
```

<br>

<a name = "go-build"></a>
Code

```sh
go get github.com/aws/aws-lambda-go/lambda
GOOS=linux go build main.go
zip function.zip main
```
