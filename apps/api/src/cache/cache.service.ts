import { redis } from './client';

const DEFAULT_TTL_SECONDS = 30;

export const CACHE_KEYS = {
    userMonitors: (userId: string) => `monitors:${userId}`,
    monitor: (userId: string, monitorId: string) => `monitor:${userId}:${monitorId}`,
};

export async function cacheGet<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = DEFAULT_TTL_SECONDS): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

export async function cacheInvalidate(key: string): Promise<void> {
    await redis.del(key);
}

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(...keys);
    }
}
