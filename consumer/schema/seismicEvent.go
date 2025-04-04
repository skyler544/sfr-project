package schema

const SeismicEventSchema = `{
	"type": "record",
	"name": "SeismicEvent",
	"fields": [
		{ "name": "uuid", "type": "string" },
		{ "name": "sensor", "type": "string" },
		{ "name": "latitude", "type": "string" },
		{ "name": "longitude", "type": "string" },
		{ "name": "depth", "type": "float" },
		{ "name": "energy", "type": "float" }
	]
}`

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
