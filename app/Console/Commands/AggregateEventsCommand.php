<?php

namespace App\Console\Commands;

use App\Services\ConsumerService;
use App\Services\ProducerService;
use Illuminate\Console\Command;

class AggregateEventsCommand extends Command
{
    protected $signature = 'app:aggregate-kafka-event';
    protected $description = 'Command description';

    public function handle(): void
    {
        $consumer = new ConsumerService('seismic-data');
        $producer = new ProducerService(
            'seismic-data-continent',
            'schemas/seismic-data-continent.avsc',
            'seismic-data-continent-value'
        );
        $aggregatedEvents = ['continents' => []];

        while (true) {
            $message = $consumer->consume();

            if ($message) {
                $aggregatedEvents['continents'][$message['continent']]['event'.$message['id']] = $message;
                $messageString = json_encode($message);
                echo "Consumed: $messageString\n";

                $producer->produceEvents($aggregatedEvents);
            }
        }
    }
}
