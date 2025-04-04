package services

import (
	"fmt"
	"time"

	"github.com/lovoo/goka"
)

func connectToBrokers(brokers []string) (goka.TopicManager, error) {
	tmc := goka.NewTopicManagerConfig()
	var tm goka.TopicManager
	var err error

	for range 10 {
		tm, err = goka.NewTopicManager(brokers, goka.DefaultConfig(), tmc)
		if err == nil {
			return tm, nil
		}

		time.Sleep(3 * time.Second)
	}

	return tm, err
}

func SubscribeToTopic(topic goka.Stream, brokers []string) error {
	tm, err := connectToBrokers(brokers)
	if err != nil {
		return fmt.Errorf("Unable to connect to kafka: %v\n", err)
	}
	defer tm.Close()

	_ = tm.EnsureStreamExists(string(topic), 8)
	return err
}
