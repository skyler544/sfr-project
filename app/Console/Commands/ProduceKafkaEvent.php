<?php

namespace App\Console\Commands;

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
    public function handle()
    {
        // TODO make this happen in a loop with random numbers
        $events = [
            ["id" => 1, "latitude" => 10, "longitude" => 20, "depth" => 1, "energy" => 42],
            ["id" => 2, "latitude" => 15, "longitude" => 28, "depth" => 0.45, "energy" => 100000],
        ];

        $conf = new Conf();
        $conf->set('metadata.broker.list', 'broker-1:19092,broker-2:19092,broker-3:19092');

        $producer = new Producer($conf);
        $topic = $producer->newTopic('seismic-data');

        foreach ($events as $event) {
            $message = json_encode($event);
            $topic->produce(RD_KAFKA_PARTITION_UA, 0, $message);
            echo "Produced: $message\n";
        }

        // $producer->flush(1000);
    }
}
