FROM golang:alpine

WORKDIR /app
COPY . .

RUN go build -o persistence .
CMD ["./persistence"]
