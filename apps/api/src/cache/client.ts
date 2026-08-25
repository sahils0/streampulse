import Redis from 'ioredis';

export const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 100, 3000);
    },
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
});

redis.on('connect', () => {
    console.log('✅ Redis connected');
});

export function createRedisClient(): Redis {
    return new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: 3,
    });
}
