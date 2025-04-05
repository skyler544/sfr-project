# Seismic Event Stream Processing (Go + Goka)

This project implements an event streaming pipeline for seismic sensor data using [Goka](https://github.com/lovoo/goka) — a Go library for building real-time data processing applications with Apache Kafka and Schema Registry integration.

## 🧱 Architecture

The system consists of:

- **`producer/`** – Continuously emits simulated seismic events to Kafka (`seismic-events` topic).
- **`consumer/`** – Aggregates events by sensor ID and publishes them to a new Kafka topic (`seismic-events-aggregated`).
- **`persistence/`** - Consume the aggregated events and populate a `mysql` database with the events from the stream.
- **`docker-compose.yml`** – Sets up Kafka brokers, Schema Registry, and microservice orchestration.

## 📊 Stream Design

```
seismic-events (input stream)
        |
        ▼
     [consumer]
        |
        ▼
seismic-events-aggregated (output stream)
        |
        ▼
     [persistence]
```

- The **`producer`** generates events resembling earthquake sensor readings.
- The **`consumer`** groups these events by `sensorid`, appending each new event to a per-sensor list.
- The aggregated result is emitted to a separate Kafka topic.

## ⚙️ Horizontal Scalability

The `consumer` service is **horizontally scalable** and runs **3 replicas** by default.

- Goka automatically distributes Kafka topic partitions across consumer instances.
- When a consumer goes down, Goka **rebalances** the group and assigns its workload to the remaining consumers.
- Kafka ensures **each event is only processed once** by one instance in the group.

> Example behavior: If there are only 3 sensors sending data, Kafka may assign 2 consumers all the work while the third stays idle. Stopping one of the active consumers triggers a rebalance, and the idle one picks up the load.

## 🚀 Why Go + Goka?

- **Go** is fast, simple, and widely used in cloud-native ecosystems.
- **Goka** abstracts away Kafka boilerplate and provides:
  - State storage
  - Group coordination
  - Automatic partition assignment
- **Docker Compose** was chosen for local orchestration due to its simplicity and ease of setup.

## 🛠️ Setup
> ⚠ Beware! Do not do this on a slow network connection. The `schema-registry` image is ~1.4GiB

To run the system locally:

```bash
docker compose up --build
```

This starts:
- Kafka broker cluster (3 nodes)
- Schema Registry
- Producer (sending simulated data)
- 3x Consumer replicas (aggregating data)

## 📥 Topics

- **Input:** `seismic-events`
- **Output:** `seismic-events-aggregated`

## 🧪 Observing Output

To consume aggregated output manually:

```bash
docker exec -it broker-1 bash
cd /opt/kafka/bin
./kafka-console-consumer.sh \
  --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 \
  --topic seismic-events-aggregated \
  --from-beginning
```

## 📁 Project Structure

```
.
├── producer/                  # Emits simulated seismic data
├── consumer/                  # Aggregates events by sensor ID
├── docker-compose.yml         # Orchestration
└── README.md
```

---

Made with ❤️ and Go 🐹
