<?php

namespace App\Services;

use RdKafka\Conf;
use RdKafka\KafkaConsumer;

class ConsumerService
{
    private KafkaConsumer $consumer;
    private string $topic;
    private AvroService $avroService;

    public function __construct(string $topic)
    {
        $this->topic = $topic;
        $this->consumer = $this->configureConsumer();
        $this->avroService = new AvroService();
    }

    public function consume(): ?array
    {
        $message = $this->consumer->consume(20 * 1000);
        if ($message->err) {
            echo "Error: {$message->errstr()}\n";
            return null;
        }

        return $this->avroService->avroDecode($message);
    }

    private function configureConsumer(): KafkaConsumer
    {
        $conf = new Conf();
        $conf->set('group.id', $this->topic);
        $conf->set('metadata.broker.list', 'broker-1:19092,broker-2:19092,broker-3:19092');
        $conf->set('auto.offset.reset', 'earliest');

        $consumer = new KafkaConsumer($conf);

        $consumer->subscribe([$this->topic]);

        return $consumer;
    }
}
