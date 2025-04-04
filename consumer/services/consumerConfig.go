package services

import (
	"consumer/schema"
	"encoding/json"
	"fmt"
	"log"

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

func ConfigureConsumer(topic goka.Stream, group goka.Group, brokers []string, tmc *goka.TopicManagerConfig, avroCodec *schema.AvroCodec) (*goka.Processor, error) {
	cb := func(ctx goka.Context, msg any) {
		event, _ := msg.(schema.SeismicEvent)

		// Retrieve previous events from stream
		var events schema.AggregatedSeismicEvent
		if val := ctx.Value(); val != nil {
			previousEvents, ok := val.(schema.AggregatedSeismicEvent)
			if ok {
				events = previousEvents
			}
		}

		events.Sensor = event.Sensor
		events.Events = append(events.Events, event)
		ctx.SetValue(events)
		ctx.Emit(goka.Stream("seismic-events-aggregated"), event.Sensor, events)
		log.Printf("Aggregated: id=%v, total events=%v\n", event.Sensor, len(events.Events))
	}

	consumerGroup := goka.DefineGroup(
		group,
		goka.Input(topic, avroCodec, cb),
		goka.Persist(new(JSONCodec)),
		goka.Output(goka.Stream("seismic-events-aggregated"), new(JSONCodec)),
	)

	consumer, err := goka.NewProcessor(
		brokers,
		consumerGroup,
		goka.WithTopicManagerBuilder(goka.TopicManagerBuilderWithTopicManagerConfig(tmc)),
		goka.WithConsumerGroupBuilder(goka.DefaultConsumerGroupBuilder),
	)

	return consumer, err
}
