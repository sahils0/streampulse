import cron, { ScheduledTask } from 'node-cron';
import { pool } from '../db/pool';
import { redis } from '../cache/client';
import { cacheGet, cacheSet, CACHE_KEYS } from '../cache/cache.service';
import { subscribe } from '../cache/pubsub';
import { kafka } from '../kafka/client';
import { TOPIC_CHECK_RESULTS } from '../kafka/producer';
import { EachMessagePayload, Consumer } from 'kafkajs';

const WARM_TTL_SECONDS = 30;

interface Monitor {
    id: string;
    user_id: string;
    url: string;
    method: string;
    interval_secs: number;
    timeout_ms: number;
    expected_status: number;
    sla_uptime_pct: number;
    is_active: boolean;
    created_at: Date;
}

let kafkaConsumer: Consumer | null = null;
let cronTask: ScheduledTask | null = null;
let unsubscribeInvalidation: (() => void) | null = null;

export async function startCacheWarmer(): Promise<void> {
    await warmAllUsers();

    cronTask = cron.schedule('*/25 * * * * *', async () => {
        try {
            await warmAllUsers();
        } catch (err) {
            console.error('[CacheWarmer] Scheduled warm error:', err);
        }
    });

    unsubscribeInvalidation = subscribe('cache:invalidate:monitors', async (data) => {
        const { userId } = data as { userId: string };
        if (userId) {
            await warmUserMonitors(userId);
        }
    });

    kafkaConsumer = kafka.consumer({
        groupId: process.env.KAFKA_GROUP_CACHE || 'cache-consumer-group',
    });
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: TOPIC_CHECK_RESULTS, fromBeginning: false });
    await kafkaConsumer.run({
        eachMessage: handleCheckResult,
    });

    console.log('✅ Cache warmer started');
}

export async function stopCacheWarmer(): Promise<void> {
    if (cronTask) {
        cronTask.stop();
        cronTask = null;
    }
    if (unsubscribeInvalidation) {
        unsubscribeInvalidation();
        unsubscribeInvalidation = null;
    }
    if (kafkaConsumer) {
        await kafkaConsumer.disconnect();
        kafkaConsumer = null;
    }
}

async function warmAllUsers(): Promise<void> {
    const result = await pool.query(
        'SELECT DISTINCT user_id FROM monitors WHERE is_active = TRUE'
    );

    const warmPromises = result.rows.map((row) => warmUserMonitors(row.user_id));
    await Promise.allSettled(warmPromises);
}

async function warmUserMonitors(userId: string): Promise<void> {
    const cached = await cacheGet<Monitor[]>(CACHE_KEYS.userMonitors(userId));
    if (cached) return;

    const dbResult = await pool.query(
        'SELECT * FROM monitors WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );

    if (dbResult.rows.length > 0) {
        await cacheSet(CACHE_KEYS.userMonitors(userId), dbResult.rows, WARM_TTL_SECONDS);
    }

    const now = Date.now();
    await redis.zadd('user:activity', now.toString(), userId);
}

async function handleCheckResult({ message }: EachMessagePayload): Promise<void> {
    if (!message.value) return;

    const result = JSON.parse(message.value.toString());
    const { monitor_id } = result;

    const monitorResult = await pool.query(
        'SELECT user_id FROM monitors WHERE id = $1',
        [monitor_id]
    );

    if (monitorResult.rows.length > 0) {
        const userId = monitorResult.rows[0].user_id;
        await warmUserMonitors(userId);
    }
}
