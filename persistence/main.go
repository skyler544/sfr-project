package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"persistence/db"
	"persistence/schema"
	"syscall"

	"github.com/lovoo/goka"
)

type JSONCodec struct{}

func (c *JSONCodec) Encode(value any) ([]byte, error) {
	data, err := json.Marshal(value)
	if err != nil {
		return nil, fmt.Errorf("Error encoding JSON: %w", err)
	}
	return data, nil
}

func (c *JSONCodec) Decode(data []byte) (any, error) {
	var events schema.AggregatedSeismicEvent
	err := json.Unmarshal(data, &events)
	if err != nil {
		return nil, fmt.Errorf("Error decoding JSON: %w", err)
	}
	return events, nil
}

func consumeAndPersist(db *sql.DB) {
	brokers := []string{"broker-1:19092", "broker-2:19092", "broker-3:19092"}
	topic := goka.Stream("seismic-events-aggregated")
	group := goka.Group("mysql-writer-group")

	cb := func(ctx goka.Context, msg any) {
		agg, ok := msg.(schema.AggregatedSeismicEvent)
		if !ok {
			log.Printf("Invalid message type: %T\n", msg)
			return
		}

		// Insert sensor (ignore if already exists)
		_, err := db.Exec("INSERT IGNORE INTO sensors (sensor) VALUES (?)", agg.Sensor)
		if err != nil {
			log.Printf("failed to insert sensor %s: %v", agg.Sensor, err)
			return
		}

		// Insert each seismic event
		for _, e := range agg.Events {
			_, err := db.Exec(`
				INSERT IGNORE INTO sensor_data (UUID, sensor, Latitude, Longitude, Depth, Energy)
				VALUES (?, ?, ?, ?, ?, ?)`,
				e.UUID, agg.Sensor, e.Latitude, e.Longitude, e.Depth, e.Energy,
			)
			if err != nil {
				log.Printf("failed to insert event %s: %v", e.UUID, err)
			}
		}

		log.Printf("Persisted %d events for sensor %s", len(agg.Events), agg.Sensor)
	}

	// Define Goka processor
	groupGraph := goka.DefineGroup(
		group,
		goka.Input(topic, new(JSONCodec), cb),
	)

	processor, err := goka.NewProcessor(
		brokers,
		groupGraph,
	)
	if err != nil {
		log.Fatalf("failed to create goka processor: %v", err)
	}

	// Run the processor with signal handling
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		if err := processor.Run(ctx); err != nil {
			log.Fatalf("processor error: %v", err)
		}
	}()

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	<-sigs
	cancel()
}

func main() {
	dsn := "root:root@tcp(mysql:3306)/"
	db, err := db.InitMySQLSchema(dsn)
	if err != nil {
		log.Fatalf("DB init failed: %v", err)
	}
	defer db.Close()

	consumeAndPersist(db)
}
