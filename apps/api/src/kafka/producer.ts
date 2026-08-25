import { Producer } from 'kafkajs';
import { kafka } from './client';

export const TOPIC_CHECK_RESULTS = 'check-results';

let producer: Producer;

export async function connectProducer(): Promise<Producer> {
    producer = kafka.producer({ allowAutoTopicCreation: false });
    await producer.connect();
    console.log('✅ Kafka producer connected');
    return producer;
}

export async function publishCheckResult(payload: {
    monitor_id: string;
    status_code: number | null;
    response_ms: number | null;
    status_ok: boolean;
    error_msg: string | null;
    checked_at: string;
}): Promise<void> {
    await producer.send({
        topic: TOPIC_CHECK_RESULTS,
        messages: [
            {
                key: payload.monitor_id,
                value: JSON.stringify(payload),
            },
        ],
    });
}
