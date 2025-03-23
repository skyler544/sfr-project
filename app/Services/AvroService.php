<?php

namespace App\Services;

use AvroSchema;
use FlixTech\SchemaRegistryApi\Registry\Cache\AvroObjectCacheAdapter;
use FlixTech\SchemaRegistryApi\Registry\CachedRegistry;
use FlixTech\SchemaRegistryApi\Registry\PromisingRegistry;
use FlixTech\AvroSerializer\Objects\RecordSerializer;
use GuzzleHttp\Client as GuzzleClient;
use RdKafka\Message;

class AvroService
{
    public function avroEncode(array $event, string $schemaPath): string
    {
        $registry = $this->getRegistry();

        $schemaJson = file_get_contents(resource_path($schemaPath));
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

    public function avroDecode(Message $message): array
    {
        $registry = $this->getRegistry();
        $deserializer = new RecordSerializer($registry);

        return $deserializer->decodeMessage($message->payload);
    }

    private function getRegistry(): CachedRegistry
    {
        return new CachedRegistry(
            new PromisingRegistry(
                new GuzzleClient(['base_uri' => 'http://schema-registry:8081'])
            ),
            new AvroObjectCacheAdapter()
        );
    }
}
