<?php

namespace App\Console\Commands;

use App\Services\ProducerService;
use Illuminate\Console\Command;

class ProduceEventsCommand extends Command
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
            ["id" => 1, "continent" => "europe", "latitude" => 19.0, "longitude" => 20.0, "depth" => 12.0, "energy" => 42.0],
            ["id" => 2, "continent" => "africa", "latitude" => 15.0, "longitude" => 28.0, "depth" => 0.45, "energy" => 100000.0],
            ["id" => 3, "continent" => "africa", "latitude" => 25.0, "longitude" => 28.0, "depth" => 0.45, "energy" => 10.0],
        ];

        $producer = new ProducerService('seismic-data', 'schemas/seismic-data-v2.avsc', 'seismic-data-v2-value');
        $producer->produceEvents($events);
    }

}
