import express from 'express';
import { pool } from './db/pool';
import authRouter from './routes/auth.routes';
import monitorRouter from './routes/monitor.routes';
import { startChecker } from './workers/checker.worker';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/monitors', monitorRouter);

export { app };

if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    pool.query('SELECT 1').then(() => {
        console.log('✅ DB connected');
        startChecker();
    }).catch(err => {
        console.error('❌ DB connection failed', err);
    });

    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}
