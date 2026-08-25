import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
    clientId: 'streampulse-api',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    retry: { initialRetryTime: 100, retries: 8 },
});
