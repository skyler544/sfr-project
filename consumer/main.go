package main

import (
	"consumer/schema"
	"consumer/services"
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/lovoo/goka"
)

func consume(consumer *goka.Processor) {
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan struct{})
	go func() {
		defer close(done)
		if err := consumer.Run(ctx); err != nil {
			log.Printf("Error running consumer: %v\n", err)
		}
	}()

	sigs := make(chan os.Signal, 1)
	go func() {
		signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM, syscall.SIGKILL)
	}()

	select {
	case <-sigs:
	case <-done:
	}
	cancel()
	<-done
}

func main() {
	var brokers = []string{"broker-1:19092", "broker-2:19092", "broker-3:19092"}
	var registryURL = "http://schema-registry:8081"
	var topic goka.Stream = "seismic-events"
	var group goka.Group = "seismic-group"
	var subject = "seismic-events"

	tmc, err := services.ConfigureTopicManager(topic, brokers)
	if err != nil {
		log.Fatalf("Unable to connect to kafka: %v\n", err)
	}

	avroCodec := schema.NewAvroCodec(subject, registryURL)

	consumer, err := services.ConfigureConsumer(topic, group, brokers, tmc, avroCodec)
	if err != nil {
		log.Fatalf("Unable to configure consumer: %v\n", err)
	}

	consume(consumer)
}
