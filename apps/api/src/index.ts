import express from 'express';
import { pool } from './db/pool';
import { redis } from './cache/client';
import { initPubSub, closePubSub } from './cache/pubsub';
import authRouter from './routes/auth.routes';
import monitorRouter from './routes/monitor.routes';
import { startChecker } from './workers/checker.worker';
import { connectProducer } from './kafka/producer';
import { startMetricsWorker, stopMetricsWorker } from './workers/metrics.worker';
import { startCacheWarmer, stopCacheWarmer } from './workers/cache-warmer.worker';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/monitors', monitorRouter);

export { app };

if (require.main === module) {
    const PORT = process.env.PORT || 3001;

    async function bootstrap() {
        await pool.query('SELECT 1');
        console.log('✅ DB connected');

        await redis.ping();
        initPubSub();

        await connectProducer();
        await startMetricsWorker();
        await startCacheWarmer();
        startChecker();
    }

    bootstrap().catch((err) => {
        console.error('❌ Startup failed', err);
        process.exit(1);
    });

    process.on('SIGTERM', async () => {
        await stopMetricsWorker();
        await stopCacheWarmer();
        await closePubSub();
        await redis.quit();
        process.exit(0);
    });

    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}
