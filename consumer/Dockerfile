FROM golang:alpine

WORKDIR /app
COPY . .

RUN go build -o consumer .
CMD ["./consumer"]
