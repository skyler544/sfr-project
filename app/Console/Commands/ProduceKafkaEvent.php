<?php

namespace App\Console\Commands;

use App\Services\AvroService;
use Illuminate\Console\Command;
use RdKafka\Conf;
use RdKafka\Producer;

class ProduceKafkaEvent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:produce-kafka-event';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        // TODO make this happen in a loop with random numbers
        $events = [
            ["id" => 1, "latitude" => 19.0, "longitude" => 20.0, "depth" => 12.0, "energy" => 42.0],
            ["id" => 2, "latitude" => 15.0, "longitude" => 28.0, "depth" => 0.45, "energy" => 100000.0],
        ];

        $producer = $this->configureProducer();
        $topic = $producer->newTopic('seismic-data');

        $avroService = new AvroService();

        foreach ($events as $event) {
            $message = $avroService->avroEncode($event, 'schemas/seismic-data.avsc');
            $topic->produce(RD_KAFKA_PARTITION_UA, 0, $message);
            echo "Produced: $message\n";
        }

        $producer->flush(1000);
    }

    private function configureProducer(): Producer
    {
        $conf = new Conf();
        $conf->set('metadata.broker.list', 'broker-1:19092,broker-2:19092,broker-3:19092');

        return new Producer($conf);
    }

}
