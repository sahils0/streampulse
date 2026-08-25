import { EachMessagePayload } from 'kafkajs';
import { kafka } from '../kafka/client';
import { TOPIC_CHECK_RESULTS } from '../kafka/producer';
import { pool } from '../db/pool';

const BATCH_SIZE = 500;
const FLUSH_INTERVAL_MS = 5000;

interface CheckResult {
    monitor_id: string;
    status_code: number | null;
    response_ms: number | null;
    status_ok: boolean;
    error_msg: string | null;
    checked_at: string;
}

let buffer: CheckResult[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

async function flush(): Promise<void> {
    if (buffer.length === 0) return;

    const batch = buffer.splice(0, buffer.length);
    const values: any[] = [];
    const params: any[] = [];

    batch.forEach((row, i) => {
        const offset = i * 5;
        values.push(
            `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`
        );
        params.push(
            row.monitor_id,
            row.status_code,
            row.response_ms,
            row.status_ok,
            row.error_msg,
            row.checked_at
        );
    });

    const query = `
        INSERT INTO check_results (monitor_id, status_code, response_ms, status_ok, error_msg, checked_at)
        VALUES ${values.join(', ')}
    `;

    try {
        await pool.query(query, params);
        console.log(`[MetricsWorker] Batch inserted ${batch.length} check results`);
    } catch (error) {
        console.error('[MetricsWorker] Batch insert failed:', error);
    }
}

async function handleMessage({ message }: EachMessagePayload): Promise<void> {
    if (!message.value) return;

    const result: CheckResult = JSON.parse(message.value.toString());
    buffer.push(result);

    if (buffer.length >= BATCH_SIZE) {
        await flush();
    }
}

export async function startMetricsWorker(): Promise<void> {
    const consumer = kafka.consumer({
        groupId: process.env.KAFKA_GROUP_METRICS || 'metrics-consumer-group',
    });

    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC_CHECK_RESULTS, fromBeginning: false });

    flushTimer = setInterval(() => {
        flush().catch((err) => console.error('[MetricsWorker] Periodic flush error:', err));
    }, FLUSH_INTERVAL_MS);

    await consumer.run({
        eachMessage: handleMessage,
    });

    console.log('✅ Metrics worker started (consumer group: %s)', process.env.KAFKA_GROUP_METRICS || 'metrics-consumer-group');
}

export async function stopMetricsWorker(): Promise<void> {
    if (flushTimer) {
        clearInterval(flushTimer);
        flushTimer = null;
    }
    await flush();
}
