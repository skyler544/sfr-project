package services

import (
	"fmt"
	"time"

	"github.com/lovoo/goka"
)

func connectToBrokers(brokers []string) (goka.TopicManager, *goka.TopicManagerConfig, error) {
	tmc := goka.NewTopicManagerConfig()
	var tm goka.TopicManager
	var err error

	for range 10 {
		tm, err = goka.NewTopicManager(brokers, goka.DefaultConfig(), tmc)
		if err == nil {
			return tm, tmc, nil
		}

		time.Sleep(3 * time.Second)
	}

	return tm, nil, err
}

func ConfigureTopicManager(topic goka.Stream, brokers []string) (*goka.TopicManagerConfig, error) {
	tm, tmc, err := connectToBrokers(brokers)
	if err != nil {
		return nil, fmt.Errorf("Unable to connect to kafka: %v\n", err)
	}
	defer tm.Close()

	err = tm.EnsureStreamExists(string(topic), 8)
	if err != nil {
		return nil, fmt.Errorf("Error creating kafka topic %s: %v\n", topic, err)
	}

	err = tm.EnsureStreamExists(string("seismic-events-aggregated"), 8)
	if err != nil {
		return nil, fmt.Errorf("Error creating kafka topic %s: %v\n", topic, err)
	}

	return tmc, err
}
