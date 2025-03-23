<?php

namespace App\Console\Commands;

use App\Services\ConsumerService;
use Illuminate\Console\Command;

class AggregateEventsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:consume-kafka-event';

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
        $consumer = new ConsumerService('seismic-data');
        $aggregatedEvents = [];

        while (true) {
            $message = $consumer->consume();

            if ($message) {
                $aggregatedEvents[$message['continent']][$message['id']] = $message;
            }
        }
    }
}
