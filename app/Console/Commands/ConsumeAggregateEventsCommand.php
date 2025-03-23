<?php

namespace App\Console\Commands;

use App\Services\ConsumerService;
use App\Services\ProducerService;
use Illuminate\Console\Command;

class ConsumeAggregateEventsCommand extends Command
{
    protected $signature = 'app:consume-aggregate-events';
    protected $description = 'Command description';

    public function handle(): void
    {
        $consumer = new ConsumerService('seismic-data-continent');

        while (true) {
            $message = $consumer->consume();

            if ($message) {
                $messageString = json_encode($message);
                echo "Consumed: $messageString\n";
            }
        }
    }
}
