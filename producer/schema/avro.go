package schema

import (
	"fmt"
	"log"

	"github.com/hamba/avro/v2"
)

type AvroCodec struct {
	schema avro.Schema
}

func NewAvroCodec(subject, registryURL string) *AvroCodec {
	schema, err := RetrieveOrRegisterSchema(subject, registryURL)
	if err != nil {
		log.Fatalf("Failed to parse Avro schema: %v\n", err)
	}
	return &AvroCodec{schema: schema}
}

func (c *AvroCodec) Encode(message any) ([]byte, error) {
	encodedData, err := avro.Marshal(c.schema, message)
	if err != nil {
		return nil, fmt.Errorf("Unable to encode message: %v\n", err)
	}
	return encodedData, err
}

func (c *AvroCodec) Decode(messageData []byte) (any, error) {
	decodedData := SeismicEvent{}
	err := avro.Unmarshal(c.schema, messageData, &decodedData)
	return decodedData, err
}
