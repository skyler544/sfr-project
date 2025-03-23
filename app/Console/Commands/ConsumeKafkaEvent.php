<?php

namespace App\Console\Commands;

use App\Services\AvroService;
use Illuminate\Console\Command;
use RdKafka\Conf;
use RdKafka\KafkaConsumer;

class ConsumeKafkaEvent extends Command
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
        $consumer = $this->configureConsumer();
        $avroService = new AvroService();

        while (true) {
            $message = $consumer->consume(10 * 1000);
            if ($message->err) {
                echo "Error: {$message->errstr()}\n";
                continue;
            }

            $message = json_encode($avroService->avroDecode($message));
            echo "Consumed: $message\n";
        }
    }

    private function configureConsumer(): KafkaConsumer
    {
        $conf = new Conf();
        $conf->set('group.id', 'seismic-data');
        $conf->set('metadata.broker.list', 'broker-1:19092,broker-2:19092,broker-3:19092');
        $conf->set('auto.offset.reset', 'earliest');

        $consumer = new KafkaConsumer($conf);

        $consumer->subscribe(['seismic-data']);

        return $consumer;
    }

}
