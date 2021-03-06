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
  b. [Handler](#nodejs-handler)
  b. [Dependencies](#nodejs-depencies)
  c. [Build / Package](#nodejs-build-package)
2. [Python](#python)
  a. [Example](#python-example)
  b. [Dependencies](#python-dependencies)
  c. [Build / Package](#python-build-package)
3. [Golang](#golang)
  a. [Example](#go-example)
  b. [Build / Package](#go-build-package)
4. [Ruby](#ruby)
  a. [Example](#ruby-example)
  b. [Dependencies](#ruby-dependencies)
  c. [Build / Package](#ruby-build-package)
4. [Java](#java)
  a. [Example(s)](#java-example)
    i. maven
    ii. gradle
  b. [Dependencies](#java-dependencies)
    i. maven
    ii. gradle
  c. [Build / Package](#java-build-package)
    i. maven
    ii. gradle

---

#### NodeJS

<a name = "nodejs-example"></a>
##### Example Code

(./index.js)
```javascript
  // sample module include
require('cfn-response')

  // code entry point (handler)
exports.handler = (event, context, callback) => {
  
    // code return point
  callback(null, {
    status: true
  });
};
```

<a name = "nodejs-handler"></a>
##### Handler

```sh
# <<fileName.handlerName>>
index.handler
```

<a name = "nodejs-dependencies"></a>
##### Dependencies

(./package.json - generated by running `npm init` where you want your project to be created)
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

<a name = "nodejs-build-package"></a>
##### Build / Package

```
npm install
zip -r function.zip index.js node_modules
```

<br>

#### Python

<a name = "python-example"></a>
##### Example Code

(./index.py)
```python
  # sample module include
import cfnresponse

  # code entry point (handler)
def handler(event, context):
  message = 'hello world'    
  return {
    'message' : message
  }  
```

<a name = "python-handler"></a>
##### Handler

```sh
# <<fileName.handlerName>>
index.handler
```

<a name = "python-dependencies"></a>
##### Dependencies

(./requirements.txt)
```sh
cfnresponse
```

<a name = "python-build-package"></a>
##### Build / Package

```sh
pip install -r requirements.txt --target=./site-packages
zip -r function.zip index.py site-packages
```

<br>

<a name = "golang"></a>
#### Go

<a name = "go-example"></a>
##### Example Code

(./handler.go)
```go
package main

  // sample module imports
import (
  "fmt"
  "context"
  "github.com/aws/aws-lambda-go/lambda"
)

  // lambda event struct
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

<a name = "go-handler"></a>
##### Handler

```sh
# <<binaryName>>
handler
```

<a name = "go-build"></a>
##### Build / Package

```sh
go get github.com/aws/aws-lambda-go/lambda
GOOS=linux go build handler.go
zip function.zip handler
```

<br>

#### Ruby

<a name = "ruby-example"></a>
##### Example Code

(./index.rb)
```ruby
  # sample module include
require 'cfn_response'

  # code entry point (handler)
def handler(event:, context:)

    # code return
  { event: JSON.generate(event), context: JSON.generate(context.inspect) }
end
```
(./source.rb)
```ruby
  # sample module include
require 'cfn_response'

module LambdaFunctions
  class Handler
    def self.process(event:,context:)
      "Hello!"
    end
  end
end
```

<a name = "ruby-handler"></a>
##### Handler

```sh
# <<fileName.handlerName>
index.handler
```
or
```sh
# <<fileName.moduleName::className.'process'>>
source.LambdaFunctions::Handler.process
```

<a name = "ruby-dependencies"></a>
##### Dependencies

(./Gemfile)
```sh
cfn_response
```

<a name = "ruby-build-package"></a>
##### Build / Package

```sh
bundle install --path vendor/bundle
zip -r function.zip index.rb vendor/bundle
```
