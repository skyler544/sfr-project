package schema

type SeismicEvent struct {
	UUID      string  `avro:"uuid"`
	Sensor    string  `avro:"sensor"`
	Latitude  string  `avro:"latitude"`
	Longitude string  `avro:"longitude"`
	Depth     float32 `avro:"depth"`
	Energy    float32 `avro:"energy"`
}

type AggregatedSeismicEvent struct {
	Sensor string         `json:"sensor"`
	Events []SeismicEvent `json:"events"`
}
