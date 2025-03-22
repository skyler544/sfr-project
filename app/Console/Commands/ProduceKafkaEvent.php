<?php

namespace App\Console\Commands;

use AvroSchema;
use FlixTech\AvroSerializer\Objects\RecordSerializer;
use FlixTech\SchemaRegistryApi\Registry\Cache\AvroObjectCacheAdapter;
use FlixTech\SchemaRegistryApi\Registry\CachedRegistry;
use FlixTech\SchemaRegistryApi\Registry\PromisingRegistry;
use Illuminate\Console\Command;
use GuzzleHttp\Client as GuzzleClient;
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
            ["id" => 1, "latitude" => 19.0, "longitude" => 20.0, "depth" => 12.0, "energy" => 42.0],
            ["id" => 2, "latitude" => 15.0, "longitude" => 28.0, "depth" => 0.45, "energy" => 100000.0],
        ];

        $conf = new Conf();
        $conf->set('metadata.broker.list', 'broker-1:19092,broker-2:19092,broker-3:19092');

        $producer = new Producer($conf);

        $topic = $producer->newTopic('seismic-data');

        foreach ($events as $event) {
            $message = $this->avroEncode($event);
            $topic->produce(RD_KAFKA_PARTITION_UA, 0, $message);
            echo "Produced: $message\n";
        }

        $producer->flush(1000);
    }

    private function avroEncode(array $event): string {
        $registry = new CachedRegistry(
            new PromisingRegistry(
                new GuzzleClient(['base_uri' => 'http://schema-registry:8081'])
            ),
            new AvroObjectCacheAdapter()
        );

        $schemaJson = file_get_contents(resource_path('schemas/seismic-data.avsc'));
        $schema = AvroSchema::parse($schemaJson);

        $serializer = new RecordSerializer(
            $registry,
            [
                // maybe better to set it to manually register
                RecordSerializer::OPTION_REGISTER_MISSING_SCHEMAS => true,
                RecordSerializer::OPTION_REGISTER_MISSING_SUBJECTS => true,
            ]
        );

        return $serializer->encodeRecord('seismic-data-value', $schema, $event);
    }
}
