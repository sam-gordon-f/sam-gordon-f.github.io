# Remember to build your handler executable for Linux!
go get github.com/aws/aws-lambda-go/lambda
GOOS=linux go build main.go
zip function.zip main
