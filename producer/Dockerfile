FROM golang:alpine

WORKDIR /app
COPY . .

RUN go build -o producer .
CMD ["./producer"]
