package main

import (
	"fmt"
	"math/rand/v2"
	"os"
	"os/signal"
	"producer/schema"
	"producer/services"
	"strconv"
	"syscall"
	"time"

	"github.com/hashicorp/go-uuid"
	"github.com/lovoo/goka"
)

func randomEvent() schema.SeismicEvent {
	id, _ := uuid.GenerateUUID()
	return schema.SeismicEvent{
		UUID:      id,
		Sensor:    "sensor-00" + strconv.Itoa(rand.IntN(3)),
		Latitude:  strconv.FormatFloat(rand.Float64()*float64(90), 'f', 2, 64) + "N",
		Longitude: strconv.FormatFloat(rand.Float64()*float64(180), 'f', 2, 64) + "W",
		Depth:     rand.Float32() * float32(20),
		Energy:    rand.Float32() * float32(10),
	}

}

func produce(topic goka.Stream, brokers []string, avroCodec *schema.AvroCodec) error {
	producer, err := goka.NewEmitter(brokers, topic, avroCodec)
	if err != nil {
		return fmt.Errorf("Error creating producer: %v\n", err)
	}
	defer producer.Finish()

	event := randomEvent()

	err = producer.EmitSync(event.Sensor, event)
	if err != nil {
		return fmt.Errorf("Error emitting message: %v\n", err)
	}

	return nil
}

func main() {
	var brokers = []string{"broker-1:19092", "broker-2:19092", "broker-3:19092"}
	var registryURL = "http://schema-registry:8081"
	var topic goka.Stream = "seismic-events"
	var subject = "seismic-events"

	services.SubscribeToTopic(topic, brokers)

	avroCodec := schema.NewAvroCodec(subject, registryURL)

	// Producer loop
	// ----------------------------------------------------
	sigchan := make(chan os.Signal, 1)
	signal.Notify(sigchan, syscall.SIGINT, syscall.SIGTERM)

loop:
	for {
		select {
		case <-sigchan:
			fmt.Println("🛑 Received shutdown signal. Exiting...")
			break loop
		default:
			produce(topic, brokers, avroCodec)
			time.Sleep(2 * time.Second)
		}
	}
}
