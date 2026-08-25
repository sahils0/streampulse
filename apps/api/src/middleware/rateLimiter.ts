import { Request, Response, NextFunction } from 'express';
import { redis } from '../cache/client';

interface RateLimitOptions {
    windowMs: number;
    maxRequests: number;
    keyPrefix?: string;
}

export function rateLimiter(options: RateLimitOptions) {
    const { windowMs, maxRequests, keyPrefix = 'rl' } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).userId || req.ip;
        const key = `${keyPrefix}:${userId}`;

        try {
            const now = Date.now();
            const windowStart = now - windowMs;

            const multi = redis.multi();
            multi.zremrangebyscore(key, 0, windowStart);
            multi.zadd(key, now.toString(), `${now}:${Math.random()}`);
            multi.zcard(key);
            multi.pexpire(key, windowMs);

            const results = await multi.exec();
            const requestCount = (results![2][1] as number) || 0;

            res.setHeader('X-RateLimit-Limit', maxRequests);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requestCount));
            res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

            if (requestCount > maxRequests) {
                res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
                return res.status(429).json({ error: 'Too many requests' });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

export const apiRateLimiter = rateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 60,
    keyPrefix: 'rl:api',
});

export const authRateLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 20,
    keyPrefix: 'rl:auth',
});
