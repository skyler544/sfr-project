<?php

namespace App\Services;

use RdKafka\Conf;
use RdKafka\Producer;
use RdKafka\ProducerTopic;

class ProducerService
{
    private Producer $producer;
    private ProducerTopic $topic;
    private string $schema;
    private string $subject;

    public function __construct(string $topic, string $schema, string $subject)
    {
        $this->producer = $this->configureProducer();
        $this->topic = $this->producer->newTopic($topic);
        $this->schema = $schema;
        $this->subject = $subject;
    }

    public function produceEvents(array $events): void
    {
        $avroService = new AvroService();

        foreach ($events as $event) {
            $message = $avroService->avroEncode($event, $this->schema, $this->subject);
            $this->topic->produce(RD_KAFKA_PARTITION_UA, 0, $message);
            echo "Produced: $message\n";
        }

        $this->producer->flush(1000);
    }

    private function configureProducer(): Producer
    {
        $conf = new Conf();
        $conf->set('metadata.broker.list', 'broker-1:19092,broker-2:19092,broker-3:19092');

        return new Producer($conf);
    }
}
