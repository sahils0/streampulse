import Redis from 'ioredis';
import { createRedisClient } from './client';

export interface PubSubMessage {
    channel: string;
    data: unknown;
}

let publisher: Redis;
let subscriber: Redis;

type MessageHandler = (data: unknown) => void;

const handlers = new Map<string, Set<MessageHandler>>();

export function initPubSub(): void {
    publisher = createRedisClient();
    subscriber = createRedisClient();

    subscriber.on('message', (channel: string, message: string) => {
        const channelHandlers = handlers.get(channel);
        if (!channelHandlers) return;

        const parsed = JSON.parse(message);
        channelHandlers.forEach((handler) => handler(parsed));
    });

    console.log('✅ Redis pub/sub initialized');
}

export async function publish(channel: string, data: unknown): Promise<void> {
    await publisher.publish(channel, JSON.stringify(data));
}

export function subscribe(channel: string, handler: MessageHandler): () => void {
    if (!handlers.has(channel)) {
        handlers.set(channel, new Set());
        subscriber.subscribe(channel);
    }
    handlers.get(channel)!.add(handler);

    return () => {
        const channelHandlers = handlers.get(channel);
        if (!channelHandlers) return;
        channelHandlers.delete(handler);
        if (channelHandlers.size === 0) {
            subscriber.unsubscribe(channel);
            handlers.delete(channel);
        }
    };
}

export async function closePubSub(): Promise<void> {
    if (publisher) await publisher.quit();
    if (subscriber) await subscriber.quit();
}
