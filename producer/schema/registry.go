package schema

import (
	"context"
	"fmt"
	"time"

	"github.com/hamba/avro/v2"
	"github.com/hamba/avro/v2/registry"
)

func connectToSchemaRegistry(registryURL string) (*registry.Client, error) {
	var client *registry.Client
	var err error

	for range 10 {
		client, err = registry.NewClient(registryURL)
		if err == nil {
			return client, nil
		}

		time.Sleep(3 * time.Second)
	}
	return nil, err
}

func RetrieveOrRegisterSchema(subject, registryURL string) (avro.Schema, error) {

	client, err := connectToSchemaRegistry(registryURL)
	if err != nil {
		return nil, fmt.Errorf("Unable to contact schema registry: %v\n", err)
	}

	_, schema, err := client.IsRegistered(context.Background(), subject, SeismicEventSchema)
	if err != nil {
		_, schema, err = client.CreateSchema(context.Background(), subject, SeismicEventSchema)
		if err != nil {
			return nil, fmt.Errorf("Unable to create schema: %v\n", err)
		}
	}

	return schema, err
}
